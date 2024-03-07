import { Box } from '@mui/material'
import React, { useRef } from 'react'
import Button from '../customButton/Button';
// import browse from '../../assets/client/browseIcon.svg';
import { makeStyles } from '@mui/styles';
// import PropTypes from 'prop-types'
import { btnBgBlue, btnStroke } from '../../theme';
import { ReactComponent as PaperClip } from '../../assets/svg/Browse.svg';

const useStyles = makeStyles(() => ({
    browseButton: {
        background: `${btnBgBlue.shade3} !important`,
        color: `${btnStroke.blueMain} !important`,
        textAlign: "center",
        padding: "5px 5px 5px 0px !important",
        borderRadius: "6px !important",
        width: "100px",
        cursor: "pointer !important",
        height: "35px",
        font: '14px Nunito Sans, sans-serif !important',
        textTransform: "none !important",
        boxShadow: "none !important",
        fontWeight: '400 !important'
    },
    root: {
        display: 'flex !important',
        position: 'relative !important',
        height: '54px !important',
        width: '100% !important',
        borderRadius: '8px !important',
        border: '1px solid #cdd0d4 !important',
        borderWidth: '0.2ex !important',
        background: 'white !important',
        padding: '10px 12px !important',
        justifyContent: 'end !important'
    },

    rootDisabled: {
        display: 'flex !important',
        position: 'relative !important',
        height: '54px !important',
        width: '100% !important',
        borderRadius: '8px !important',
        border: '1px solid white !important',
        background: '#FAFAFA !important',
        padding: '10px 12px !important',
        justifyContent: 'end !important'
    },

    inputField: {
        height: '100%',
        width: '100%',
    },

    label: {
        position: 'absolute !important',
        top: '17px',
        font: '14px Nunito !important',
        fontWeight: `${400} !important`,
        color: '#737373 !important',
    },

    labelActive: {
        position: 'absolute !important',
        top: '8px',
        font: '11px Nunito !important',
        fontWeight: `${400} !important`,
        color: '#737373 !important',
        transform: 'translateY(-2px)',
        transition: 'all 0.3s ease !important',
        pointerEvents: 'none'
    },


    fileName: {
        paddingTop: '15px !important',
        font: '14px Nunito !important',
        fontWeight: `${400} !important`,
        color: '#262626 !important',
        pointerEvents: 'none'
    },

    input: {
        display: 'none'
    }
}))

function Browse(props) {
    const { value, name, labelText, isDisabled, onChange } = props;
    const classes = useStyles();

    const fileInputRef = useRef(null);

    const handleFileClick = () => {
        if (isDisabled === false) {
            fileInputRef.current.click();
        }
    };
    return (
        // <FormControl fullWidth variant="filled">
        //     <InputLabel id="demo-simple-select-filled-label" sx={{ width: width ? width : '100%' }}>{value == '' ? labelText : ''}</InputLabel>
        //     <Box sx={{
        //         display: 'flex',
        //         flexDirection: 'row',
        //         border: '1px solid #c4c2c2', height: '57px', borderRadius: '8px',
        //         alignItems: 'center', justifyContent: 'space-between', padding: '0px 14px 0px 0px',
        //     }}>
        //         <Text brownMnLargeLabel sx={{ margin: '0px 0px 0px 10px', width: width ? `${width} + ..` : '100%' }}>{value ? value : ''}</Text>
        //         <Button variant="contained" component="label" className={classes.browseButton}>
        //             <img src={browse} alt='browse' style={{ height: '18px', width: '18px' }} /> Browse
        //             {/* <TextField
        //                 name={name} onChange={onChange} type="file"
        //                 hidden                        
        //             /> */}
        //             <input hidden name={name} onChange={onChange} type="file" id="demo-simple-select-filled-label" />
        //         </Button>
        //     </Box>
        // </FormControl>
        <Box className={`${isDisabled ? classes.rootDisabled : classes.root}`}>
            <Box className={classes.inputField}>

                {value != '' ? (<>
                    <Box className={classes.labelActive}>{labelText}</Box>
                    <Box className={classes.fileName}>
                        {value}
                    </Box></>) : (<Box className={classes.label}>{labelText}</Box>)}
            </Box>

            <Button
                browseBtn startIcon={<PaperClip />}
                onClick={handleFileClick}
                disabled={isDisabled}
            >
                Browse
            </Button>
            <input
                name={name}
                type='file'
                className={classes.input}
                onChange={onChange}
                ref={fileInputRef}
            />
        </Box>
    )
}

export default Browse

// Browse.prototype = {
//     name: PropTypes.string,
//     value: PropTypes.any,
//     onChange: PropTypes.func,
//     labelText: PropTypes.any,
//     width: PropTypes.any
// }