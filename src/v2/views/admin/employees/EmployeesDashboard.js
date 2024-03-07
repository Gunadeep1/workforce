import React, { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DashboardStyles from '../DasboardStyles';
import { Box, Avatar, Stack, Grid, FormControlLabel, RadioGroup, Checkbox, Chip, Radio, FormControl, SwipeableDrawer, CircularProgress, } from '@mui/material';
import crossIcon from '../../../assets/svg/crossIcon.svg';
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Skeleton from '@mui/material/Skeleton';
import Component87 from '../../../assets/svg/Component87.svg';
// import Component1311 from '../../../assets/svg/Component1311.svg';
import Search from '../../../assets/svg/search1.svg';
import Filterlines from '../../../assets/svg/filter-lines.svg';
import Downloadcloud from '../../../assets/svg/download-cloud.svg';
import Userplus from '../../../assets/svg/user-plus.svg';
import InviteViaLink from '../../../assets/svg/invite-via-link.svg';
import Onboart from '../../../assets/svg/onboard.svg';
import EmployeeAPI from '../../../apis/admin/employees/EmployeesApi';
import { addErrorMsg } from '../../../utils/utils';
import { Link, useNavigate } from "react-router-dom";
import Text from '../../../components/customText/Text';
import Button from '../../../components/customButton/Button';
import { ReactComponent as CloseIcon } from '../../../assets/svg/cross.svg';
import { ReactComponent as CheckedIcon } from '../../../assets/svg/CheckedIcon.svg';
import { ReactComponent as CheckBorderIcon } from '../../../assets/svg/CheckedBorderIcon.svg';
import { ReactComponent as RadioIcon } from '../../../assets/svg/RadioIcon.svg';
import { ReactComponent as RadioCheckedIcon } from '../../../assets/svg/RadioCheckedIcon.svg';
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import CommonApi from '../../../apis/CommonApi';
import LocalStorage from '../../../utils/LocalStorage';
// import CustomSelect from '../../../components/customSelect/CustomSelect';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import { Divider } from 'rsuite';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import disableUser from '../../../assets/client/disableUser.svg';

const statusDropdown = [{ id: "Active", value: "Active" }, { id: "In Active", value: "In-Active" }];

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#404040",
        padding: "6px 14px",
        minWidth: 100,
        border: "1px solid #404040"
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: "#404040",
        "&::before": {
            backgroundColor: "#404040",
            border: "1px solid #404040"
        }
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} timeout={500} />;
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper ": {
        borderRadius: "16px",
    },
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2)
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1)
    }
}));

