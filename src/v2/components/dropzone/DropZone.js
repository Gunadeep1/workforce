import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import Button from '../customButton/Button';
import { useDropzone } from 'react-dropzone';
import DropZoneStyles from './DropZoneStyles';
// import Text from "../customText/CustomText";
import Text from '../customText/Text';
// import UploadSvg from '../../../assets/SVG/Ocr/Upload.svg';

function Dropzone(props) {
    const classes = DropZoneStyles();
    const onDrop = useCallback(acceptedFiles => {
        props.callApi(acceptedFiles)
        // eslint-disable-next-line
    }, [])
    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({ noClick: true, onDrop })

    return (
        <Box {...getRootProps()} className={classes.dropzone}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <Text normal my={1} className={classes.dropzoneText}>Drop the file here ...</Text> :
                    <Box className={classes.dropzoneContentContainer}>
                        <Box className={classes.dropzoneContentBox}>
                            {/* <img src={UploadSvg} alt="UploadSvg" /> */}
                            <Text my={1} className={classes.dropzoneText}>Drag & Drop timesheets to Create Template</Text>
                            <Text my={1} className={`${classes.dropzoneText} ${classes.or}`}>or</Text>
                            <Box className={classes.browseBtnBox}>
                                <Button className={classes.browseButton} onClick={open} >
                                    Click here
                                </Button>
                            </Box>
                        </Box>
                    </Box>
            }
        </Box>
    )
}

export default Dropzone;