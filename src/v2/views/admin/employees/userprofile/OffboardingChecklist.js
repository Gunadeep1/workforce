import React, { useEffect, useState } from 'react'
import { Box, Grid, Avatar, Divider, Stack, Typography } from "@mui/material";
import Text from '../../../../components/customText/Text';
import Date from '../../../../components/datePicker/Date';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionSummary from '@mui/material/AccordionSummary';
import Accordion from '@mui/material/Accordion';
import CustomButton from '../../../../components/customButton/Button';
import CustomSelect from '../../../../components/customSelect/CustomSelect';
import FileInput from '../../../../components/muiFileInput/FileInput';
import { getCurrencySymbol } from "../../../../utils/utils";
import LocalStorage from '../../../../utils/LocalStorage';
import moment from 'moment';
import { dateFormat } from '../../../../utils/utils';
import offBoardImag1 from "../../../../assets/svg/disabled 1.svg"
// eslint-disable-next-line
import offBoardImag2 from "../../../../assets/svg/offBoard2.svg"
// eslint-disable-next-line
import offBoardImag3 from "../../../../assets/svg/offBoard3.svg"
import offBoardImag4 from "../../../../assets/svg/give-money 2.svg"
import checked from "../../../../assets/svg/Checked.svg"
import { Link } from "react-router-dom";
import { addErrorMsg } from '../../../../utils/utils';
import completed from "../../../../assets/svg/CompletedImg.svg"
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import { useLocation } from 'react-router-dom';
import CommonApi from '../../../../apis/CommonApi';
import { makeStyles } from "@mui/styles";
import {
  isValid,
  validate_emptyField,
} from "../../../../components/Validation";
import OffboardingChecklistStyles from './OffboardingChecklistStyles';
import OffboardApi from '../../../../apis/admin/offboard/OffboardApi';
import Slide from "@mui/material/Slide";
import SettingsApi from '../../../../apis/settingsApi/SettingsApi';

const useStyles = makeStyles({
  accordionSummary: {
    backgroundColor: "#ffffff",
    '&.MuiAccordionSummary-root': {
      pointerEvents: 'none',
    },
  },
});

