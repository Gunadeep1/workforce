import React, { useState, useEffect,useRef } from "react";
import { Box, Autocomplete, Chip, TextField ,Grid} from '@mui/material';
import Text from '../../../../../components/customText/Text';
import { ReactComponent as ArrowDown } from '../../../../../assets/svg/ArrowDown.svg'
import Plus from '../../../../../assets/svg/plus.svg';
import Minus from '../../../../../assets/svg/Minus.svg';
import Button from '../../../../../components/customButton/Button';
import DateIcon from '../../../../../assets/svg/DateIcon.svg'
import MainStyles from '../../MainStyles'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import GroupsApi from '../../../../../apis/configuration/groups/GroupsApi';
import LocalStorage from '../../../../../utils/LocalStorage';
import { addSuccessMsg, addErrorMsg } from '../../../../../utils/utils';
import TemplateApi from "../../../../../apis/configuration/template/TemplateApi";
import RemindersApi from "../../../../../apis/configurations/reminders/RemindersApi";
import { validate_emptyField, validates_Integer } from "../../../../../components/Validation";
import BaseTextareaAutosize from '@mui/material/TextareaAutosize';
import { styled } from "@mui/material/styles";
import Input from "../../../../../components/input/Input";



const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    width: 495px;
    font-family: 'Nunito', Nunito Sans, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    border: none !important
    &:focus-visible {
        outline: 0;
      }
  `,
);



function Immigration({ current ,activityData,getActivity,activityTotal}) {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const classes = MainStyles()
    const [group, setGroup] = useState([]);
    const [slugs, setSlugs] = useState([]);
    const [textAdd, setTextAdd] = useState("");
    const [error, setError] = useState({});
    const activityRef =  useRef(null);

    const cycles = [
        { id: 'days', value: 'days' },
        { id: 'weeks', value: 'weeks' },
        { id: 'months', value: 'months' },
    ]

    const remind = [
        { id: '1', value: 'before' },
        { id: '2', value: 'after' },
    ]

    // const status = [
    //     { id: true, value: "true" },
    //     { id: false, value: "false" },
    // ]
    
    const [activityFilter,setActivityFilter]=useState({
        limit: 10,
        page: 1,
      })
    const [formData, setFormData] = useState(

        {
            request_id: '',
            reminder_name_id: '',
            status: '',
            content: '',
            group_ids: [],
            reminders: [
                {
                    occurance_order: '',
                    number: '',
                    cycle: '',
                    is_recurring: '',
                    recurring_days: ''
                }
            ],
            deleted_reminder_occurance_id: []
        }
    );


    const [remindersIds, setRemindersIds] = useState({
        approval: [],
    })

    // eslint-disable-next-line
    const [accordionState, setAccordionState] = useState('documentExpiry');

    const handleChangeAccordion = (event, expanded) => {
        setAccordionState(expanded ? 'documentExpiry' : '');

        setFormData(prevFormData => ({
            ...prevFormData,
            reminder_name_id: expanded ? '8' : ''

            // for immigration need to use below code
            // reminder_name_id: expanded ? '7' : ''
        }));
    };


    const [templateType, setTemplateType] = useState({

        templateText: "",
    });

    const handleAddReminder = () => {

        let Obj = {
            occurance_order: '',
            number: '',
            cycle: '',
            is_recurring: '',
            recurring_days: ''
        };
        let newArr = formData.reminders;
        newArr.push(Obj);
        setFormData({ ...formData, reminders: newArr })

    };

    const handleRemoveReminder = (index) => {
        let reminders = formData.reminders;
        let reminderDeleteids = formData.deleted_reminder_occurance_id;
        if (!["", null, undefined].includes(reminders[index].id) && !reminderDeleteids.some(i => i == reminders[index].id)) {
            if (remindersIds.approval.some(n => n.id == reminders[index].id)) {
                reminderDeleteids.push(reminders[index].id);
            }
        }
        reminders.splice(index, 1);
        setFormData({ ...formData, reminders: reminders, deleted_reminder_occurance_id: reminderDeleteids })

        docError.splice(index, 1)
        setDocError([...docError])
    };


    useEffect(() => {
        getReminderConfiguration();
        getAssignedToDropdownList();
        getTemplateSlugs();
        getActivity(activityFilter)
        // eslint-disable-next-line
    }, []);


    const getAssignedToDropdownList = () => {
        GroupsApi.getGroupsDropdown(
            LocalStorage.uid(), LocalStorage.getAccessToken(),
        ).then((response) => {
            if (response.data.statusCode == 1003) {
                setGroup(response.data.data);
            } else {
                addErrorMsg(response.data.message);
            }
        });
    };

    const handleDeleteEmployee = (key) => {
        let newArr = formData.group_ids;
        newArr.splice(key, 1);
        setFormData({ ...formData, group_ids: newArr, })

    }


    const handleChangeMembers = (e, newValue) => {
        if (!["", null, undefined].includes(e.target.value)) {
            let { id, value } = newValue[newValue.length - 1];
            let group_id = formData.group_ids;
            if (group_id.filter((i) => i.id == id).length == 0) {
                group_id.push({ id: id, value: value });
                setFormData({ ...formData, group_ids: group_id })
            }
        }
    }

    const [docError, setDocError] = useState([]);

    const handleChangeTemplate = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        }, handleValidations(e.target));
        setTextAdd(e.target.value);

    };

    const handleChange = (e, index) => {
        const input = e.target.value;
        formData.reminders[index][e.target.name] = input;
        setFormData({ ...formData }, handleValidatePopup(e.target, index));
    }


    const changeHandler = (e) => {
        setTemplateType({
            ...templateType,
            [e.target.name]: e.target.value,
        }, handleValidations(e.target))
        setTextAdd(e.target.value);
    }

    const handleValidatePopup = (e, index) => {
        let input = e;
        let error = docError.length > 0 ? (docError ? docError[index] : docError) : docError;
        for (var k = 0; k <= index; k++) {
            docError.push({});
        }
        let s1 = docError.length > 0 ? [...docError] : [{ ...docError }];
        switch (input.name || input.tagName) {
            case "occurance_order":
                error.occurance_order = validate_emptyField(input.value);
                break;
            case "number":
                error.number = validates_Integer(input.value);
                break;
            case "cycle":
                error.cycle = validate_emptyField(input.value);
                break;
            case "is_recurring":
                error.is_recurring = validate_emptyField(input.value);
                break;
            default:
                break;
        }
        setDocError(s1);

    }

    const handleValidations = (input) => {
        let err = error;
        switch (input.name || input.tagName) {
            case "reminder_name_id":
                err.reminder_name_id = validate_emptyField(input.value);
                break;
            case "content":
                err.content = validate_emptyField(input.value);
                break;
            case 'templateText':
                err.templateText = validate_emptyField(input.value)
                break;
            default:
                break;
        }
        setError(err);
    }

    //below uncommented code is the actual code , once immigration is done it need to uncommented
    // const getTemplateSlugs = () => {
    //     TemplateApi.getTemplateSlug(LocalStorage.uid(), "document-expiry-reminder", LocalStorage.getAccessToken()).then(
    //         (res) => {
    //             if (res.data.statusCode == 1003) {
    //                 setSlugs(res.data.data);
    //             }
    //         }
    //     )
    // }

    //below function should be commented
    const getTemplateSlugs = () => {
        TemplateApi.getTemplateSlug(LocalStorage.uid(), "employee-profile-approval-reminder", LocalStorage.getAccessToken()).then(
            (res) => {
                if (res.data.statusCode == 1003) {
                    setSlugs(res.data.data);
                }
            }
        )
    }

    // const getReminderConfiguration = () => {
    //     let id = "immigration"
    //     RemindersApi.getReminderConfig(id).then(
    //         (res) => {
    //             if (res.data.statusCode == 1003) {
    //                 if (res.data.data.length > 0) {
    //                     let ApprovalObj = res.data.data.filter(i => i.reminder_name_id == 7)[0];


    //                     setRemindersIds({ approval: ApprovalObj.reminders })

    //                     setFormData({ ...formData, ...ApprovalObj });
    //                 }

    //                 console.log(res.data.data, "response");
    //             }
    //         }
    //     )
    // }

    const getReminderConfiguration = () => {
        let id = "employee"
        RemindersApi.getReminderConfig(id).then(
            (res) => {
                if (res.data.statusCode == 1003) {
                    if (res.data.data.length > 0) {
                        let ApprovalObj = res.data.data.filter(i => i.reminder_name_id == 8)[0];


                        setRemindersIds({ approval: ApprovalObj.reminders })

                        setFormData({ ...formData, ...ApprovalObj });
                    }

                    console.log(res.data.data, "response");
                }
            }
        )
    }


    const updateReminderConfiguration = (obj) => {
        let data = { ...obj, request_id: LocalStorage.uid() }
        RemindersApi.updateReminderConfig(obj.id, data).then((response) => {
            setTimeout(() => {
                if (response.data.statusCode == 1003) {
                    setFormData({ ...formData, group_ids: [], })
                    getReminderConfiguration()
                    getActivity()
                    addSuccessMsg(response.data.message)
                } else {
                    addErrorMsg(response.data.message)
                }
            }, 300)

        });
    }


    const addButton = () => {
        let finalText = '';
        // eslint-disable-next-line
        slugs.filter((obj) => {
            if (obj.id === textAdd) {
                finalText = formData.content + `{${obj.value}}`
                return obj.value;
            }
        })

        setFormData({
            ...formData,
            content: finalText
        });
    }

    const handleSubmit = () => {

        updateReminderConfiguration(formData)

    };

    const activityHandleScroll = () => {
        const { current } = activityRef;
        if (current) {
          const { scrollTop, scrollHeight, clientHeight } = current;
          if (scrollTop + clientHeight >= scrollHeight) {
            // getCategory({...filter})
            if(activityTotal>=activityFilter.limit){
              setActivityFilter({...activityFilter, limit: activityFilter.limit + 10, page: 1 })
              getActivity({ ...activityFilter, limit: activityFilter.limit + 10, page: 1,});
            }
           
    
            // Reached the bottom of the inner box
            console.log('Reached end of inner box, calling a function...');
          
          }
        }
      };


    return (
        <Box sx={{
            height: '75vh',
            overflow: 'auto',
            padding: '16px',
        }}>
            <Box className={classes.activeItemBox}>
                <div>{current.name}</div>
                <div style={{ marginTop: '16px' }}>
                    <Accordion onChange={handleChangeAccordion} sx={{ border: 'none', boxShadow: 'none' }}>
                        <AccordionSummary
                            expandIcon={<ArrowDown />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                            sx={{ border: 'none', boxShadow: 'none', padding: '10px' }}
                        >
                            <Box display={"flex"} gap={1.5}>
                                <img src={DateIcon} alt="DateIcon"></img>
                                <Text sx={{ fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontSize: '16px', fontWeight: '600', color: '#092333' }}>Document Expiry</Text>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ width: '100%', height: '643px', overflowY: 'auto', backgroundColor: '#FBFBFB', borderRadius: '12px', padding: '30px' }}>
                                <Box sx={{ width: '100%', height: '97px', border: '1px solid #C7CCD3', borderRadius: '8px', padding: '8px' }}>

                                    <Autocomplete
                                        multiple
                                        limitTags={2}
                                        id="multiple-limit-tags"
                                        options={group}
                                        getOptionLabel={(option) => option.value}
                                        name="group_ids"
                                        value={formData.group_ids}
                                        disabled={false}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={"Assign To"}
                                                sx={{
                                                    color: '#737373 !important',
                                                    font: '12px Nunito Sans, sans-serif !important',
                                                    fontWeight: `${400} !important`
                                                }}
                                            />
                                        )}
                                        onChange={(e, newValue) => handleChangeMembers(e, newValue)}

                                        renderTags={(value, getTagProps) =>
                                            value.map((option, key) => (
                                                <Chip
                                                    key={key}
                                                    label={option && option.value}
                                                    sx={{ gap: '6px', m: "4px 6px", p: "4px", font: "12px Nunito, Nunito Sans, sans-serif", fontWeight: 500, }}
                                                    onDelete={() => handleDeleteEmployee(key)}
                                                    disabled={false}
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
                                                transform: "translate(10px, 16px) scale(1)",
                                                color: '#737373 ',
                                                font: '14px Nunito ',
                                                fontWeight: `${400} `,
                                            },
                                            "& .css-1jy569b-MuiFormLabel-root-MuiInputLabel-root": {
                                                color: "#737373",
                                                fontSize: "14px",
                                                fontFamily: "Nunito, Nunito Sans, sans-serif",
                                                fontWeight: 400,
                                                paddingTop: '20px'
                                            },
                                            "&.Mui-focused .MuiInputLabel-outlined": {
                                                color: "#737373",
                                                fontSize: "16px",
                                                fontFamily: "Nunito, Nunito Sans, sans-serif",
                                                fontWeight: 400,
                                            },
                                            "&.MuiAutocomplete-root .MuiOutlinedInput-root": {
                                                paddingTop: '30px'
                                            },

                                        }}
                                    />
                                </Box>
                                <Box mt={2}>
                                    <Text sx={{ fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontSize: '16px', fontWeight: '400', color: '#171717' }}>Reminder Cycle</Text>
                                </Box>
                                {formData.reminders.map((step, index) => (
                                   <Grid item container spacing={2} lg={12} md={12} sm={12} xs={12} mt={'2px'}>
                                   <Grid item container spacing={2} lg={12} md={11} sm={11} xs={11}>
                                       <Grid item lg={3} md={3} sm={3} xs={12}>
                                           <CustomSelect
                                               commonSelect
                                               label={<Text sx={{ fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontSize: '12px', fontWeight: '400', color: '#737373' }}>Remind</Text>}
                                               name='occurance_order'
                                               value={step.occurance_order}
                                               options={remind}
                                               scrollTrue={true}
                                               onChange={(e) => handleChange(e, index, formData.id)}
                                           />
                                       </Grid>
                                       <Grid item lg={3} md={3} sm={3} xs={12}>
                                           <Input
                                               formControlProps={{
                                                   fullWidth: true
                                               }}
                                               inputProps={{
                                                   name: 'number',
                                                   value: step.number
                                               }}
                                               handleChange={(e) => handleChange(e, index, formData.id)}
                                               clientInput
                                               labelText={<Text largeLabel>Count</Text>}
                                           />
                                       </Grid>

                                       <Grid item lg={3} md={3} sm={3} xs={12}>
                                           <CustomSelect
                                               commonSelect
                                               label={<Text sx={{ fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontSize: '12px', fontWeight: '400', color: '#737373' }}>Cycle</Text>}
                                               name='cycle'
                                               value={step.cycle}
                                               scrollTrue={true}
                                               options={cycles}
                                               onChange={(e) => handleChange(e, index, formData.id)}
                                           />
                                       </Grid>

                                       {index === formData.reminders.length - 1 ?
                                           <Grid item lg={3} md={3} sm={3} xs={12}>
                                               <Input
                                                   formControlProps={{
                                                       fullWidth: true
                                                   }}
                                                   inputProps={{
                                                       name: 'recurring_days',
                                                       value: step.recurring_days
                                                   }}
                                                   handleChange={(e) => handleChange(e, index, formData.id)}
                                                   clientInput
                                                   labelText={<Text largeLabel>Remind Every (Optional)</Text>}
                                               />

                                           </Grid> :
                                           <Grid item container alignItems='center' lg={1} md={2} sm={3} xs={1} width={'100%'} paddingTop={'10px'}>
                                               <img onClick={() => handleRemoveReminder(index, formData.id)} style={{ cursor: 'pointer' }} src={Minus} alt="Minus"></img>
                                           </Grid>
                                       }

                                   </Grid>
                               </Grid>
                                ))}

                                <Box onClick={() => handleAddReminder()} mt={2} display={'flex'} justifyContent={'center'} alignItems={'center'} width={'100%'} height={'30px'} backgroundColor={'#F5F9FF'} border={'none'} borderRadius={'8px'} transition="background-color 0.3s" // Add a transition for a smooth effect
                                    sx={{
                                        cursor: 'pointer',
                                        ':hover': {
                                            backgroundColor: '#d1e1ff',
                                        },
                                    }}>
                                    <Text sx={{ color: "#0C75EB", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontSize: '14px', fontWeight: '500' }}>Add Reminder Cycle</Text>
                                </Box>
                                <Box mt={2}>
                                    <Text sx={{ color: "#171717", fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontSize: '16px', fontWeight: '400' }}>Template</Text>
                                    <Box mt={2} display={'flex'} gap={2}>
                                        <Box width={'80%'}>
                                            <CustomSelect
                                                commonSelectBorderBlue
                                                label={'Choose Field'}
                                                name='templateText'
                                                scrollTrue={true}
                                                options={slugs}
                                                value={templateType.templateText}
                                                // onChange={handleChangeTemplate}
                                                onChange={changeHandler}

                                            />
                                        </Box>
                                        <Box width={'20%'}>
                                            <Button
                                                sx={{
                                                    width: '100% !important',
                                                    height: '95% !important',
                                                    font: "14px Nunito, sans-serif !important",
                                                    background: `#0C75EB !important`,
                                                    color: '#FFFFFF !important',
                                                    textTransform: "none !important",
                                                    borderRadius: "8px !important",
                                                    variant: "outlined"
                                                }}
                                                onClick={addButton}
                                            ><img src={Plus} alt='plus' style={{ height: '22px', width: '22px', marginRight: '5px' }} />Add</Button>
                                        </Box>
                                        <Box>

                                        </Box>
                                    </Box>
                                    <Box mt={2} height={'104px'} width={'100%'} backgroundColor={'#FFFFFF'} borderRadius={'6px'} padding={'10px'}>
                                        {/* <Text sx={{
                                            color: "#000000",
                                            fontFamily: "Nunito , Nunito Sans, sans-serif !important",
                                            fontSize: '14px',
                                            fontWeight: '400'
                                        }}
                                        onChange={handleChange}
                                        name="templateText" value={templateType.templateText}>
                                            {console.log(templateType,"type")}
                                        </Text> */}
                                        <Textarea className={classes.textarea} style={{ border: 'none', outline: 'none' }} type="text" name="content" value={formData.content} aria-label="minimum height" minRows={3} sx={{ resize: "none" }} onChange={(e) => handleChangeTemplate(e)} />

                                    </Box>
                                    <Box mt={3} gap={1} display={'flex'} justifyContent={'right'}>
                                        <Button
                                            sx={{
                                                width: "95px",
                                                height: "42px",
                                                borderRadius: "10px",
                                                border: '1px solid #0C75EB',
                                                color: '#0C75EB',
                                                backgroundColor: '#FFFFFF',
                                                textTransform: 'none',
                                                font: "18px Nunito, sans-serif !important",
                                                fontWeight: `500 !important`,
                                            }}
                                        >Cancel</Button>
                                        {
                                            (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_create" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_template" && item.is_allowed == true))) ||
                                                (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_template" && item.is_allowed == true))) ?
                                                <Button
                                                    sx={{
                                                        width: "95px",
                                                        height: "42px",
                                                        borderRadius: "10px",
                                                        border: 'none',
                                                        color: '#FFFFFF',
                                                        backgroundColor: '#0C75EB',
                                                        textTransform: 'none',
                                                        font: "18px Nunito, sans-serif !important",
                                                        fontWeight: `500 !important`,
                                                        '&:hover': {
                                                            backgroundColor: '#0C75EB',
                                                            color: '#FFFFFF'
                                                        },
                                                    }}
                                                    onClick={() => handleSubmit()}
                                                >Save</Button> :
                                                <Button saveLoaderDisable sx={{ height: '42px !important', width: "80px" }}
                                                >Save</Button>
                                        }
                                    </Box>
                                </Box>
                            </Box>

                            {/* <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                malesuada lacus ex, sit amet blandit leo lobortis eget.
                            </Typography> */}
                        </AccordionDetails>
                    </Accordion>
                    {/* <Accordion sx={{ border: 'none', boxShadow: 'none' }}>
                        <AccordionSummary
                            expandIcon={<ArrowDown />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                            sx={{ border: 'none', boxShadow: 'none', padding: '10px' }}
                        >
                            <Box display={"flex"} gap={1.5}>
                                <img src={DateIcon} alt="DateIcon"></img>
                                <Text sx={{ fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontSize: '16px', fontWeight: '600', color: '#092333' }}>Invoice Drafted</Text>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                malesuada lacus ex, sit amet blandit leo lobortis eget.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion sx={{ border: 'none', boxShadow: 'none' }}>
                        <AccordionSummary
                            expandIcon={<ArrowDown />}
                            aria-controls="panel3-content"
                            id="panel3-header"
                            sx={{ border: 'none', boxShadow: 'none', padding: '10px' }}
                        >
                            <Box display={"flex"} gap={1.5}>
                                <img src={DateIcon} alt="DateIcon"></img>
                                <Text sx={{ fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontSize: '16px', fontWeight: '600', color: '#092333' }}>Invoice Due</Text>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                malesuada lacus ex, sit amet blandit leo lobortis eget.
                            </Typography>
                        </AccordionDetails>
                    </Accordion> */}
                </div>
            </Box>

            {/* <Box className={classes.activeItemBoxNext}>
                <Text sx={{ fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontSize: '16px', fontWeight: '400', color: '#171717' }}>Recent Activities</Text>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: '16px', width: '100%', height: '108px', backgroundColor: '#FBFBFB', padding: "20px, 12px, 20px, 12px", borderRadius: '8px' }}>
                    <Box width={'30%'} pl={2}>
                        <Text sx={{ fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontSize: '14px', fontWeight: '600', color: '#000000' }}>Nithin Krishna</Text>
                        <Text sx={{ fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontSize: '12px', fontWeight: '500', color: '#737373' }}>10-12-2023</Text>
                    </Box>
                    <Box width={'70%'}>
                        Net-60 - name has been changed from Net-60 to Net-20, Days has been changed from 60 to 20, Description has been changed from to osrnfroflnreov
                    </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: '16px', width: '100%', height: '108px', backgroundColor: '#FBFBFB', padding: "20px, 12px, 20px, 12px", borderRadius: '8px' }}>
                    <Box width={'30%'} pl={2}>
                        <Text sx={{ fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontSize: '14px', fontWeight: '600', color: '#000000' }}>Nithin Krishna</Text>
                        <Text sx={{ fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontSize: '12px', fontWeight: '500', color: '#737373' }}>10-12-2023</Text>
                    </Box>
                    <Box width={'70%'}>
                        Net-60 - name has been changed from Net-60 to Net-20, Days has been changed from 60 to 20, Description has been changed from to osrnfroflnreov
                    </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: '16px', width: '100%', height: '108px', backgroundColor: '#FBFBFB', padding: "20px, 12px, 20px, 12px", borderRadius: '8px' }}>
                    <Box width={'30%'} pl={2}>
                        <Text sx={{ fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontSize: '14px', fontWeight: '600', color: '#000000' }}>Nithin Krishna</Text>
                        <Text sx={{ fontFamily: "Nunito , Nunito Sans, sans-serif !important", fontSize: '12px', fontWeight: '500', color: '#737373' }}>10-12-2023</Text>
                    </Box>
                    <Box width={'70%'}>
                        Net-60 - name has been changed from Net-60 to Net-20, Days has been changed from 60 to 20, Description has been changed from to osrnfroflnreov
                    </Box>
                </Box>
            </Box> */}
            <Box className={classes.activeItemBox} mt={4}>
                <Box mb={3}>
                    <Text RegularBlack1>Recent Activities</Text>
                </Box>
                <Box sx={{
          height: '40vh', overflowY: 'auto',
          //  '&::-webkit-scrollbar': {
          //   display: 'none',
          // },
        }}
        ref={activityRef}
        onScroll={activityHandleScroll}>
                {activityData.length > 0 && activityData.map((value) => (
                    <Box className={classes.descriptionBoxStyle} mb={2}>
                        <Grid container spacing={6}>
                            <Grid item lg={4} md={4} sm={6} xs={12} container direction={'column'} gap={1} height={'108px'} justifyContent={'center'}>
                                <Text mediumBlackColor>{value.created_by}</Text>
                                <Text greyLabel>{value.created_at}</Text>
                            </Grid>
                            <Grid item lg={8} md={8} sm={6} xs={12} display={"flex"} justifyContent={'center'} flexDirection={"column"}>
                                <Text BrowmnMnStepperText>{value.field_changes === '[]' ? '' : value.field_changes}</Text>
                            </Grid>
                        </Grid>
                    </Box>
                ))}
                </Box>
            </Box>
        </Box>

    )
};

export default Immigration;