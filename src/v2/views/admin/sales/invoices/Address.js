import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, Menu, MenuItem, Slide, Dialog, DialogContent, Stack } from "@mui/material";

import { styled } from '@mui/material/styles';
import { addWarningMsg } from '../../../../utils/utils';
// import SearchSelect from '../../../../components/selectField/SearchSelect';
import Text from '../../../../components/customText/Text';
import SalesStyles from '../SalesStyles';
import { ReactComponent as EditSvg } from '../../../../assets/svg/editGray.svg';
import CustomButton from "../../../../components/customButton/Button";
// import LoadingButton from '../../../../components/customButton/LoadingButton';
import BaseTextareaAutosize from '@mui/material/TextareaAutosize';
import CommonApi from '../../../../apis/CommonApi';
// import ReusablePopup from '../../../../components/reuablePopup/ReusablePopup';
import AddressForm from '../popups/AddressForm';


const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    width: 415px;
    font-family: 'Nunito', Nunito Sans, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
   
    border: 2px solid #C7CCD3;
    &:focus-visible {
        outline: 0;
      }
  `,
);


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} timeout={500} />;
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper ": {
        borderRadius: "8px",
        minWidth: "400px"
    },
    "& .MuiDialogContent-root": {
        // padding: theme.spacing(2)
        // padding: theme.spacing(3)
    },
    "& .MuiDialogActions-root": {
        // padding: theme.spacing(1)
        // padding: theme.spacing(5)
    }
}));

export default function Address(props) {

    const classes = SalesStyles();
    const { label, data, companyId, slug, selectAddress } = props;

    const [openPopup, setOpenPopup] = useState(false);
    const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
    const [companiesAddressList, setCompaniesAddressList] = useState([]);

    const [editAddressAction, setEditAddressAction] = useState(false);
    const [editAddressData, setEditAddressData] = useState({
        company_id: "",
        address_line_one: '',
        address_line_two: '',
        city: '',
        state_id: '',
        country_id: '',
        zip_code: '',
        address_type: slug,
    });

    const editBtnRef = useRef(null);



    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        if (companyId !== "" && companyId !== null && companyId !== undefined) {
            setAnchorEl(event.currentTarget);
        } else {
            addWarningMsg("Please Select Client.")
        }
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (companyId !== "" && companyId !== null && companyId !== undefined) {
            getCompaniesAddressList();
        }
        // eslint-disable-next-line
    }, [companyId]);

    // companyId={state.company_id}
    const getCompaniesAddressList = () => {
        CommonApi.companiesAddressList(slug, companyId).then((response) => {
            if (response.data.statusCode == 1003) {
                setCompaniesAddressList(response.data.data);
            }
        });
    };

    const openAddressForm = () => {
        let addressObj = {
            company_id: "",
            address_line_one: '',
            address_line_two: '',
            city: '',
            state_id: '',
            country_id: '',
            zip_code: '',
            address_type: slug,
        };
        setEditAddressData({ ...addressObj })
        setAnchorEl(null);
        setOpenConfirmPopup(true)
    }

    const closePopup = (address) => {
        getCompaniesAddressList();
        setAnchorEl(editBtnRef.current);
        setOpenPopup(false)
    }


    return (
        <Box py={2}>
            <Box sx={{ width: "100%", display: 'flex', justifyContent: "space-between" }}>
                <Text className={classes.addresslable}>{label}</Text>
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}

                    ref={editBtnRef}
                >
                    <Text className={classes.edit}>Edit</Text>
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    // onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            width: "433px",
                            height: "430px",
                            overflow: 'visible',
                            borderRadius: "8px",
                            filter: 'drop-shadow(0px 3px 6px rgba(0,0,0,0.1))',
                            mt: 1,
                            mr: 1,
                            py: 3,
                            px: "4px",
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >

                    <Box px={3}>
                        <Text className={classes.addressMenuTitle}>{label}</Text>
                    </Box>

                    {
                        companiesAddressList.length === 0 ?
                            <Box sx={{ height: "292px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                No Data Found
                            </Box> :
                            <Box sx={{ height: "292px", overflow: "auto" }}>
                                <Box style={{ padding: "0px 24px", }}>
                                    {
                                        companiesAddressList.map((item, key) => (
                                            <MenuItem key={key} sx={{ margin: "16px 0px", padding: "1px 0px", width: "100%", borderBottom: "1px solid #EAECF0", "&:hover": { backgroundColor: "#FFFFFF" } }} >
                                                <Box sx={{ width: "100%", display: "flex" }}
                                                    onClick={
                                                        () => {
                                                            selectAddress(slug, item)
                                                            handleClose();
                                                        }
                                                    }
                                                >
                                                    <Box py={1} sx={{ width: "90%", minHeight: "79px", overflow: "auto" }}>
                                                        <Text className={classes.addressTitle}>{`Address ${key + 1}`}</Text>
                                                        <Text className={classes.address}>
                                                            {`${item.address_line_one} ${item.address_line_two}`}
                                                        </Text>
                                                        <Text className={classes.address}>{`${item.city} ${item.state_name}`}</Text>
                                                        <Text className={classes.address}>{`${item.country_name} ${item.zip_code}`}</Text>
                                                    </Box>
                                                    <Box sx={{ width: "10%", minHeight: "79px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                        <IconButton
                                                            onClick={
                                                                (e) => {
                                                                    e.stopPropagation();
                                                                    setEditAddressAction(true);
                                                                    setEditAddressData({ ...item, address_type: slug });
                                                                    handleClose();
                                                                    setOpenPopup(true);
                                                                }
                                                            }
                                                        >
                                                            <EditSvg />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                            </MenuItem>
                                        ))
                                    }
                                </Box>
                            </Box>
                    }
                    <Box px={3} sx={{ width: "100%", height: "54px", display: "flex", alignItems: "end" }}>
                        <CustomButton browseBtn fullWidth sx={{ height: "33px" }} onClick={() => openAddressForm()}>Add New Address</CustomButton>
                    </Box>
                </Menu>
            </Box>
            <Box my={1}>
                <Textarea
                    disabled
                    className={classes.textarea}
                    value={data === null ? "" :
                        `${data.address_line_one} ${data.address_line_two} ${data.city} 
