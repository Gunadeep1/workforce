import React from 'react';
import PopupStyles from './CustomPopupStyle'
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function Popups(props) {

    const classes = PopupStyles();

    const { title, children, openPopup, setOpenPopup, scrollTrue, close, iconHide, fullWidth, fixedWidth, white, statusWidth } = props;

    const closePopup = () => {
        if (close) {
            close();
        }
        else {
            setOpenPopup(false);
        }
    }

    return (
        // fitScreen ?
        <Dialog  open={openPopup} classes={{ paper: fullWidth ? classes.dialogWrapper1 : fixedWidth ? classes.fixedWidth : statusWidth ? classes.statusWidth : classes.dialogWrapper }}
            disableScrollLock={scrollTrue ? true : false}
        >
            <DialogTitle className={white ? classes.dialogWhite : classes.dialogTitle}>
                <div style={{ display: 'flex' }}>
                    <Typography className={classes.headerStyle} style={{ flexGrow: 1 }}>
                        {title}
                    </Typography>
                    {
                        !iconHide ? <CloseIcon onClick={closePopup} className={white ? classes.redIcon : classes.iconBtn}></CloseIcon> : ''
                    }

                </div>
            </DialogTitle>
            <DialogContent className={classes.DialogContent}>
                {/* children is for passing for any type of data */}
                {children}
            </DialogContent>
        </Dialog>
        // :
        // <Dialog open={openPopup} classes={{ paper: fullWidth ? classes.dialogWrapper1 : classes.dialogWrapper }}
        //     disableScrollLock={scrollTrue ? true : false}
        // >
        //     <DialogTitle className={ white ? classes.dialogWhite : classes.dialogTitle }>
        //         <div style={{ display: 'flex' }}>
        //             <Typography className={classes.headerStyle} style={{ flexGrow: 1 }}>
        //                 {title}
        //             </Typography>
        //             {
        //                 !iconHide ? <CloseIcon onClick={closePopup} className={classes.iconBtn}></CloseIcon> : ''
        //             }

        //         </div>
        //     </DialogTitle>
        //     <DialogContent className={classes.DialogContent}>
        //         {/* children is for passing for any type of data */}
        //         {children}
        //     </DialogContent>
        // </Dialog>
    );
}

export default Popups;

Popups.propTypes = {
    children: PropTypes.node,
    header: PropTypes.node,
    close: PropTypes.node,
    scrollTrue: PropTypes.any
}
