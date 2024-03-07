import * as React from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import DateSvg from '../../../assets/svg/date.svg';
import './form.css';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

// function a11yProps(index) {
//     return {
//         id: `full-width-tab-${index}`,
//         'aria-controls': `full-width-tabpanel-${index}`,
//     };
// }



export default function Invitelinkform(props) {

    // const classes = DashboardStyles();


    // const theme = useTheme();
    // const [value, setValue] = React.useState(0);

    // const handleChange = (event, newValue) => {

    //     console.log(event, newValue, " -----------------");
    //     setValue(newValue);
    // };

    // const handleChangeIndex = (index) => {
    //     console.log(index, "  +++++++++");
    //     setValue(index);
    // };

    const [te, setTe] = React.useState("")

    return (
        <div className="field-box">
            <div className="input-field">
                <input type="text" required spellcheck="false" value={te} onChange={(e) => setTe(e.target.value)} className={`text-input ${te === "" ? null : "inputWithTest"}`} />
                <label>{props.label}</label>  <label>{props.label} {props.labelMsg ? <span style={{color: 'rgb(194 188 188)',}}>(optional)</span> : null} </label>
            </div>
            <div>
                {
                    props.label === "Date of Birth" ? <img src={DateSvg} alt="date" style={{marginTop:"8px", marginLeft:"8px", cursor:"pointer"}} /> : null
                }
            </div>
        </div>
    );
}