${data.state_name} ${data.country_name} ${data.zip_code}`
                    }
                    aria-label="minimum height" minRows={5}
                    sx={{ resize: "none" }}
                // onChange={handleChange} 
                />
            </Box>


            <BootstrapDialog
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="customized-dialog-title"
                open={openPopup}
            >
                <DialogContent>

                    {
                        openPopup ?
                            <AddressForm closePopup={closePopup} label={label} slug={slug} companyId={companyId} editAddressAction={editAddressAction} editAddressData={editAddressData} /> : null
                    }

                </DialogContent>
            </BootstrapDialog>

            <BootstrapDialog
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="customized-dialog-title"
                open={openConfirmPopup}
            >

                <DialogContent>

                    {
                        openConfirmPopup ?
                            <Box style={{ width: "480px" }} p={1}>
                                <Box py={1}>
                                    <Text className={classes.addressMenuTitle} style={{ textAlign: "center" }}>Do You Want To Add Address To The Client?</Text>
                                </Box>
                                <Box style={{ width: "100%", height: "68px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Stack direction={"row"} gap={2} >
                                        <CustomButton outlineBlue largeCancelText yesNoBtn redHover
                                            onClick={
                                                () => {
                                                    setOpenConfirmPopup(false)
                                                    setAnchorEl(editBtnRef.current);
                                                }
                                            }
                                        >No</CustomButton>
                                        <CustomButton
                                            saveBtn
                                            saveBtnSmall
                                            yesNoBtn
                                            onClick={
                                                () => {
                                                    setOpenConfirmPopup(false)
                                                    setOpenPopup(true)
                                                }
                                            }>Yes</CustomButton>
                                    </Stack>
                                </Box>
                            </Box>
                            : null
                    }

                </DialogContent>
            </BootstrapDialog>


        </Box>
    );
}
