import React, { useState, useEffect, useRef } from "react";
import { Box, Paper } from "@mui/material";
import NavbarStyles from './NavbarStyles';
import SearchGlobal from '../../assets/svg/search2.svg';
import Profile from '../../assets/svg/profile.svg';
import AccountMenu from "../menu/AccountMenu";
import LocalStorage from "../../utils/LocalStorage";
import Notifications from "../../views/settings/notifications/NotificationPopup";
import { Divider } from "rsuite";
import AdminRoute from "../../routes/AdminRoute";
import { useLocation, useNavigate } from "react-router";
import FileSVG from '../../assets/svg/File.svg';
import Logo from '../../assets/svg/logo-name.svg';


function useComponentVisible(initialIsVisible) {
    const [isComponentVisible, setIsComponentVisible] = useState(
        initialIsVisible
    );
    const [tool, setTool] = useState(true)
    const ref = useRef(null);

    const handleHideDropdown = (event) => {
        if (event.key === "Escape") {
            setIsComponentVisible(false);
        }
    };

    const handleClickOutside = event => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsComponentVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleHideDropdown, true);
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("keydown", handleHideDropdown, true);
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    return { ref, isComponentVisible, tool, setTool, setIsComponentVisible };
}

export default function App(props) {
    const {
        ref,
        isComponentVisible,
        setIsComponentVisible
    } = useComponentVisible(true);
    const classes = NavbarStyles();
    const location = useLocation();
    const [state, setState] = useState({
        search: ""
    })
    const [searchData, setsearchData] = useState([])
    const navigate = useNavigate();

    const handleChange = (event) => {
        console.log(event);
        const inputvalue = event.target.value
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
        const searchAdmin = AdminRoute.filter(item => (item.name !== '' || item.name !== undefined) && item.name.toLowerCase().includes(inputvalue.toLowerCase()));
        console.log(searchAdmin)
        setIsComponentVisible(true)
        // const searchConfigure = ConfigurationRoute.filter(item => item.name.toLowerCase().includes(inputvalue.toLowerCase()));
        // const arr = searchAdmin.concat(searchConfigure)
        setsearchData([...searchAdmin]);
    }

    return (


        <Box component={'nav'} className={classes.nav} ref={ref}>
            <div style={{ width: "100%" }}> {location.pathname == "/ocr/bulk-upload-timesheets" && <img src={Logo} alt="Logo" style={{ height: "54px" }} />}</div>
            {location.pathname != "/ocr/bulk-upload-timesheets" &&
                <div className={classes.searchField}>
                    <input
                        type="text"
                        className={classes.globalSearchInput}
                        placeholder="Search or Jump to..."
                        name='search'
                        value={state.search}
                        onChange={handleChange}
                        autocomplete="off"
                    />
                    <button
                        type="button"
                        className={classes.searchIcon}
                    >
                        <img src={SearchGlobal} alt="SearchGlobal" />
                    </button>
                </div>
            }
            {isComponentVisible && state.search != '' ?
                <Paper className={classes.SearchList}>
                    {console.log(searchData, 'searchData')}
                    {searchData.map((item) => (
                        <>
                            <Box className={classes.mainSearchBar} onClick={() => { navigate(`${item.path}`); setState({ ...state, search: '' }) }}>
                                <Box className={classes.innerBoxname}><img src={FileSVG} alt='FileSVG' style={{ marginRight: '15px' }} /> {item.name}</Box>
                                <Box className={classes.innerBoxmain}>{item.main ? item.main : 'main'}</Box>
                            </Box>
                            <Divider></Divider>
                        </>
                    ))}

                </Paper>
                : ''
            }

            <div className={classes.rightItems}>

                {location.pathname != "/ocr/bulk-upload-timesheets" && <Notifications />}

                <AccountMenu person={Profile} UserName={LocalStorage.getUserData().full_name} MailId={LocalStorage.getUserData().email_iD} />

            </div>
        </Box >
    )
};
