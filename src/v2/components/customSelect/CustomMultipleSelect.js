// import * as React from 'react';
// import { useTheme } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import Chip from '@mui/material/Chip';

// import {
//     // FormControl,
//     // Select,
//     // MenuItem,
//     ListSubheader,
//     // TextField,
//     // IconButton,
//     // Box,
//     Menu
// } from "@mui/material";

// import CustomSelectStyles from './CustomSelectStyles';

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//     PaperProps: {
//         style: {
//             maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//             padding: '0px'
//         },
//         sx: {
//             "& .MuiList-root ": {
//                 padding: "0px !important",
//             },
//         }
//     },
// };

// // const names = [
// //     'Oliver Hansen',
// //     'Van Henry',
// //     'April Tucker',
// //     'Ralph Hubbard',
// //     'Omar Alexander',
// //     'Carlos Abbott',
// //     'Miriam Wagner',
// //     'Bradley Wilkerson',
// //     'Virginia Andrews',
// //     'Kelly Snyder',
// // ];

// function getStyles(name, personName, theme) {
//     return {
//         fontWeight:
//             personName.indexOf(name) === -1
//                 ? theme.typography.fontWeightRegular
//                 : theme.typography.fontWeightMedium,
//     };
// }

// export default function MultipleSelectChip() {
//     const classes = CustomSelectStyles();
//     const theme = useTheme();
//     const [personName, setPersonName] = React.useState([]);
//     const [searchText, setSearchText] = React.useState('');

//     const [names, setNames] = React.useState([
//         'Oliver Hansen',
//         'Van Henry',
//         'April Tucker',
//         'Ralph Hubbard',
//         'Omar Alexander',
//         'Carlos Abbott',
//         'Miriam Wagner',
//         'Bradley Wilkerson',
//         'Virginia Andrews',
//         'Kelly Snyder',
//     ]);

//     const handleChange = (event) => {
//         const {
//             target: { value },
//         } = event;
//         setPersonName(
//             // On autofill we get a stringified value.
//             typeof value === 'string' ? value.split(',') : value,
//         );
//     };

//     const handleChangeSearch = (e) => {


//         // let arr = names;

//         // let newArr = arr.filter(i => searchText === '' ? true : i.includes(e.target.value));

//         setSearchText(e.target.value);

//         // console.log(newArr);

//         // setNames(newArr);

//     }

//     const handleChipDelete = (e) => {
//         e.preventdefault();

//         console.log(e);
//     }

//     return (
//         <div style={{ width: '100%', height: '69px', display: 'flex', alignItems: "center", border: "1px solid #C7CCD3", borderRadius: "8px", }}>
//             <FormControl sx={{ width: '100%', height: '44px', }}>
//                 <InputLabel className={classes.inputLabel}>Level 1 Approvers</InputLabel>
//                 <Select
//                     sx={{ "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
//                     labelId="demo-multiple-chip-label"
//                     id="demo-multiple-chip"
//                     multiple
//                     value={personName}
//                     onChange={handleChange}
//                     // input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
//                     renderValue={(selected) => (
//                         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                             {selected.map((value) => (
//                                 <Chip key={value} label={value} onDelete={handleChipDelete} />
//                             ))}
//                         </Box>
//                     )}
//                     MenuProps={MenuProps}
//                 >

//                     <ListSubheader className={classes.listSubHeader}>
//                         <input type='text' onChange={handleChangeSearch} value={searchText} style={{ height: "24px" }} />
//                     </ListSubheader>

//                     {names.map((name) => (
//                         <MenuItem
//                             key={name}
//                             value={name}
//                             // style={getStyles(name, personName, theme)}
//                         >
//                             {name}
//                         </MenuItem>


//                     ))}

//                 </Select>
//             </FormControl>
//         </div>
//     );
// }

import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CustomSelectStyles from './CustomSelectStyles';
import { Chip } from "@mui/material";
import { ReactComponent as DeleteIcon } from '../../assets/svg/closeIcon.svg';
// import parse from 'autosuggest-highlight/parse';
// import match from 'autosuggest-highlight/match';




// const useStyles = makeStyles((theme) => ({
//     root: {
//         "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
//             // Default transform is "translate(14px, 20px) scale(1)""
//             // This lines up the label with the initial cursor position in the input
//             // after changing its padding-left.
//             transform: "translate(34px, 20px) scale(1);"
//         },
//         "&.Mui-focused .MuiInputLabel-outlined": {
//             color: "purple"
//         }
//     },
// }));

export default function LimitTags(props) {
    const { labelText, valuesArr, onChange, handleDeleteChip, index } = props;
    const classes = CustomSelectStyles();
    // const [valuesArr, setValuesArr] = React.useState([{ title: 'Goodfellas', year: 1990 }, { title: 'Se7en', year: 1995 },])

    return (
        <div style={{ width: '100%', paddingTop: valuesArr.length > 0 ? '16px' : '5px', minHeight: '69px', display: 'flex', alignItems: "center", }}>
            <Autocomplete
                multiple
                // limitTags={2}
                id="multiple-limit-tags"
                freeSolo
                options={[]}
                getOptionLabel={(option) => option.value}
                value={valuesArr}
                renderInput={(params) => (
                    <TextField {...params} label={labelText} className={classes.inputLabel} pt={2} />
                    // <TextField className={classes.inputLabel} label="Level 1 Approvers" />
                )}
                onChange={(e) => onChange(e, index)}

                renderTags={(value, getTagProps) =>
                    value.map((option, key) => (
                        <Chip
                            key={key}
                            label={option}
                            sx={{ gap: '6px', m: "4px 6px", p: "4px", font: "12px Nunito, Nunito Sans, sans-serif", fontWeight: 500, }}
                            onDelete={() => handleDeleteChip(key, index)}
                            deleteIcon={<DeleteIcon />}
                        />
                    ))
                }
                sx={{
                    width: '100%',
                    "& .MuiOutlinedInput-notchedOutline": {
                        border: "none"
                    },
                    "& .MuiAutocomplete-endAdornment": {
                        display: "none"
                    },
                    "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
                        transform: "translate(10px, 16px) scale(1);"
                    },
                    "& .css-1sumxir-MuiFormLabel-root-MuiInputLabel-root": {
                        color: "#737373",
                        fontSize: "10px",
                        fontFamily: "Nunito, Nunito Sans, sans-serif",
                        fontWeight: 400,
                        transform: "translate(14px, 2px) scale(1);"
                    },
                    "& .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root": {
                        color: "#737373",
                        fontSize: "16px",
                        fontFamily: "Nunito, Nunito Sans, sans-serif",
                        fontWeight: 500,
                    },
                    "&.Mui-focused .MuiInputLabel-outlined": {
                        color: "#737373",
                        fontSize: "10px",
                        fontFamily: "Nunito, Nunito Sans, sans-serif",
                        fontWeight: 400,
                        transform: valuesArr.length === 0 ? "translate(14px,2px) scale(1);" : "translate(12px, -6px) scale(1);"
                    },
                }}
            />
        </div>
    );
}