export default function ControlledAccordions() {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const classes = DashboardStyles();
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const [selectedFilter, setSelectedFilter] = useState("");
    const [filterData, setFilterData] = useState({
        limit: 4,
        page: 1,
        search: "",
        employment: [],
        category: [],
        status: [],
        visa: [],
    })
    const [visaTypeDropdown, setVisaTypeDropdown] = useState([]);
    const [employeeExportData, setEmployeeExportData] = useState([]);
    const [employeeExportFields, setEmployeeExportFields] = useState([]);
    const [currentLabel, setCurrentLabel] = useState(0);
    const [checkAll, setCheckAll] = useState({});
    const [category, setCategory] = useState([]);
    const [employmentTypeDropdown, setEmploymentTypeDropdown] = useState([]);

    const [drawer, setDrawer] = useState(false);
    // const [exportData, setExportData] = useState("")

    useEffect(() => {
        getEmploymentTypeDropdown();
        getVisaTypeDropdown();
        categoryList();
        getAllEmployees(filterData);
        getEmployeeExportData();
        // getEmploymentTypeDropdown();
        // eslint-disable-next-line
    }, []);


    const getVisaTypeDropdown = () => {
        let search = "";
        CommonApi.VisaTypeDropdown(search).then((response) => {
            if (response.data.statusCode == 1003) {
                setVisaTypeDropdown(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }

    // Get Employee Export data
    const getEmployeeExportData = () => {
        EmployeeAPI.EmployeeExportFields().then((response) => {
            if (response.data.statusCode == 1003) {
                let responseData = response.data.data;
                responseData.map((i) => i.status = false);
                responseData[0].status = true;
                setEmployeeExportData(responseData);
                setEmployeeExportFields(responseData[0].data)
                setCurrentLabel(0)
                // Set initial label to first element
                console.log(currentLabel);
                //for(let i=0; i<response.data.data.length; i++){
                //    exportElements[response.data.data[i].name] =[]; // initialize state with empty arrays for all the labels
                //    //checkAll[response.data.data[i].status] = true); // default check All to false
                //}
                //setExportElements({...exportElements})
                ////setCheckAll({...checkAll})
            } else {
                addErrorMsg(response.data.message);
            }
        })
    }

    const categoryList = () => {
        CommonApi.CategoryList(LocalStorage.uid(), 1, LocalStorage.getAccessToken()).then((res) => {
            if (res.data.statusCode === 1003) {
                setCategory(res.data.data);
            }
        })
    }

    const getEmploymentTypeDropdown = () => {
        let search = "";
        CommonApi.getEmploymentTypeDropdown(search).then((response) => {
            if (response.data.statusCode == 1003) {
                setEmploymentTypeDropdown(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    }

    const getAllEmployees = (filter) => {
        setDrawer(false)
        setLoading(true)
        EmployeeAPI.getAllEmployees(filter).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    setEmployees(response.data.data);
                    setPagination(response.data.pagination)
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const employeeExport = () => {
        setLoading(true)
        let data = {};
        data.request_id = LocalStorage.uid()
        data.name = employeeExportData[currentLabel].name;
        data.table_name = employeeExportData[currentLabel].table_name;
        data.data = employeeExportData[currentLabel].data;
        console.log(data);
        EmployeeAPI.employeeExport(data).then((response) => {
            console.log(data)
            setLoading(false)
            const url = response.data.path;
            const link = document.createElement('a');
            link.href = url;
            let file_name = url.split('/').pop();
            link.setAttribute('download', file_name);
            document.body.appendChild(link);
            link.click();
            setDrawer(false)
        });
    }
    console.log("getttingEmployees", employees)
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    // Onchange of the Label radio button
    const changeExportLabel = (key, event) => {
        if (event.target.checked == true) { // If check is true
            setCurrentLabel(key) // Set Current label state to selected label
            //employeeExportData[key].status = true;
            setEmployeeExportFields(employeeExportData[key].data); // Set Export fields of the selected label
            //setEmployeeExportData([...employeeExportData]);
        } else {
            employeeExportData[key].status = false;
            //setCurrentLabel(key) // Set Current label state to selected label
            setEmployeeExportFields(employeeExportData[key].data); // Set Export fields of the selected label
            //setEmployeeExportData([...employeeExportData]);
            clearAllFields();
        }
    }

    // Onchange of the Check All checkbox
    const checkAllFields = (event) => {
        if (event.target.checked == true) { // If check is true
            employeeExportFields.filter((obj) => obj.field_name != 'reference_id').map((i) => i.status = true);
            setEmployeeExportFields(employeeExportFields); // select all fields
            employeeExportData[currentLabel].data = employeeExportFields;
            setEmployeeExportData(employeeExportData)
            checkAll[currentLabel] = true
            setCheckAll({ ...checkAll }) // set check true for All checkbox
        } else {
            employeeExportFields.filter((obj) => obj.field_name != 'reference_id').map((i) => i.status = false);
            setEmployeeExportFields(employeeExportFields); // unselect all fields
            employeeExportData[currentLabel].data = employeeExportFields;
            setEmployeeExportData(employeeExportData)
            checkAll[currentLabel] = false
            setCheckAll({ ...checkAll }) // set check false for All checkbox
        }
    }

    const clearAllFields = () => {
        //let a =[]
        employeeExportFields.map((i) => i.status = false);
        setEmployeeExportFields(employeeExportFields); // unselect all fields
        //employeeExportData[currentLabel].data.push(employeeExportFields);
        //setEmployeeExportData(employeeExportData)
        checkAll[currentLabel] = false
        setCheckAll({ ...checkAll }) // set check false for All checkbox
    }

    //check/uncheck each field
    const checkUncheckField = (event, id) => {
        if (event.target.checked == true) { // if checked true
            employeeExportFields[id].status = true;
            //checkedFields.push(id); // push the selected field to the array
            if (employeeExportFields.length == employeeExportFields.filter((obj) => obj.status === true).length) { // if all the fields are checked
                checkAll[id] = true
                setCheckAll({ ...checkAll }) // set check true for All checkbox
            }
        } else { // if checked false
            if (employeeExportFields[id].field_name != 'reference_id') {
                checkAll[id] = false;
                setCheckAll({ ...checkAll }) // set check false for All checkbox
                employeeExportFields[id].status = false; // remove the field from selected list
            }
        }
        //exportElements[currentLabel] = [...checkedFields];
        setCheckAll({ ...id });
        setEmployeeExportFields(employeeExportFields); // push the selected fields to exportElement Object
        //employeeExportData[currentLabel].data.push(employeeExportFields);
        //setEmployeeExportData(employeeExportData)
    }

    const loadeMore = () => {
        setFilterData({ ...filterData, limit: filterData.limit + 4, page: 1 });
        getAllEmployees({ ...filterData, limit: filterData.limit + 4, page: 1, });
        if (selectedOption === "Drafted") {
            setEmpFilter({ ...empfilter, limit: empfilter.limit + 4, page: 1, drafted_stage: "true" });
            getAllEmployees({ ...empfilter, limit: empfilter.limit + 4, page: 1, drafted_stage: "true" });
        }
    }

    const handleSearch = (e) => {
        setEmployees([])
        setFilterData({ ...filterData, limit: 4, page: 1, search: e.target.value })
        getAllEmployees({ ...filterData, limit: 4, page: 1, search: e.target.value });
    }


    const handleDeleteChip = (id, name) => {

        // return console.log(id, name, "  ........................");

        let newFilterData = filterData;
        if (newFilterData[name].includes(id)) {
            newFilterData[name].splice(newFilterData[name].findIndex(item => item === parseInt(id)), 1)
        }
        setFilterData({ ...newFilterData });
    };

    const handleChangeCheckBox = (e) => {
        let newFilterData = filterData;
        if (e.target.name == "status") {
            if (newFilterData[e.target.name].includes(e.target.value)) {
                newFilterData[e.target.name].splice(newFilterData[e.target.name].findIndex(item => item == e.target.value), 1)
            } else {
                newFilterData[e.target.name].push(e.target.value)
            }
        } else {
            if (newFilterData[e.target.name].includes(parseInt(e.target.value))) {
                newFilterData[e.target.name].splice(newFilterData[e.target.name].findIndex(item => item === parseInt(e.target.value)), 1)
            } else {
                newFilterData[e.target.name].push(parseInt(e.target.value))
            }
        }
        setFilterData({ ...newFilterData });
    }

    const clearAllFilter = () => {
        setSelectedFilter("")
        setFilterData({ ...filterData, employment: [], category: [], status: [], visa: [], })
    }
    const cancelFilter = () => {
        setDrawer(false)
        clearAllFilter()
        getAllEmployees({ ...filterData, employment: [], category: [], status: [], visa: [], });
    }

    const FilterView = () => (
        <Box width={'660px'} height={'100vh'} >
            <Box height={'10vh'} borderBottom={'1px solid #EAECF0'} display={'flex'} alignItems={'center'} pl={4} >
                <Text BlackExtraDark>Filters</Text>
            </Box>

            <Box display={'flex'} height={'7vh'} borderBottom={'1px solid #EAECF0'} alignItems={'center'} justifyContent={'space-between'} pr={'26px'} gap={1}>
                <Box display={'flex'} height={'60px'} alignItems={'center'} width={'90%'} pl={4} pr={'26px'} gap={1} >
                    {
                        selectedFilter === "Employee Type" &&
                        employmentTypeDropdown.map((item, key) => (
                            filterData.employment.includes(item.id) &&
                            <Chip
                                key={key}
                                label={item.value}
                                variant="outlined"
                                onDelete={() => handleDeleteChip(item.id, "employment")}
                                deleteIcon={<CloseIcon />} />
                        ))
                    }

                    {
                        selectedFilter === "Category" &&
                        category.map((item, key) => (
                            filterData.category.includes(item.id) &&
                            <Chip
                                key={key}
                                label={item.value}
                                variant="outlined"
                                onDelete={() => handleDeleteChip(item.id, "category")}
                                deleteIcon={<CloseIcon />}
                            />
                        ))
                    }

                    {
                        selectedFilter === "Visa Type" &&
                        visaTypeDropdown.map((item, key) => (
                            filterData.visa.includes(item.id) &&
                            <Chip key={key} label={item.value} variant="outlined" onDelete={() => handleDeleteChip(item.id, "visa")} deleteIcon={<CloseIcon />} />
                        ))
                    }

                    {
                        selectedFilter === "Status" &&
                        statusDropdown.map((item, key) => (
                            filterData.status.includes(item.id) &&
                            <Chip key={key} label={item.value} variant="outlined" onDelete={() => handleDeleteChip(item.id, "status")} deleteIcon={<CloseIcon />} />
                        ))
                    }
                </Box>
                <Button startIcon={<CloseIcon />} onClick={() => clearAllFilter()} clearAll >Clear All</Button>
            </Box>

            <Box display={'flex'} width={'100%'} border={'1px solid #EAECF0'} height={'73vh'} >
                <Box display={'flex'} flexDirection={'column'} height={'100%'} width={'45%'} borderRight={'1px solid #EAECF0'} pl={5} pt={2} >
                    <RadioGroup sx={{
                        gap: '16px !important'
                    }}
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                        <FormControlLabel
                            value="Employee Type"
                            control={
                                <Radio
                                    icon={<RadioIcon />}
                                    checkedIcon={<RadioCheckedIcon />}
                                />}
                            label={<Text checkboxlable >Employee Type</Text>} />
                        <FormControlLabel
                            value="Category"
                            control={
                                <Radio icon={<RadioIcon />}
                                    checkedIcon={<RadioCheckedIcon />} />}
                            label={<Text checkboxlable >Category</Text>} />
                        <FormControlLabel
                            value="Visa Type"
                            control={
                                <Radio icon={<RadioIcon />} checkedIcon={<RadioCheckedIcon />} />}
                            label={<Text checkboxlable >Visa Type</Text>} />
                        <FormControlLabel
                            value="Status"
                            control={
                                <Radio icon={<RadioIcon />}
                                    checkedIcon={<RadioCheckedIcon />} />}
                            label={<Text checkboxlable >Status</Text>} />

                    </RadioGroup>
                </Box>
                {console.log(selectedFilter, "  selectedFilterselectedFilter")}
                <Box display={'flex'} flexDirection={'column'} height={'100%'} width={'55%'} pl={5} pt={2} >
                    <FormControl sx={{
                        gap: '16px !important'
                    }}>
                        {
                            selectedFilter === "Employee Type" &&
                            employmentTypeDropdown.map((item, key) => (
                                <FormControlLabel
                                    key={key}
                                    control={
                                        <Checkbox
                                            name={"employment"}
                                            value={item.id}
                                            onChange={handleChangeCheckBox}
                                            icon={<CheckBorderIcon />}
                                            checkedIcon={<CheckedIcon />}
                                            // defaultChecked={filterData.employment.includes(item.id)}
                                            checked={filterData.employment.includes(item.id) ? "checked" : null}
                                        />}
                                    label={<Text checkboxlable >{item.value}</Text>}
                                />
                            ))
                        }

                        {
                            selectedFilter === "Category" &&
                            category.map((item, key) => (
                                <FormControlLabel
                                    key={key}
                                    control={
                                        <Checkbox
                                            name={"category"}
                                            value={item.id}
                                            onChange={handleChangeCheckBox}
                                            icon={<CheckBorderIcon />}
                                            checkedIcon={<CheckedIcon />}
                                            defaultChecked={filterData.category.includes(item.id)} />}
                                    label={<Text checkboxlable >{item.value}</Text>}
                                />
                            ))
                        }

                        {
                            selectedFilter === "Visa Type" &&
                            visaTypeDropdown.map((item, key) => (
                                <FormControlLabel
                                    key={key}
                                    control={
                                        <Checkbox
                                            name={"visa"}
                                            value={item.id}
                                            onChange={handleChangeCheckBox}
                                            icon={<CheckBorderIcon />}
                                            checkedIcon={<CheckedIcon />}
                                            defaultChecked={filterData.visa.includes(item.id)} />}
                                    label={<Text checkboxlable >{item.value}</Text>} />
                            ))
                        }
                        {selectedFilter === "Status" &&
                            statusDropdown.map((item, key) => (
                                <FormControlLabel
                                    key={key}
                                    control={
                                        <Checkbox
                                            name={"status"}
                                            value={item.id}
                                            onChange={handleChangeCheckBox}
                                            icon={<CheckBorderIcon />}
                                            checkedIcon={<CheckedIcon />}
                                            defaultChecked={filterData.status.includes(item.id)} />}
                                    label={<Text checkboxlable >{item.value}</Text>} />
                            ))
                        }

                    </FormControl>

                </Box>
            </Box>

            <Box display={'flex'} alignItems={'center'} justifyContent={'end'} gap={1} height={'73px'} pr={'26px'}>
                <Button cancelSmall onClick={() => cancelFilter()}>Cancel</Button>
                <Button saveSmall onClick={() => getAllEmployees({ ...filterData, limit: 5, page: 1, })} >Apply Filters</Button>
            </Box>
        </Box >)



    const ExportView = () => (
        <Box sx={{
            width: '660px', height: '100vh',
            overflow: "auto",
            '&::-webkit-scrollbar': {
                width: '4px',
            },
            '&::-webkit-scrollbar-track': {
                '-webkit-box-shadow': 'inset 0 0 6px #ffffff',
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#C7CCD3',
                outline: '1px solid #C7CCD3',
                borderRadius: "4px",
            }
        }}>

            <Box height={'10vh'} borderBottom={'1px solid #EAECF0'} display={'flex'} alignItems={'center'} pl={4} >
                <Text BlackExtraDark>Export</Text>
            </Box>

            <Box display={'flex'} height={'7vh'} borderBottom={'1px solid #EAECF0'} alignItems={'center'} justifyContent={'space-between'} pr={'26px'} gap={1}>
                <Box display={'flex'} height={'60px'} alignItems={'center'} width={'90%'} pl={4} pr={'26px'} gap={1} >
                    <>
                        {console.log(employeeExportData[currentLabel])}
                        {
                            employeeExportData[currentLabel].data
                                .filter(item => item.status === true)
                                .map((item, key) => (
                                    <Chip label={item.label_name} variant="outlined" onDelete={(e) => checkUncheckField(e, item)} deleteIcon={<CloseIcon />}
                                    />)
                                )
                        }</>

                </Box>
                <Button clearAll startIcon={<CloseIcon />} onClick={clearAllFields}>Clear All</Button>
            </Box>

            <Box display={'flex'} width={'100%'} border={'1px solid #EAECF0'} height={'73vh'} >
                <Box display={'flex'} flexDirection={'column'} gap={1} height={'100%'} width={'45%'} borderRight={'1px solid #EAECF0'} pl={5} pt={2} >



                    <RadioGroup sx={{
                        gap: '16px !important'
                    }}
                        defaultValue="Personal Information"

                    >
                        {/*<FormControlLabel value="Personal Information" control={<Radio icon={<RadioIcon />} checkedIcon={<RadioCheckedIcon />} />} label={<Text checkboxlable >Personal Information</Text>} />*/}

                        {
                            employeeExportData.map((item, key) => (
                                <FormControlLabel key={key} value={item.name} control={<Radio icon={<RadioIcon />} onChange={(e) => changeExportLabel(key, e)} value={item.name} checked={currentLabel == key} checkedIcon={<RadioCheckedIcon />} />} label={<Text checkboxlable >{item.name}</Text>} />
                            ))
                        }
                    </RadioGroup>

                </Box>
                <Box
                    pl={5} pt={2}
                    sx={{
                        isplay: "flex",
                        flexDirection: "column",
                        gap: 1,
                        height: "100%",
                        width: "55%", paddingLeft: 5, overflow: "auto",
                        '&::-webkit-scrollbar': {
                            width: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            '-webkit-box-shadow': 'inset 0 0 6px #ffffff'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#C7CCD3',
                            outline: '1px solid #C7CCD3',
                            borderRadius: "4px"
                        }
                    }} >
                    <FormControl sx={{
                        gap: '16px !important'
                    }}>
                        <FormControlLabel control={<Checkbox icon={<CheckBorderIcon />} onChange={checkAllFields} checked={employeeExportFields.length == employeeExportFields.filter((obj) => obj.status === true).length} checkedIcon={<CheckedIcon />} />} label={<Text checkboxlable >All</Text>} />
                        {
                            employeeExportFields.map((item, key) => (
                                <FormControlLabel key={key} control={<Checkbox icon={<CheckBorderIcon />} onChange={(e) => checkUncheckField(e, key)} value={item} checked={item.status} checkedIcon={<CheckedIcon />} />} label={<Text checkboxlable >{item.label_name}</Text>} />
                            ))
                        }
                    </FormControl>


                </Box>
            </Box>

            <Box display={'flex'} alignItems={'center'} justifyContent={'end'} gap={1} height={'73px'} pr={'26px'}>

                <Button cancelSmall onClick={() => setDrawer(false)}>Cancel</Button>
                <Button exportSmall onClick={employeeExport}>Export</Button>
            </Box>

        </Box >
    )
    // const employeeFilter = [
    //     {
    //         "id": 1,
    //         "value": "All Employees"
    //     },
    //     {
    //         "id": 2,
    //         "value": "Drafted "
    //     }
    // ]

    const [selectedOption, setSelectedOption] = useState('All employees');// eslint-disable-next-line 
    const [empfilter, setEmpFilter] = useState({
        limit: 4,
        page: 1,

        drafted_stage: ''
    })

    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);
        if (e.target.value === 'All employees') {
            getAllEmployees({ ...empfilter, drafted_stage: '' });
        } else {
            getAllEmployees({ ...empfilter, drafted_stage: "true" })
        }

    };
    // function CircularStatic(props) {
    //     return <CircularProgressWithLabel value={props.progress} />;
    // }
    // const [anchorEl, setAnchorEl] = React.useState(null);
    // const isOpen = Boolean(anchorEl);
    // const [employeeCategoryText, setEmployeeCategoryText] = useState("All Employees");

    // const handleClick = event => {
    //     setAnchorEl(event.currentTarget);
    // };

    // const onClose = () => {
    //     setAnchorEl(null);
    // };

    // const children = [
    //     "All Employees",
    //     "Drafted"
    // ]

    return (
        <Box className={classes.flexBox}>
            <Box sx={{ width: "68%" }}>
                <Box style={{ padding: "40px 10px 10px 10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>

                            <Select
                                MenuProps={{
                                    sx: {
                                        "&& .Mui-selected": {
                                            backgroundColor: "#ffffff"
                                        },
                                        "&& .Mui-hover": {
                                            backgroundColor: "#ffffff"
                                        },
                                        "&& .Mui-active": {
                                            backgroundColor: "#ffffff"
                                        }
                                    }
                                }}
                                value={selectedOption}
                                onChange={handleSelectChange}
                                IconComponent={KeyboardArrowDownIcon}
                                sx={{
                                    fontSize: "18px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: "#181A18", width: "170px",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        border: "none !important"
                                    },
                                    "& .MuiSvgIcon-root": {
                                        fill: '#171717 !important',
                                        marginRight: '5px !important',
                                    },

                                    "& .MuiInputBase-root.MuiFilledInput-root.MuiSelect-root.Mui-focused": {
                                        top: '15px !important'
                                    },
                                }}
                            >

                                <MenuItem value="All employees" className={classes.filter} >All employees</MenuItem>
                                <MenuItem value="Drafted" className={classes.filter}>Drafted</MenuItem>
                                <MenuItem value="Self Onboarded" className={classes.filterLast}>Self Onboarded</MenuItem>
                            </Select>

                            {/* <Typography sx={{ fontSize: "22px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: "rgba(38, 38, 38, 1)" }}>
                                {employeeCategoryText}
                            </Typography>
                            <IconButton
                                onClick={handleClick}
                                disableRipple
                            >
                                {
                                    isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
                                }
                            </IconButton>
                            <Menu
                                id="custom-menu"
                                open={isOpen}
                                onClose={onClose}
                                anchorEl={anchorEl}
                               
                                // className={MenuClasses.menuPopup}
                                MenuListProps={{ 'aria-labelledby': 'custom-menu', }}
                                sx={{
                                    transform: 'translateX(-55px) translateY(0px)',
                                }}
                            >
                                {
                                    children.map((item, index) => (
                                        <Box key={index}>
                                            <MenuItem
                                                 onChange={handleSelectChange}
                                            >
                                                <Typography
                                                    sx={{
                                                        font: '12px Nunito !important',
                                                        padding: '5px !important',
                                                        fontWeight: "500 !important",
                                                        color: "black"
                                                    }}
                                                >
                                                    {item}
                                                </Typography>
                                            </MenuItem>
                                            <Divider />
                                        </Box>
                                    ))
                                }

                            </Menu> */}
                        </div>
                        <div>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "14px" }}>
                                <div style={{ height: "40px", border: "1.5px solid rgba(199, 204, 211, 1)", width: "260px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center", }}>
                                    <input
                                        type="text"
                                        value={filterData.search}
                                        className={classes.EmployeesSearchInput}
                                        onChange={handleSearch}
                                        placeholder="Search by Name / Employee ID"
                                    />
                                    <button
                                        type="button"
                                        style={{ all: "unset", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", width: "45px", height: "38px", border: "none", backgroundColor: "#FFFFFF", borderRadius: "6px", }}
                                    >
                                        <img src={Search} alt="Search" />
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    style={{ all: "unset", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", width: "40px", height: "40px", border: "1.5px solid rgba(199, 204, 211, 1)", backgroundColor: "#ffffff", borderRadius: "6px" }}
                                    onClick={() => setDrawer("filter")}
                                >
                                    <img src={Filterlines} alt="Userplus" />
                                </button>
                                <button
                                    type="button"
                                    style={{ all: "unset", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", width: "40px", height: "40px", border: "1.5px solid rgba(199, 204, 211, 1)", backgroundColor: "#ffffff", borderRadius: "6px" }}
                                    onClick={() => setDrawer("export")}
                                >
                                    <img src={Downloadcloud} alt="Userplus" />
                                </button>
                                {
                                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_create" && item.is_allowed == true))) ?
                                        <button
                                            type="button"
                                            onClick={() => handleClickOpen()}
                                            style={{ all: "unset", padding: "0px 12px", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "400", minWidth: "150px", height: "40px", border: "1.5px solid rgba(12, 117, 235, 1)", backgroundColor: "rgba(12, 117, 235, 1)", borderRadius: "6px", color: "#ffffff" }}
                                        >
                                            <img src={Userplus} alt="Userplus" style={{ margin: "0px 8px" }} />  Add Employee
                                        </button> :
                                        <Button addNewDisable><img src={disableUser} alt="Userplus" style={{ marginRight: "10px", color: 'red !important' }} />Add Employee</Button>
                                }
                            </div>
                        </div>
                    </div>
                </Box>
                <Box style={{ padding: "10px" }}>
                    {
                        loading ?
                            [1, 2, 3, 4,].map((item) => (
                                <Stack key={item} direction="row" my={3} px={4} py={2} spacing={2} sx={{ width: "100%", boxShadow: "5px 5px 10px 0px rgba(0, 0, 0, 0.05)", borderRadius: "8px" }}>
                                    <Box sx={{ width: "59%", display: "flex", alignItems: "center", gap: 2, borderRight: "1px solid rgba(226, 229, 230, 1)" }}>
                                        <Skeleton variant="circular" sx={{ width: "64px", height: "56px" }} />
                                        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Box>
                                                <Skeleton variant="text" sx={{ fontSize: '1rem', width: "10rem" }} />
                                                <Skeleton variant="text" sx={{ fontSize: '1rem', width: "5rem" }} />
                                            </Box>
                                            <Box sx={{ width: "20%", alignSelf: "center" }}>
                                                <Skeleton variant="text" sx={{ fontSize: '1rem', width: "4rem" }} />
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box sx={{ width: "41%", display: "flex", alignItems: "center", gap: 2 }}>

                                        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                                            <Skeleton variant="text" sx={{ fontSize: '1rem', width: "5rem" }} />
                                            <Skeleton variant="text" sx={{ fontSize: '1rem', width: "5rem" }} />
                                        </Box>

                                    </Box>
                                </Stack>
                            )) :
                            <>{
                                employees.length > 0 ?
                                    <>
                                        {
                                            employees.map((Emp, key) => (
                                                <Accordion
                                                    key={key}
                                                    className={classes.customAccordion}
                                                    expanded={expanded === `panel${key}`} onChange={handleChange(`panel${key}`)}>
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1bh-content"
                                                        id="panel1bh-header"
                                                        className={classes.AccordionSummary}
                                                    >
                                                        <Grid container lg={12} spacing={2} textAlign='center' alignItems='center'>
                                                            {/* <Box
                                                    className={classes.AccordionSummaryBox}
                                                > */}
                                                            {/* <Grid item lg={2}> */}
                                                            <Box sx={{ position: 'relative', display: 'flex' }}>
                                                                <CircularProgress variant="determinate" value={Emp.profile_progress} size="4.2rem" thickness={2} sx={{ backgroundColor: "#F2F2F2", color: Emp.profile_progress == 100 ? 'green' : Emp.profile_progress <= 99 && Emp.profile_progress >= 40 ? 'orange' : Emp.profile_progress < 40 ? "red" : '', borderRadius: "100%", }} />
                                                                <Box
                                                                    sx={{
                                                                        top: 0,
                                                                        left: 0,
                                                                        bottom: 0,
                                                                        right: 0,

                                                                        position: 'absolute',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                    }}
                                                                >
                                                                    <Box sx={{ display: "flex", padding: "3px", borderRadius: "50%", backgroundColor: "#ffffff" }}>
                                                                        <HtmlTooltip
                                                                            placement="bottom"
                                                                            arrow
                                                                            title={
                                                                                <React.Fragment>
                                                                                    <Box>
                                                                                        <Typography className={classes.profileTooltipText}>
                                                                                            {`Profile Completion - ${Emp.profile_progress}%`}
                                                                                        </Typography>
                                                                                    </Box>
                                                                                </React.Fragment>
                                                                            }
                                                                        >
                                                                            <Avatar
                                                                                alt={Emp.full_name[0]}
                                                                                src={Emp.profile_picture_url}
                                                                                sx={{ width: 56, height: 56, }}
                                                                            />
                                                                        </HtmlTooltip>
                                                                    </Box>
                                                                </Box>
                                                            </Box>
                                                            {/* </Grid> */}
                                                            <Grid item lg={4} textAlign='start'>
                                                                <Text largeBlack noWrap> {Emp.full_name === "" ? "--" : Emp.full_name} {Emp.e_verified ? <img src={Component87} alt='svg' style={{ margin: "0px 6px -5px 6px" }} /> : null}</Text>
                                                                <Text mediumLabel noWrap>  {Emp.reference_id === "" ? "--" : Emp.reference_id}</Text>
                                                            </Grid>
                                                            <Grid item lg={3}>
                                                                <Text largeBlack noWrap>{Emp.visa_type === "" ? "--" : Emp.visa_type}</Text>
                                                            </Grid>
                                                            <Grid item lg={2}>
                                                                <Text mediumOrange noWrap> {Emp.sub_status === "" ? "--" : Emp.sub_status}</Text>
                                                            </Grid>
                                                            <Grid item lg={2}>
                                                                {
                                                                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_view" && item.is_allowed == true))) ?
                                                                        <Typography
                                                                            component={Link}
                                                                            to={Emp.drafted_stage === null ? `/employees/user-profile/${Emp.full_name === "" ? "" : Emp.full_name.trim().split(/ +/).join('-')}` : '/employees/onboard'}
                                                                            state={{ id: Emp.id, full_name: Emp.full_name, e_verify: Emp.e_verified, reference_id: Emp.reference_id, avatar_url: Emp.profile_picture_url, enable_login: Emp.enable_login, stage: Emp.drafted_stage, progress: Emp.profile_progress }}
                                                                            className={classes.linkText}
                                                                        >
                                                                            {Emp.drafted_stage === null ? "View Profile" : "Complete Profile"}
                                                                        </Typography> :
                                                                        <Text smallGrey sx={{ cursor: 'default !important' }}>View Profile</Text>
                                                                }
                                                            </Grid>
                                                            {/* </Grid> */}
                                                            {/* <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <Box mx={2}>
                                                            <Typography className={classes.primarytext}>
                                                                {Emp.full_name === "" ? "--" : Emp.full_name} {Emp.e_verified ? <img src={Component87} alt='svg' style={{ margin: "0px 6px" }} /> : null}
                                                            </Typography>
                                                            <Typography className={classes.secondarytext}>
                                                                {Emp.reference_id === "" ? "--" : Emp.reference_id}
                                                            </Typography>
                                                        </Box>
                                                        <Box mx={3} sx={{ width: "20%", alignSelf: "center" }}>
                                                            <Typography className={classes.text2}>
                                                                {Emp.visa_type === "" ? "--" : Emp.visa_type}
                                                            </Typography>
                                                        </Box>
                                                    </Box> */}
                                                            {/* </Box> */}
                                                            {/* <Box sx={{ width: "40%", display: "flex", alignItems: "center", gap: 2 }}>
                                                    <Box sx={{ width: "100%", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                                                        <Typography mr={4} pr={4} className={classes.text2}>
                                                            {Emp.status === "" ? "--" : Emp.status}
                                                        </Typography>
                                                        <Typography
                                                            component={Link}
                                                            to={`/employees/user-profile/${Emp.full_name === "" ? "" : Emp.full_name.trim().split(/ +/).join('-')}`}
                                                            state={{ id: Emp.id, full_name: Emp.full_name, e_verify: Emp.e_verified, reference_id: Emp.reference_id, avatar_url: Emp.avatar, enable_login: Emp.enable_login }}
                                                            className={classes.linkText}
                                                        >
                                                            View Profile
                                                        </Typography>
                                                    </Box>
                                                </Box> */}
                                                        </Grid>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Box className={classes.AccordionDetails} pt={1}>
                                                            <Box width={'100%'}>
                                                                <Typography className={classes.text1}>
                                                                    Employee Type
                                                                </Typography>
                                                                <Typography my={1} className={classes.text2}>
                                                                    {Emp.employment_type === "" ? "--" : Emp.employment_type}
                                                                </Typography>
                                                            </Box>
                                                            <Box width={'100%'}>
                                                                <Typography className={classes.text1}>
                                                                    Employee Category
                                                                </Typography>
                                                                <Typography my={1} className={classes.text2}>
                                                                    {Emp.employee_category === "" ? "--" : Emp.employee_category}
                                                                </Typography>
                                                            </Box>
                                                            <Box width={'100%'}>
                                                                <Typography className={classes.text1}>
                                                                    Email ID
                                                                </Typography>
                                                                <Typography my={1} className={classes.text2}>
                                                                    {Emp.email_id === "" ? "" : Emp.email_id}
                                                                </Typography>
                                                            </Box>
                                                            <Box width={'100%'}>
                                                                <Typography className={classes.text1}>
                                                                    Phone No
                                                                </Typography>
                                                                <Typography my={1} className={classes.text2}>
                                                                    {Emp.contact_number === "" ? "" : Emp.contact_number}
                                                                </Typography>
                                                            </Box>

                                                        </Box>
                                                    </AccordionDetails>
                                                </Accordion>
                                            ))
                                        }
                                    </> : employees.length == 0 ?
                                        <Box sx={{ height: "50vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <Text sx={{ fontSize: "22px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: "rgba(38, 38, 38, 1)" }}>
                                                No records Found
                                            </Text>
                                        </Box> : ''
                            }
                            </>
                    }
                </Box>
                {
                    !loading && employees.length > 0 &&
                        pagination.totalPages ? pagination.currentPage < pagination.totalPages ?
                        <Box style={{ textAlign: "center", padding: "10px", }}>
                            {/* <button
                                onClick={() => loading ? null : loadeMore()}
                                type="button"
                                style={{ all: "unset", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "400", minWidth: "150px", height: "40px", border: "1.5px solid rgba(12, 117, 235, 1)", borderRadius: "6px", color: "rgba(12, 117, 235, 1)" }}
                            >
                                {loading ? "Loading..." : "Load more"}
                            </button> */}
                            <Button outlineBlue onClick={() => loading ? null : loadeMore()}>{loading ? "Loading..." : "Load more"}</Button>
                        </Box> : null : null
                }

            </Box>



            <BootstrapDialog
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={true}
                maxWidth={"md"}
            >

                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                        boxShadow: 'none !important',
                        "&hover": {
                            boxShadow: 'none !important',
                        }
                    }}
                >
                    <img src={crossIcon} alt="cross" />
                    {/* <CloseIcon sx={{ color: "rgba(38, 38, 38, 1)" }} /> */}
                </IconButton>
                <DialogContent sx={{ margin: "50px", }}>
                    <Grid container spacing={0}>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <Box style={{ height: "400px", width: "400px", display: 'flex', justifyContent: "center", alignItems: "center" }}>
                                <Box sx={{ textAlign: "center" }}>
                                    <Box sx={{ margin: "12px 0px" }}>
                                        <img src={InviteViaLink} alt='invite-via-link' style={{ height: "200px" }} />
                                    </Box>
                                    <Box sx={{ margin: "8px 0px" }}>
                                        <Typography sx={{ fontSize: "12px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "400", color: "rgba(38, 38, 38, 1)", textAlign: "center", wordWrap: "break-word", }}>
                                            Send the employee an invite link to add them to <br /> the organization.
                                        </Typography>
                                    </Box>
                                    <Box sx={{ margin: "4px 0px" }}>
                                        <button
                                            onClick={() => navigate("/employees/add")}
                                            type="button"
                                            className={classes.inviteLinkBtn}
                                        // style={{
                                        //     margin: "12px 0px", all: "unset", cursor: "pointer", textAlign: "center", fontSize: "16px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "400", width: "150px", height: "40px", border: "1.5px solid rgba(12, 117, 235, 1)", borderRadius: "6px", color: "rgba(12, 117, 235, 1)",
                                        //     "&::hover": {
                                        //         backgroundColor:'rgba(12, 117, 235, 1)',color:'#FFFFFF'
                                        // } }}
                                        >
                                            Invite via link
                                        </button>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <Box style={{ height: "400px", width: "400px", display: 'flex', justifyContent: "center", alignItems: "center", borderLeft: "1.5px solid rgba(199, 204, 211, 1)" }}>
                                <Box sx={{ textAlign: "center" }}>
                                    <Box sx={{ margin: "16px 0px" }}>
                                        <img src={Onboart} alt='onboart' style={{ height: "200px" }} />
                                    </Box>
                                    <Box sx={{ margin: "6px 0px" }}>
                                        <Typography sx={{ fontSize: "12px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "400", color: "rgba(38, 38, 38, 1)", textAlign: "center", wordWrap: "break-word", }}>
                                            Onboard an employee manually, to add them to <br />the organization.
                                        </Typography>
                                    </Box>
                                    <Box sx={{ margin: "20px 0px", }}>
                                        <button
                                            type="button"
                                            className={classes.onboardBtn}
                                            onClick={() => navigate('/employees/onboard')}
                                        >
                                            Onboard
                                        </button>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
            </BootstrapDialog>

            <SwipeableDrawer
                anchor={'right'}
                open={drawer}
                // onClose={toggleDrawer(false, state.view)}
                // onOpen={toggleDrawer(true, state.view)}
                transitionDuration={300}
                sx={{
                    ".MuiDrawer-paper ": {
                        borderRadius: '8px 0px 0px 8px !important',
                    },
                    "& .MuiBackdrop-root.MuiModal-backdrop": {
                        backgroundColor: 'rgba(0, 0, 0, 0.75) !important'
                    }
                }
                }
            >
                {
                    drawer === "filter" ? FilterView() : null
                }
                {
                    drawer === "export" ? ExportView() : null
                }
            </SwipeableDrawer>
        </Box >
    );
}