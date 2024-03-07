import React from 'react'
import { ReactComponent as DeleteIcon } from '../../../../../assets/svg/crossicon1.svg';
import { ReactComponent as AlertIcon } from '../../../../../assets/svg/AlertIcon.svg';
import Text from '../../../../../components/customText/Text';
import Button from '../../../../../components/customButton/Button';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { Box } from '@mui/material';
import { styled } from "@mui/material/styles";
import Slide from "@mui/material/Slide";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper ": {
        maxHeight: '586px !important',
        maxWidth: '562px !important',
        padding: '0px !important',
        borderRadius: "8px",
    },
    "& .MuiDialogContent-root": {
        padding: '0px !important',
    },
    "& .MuiDialogActions-root": {
        padding: '0px !important'
    },
    "& .MuiDialog-container": {
        background: 'rgba(0, 0, 0, 0.55) !important'
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} timeout={500} />;
  });

export default function AlertBox({handleDialogClose, handleDelete, open}) {

    return (

        <BootstrapDialog
            TransitionComponent={Transition}
            keepMounted
            onClose={handleDialogClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth={"md"}
        >
            <DialogContent >
                <Box sx={{ display: 'flex',flexDirection:'column', height: '391px !important', width: '542px !important', borderRadius: '8px', alignItems: 'center', position: 'relative', }}>
                    <Box sx={{ position: 'absolute', top: '16px', right: '16px', cursor:'pointer', height:'24px', width:'24px', borderRadius:'50%' }} onClick={handleDialogClose}>
                        <DeleteIcon />
                    </Box>
                    <Box mt={'40px'}><AlertIcon/></Box>
                    <Box mt={'32px'}><Text mediumViewAmt>Are You Sure?</Text></Box>
                    <Box mt={'8px'}><Text greyLabel >Do You Really Wish To Delete.</Text></Box>
                    <Box mt={'40px'} display={'flex'} justifyContent={'center'} gap={2}>
                        <Button noButton onClick={handleDialogClose} >No</Button>
                        <Button deleteButton onClick={handleDelete}>Yes, Delete</Button>
                    </Box>
                </Box>
            </DialogContent>
        </BootstrapDialog>
    )
}
