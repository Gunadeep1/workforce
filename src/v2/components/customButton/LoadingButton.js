import React from "react";
import CustomStyles from "./ButtonStyles";
import PropTypes from "prop-types";
import classNames from "classnames";
import { LoadingButton as MuiLoadingButton } from "@mui/lab";

/* fun starts here */
function LoadingButton(props) {
    // assign useStyles to classes
    const classes = CustomStyles();

    //based on props automatically it will take styles
    const {
        loading,
        className,
        children,
        saveLoader,
        smallSaveLoader,
        saveLoadersmall,
        draftLoader,
        browseLoader,
        popupLoaderCancel,
        popupLoaderSave,
        smallHeightSave,
        largeSave,
        smallHeightCancel,
        tableAddButton,
        deleteBtn,
        disable,
        saveLoaderAutoWidth,
        saveVerySmall,
        cancelOutline,
        saveBtn,
        saveExtraSmall,
        popupSaveBlue, saveLoaderDisable,
        addButtonmd,
        ...otherProps
    } = props;

    /**
     * When you called this function just you have to pass defined props for styles
     * ----------
     * if prop is not avaliable create new class in CustomButtonStyles file for styles and add that class in
     * >props
     * >btnClasses
     * >Button.propTypes
     * ------------
     * ------------
     * @parem children
     * -------------
     * content of the button excepted type `node`
     * */

    // Assigning the styles to variables
    const btnClasses = classNames({
        [className]: className,
        [classes.saveLoader]: saveLoader,
        [classes.saveLoadersmall]: saveLoadersmall,
        [classes.draftLoader]: draftLoader,
        [classes.browseLoader]: browseLoader,
        [classes.popupLoaderCancel]: popupLoaderCancel,
        [classes.popupLoaderSave]: popupLoaderSave,
        [classes.popupLoaderSave]: popupLoaderSave,
        [classes.smallHeightSave]: smallHeightSave,
        [classes.largeSave]: largeSave,
        [classes.smallHeightCancel]: smallHeightCancel,
        [classes.tableAddButton]: tableAddButton,
        [classes.smallSaveLoader]: smallSaveLoader,
        [classes.deleteBtn]: deleteBtn,
        [classes.disable]: disable,
        [classes.saveLoaderAutoWidth]: saveLoaderAutoWidth,
        [classes.saveVerySmall]: saveVerySmall,
        [classes.cancelOutline]: cancelOutline,
        [classes.saveBtn]: saveBtn,
        [classes.saveExtraSmall]: saveExtraSmall,
        [classes.popupSaveBlue]: popupSaveBlue,
        [classes.saveLoaderDisable]: saveLoaderDisable,
        [classes.addButtonmd]: addButtonmd
    });

    return (
        <MuiLoadingButton loading={loading} loadingPosition="start" {...otherProps} className={btnClasses}>
            {children}
        </MuiLoadingButton>
    );
}

export default LoadingButton;

LoadingButton.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    saveLoader: PropTypes.bool,
    saveLoadersmall: PropTypes.bool,
    draftLoader: PropTypes.bool,
    browseLoader: PropTypes.bool,
    popupLoaderSave: PropTypes.bool,
    popupLoaderCancel: PropTypes.bool,
    smallHeightSave: PropTypes.bool,
    smallHeightCancel: PropTypes.bool,
    largeSave: PropTypes.bool,
    tableAddButton: PropTypes.bool,
    smallSaveLoader: PropTypes.bool,
    deleteBtn: PropTypes.bool,
    disable: PropTypes.bool,
    saveLoaderAutoWidth: PropTypes.bool,
    saveVerySmall: PropTypes.bool,
    cancelOutline: PropTypes.bool,
    saveBtn: PropTypes.bool,
    saveExtraSmall: PropTypes.bool,
    popupSaveBlue: PropTypes.bool,
    saveLoaderDisable: PropTypes.bool,
    addButtonmd: PropTypes.bool
};