function OffboardingChecklist() {
  const classes = OffboardingChecklistStyles();
  const classes1 = useStyles();
  const payViaList = require('../../../../utils/jsons/PayVia.json');
  const EmailSentTo = require('../../../../utils/jsons/EmailSentTo.json');
  const location = useLocation();
  const [error2, setError2] = useState({});
  const [error3, setError3] = useState({});
  const [error4, setError4] = useState({});
  const [isAccordionOpen1, setAccordionOpen1] = useState(true);
  const [isAccordionOpen2, setAccordionOpen2] = useState(true);
  const [isAccordionOpen3, setAccordionOpen3] = useState(true);
  const [isAccordionOpen4, setAccordionOpen4] = useState(true);
  // eslint-disable-next-line
  const [get1, setGet1] = useState({});
  const [open, setOpen] = useState(0)
  const [popUpOpen, setPopUpOpen] = useState(false);
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper ": {
      borderRadius: "16px",
      width: "500px"
    }
  }));
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });
  const { acc } = location.state
  const { full_name, reference_id, avatar_url, id, args } = location.state
 
  useEffect(() => {
    getOffBoardCheckList(id)
    OrganizationIndex();
    // eslint-disable-next-line
  }, [])

  const [cardData1, setCardData1] = useState({
    request_id: LocalStorage.uid(),
    key: "disable_user_access_across_apps",
    value: false,
    employee_id: "",
    last_working_day: ""
  })

  const [level, setLevel] = useState({
    associated_app_names: "",
    notify_university_usics: "",
    enable_delete_email: "",
    enable_settlement_amount: "",
  })

  const [cardData2, setCardData2] = useState({
    request_id: LocalStorage.uid(),
    notify_emails: {
      email_sent_to: "",
      date: "",
      documents: [
        {
          id: "",
          document_name: "",
        }
      ]
    },
    employee_id: "",
    last_working_day: ""

  })
  const [cardData3, setCardData3] = useState({
    request_id: LocalStorage.uid(),
    key: "delete_email_id_on",
    value: "",
    delete_email_id_document: "",
    employee_id: "",
    last_working_day: ""
  })

  const [cardData4, setCardData4] = useState({
    request_id: LocalStorage.uid(),
    key: "settlement_mode",
    value: "",
    employee_id: "",
    last_working_day: ""
  })

  const getOffBoardCheckList = (args) => {
    OffboardApi.getOffBoardCheckList(args).then((response) => {
      if (response.data.statusCode == 1003) {
        setTimeout(() => {
          setGet1({ ...response.data.data[0] })
        }, 400)
      } else {
        addErrorMsg(response.data.message);
      }
    });
  }

  const OrganizationIndex = () => {
    SettingsApi.configIndexApi().then((res) => {
      if (res.data.statusCode == 1003) {
        setLevel(res.data.data[0])
      }
    })
  }

  const handleAccordionClick = (args) => {
    if (args == 1) {
      setAccordionOpen1(!isAccordionOpen1);
    } else if (args == 2) {
      setAccordionOpen2(!isAccordionOpen2);
    } else if (args == 3) {
      setAccordionOpen3(!isAccordionOpen3);
    }

  };
  const validateAll2 = () => {
    let errors = {};
    errors.email_sent_to = validate_emptyField(cardData2.notify_emails.email_sent_to);
    errors.date = validate_emptyField(cardData2.notify_emails.date);
    return errors;
  };
  const validateAll3 = () => {
    let errors = {};
    errors.value = validate_emptyField(cardData3.value);
    return errors;
  };
  const validateAll4 = () => {
    let errors = {};
    errors.value = validate_emptyField(cardData4.value);
    return errors;
  };
  const cardClick = (args) => {
    if (args == 1) {
      const data = { ...cardData1, employee_id: id, value: true, last_working_day: get1.last_working_day ? get1.last_working_day : cardData1.last_working_day };
      OffboardApi.storeOffBoard(data).then((response) => {
        if (response.data.statusCode == 1003) {
          setAccordionOpen1(false);
          getOffBoardCheckList(id)
          setOpen(2)
          setAccordionOpen2(true)
        } else {
          addErrorMsg(response.data.message);
        }
      })
    }
    else if (args == 2) {
      let errors = validateAll2()
      if (isValid(errors)) {
        const data = { ...cardData2, employee_id: id, last_working_day: get1.last_working_day ? get1.last_working_day : cardData2.last_working_day, email_sent_to: cardData2.notify_emails.email_sent_to, date: cardData2.notify_emails.date, };
        OffboardApi.storeOffBoard(data).then((response) => {
          if (response.data.statusCode == 1003) {
            setAccordionOpen2(false)
            setAccordionOpen3(true)
            setOpen(3)
            getOffBoardCheckList(id)
          } else {
            addErrorMsg(response.data.message);
          }

        })
      } else {
        console.log(errors);
        setError2(errors);
      }

    } else if (args == 3) {
      let errors = validateAll3()
      if (isValid(errors)) {
        const data = { ...cardData3, employee_id: id, last_working_day: get1.last_working_day ? get1.last_working_day : cardData3.last_working_day, value: cardData3.value };
        OffboardApi.storeOffBoard(data).then((response) => {
          if (response.data.statusCode == 1003) {
            setAccordionOpen3(false)
            setAccordionOpen4(true)
            getOffBoardCheckList(id)
            setOpen(4)
          } else {
            addErrorMsg(response.data.message);
          }
        })
      } else {
        setError3(errors);
      }


    } else if (args == 4) {
      if (get1.balance_amount == "") {
        const data = { ...cardData4, employee_id: id, last_working_day: get1.last_working_day ? get1.last_working_day : cardData4.last_working_day, value: cardData4.value };
        OffboardApi.storeOffBoard(data).then((response) => {
          if (response.data.statusCode == 1003) {
            setPopUpOpen(true)
          } else {
            addErrorMsg(response.data.message);
          }
        })
      } else {
        let errors = validateAll4()
        if (isValid(errors)) {
          const data = { ...cardData4, employee_id: id, last_working_day: get1.last_working_day ? get1.last_working_day : cardData4.last_working_day, value: cardData4.value };
          OffboardApi.storeOffBoard(data).then((response) => {
            if (response.data.statusCode == 1003) {
              setPopUpOpen(true)
            } else {
              addErrorMsg(response.data.message);
            }
          })
        } else {
          setError4(errors);
        }
      }
    }
  }
  const uploadDocs = (value) => {
    if (value.target.files[0].type.split('/').some(r => ['png', 'jpg', 'jpeg', 'pdf'].includes(r))) {
      const formData = new FormData();
      formData.append("files", value.target.files[0]);
      formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
      CommonApi
        .documentUpload("offboarding-document",formData, LocalStorage.getAccessToken())
        .then((response) => {
          if (response.data.statusCode == 1003) {
            let docArr;
            if (cardData2.notify_emails.documents.length > 0) {
              docArr = cardData2.notify_emails.documents.map((doc) => ({
                ...doc,
                document_name: value.target.files[0].name,
              }));
            } else {
              docArr = [
                {
                  id: "",
                  document_name: value.target.files[0].name,
                }
              ]
            }
            setCardData2((prev) => ({
              ...prev,
              notify_emails: {
                ...prev.notify_emails,
                documents: docArr,
              },
            }));
          } else {
            addErrorMsg(response.data.message);
          }
        });
    }
    else {
      addErrorMsg("Upload Valid File(png,jpg,jpeg,pdf).");
    }

  };
  const uploadDocs1 = (value) => {
    if (value.target.files[0].type.split('/').some(r => ['png', 'jpg', 'jpeg', 'pdf'].includes(r))) {
      const formData = new FormData();
      formData.append("files", value.target.files[0]);
      formData.append("tenant_id", LocalStorage.getUserData().tenant_id);

      CommonApi.documentUpload("offboarding-document",formData, LocalStorage.getAccessToken())
        .then((response) => {
          if (response.data.statusCode === 1003) {
            setCardData3((prev) => ({
              ...prev,
              delete_email_id_document: value.target.files[0].name,
            }));
          } else {
            addErrorMsg(response.data.message);
          }
        });
    } else {
      addErrorMsg("Upload Valid File(png,jpg,jpeg,pdf).");
    }

  };
  const handleValidations = (input) => {
    let err2 = error2;
    let err3 = error3
    switch (input.name || input.tagName) {
      case "email_sent_to":
        err2.email_sent_to = validate_emptyField(input.value);
        break;
      case "date":
        err2.date = validate_emptyField(input.value);
        break;
      case 'value':
        err3.value = validate_emptyField(input.value);
        break;
      default:
        break;
    }
    setError2(err2);
    setError3(err3);
  };
  const handleValidations1 = (input) => {
    let err4 = error4
    switch (input.name || input.tagName) {
      case 'value':
        err4.value = validate_emptyField(input.value);
        break;
      default:
        break;
    }
    setError4(err4);
  };
  const changeHandler1 = (e) => {
    setCardData4({
      ...cardData4,
      [e.target.name]: e.target.value
    })
    handleValidations1(e.target);
  }
  const changeHandler = (e) => {
    if (e.target.name == 'email_sent_to') {
      cardData2.notify_emails[e.target.name] = e.target.value
      setCardData2({ ...cardData2 });
    }
    handleValidations(e.target);
  }
  const dateChange = (e, name) => {
    let date = e.$d
    if (name == 'date') {
      cardData2.notify_emails[name] = moment(date).format(dateFormat())
      setCardData2({ ...cardData2 });
    }
    else if (name == 'value') {
      setCardData3({
        ...cardData3,
        [name]: moment(date).format(dateFormat())
      })
    }
    else if (name == "last_working_day") {
      setCardData1({
        ...cardData1,
        [name]: moment(date).format(dateFormat())
      })
      setCardData2({
        ...cardData2,
        [name]: moment(date).format(dateFormat())
      })
      setCardData3({
        ...cardData3,
        [name]: moment(date).format(dateFormat())
      })
      setCardData4({
        ...cardData4,
        [name]: moment(date).format(dateFormat())
      })
      setGet1({
        ...get1, [name]: moment(date).format(dateFormat())
      });
    }
    handleValidations({ name: name, value: date });
  }
  return (
    <>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }} position={"sticky"}  >
        <Grid container sx={{ width: "54vw" }} pt={2}>
          <Grid item>
            <Text boldBlackfont16>
              Offboarding Checklist
            </Text>
          </Grid>
          <Grid item container lg={12} mt={3} sx={{ boxShadow: "5px 5px 10px 0px rgba(0, 0, 0, 0.05) !important", }} p={2}>
            <Grid item lg={7}>
              <Box display="flex" alignItems="center">
                <Avatar alt="rychbcb" src={avatar_url} sx={{ width: '70px', height: "70px" }} />
                <Box ml={2}>
                  <Text boldBlackfont16>{full_name}</Text>
                  <Text smallBlack sx={{ color: '#737373 !important', paddingTop: '5px !important', fontFamily: "Nunito , Nunito Sans, sans-serif !important" }} nowrap>{reference_id}</Text>
                </Box>
              </Box>
            </Grid>
            <Grid item lg={5}>
              <Box pt={'8px'}>
                <Date
                  labelText={<Text largeLabel>Last Working Day</Text>}
                  name='last_working_day'
                  value={get1.last_working_day}
                  maxDate={moment().format('YYYY-MM-DD')}
                  onChange={(value => dateChange(value, 'last_working_day'))}
                  height='56px' />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", overflowY: "auto", height: "60vh" }}>
        <Grid container sx={{ width: "55vw" }} >
          {
            level.associated_app_names !== '' &&
            <Grid item lg={12} mt={1}>
              <Accordion
                expanded={acc == 1 || args == 1 ? isAccordionOpen1 : ""}
                onChange={() => handleAccordionClick(1)}
                className={classes.customAccordion}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  className={classes1.accordionSummary}
                >
                  <Grid item container>
                    <Grid item lg={1}>
                      {get1.off_boarding_percentage == 25 || get1.off_boarding_percentage == 50 || get1.off_boarding_percentage == 75
                        ? <img alt='checked' src={checked} /> : <img alt='off1' src={offBoardImag1} />}
                    </Grid>
                    <Grid item lg={10} p={1} ml={3} display={"flex"} justifyContent={"center"} flexDirection={"column"}>
                      <Text mediumOverView sx={{ color: "#171717 !important" }}>{level.associated_app_names !== '' && '1.'}{level.associated_app_names}</Text>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid item container>
                    <Grid item p={2}>
                      <Text BrowmnMnStepperText>Have you disabled the user access for {get1.organization_name}</Text>
                    </Grid>
                    <Grid item lg={12} mt={2}><Divider sx={{ border: "1px solid #EAECF0" }} /></Grid>
                    <Grid item lg={12} display={"flex"} justifyContent={"end"} mt={2}>
                      <Stack direction={"row"} spacing={3}>
                        <CustomButton popupCancel1 component={Link} to={`/employees/user-profile/${full_name === "" ? "" : full_name.trim().split(/ +/).join('-')}`}
                          state={{
                            id: id, full_name: full_name, reference_id: reference_id, offBoardButton: true, progress: 0, avatar_url: avatar_url
                          }}
                        >
                          NO
                        </CustomButton>
                        <CustomButton popupSaveBlue onClick={() => cardClick(1)}>
                          Yes
                        </CustomButton>
                      </Stack>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          }
          {
            level.notify_university_usics == true &&
            <Grid item lg={12} mt={1}>
              <Accordion
                onChange={() => handleAccordionClick(2)}
                expanded={args == 2 || open == 2 ? isAccordionOpen2 : ""}
                className={classes.customAccordion}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  className={classes1.accordionSummary}

                >
                  <Grid item container>
                    <Grid item lg={1}>
                      {get1.off_boarding_percentage == 50 || get1.off_boarding_percentage == 75 ? <img alt='check' src={checked} /> : <img alt='off2' src={offBoardImag2} />}
                    </Grid>
                    <Grid item lg={10} p={1} ml={3} display={"flex"} justifyContent={"center"} flexDirection={"column"}>
                      <Text mediumOverView sx={{ color: "#171717 !important" }}>{
                        level.associated_app_names !== '' && level.notify_university_usics && '2.'
                      } Send Email to USCIS / University</Text>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid item container>
                    <Grid item lg={12}><Divider sx={{ border: "1px solid #EAECF0" }} /></Grid>
                    <Grid item container spacing={3} pt={3}>
                      <Grid item lg={3}>
                        <Box pt={'8px'}>
                          <CustomSelect
                            name='email_sent_to'
                            value={cardData2.notify_emails.email_sent_to}
                            commonSelect
                            onChange={changeHandler}
                            label={<Text largeLabel>Email Sent To</Text>}
                            options={EmailSentTo}
                          />
                        </Box>
                        {
                          error2.email_sent_to ?
                            <Text red>{error2.email_sent_to ? error2.email_sent_to : ''}</Text> : ''
                        }
                      </Grid>
                      <Grid item lg={3}>
                        <Box pt={'8px'}>
                          <Date
                            labelText={<Text largeLabel>Date</Text>}
                            name='date'
                            value={cardData2.notify_emails.date}
                            shouldDisableDate
                            onChange={(value => dateChange(value, 'date'))}
                            height='53px' />
                        </Box>
                        {
                          error2.date ?
                            <Text red>{error2.date ? error2.date : ''}</Text> : ''
                        }
                      </Grid>
                      <Grid item lg={6}>
                        <Box pt={'7px'}>
                          <FileInput
                            name={"document_name"}
                            FileName={cardData2.notify_emails.documents[0] ? cardData2.notify_emails.documents[0].document_name : ""}
                            handleChange={uploadDocs}
                            label={<Text largeLabel>Proof Of Document <span style={{ color: "#C7CCD3" }}>( Optional )</span></Text>}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid item lg={12} mt={4}><Divider sx={{ border: "1px solid #EAECF0" }} /></Grid>
                    <Grid item lg={12} display={"flex"} justifyContent={"end"} mt={2}>
                      <Stack direction={"row"} spacing={3}>
                        <CustomButton closeBtn component={Link} to={`/employees/user-profile/${full_name === "" ? "" : full_name.trim().split(/ +/).join('-')}`}
                          state={{
                            id: id, full_name: full_name, reference_id: reference_id, offBoardButton: true, progress: 25, avatar_url: avatar_url, active: 1, grButn: 1
                          }}>
                          Cancel
                        </CustomButton>
                        <CustomButton popupSaveBlue sx={{ width: "84px !important" }} onClick={() => cardClick(2)}>
                          Save
                        </CustomButton>
                      </Stack>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          }
          {
            level.enable_delete_email == true &&
            <Grid item lg={12} mt={1}>
              <Accordion
                expanded={args == 3 || open == 3 ? isAccordionOpen3 : ""}
                onChange={() => handleAccordionClick(3)}
                className={classes.customAccordion}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  className={classes1.accordionSummary}

                >
                  <Grid item container>
                    <Grid item lg={1}>
                      {get1.off_boarding_percentage == 75 ? <img alt='check' src={checked} /> : <img alt='off3' src={offBoardImag3} />}
                    </Grid>
                    <Grid item lg={10} p={1} ml={3} display={"flex"} justifyContent={"center"} flexDirection={"column"}>
                      <Text mediumOverView sx={{ color: "#171717 !important" }}>{
                        level.associated_app_names !== '' && level.notify_university_usics && level.enable_delete_email && '3.'
                      } Delete Mail ID</Text>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid item container>
                    <Grid item lg={12}><Divider sx={{ border: "1px solid #EAECF0" }} /></Grid>
                    <Grid item container spacing={3} pt={3}>
                      <Grid item lg={4}>
                        <Box pt={'8px'}>
                          <Date
                            labelText={<Text largeLabel>E-Mail ID Deleted on</Text>}
                            name='value'
                            value={cardData3.value}
                            shouldDisableDate
                            onChange={(value => dateChange(value, 'value'))}
                            height='53px' />
                        </Box>
                        {
                          error3.value ?
                            <Text red>{error3.value ? error3.value : ''}</Text> : ''
                        }
                      </Grid>
                      <Grid item lg={8}>
                        <Box pt={'7px'}>
                          <FileInput
                            name={"delete_email_id_document"}
                            FileName={cardData3.delete_email_id_document}
                            handleChange={uploadDocs1}
                            isDisabled={false}
                            label={<Text largeLabel>Proof Of Document <span style={{ color: "#C7CCD3" }}>( Optional )</span></Text>}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid item lg={12} mt={4}><Divider sx={{ border: "1px solid #EAECF0" }} /></Grid>
                    <Grid item lg={12} display={"flex"} justifyContent={"end"} mt={2}>
                      <Stack direction={"row"} spacing={3}>
                        <CustomButton closeBtn component={Link} to={`/employees/user-profile/${full_name === "" ? "" : full_name.trim().split(/ +/).join('-')}`}
                          state={{
                            id: id, full_name: full_name, reference_id: reference_id, offBoardButton: true, progress: 50, avatar_url: avatar_url, active: 2, grButn: 2
                          }}>
                          Cancel
                        </CustomButton>
                        <CustomButton popupSaveBlue sx={{ width: "84px !important" }} onClick={() => cardClick(3)}>
                          Save
                        </CustomButton>
                      </Stack>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>


            </Grid>
          }
          {
            level.enable_settlement_amount == true &&
            <Grid item lg={12} mt={1} pb={1}>
              <Accordion
                expanded={args == 4 || open == 4 ? isAccordionOpen4 : ""}
                className={classes.customAccordion}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  className={classes1.accordionSummary}
                >
                  <Grid item container>
                    <Grid item lg={1}>
                      <img alt='off4' src={offBoardImag4} />
                    </Grid>
                    <Grid item lg={10} p={1} ml={3} display={"flex"} justifyContent={"center"} flexDirection={"column"}>
                      <Text mediumOverView sx={{ color: "#171717 !important" }}>{
                        level.associated_app_names !== '' && level.notify_university_usics && level.enable_delete_email && level.enable_settlement_amount && '4.'
                      } Settle Amount</Text>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid item container>
                    <Grid item lg={12}><Divider sx={{ border: "1px solid #EAECF0" }} /></Grid>
                    <Grid item container spacing={3} pt={3}>
                      <Grid item lg={9}>
                        <Text overViewLable>Total Balance Available</Text>
                        <Text boldBlackfont16 sx={{ font: '24px Nunito Sans, sans-serif !important', }}>{getCurrencySymbol()}{" "}{get1.balance_amount ? get1.balance_amount : 0}</Text>
                      </Grid>
                      <Grid item lg={3}>
                        {get1.balance_amount ?
                          (<>
                            <Box pt={'8px'}>
                              <CustomSelect
                                name='value'
                                value={cardData4.value}
                                commonSelect
                                onChange={changeHandler1}
                                label={<Text largeLabel>Pay Via</Text>}
                                options={payViaList}
                              />
                            </Box>
                            {
                              error4.value ?
                                <Text red>{error4.value ? error4.value : ''}</Text> : ''
                            }
                          </>)
                          :
                          ""}

                      </Grid>
                    </Grid>
                    <Grid item lg={12} mt={4}><Divider sx={{ border: "1px solid #EAECF0" }} /></Grid>
                    <Grid item lg={12} display={"flex"} justifyContent={"end"} mt={2}>
                      <Stack direction={"row"} spacing={3}>
                        <CustomButton closeBtn component={Link} to={`/employees/user-profile/${full_name === "" ? "" : full_name.trim().split(/ +/).join('-')}`}
                          state={{
                            id: id, full_name: full_name, reference_id: reference_id, offBoardButton: true, progress: 75, avatar_url: avatar_url, active: 3, grButn: 3
                          }}>
                          Cancel
                        </CustomButton>
                        <CustomButton popupSaveBlue sx={{ width: "84px !important" }} onClick={() => cardClick(4)}>
                          Finish
                        </CustomButton>
                      </Stack>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          }
        </Grid>
        <BootstrapDialog
          TransitionComponent={Transition}
          keepMounted
          aria-labelledby="customized-dialog-title"
          open={popUpOpen}
        >
          <DialogContent sx={{ margin: "20px", }}>
            <>
              <Box my={1} sx={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                <img src={completed} alt="completed" />
              </Box>
              <Box my={3}>
                <Typography my={1} sx={{ color: "#54595E", font: '18px  Nunito , Nunito Sans, sans-serif', fontWeight: 600, textAlign: 'center' }}>
                  Off boarding Completed
                </Typography>
                <Typography my={1} sx={{ color: "#54595E99", font: '14px  Nunito , Nunito Sans, sans-serif', fontWeight: 400, textAlign: 'center' }}>
                  <span style={{ color: "#0C75EB" }}>{full_name}</span> has been off boarded Successfully
                </Typography>
              </Box>
              <Box my={2} className={classes.popupHead1}>
                <CustomButton popupSaveBlue sx={{ width: "335px !important" }} component={Link} to={`/employees/user-profile/${full_name === "" ? "" : full_name.trim().split(/ +/).join('-')}`}
                  onClick={() => getOffBoardCheckList(id)}
                  state={{
                    id: id, full_name: full_name, reference_id: reference_id, offBoardButton: false,
                    avatar_url: avatar_url, active: 3, grButn: 3
                  }} >
                  Done
                </CustomButton>
              </Box>
            </>
          </DialogContent>
        </BootstrapDialog>
      </Box>
    </>
  )
}

export default OffboardingChecklist
