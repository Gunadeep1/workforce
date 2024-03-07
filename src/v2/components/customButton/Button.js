import { Button as MuiButton } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import ButtonStyles from "./ButtonStyles";

/* fun starts here */
function Button(props) {
    // assign useStyles to classes
    const classes = ButtonStyles();

    //based on props automatically it will take styles
    const { className, children,
        save,
        smallSave, mediumInvite, onboardBtn, brownMnRedCancel, brownMnSave,
        brownMnMediumSave, addNew, EditBlue, outlineBlue, outlineBlueSmall, saveBtn, cancelBtn,
        browseBtn, browseBtnUpload,
        blackCancel, addButton, lightBlue, blueButton, BorderBlueButton, popupSaveBlue, popupCancel, popupBack,
        add,
        remove,
        cancel,
        addHeightButton, saveAsDraft,
        greyButton,
        iconRemoveBtn,
        groupBtn,
        clearAll,
        cancelSmall,
        exportSmall,
        saveSmall, clearall, texutalCancel, no,
        deleteBtn, popupDelete, outlinedSmallAdd, popupCancelHeight, editButton,
        viewButton, reopenBtn, cancelBtnBorder, disable, outlineBlueAuto, outlineBlueAutoAdd, saveBtnSmall, saveLarge, cancelOutline,
        approveBtn, blueOutlineBtn, blueBtnSave, sendBtn, blackCancelBtn, selectButton, closeBtn, addComment, disablebutton, placementDisable,
        smallBlueOutlineBtn, addHeighDisabletButton, disableSaveBtn,
        largeCancelText, yesNoBtn,
        outlineBlueMedium, popupCancel1, offBoardButton,
        saveNcontinue, redHover,
        DashboardAdd, borderCancel, bluesmallHeight, cancelText,
        //configuration

        addButtonDisable, editButtonDisable,
        // addNewDisable, saveLoaderDisable, rejectDisable, ...otherProps } = props;

        activity, cancelActivity,
        deleteButton, closeButton, saveVerySmall, blueHoverBtn,
        outlineRedCancel, saveExtraSmall, addTitleBtn, noButton, lightblueBtn, createLg, cancelLg,loginButton,cancelButton,
        addNewDisable, saveLoaderDisable, rejectDisable, addTitleBtnDisable, saveBtnDisable, popupSaveBlueDisable, ...otherProps } = props;

    /**
     * When you called this function just you have to pass defined props for styles
     * ----------
     * if prop is not available create new class in CustomButtonStyles file for styles and add that class in
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
        [classes.save]: save,
        [classes.smallSave]: smallSave,
        [classes.mediumInvite]: mediumInvite,
        [classes.onboardBtn]: onboardBtn,
        [classes.brownMnRedCancel]: brownMnRedCancel,
        [classes.brownMnSave]: brownMnSave,
        [classes.brownMnMediumSave]: brownMnMediumSave,
        [classes.addNew]: addNew,
        [classes.EditBlue]: EditBlue,
        [classes.outlineBlue]: outlineBlue,
        [classes.outlineBlueSmall]: outlineBlueSmall,
        [classes.saveBtn]: saveBtn,
        [classes.cancelBtn]: cancelBtn,
        [classes.browseBtn]: browseBtn,
        [classes.browseBtnUpload]: browseBtnUpload,
        [classes.blackCancel]: blackCancel,
        [classes.addButton]: addButton,
        [classes.lightBlue]: lightBlue,
        [classes.blueButton]: blueButton,
        [classes.BorderBlueButton]: BorderBlueButton,
        [classes.popupSaveBlue]: popupSaveBlue,
        [classes.popupCancel]: popupCancel,
        [classes.popupBack]: popupBack,
        [classes.addHeightButton]: addHeightButton,
        [classes.add]: add,
        [classes.remove]: remove,
        [classes.cancel]: cancel,
        [classes.saveAsDraft]: saveAsDraft,
        [classes.greyButton]: greyButton,
        [classes.browseBtn]: browseBtn,
        [classes.browseBtnUpload]: browseBtnUpload,
        [classes.iconRemoveBtn]: iconRemoveBtn,
        [classes.groupBtn]: groupBtn,
        [classes.clearAll]: clearAll,
        [classes.cancelSmall]: cancelSmall,
        [classes.exportSmall]: exportSmall,
        [classes.saveSmall]: saveSmall,
        [classes.clearall]: clearall,
        [classes.texutalCancel]: texutalCancel,
        [classes.no]: no,
        [classes.deleteBtn]: deleteBtn,
        [classes.popupDelete]: popupDelete,
        [classes.cancelBtnBorder]: cancelBtnBorder,
        [classes.outlinedSmallAdd]: outlinedSmallAdd,
        [classes.popupCancelHeight]: popupCancelHeight,
        [classes.editButton]: editButton,
        [classes.viewButton]: viewButton,
        [classes.reopenBtn]: reopenBtn,
        [classes.disable]: disable,
        [classes.outlineBlueAuto]: outlineBlueAuto,
        [classes.outlineBlueAutoAdd]: outlineBlueAutoAdd,
        [classes.saveBtnSmall]: saveBtnSmall,
        [classes.saveLarge]: saveLarge,
        [classes.disablebutton]: disablebutton,
        [classes.cancelOutline]: cancelOutline,
        [classes.approveBtn]: approveBtn,
        [classes.blueOutlineBtn]: blueOutlineBtn,
        [classes.blueBtnSave]: blueBtnSave,
        [classes.sendBtn]: sendBtn,
        [classes.blackCancelBtn]: blackCancelBtn,
        [classes.selectButton]: selectButton,
        [classes.closeBtn]: closeBtn,
        [classes.addComment]: addComment,
        [classes.popupCancel1]: popupCancel1,
        [classes.offBoardButton]: offBoardButton,
        [classes.placementDisable]: placementDisable,
        [classes.smallBlueOutlineBtn]: smallBlueOutlineBtn,
        [classes.offBoardButton]: offBoardButton,
        [classes.placementDisable]: placementDisable,
        [classes.smallBlueOutlineBtn]: smallBlueOutlineBtn,
        [classes.addHeighDisabletButton]: addHeighDisabletButton,
        [classes.disableSaveBtn]: disableSaveBtn,
        [classes.largeCancelText]: largeCancelText,
        [classes.yesNoBtn]: yesNoBtn,
        [classes.outlineBlueMedium]: outlineBlueMedium,
        [classes.redHover]: redHover,
        [classes.DashboardAdd]: DashboardAdd,
        [classes.saveNcontinue]: saveNcontinue,
        [classes.closeButton]: closeButton,
        [classes.deleteButton]: deleteButton,
        [classes.saveVerySmall]: saveVerySmall,
        [classes.blueHoverBtn]: blueHoverBtn,
        [classes.outlineRedCancel]: outlineRedCancel,
        [classes.saveExtraSmall]: saveExtraSmall,
        [classes.addTitleBtn]: addTitleBtn,
        [classes.noButton]: noButton,
        [classes.deleteButton]: deleteButton,
        [classes.cancelLg]: cancelLg,
        [classes.createLg]: createLg,
        [classes.lightblueBtn]: lightblueBtn,
        [classes.cancelText]: cancelText,
        [classes.borderCancel]: borderCancel,
        [classes.bluesmallHeight]:bluesmallHeight,
        [classes.loginButton]:loginButton,
        [classes.cancelButton]:cancelButton,
        [classes.addButtonDisable]: addButtonDisable,
        [classes.editButtonDisable]: editButtonDisable,
        [classes.bluesmallHeight]: bluesmallHeight,
        [classes.activity]: activity,
        [classes.cancelActivity]: cancelActivity,
        [classes.addNewDisable]: addNewDisable,
        [classes.saveLoaderDisable]: saveLoaderDisable,
        [classes.rejectDisable]: rejectDisable,
        [classes.addTitleBtnDisable]: addTitleBtnDisable,
        [classes.saveBtnDisable]: saveBtnDisable,
        [classes.popupSaveBlueDisable]: popupSaveBlueDisable,
    });

    return (
        <MuiButton {...otherProps} className={btnClasses}>
            {children}
        </MuiButton>
    );
}

export default Button;

Button.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    smallSave: PropTypes.bool,
    mediumInvite: PropTypes.bool,
    onboardBtn: PropTypes.bool,
    brownMnRedCancel: PropTypes.bool,
    brownMnSave: PropTypes.bool,
    brownMnMediumSave: PropTypes.bool,
    blackCancel: PropTypes.bool,
    addButton: PropTypes.bool,
    lightBlue: PropTypes.bool,
    blueButton: PropTypes.bool,
    save: PropTypes.bool,
    addNew: PropTypes.bool,
    EditBlue: PropTypes.bool,
    outlineBlue: PropTypes.bool,
    outlineBlueSmall: PropTypes.bool,
    saveBtn: PropTypes.bool,
    cancelBtn: PropTypes.bool,
    browseBtn: PropTypes.bool,
    browseBtnUpload: PropTypes.bool,
    BorderBlueButton: PropTypes.bool,
    popupSaveBlue: PropTypes.bool,
    popupCancel: PropTypes.bool,
    popupBack: PropTypes.bool,
    addHeightButton: PropTypes.bool,
    add: PropTypes.bool,
    remove: PropTypes.bool,
    cancel: PropTypes.bool,
    saveAsDraft: PropTypes.bool,
    greyButton: PropTypes.bool,
    // browseBtn: PropTypes.bool,
    iconRemoveBtn: PropTypes.bool,
    groupBtn: PropTypes.bool,
    clearAll: PropTypes.bool,
    cancelSmall: PropTypes.bool,
    exportSmall: PropTypes.bool,
    saveSmall: PropTypes.bool,
    clearall: PropTypes.bool,
    texutalCancel: PropTypes.bool,
    no: PropTypes.bool,
    deleteBtn: PropTypes.bool,
    popupDelete: PropTypes.bool,
    cancelBtnBorder: PropTypes.bool,
    outlinedSmallAdd: PropTypes.bool,
    popupCancelHeight: PropTypes.bool,
    editButton: PropTypes.bool,
    viewButton: PropTypes.bool,
    reopenBtn: PropTypes.bool,
    disable: PropTypes.bool,
    outlineBlueAuto: PropTypes.bool,
    outlineBlueAutoAdd: PropTypes.bool,
    saveBtnSmall: PropTypes.bool,
    saveLarge: PropTypes.bool,
    disablebutton: PropTypes.bool,
    cancelOutline: PropTypes.bool,
    approveBtn: PropTypes.bool,
    blueOutlineBtn: PropTypes.bool,
    blueBtnSave: PropTypes.bool,
    sendBtn: PropTypes.bool,
    blackCancelBtn: PropTypes.bool,
    selectButton: PropTypes.bool,
    closeBtn: PropTypes.bool,
    addComment: PropTypes.bool,
    popupCancel1: PropTypes.bool,
    offBoardButton: PropTypes.bool,
    placementDisable: PropTypes.bool,
    smallBlueOutlineBtn: PropTypes.bool,
    addHeighDisabletButton: PropTypes.bool,
    disableSaveBtn: PropTypes.bool,
    largeCancelText: PropTypes.bool,
    yesNoBtn: PropTypes.bool,
    outlineBlueMedium: PropTypes.bool,
    redHover: PropTypes.bool,
    DashboardAdd: PropTypes.bool,
    saveNcontinue: PropTypes.bool,
    closeButton: PropTypes.bool,
    deleteButton: PropTypes.bool,
    saveVerySmall: PropTypes.bool,
    blueHoverBtn: PropTypes.bool,
    outlineRedCancel: PropTypes.bool,
    saveExtraSmall: PropTypes.bool,
    addTitleBtn: PropTypes.bool,
    noButton: PropTypes.bool,
    cancelLg: PropTypes.bool,
    createLg: PropTypes.bool,
    lightblueBtn: PropTypes.bool,
    cancelText: PropTypes.bool,
    borderCancel: PropTypes.bool,
    bluesmallHeight: PropTypes.bool,
    loginButton: PropTypes.bool,
    cancelButton: PropTypes.bool,
    addButtonDisable: PropTypes.bool,
    editButtonDisable: PropTypes.bool,
    addNewDisable: PropTypes.bool,
    saveLoaderDisable: PropTypes.bool,
    rejectDisable: PropTypes.bool,
    activity: PropTypes.bool,
    cancelActivity: PropTypes.bool,
    addTitleBtnDisable: PropTypes.bool,
    saveBtnDisable: PropTypes.bool,
    popupSaveBlueDisable: PropTypes.bool,
};

