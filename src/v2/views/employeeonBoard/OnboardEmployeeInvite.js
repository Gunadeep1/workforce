import React, { useEffect, useState } from "react";
import logoName from '../../assets/svg/logo-name-white.svg';
import Text from "../../components/customText/Text";
import { Box, Grid, IconButton, Dialog, DialogContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import OnboardStyles from './OnboardStyles';
import onBoardLinkApi from "../../apis/onBoardLink/onBoardLinkApi";
import { useNavigate } from "react-router-dom";
import Button from '../../components/customButton/Button';
import { ReactComponent as ExpenseDeleteIcon } from '../../assets/svg/ExpenseDeleteIcon.svg';
import { ReactComponent as OfferRejected } from '../../assets/svg/OfferRejected.svg';
import OfferRejectedBackground from '../../assets/svg/OfferRejectedBackground.svg';
import onBoardLinkImage from '../../assets/svg/onBoardLink.svg';
import maximumBox from '../../assets/svg/maximumBox.svg'
import downloadBox from '../../assets/svg/downloadBox.svg'
import crossIcon from "../../assets/svg/crossIcon.svg";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import FsLightbox from 'fslightbox-react';
import { pdfjs } from 'react-pdf';
import { addErrorMsg, addSuccessMsg } from "../../utils/utils";


function OnboardEmployeeInvite() {

    // const { id } = useParams();
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('onboarding_id');
    const [data, setData] = useState({
        first_name: '',
        last_name: '',
        offer_letter_url: '',
        upload_documents: [],
    });
    const [dataUrl, setDataUrl] = useState(null);
    const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);

    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [Rejected, setRejected] = useState(false);
    const navigate = useNavigate();

    const onError = (error) => {
        console.error(error);
    };
    const classes = OnboardStyles();
    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        "& .MuiDialog-paper ": {
            borderRadius: "16px",
        },
        "& .MuiDialogContent-root": {
            padding: theme.spacing(2)
        },
        "& .MuiDialogActions-root": {
            padding: theme.spacing(1)
        }
    }));


    const url = window.URL.createObjectURL(new Blob([data.offer_letter_url]));

    const handleDownloadPdf = () => {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `sample.pdf`); //or any other extension
        document.body.appendChild(link);
        link.click();
    }


    const handleClose = () => {
        setRejected(false);
        setOpenDialog(false);
    }

    useEffect(() => {
        console.log(id,"id");
        getInviteViaLink(id);
        // eslint-disable-next-line
    }, []);

    const getInviteViaLink = (id) => {
        onBoardLinkApi.inviteViaLink(id).then((res) => {
            if (res.data.statusCode === 1003) {
                setData({ ...data, "first_name": res.data.data.first_name, "last_name": res.data.data.last_name, "offer_letter_url": res.data.data.offer_letter_url, "upload_documents": res.data.data.upload_documents });
                handlLoadPDf(res.data.data.offer_letter_url);
                // FileSaver.saveAs(res.data.data.offer_letter_url);
            } else {
                addErrorMsg(res.data.message);
            }
        })
    }

    const handlLoadPDf = (offer_letter_url) => {
        fetch(`https://cors-anywhere.herokuapp.com/${offer_letter_url}`)
            .then(response => response.blob())
            .then(blob => {
                const fileReader = new FileReader();
                fileReader.onload = (e) => {
                    setDataUrl(e.target.result);
                    setIsDocumentLoaded(true);
                };
                fileReader.readAsDataURL(blob);
            })
            .catch(error => console.error(error));
    }

    const updateRejectedStatus = () => {
        onBoardLinkApi.updateInviteLink(id, "rejected").then((res) => {
            if (res.data.statusCode === 1003) {
                addSuccessMsg("Offer Rejected Successfully");
                setRejected(true);
            } else {
                addErrorMsg(res.data.message);
                handleClose();
            }
        })
    }

    const fontOptions = {
        GungsuhBold: {
            normal: 'Gungsuh-Bold.ttf',
            bold: 'Gungsuh-Bold-Bold.ttf',
        },
    };

    return (
        <Grid container>
            <Grid
                item
                container
                lg={6} xl={6} md={12} sm={12} xs={12}
                className={classes.BrowseMonster}
                alignItems="center"
                justifyContent="center">
                <img src={logoName} alt="logoName" className={classes.BrowseMonsterImageStyle} />

                <Box>
                    <img src={onBoardLinkImage} alt="onBoardLinkImage" className={classes.onBoardLinkImageStyle} />
                    <Text className={classes.Congratulations}>Congratulations</Text>,
                    <Text className={classes.ConText}>
                        Hello {data ? data.first_name : ""} {data ? data.last_name : ""} Thanks for showing your interest with us.<br></br>
                        You are hired for the Software developer" Position with us.<br></br> To continue with our organization please go through your <br></br> offer letter and click on Accept offer.
                    </Text>
                </Box>
            </Grid>

            <Grid
                item
                container
                lg={6} xl={6} md={12} sm={12} xs={12}
                className={classes.PDFRendergrid}
                alignItems="center"
                justifyContent="center">
                <Box className={classes.MainBox}>
                    <Box component="div" sx={{ ':hover div': { opacity: 1 }, }} className={classes.PDFRenderBox}>
                        {isDocumentLoaded &&
                            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
                                <Viewer
                                    width="100%"
                                    fileUrl={dataUrl}
                                    canvasCss={{
                                        fontFamily: 'Gungsuh-Bold, sans-serif', // Use a fallback font
                                    }}
                                    fontOptions={fontOptions}
                                    onError={onError} />
                            </Worker>}
                        <Box component="div" gap={2} className={classes.PDFBoxDownloadAndViewBox}>
                            <img onClick={() => { setIsLightboxOpen(!isLightboxOpen); }} src={maximumBox} alt="maximumBox"></img>
                            <img onClick={handleDownloadPdf} src={downloadBox} alt="downloadBox"></img>
                        </Box>
                    </Box>
                    <Box className={classes.ButtonBox} gap={2}>
                        <Button className={classes.RejectButton} onClick={() => { setOpenDialog(true); }}>
                            Reject
                        </Button>
                        <Button className={classes.AcceptButton}
                            onClick={() => navigate("/onboard-employee-upload/" + id, { state: { data: data } })}>
                            Accept
                        </Button>
                    </Box>
                </Box>
                <FsLightbox
                    toggler={isLightboxOpen}
                    sources={[
                        <iframe title="pdf" src={data.offer_letter_url} width={"10000px"} height={"10000px"} />
                    ]}
                />
            </Grid>

            {openDialog &&
                <BootstrapDialog
                    keepMounted
                    aria-labelledby='customizes-dialog-title'
                    open={openDialog}
                    maxWidth={"md"}>
                    <Box className={classes.MainDialogBox}>
                        {!Rejected && <Box className={classes.RejectedIconBox}>
                            <IconButton
                                aria-label='close'
                                onClick={handleClose}>
                                <img src={crossIcon} alt='close' />
                            </IconButton></Box>}
                        <DialogContent className={classes.DialogContent}>
                            <Box textAlign='center' className={classes.DialogContentMainBox}>
                                {!Rejected ? <><ExpenseDeleteIcon></ExpenseDeleteIcon>
                                    <Text className={classes.DialogContentText1}>Are You Sure?</Text>
                                    <Text className={classes.DialogContentText2}>Do You Really Reject the Offer?</Text>
                                    <Box className={classes.DialogContentButtonBox}>
                                        <Button onClick={handleClose} className={classes.CloseButton}>No</Button>
                                        <Button className={classes.OkButton} onClick={() => { updateRejectedStatus() }} >Yes, Reject</Button>
                                    </Box></> :

                                    <Box p={5}>
                                        <Box
                                            sx={{
                                                backgroundImage: `url(${OfferRejectedBackground}) !important`,
                                            }}
                                            className={classes.OfferRejected}
                                            >
                                            <OfferRejected></OfferRejected>
                                        </Box>
                                        <Text className={classes.OfferRejectedText}>Offer Has Been Rejected.</Text>
                                        <Box className={classes.OfferRejectedBox}>
                                            <Button onClick={() => { handleClose(); navigate("/"); }} className={classes.ExitButton}>Exit</Button>
                                        </Box>
                                    </Box>
                                }

                            </Box>
                        </DialogContent>

                    </Box>
                </BootstrapDialog>
            }
        </Grid >
    );

}

export default OnboardEmployeeInvite;