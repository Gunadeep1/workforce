import React, { useRef, useState } from 'react'
import Button from '../customButton/Button';
import FileInputStyles from './FileInputStyles';
// import { ReactComponent as PaperClip } from '../../assets/svg/Browse.svg';
import browse from '../../assets/svg/Browse.svg';
import { Box } from '@mui/material';
import eye from '../../assets/employee/blueEye.svg';
import del from "../../assets/employee/RedDelete.svg";

export default function BrowseFile(props) {
    const { name, handleChange, label, isDisabled, FileName, viewDisplay, value,eraseData,setEraseData } = props;

    const fileInputRef = useRef(null);
    const [deleteValue, setDeleteValue] = useState(FileName);
    const [actionState, setActionState] = useState('');    

    const handleFileClick = () => {
        if (!isDisabled) {
            fileInputRef.current.click();
        }
    };

    const handleDelete = () => {
        setDeleteValue('');
        setActionState('');
        setEraseData(true);
    }

    const classes = FileInputStyles();
    return (
        <Box className={`${isDisabled ? classes.rootDisabled : classes.root}`}>
            <Box className={classes.inputField}>
                {deleteValue != '' ? (<>
                    <Box className={classes.labelActive}>{label}</Box>
                    <Box className={classes.fileName}>
                        {deleteValue}
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
                        : deleteValue ?
                            <img src={del} alt='delete Icon' className={classes.deleteIcon} onClick={handleDelete} />
                            :
                            <Button
                                browseBtn
                                startIcon={<img src={browse} alt='browse' />}
                                onClick={handleFileClick}
                                disabled={isDisabled}
                            >
                                Browse
                            </Button>
            }
            <input
                name={name}
                type='file'
                className={classes.input}
                onChange={handleChange}
                ref={fileInputRef}
                actionState={actionState}
                value={value}
                eraseData={eraseData}
            />

        </Box>
    )
}
