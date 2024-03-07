import React from 'react';
import ReusablePopupStyles from './ReusablePopupStyles'
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, Typography, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import closeImg from '../../assets/svg/crossIcon.svg';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction={"left"} ref={ref} {...props} />;
});
function ReusablePopup(props) {

    const classes = ReusablePopupStyles(); 

    const { title, children, openPopup, setOpenPopup, scrollTrue, close, iconHide, fullWidth, fixedWidth, white, statusWidth, crossIcon, width1000, widthMax } = props;

    const closePopup = () => {
        if (close) {
            close();
        }
        else {
            setOpenPopup(false);
        }
    }

    return (
        <Dialog open={openPopup} classes={{ paper: fullWidth ? classes.dialogWrapper1 : fixedWidth ? classes.fixedWidth : statusWidth ? classes.statusWidth : width1000 ? classes.width1000 : widthMax ? classes.widthMax : classes.dialogWrapper }}
            disableScrollLock={scrollTrue ? true : false} TransitionComponent={Transition}
        >
            <DialogTitle className={white ? classes.dialogWhite : classes.dialogTitle}>
                <div style={{ display: 'flex' }}>
                    <Typography className={classes.headerStyle} style={{ flexGrow: 1 }}>
                        {title}
                    </Typography>
                    {
                        !iconHide ? <CloseIcon onClick={closePopup} className={white ? classes.redIcon : classes.iconBtn}></CloseIcon> : ''
                    }
                    {
                        crossIcon && <img src={closeImg} alt='close' onClick={closePopup} style={{ cursor: 'pointer' }} />
                    }
                </div>
            </DialogTitle>
            <DialogContent className={classes.DialogContent}>
                {/* children is for passing for any type of data */}
                {children}
            </DialogContent>
        </Dialog>
    );
}

export default ReusablePopup;

ReusablePopup.propTypes = {
    children: PropTypes.node,
    header: PropTypes.node,
    close: PropTypes.node,
    scrollTrue: PropTypes.any
}
