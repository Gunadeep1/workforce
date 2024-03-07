import React, { useRef } from 'react'
import Button from '../customButton/Button';
import FileInputStyles from './FileInputStyles';
// import { ReactComponent as PaperClip } from '../../assets/svg/Browse.svg';
import browse from '../../assets/svg/Browse.svg';
import uploadArrowBlue from '../../assets/svg/uploadArrowBlue.svg';
import { Box } from '@mui/material';
import eye from '../../assets/employee/blueEye.svg';
import del from "../../assets/employee/RedDelete.svg";
import deleteIcon from "../../assets/employee/RedDelete.svg";


export default function FileInput(props) {
    const { name, handleChange, label, isDisabled, FileName, viewDisplay, actionState, value, handleDelete, disabled, uploadKeyName } = props;


    const fileInputRef = useRef(null);

    const handleFileClick = () => {
        if (!isDisabled) {
            fileInputRef.current.click();
        }
    };

    const onInputClick = (event) => {
        event.target.value = ''
    }

    const classes = FileInputStyles();
    return (
        <Box className={`${isDisabled ? classes.rootDisabled : classes.root}`}>
            <Box className={classes.inputField}>

                {FileName != '' ? (<>
                    <Box className={classes.labelActive}>{label}</Box>
                    <Box className={classes.fileName}>
                        {FileName}
                    </Box></>) : (<Box className={classes.label}>{label}</Box>)}
            </Box>

            {
                actionState == 'deleteState' ?
                    <Box display='flex' flexDirection='row' columnGap={1}>
                        <Box className={classes.IconBg}>
                            <img src={eye} alt='view' className={classes.viewIcon} onClick={() => window.open(viewDisplay)} />
                        </Box>
                        <Box className={classes.deleteBg}>
                            <img src={del} alt='delete Icon' className={classes.viewIcon} />
                        </Box>
                    </Box>
                    : actionState == 'view' ?
                        <Box className={classes.IconBg}>
                            <img src={eye} alt='view' className={classes.viewIcon} onClick={() => window.open(viewDisplay)} />
                        </Box>
                        : actionState == 1 ?
                            <>
                                {
                                    disabled ?
                                        <img src={deleteIcon} alt='delete Icon' className={classes.deisableDelete} /> :
                                        <img src={deleteIcon} alt='delete Icon' className={classes.deleteIcon} onClick={handleDelete} />
                                }
                            </>
                            :
                            actionState == "Upload" ?
                            <Button
                                browseBtnUpload
                                startIcon={<img src={uploadArrowBlue} alt='browse' />}
                                onClick={handleFileClick}
                                disabled={isDisabled}
                            >
                               {uploadKeyName?`${uploadKeyName}`:'Browse'} 
                            </Button>
                            :
                            <Button
                                browseBtn
                                startIcon={<img src={browse} alt='browse' />}
                                onClick={handleFileClick}
                                disabled={isDisabled}
                            >
                               {uploadKeyName?`${uploadKeyName}`:'Browse'} 
                            </Button>
            }
            <input
                name={name}
                type='file'
                onClick={onInputClick}
                className={classes.input}
                onChange={handleChange}
                ref={fileInputRef}
                actionState={actionState}
                value={value}
                handleDelete={handleDelete}
                disabled={disabled}
            />

        </Box>
    )
}
