import React, { useEffect, useState } from 'react';
import Text from "../components/customText/Text";
import minus from '../assets/svg/dashboard/blackMinus.svg'
import cross from '../assets/svg/dashboard/blackCross.svg'
import chatIcon from '../assets/svg/dashboard/chatIcon.svg';
import Button from "../components/customButton/Button";
import { ReactComponent as AddAttachmentIcon } from '../assets/svg/dashboard/mic.svg';
import { ReactComponent as SendIcon } from '../assets/svg/messagesendIcon.svg';
import { Box, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { ReactComponent as RedMic } from '../assets/svg/dashboard/micRed.svg';
import DashboardAPI from '../apis/admin/DashboardAPI';
import { addErrorMsg } from '../utils/utils';
import LocalStorage from '../utils/LocalStorage';
import { btnTxtBlack } from '../theme';

const useStyles = makeStyles(() => ({
    chatInput: {
        width: '100%',
        border: 'none',
        font: '16px Nunito',
        fontWeight: `${400}`,
        color: '#4F4F4F',
        paddingLeft: '15px',
        alignItems: 'center'
    },
    msg: {
        borderRadius: "4px", minWidth: "100px", margin: "4px 0px", padding: "5px 10px", textAlign: 'start'
    },
    sendMsgBox: {
        width: "100%", display: "flex", justifyContent: "flex-end", background: '#F4F4F4'
    },
    receiveMsgBox: {
        width: "100%", display: "flex", alignItems: "center", justifyContent: "flex-start"
    },
    suggestions: {
        width: '75%', border: '1px solid #3B4957', borderRadius: '8px', padding: '5px 8px'
    },
    suggestionText: {
        color: '#3B4957 !important', cursor: 'pointer'
    }
}));

function ChatBot({ openPoup, setOpenPopup }) {
    const classes = useStyles();
    const [message, setMessage] = useState('');
    const [viewMessage, setViewMessage] = useState(false);
    const [msgData, setMsgData] = useState([]); // eslint-disable-next-line
    const [recievedData, setRecievedData] = useState('');
    const [enableSuggestions, setEnableSuggestions] = useState(false);
    const {
        transcript,
        listening,
        // resetTranscript,
        // browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const changeHandler = (e) => {
        setMessage(e.target.value);
    }

    const sendChat = () => {
        setViewMessage(true);
        msgData.push(message);
        setMsgData([...msgData]);
        const data = {
            request_id: LocalStorage.uid(),
            question: message
        }
        DashboardAPI.storeChart(data).then((res) => {
            if (res.data.statusCode == 1003) {
                console.log(res.data.data, 'test');
            } else {
                addErrorMsg(res.data.message);
                setRecievedData(res.data.message);
            }
        })
        setMessage('');
    }

    const suggestionHandler = (args) => {
        setViewMessage(true);
        msgData.push(args);
        setMsgData([...msgData]);
        const data = {
            request_id: LocalStorage.uid(),
            question: args
        }
        DashboardAPI.storeChart(data).then((res) => {
            if (res.data.statusCode == 1003) {
                console.log(res.data.data, 'test');
            } else {
                addErrorMsg(res.data.message);
                setRecievedData(res.data.message);
            }
        })
        setMessage('');
    }

    useEffect(() => {
        setMessage(transcript);
    }, [transcript])

    return (
        <Grid container textAlign='center' sx={{ borderRadius: '2px !important', background: '#F4F4F4', width: 'auto' }}>
            <Grid item container lg={12} alignItems='center' justifyContent='end'>
                {
                    msgData.length > 0 ?
                        <Grid item container lg={12} alignItems='center' p={'10px 10px'} sx={{ background: '#FFFFFF' }}>
                            <Grid item lg={10}>
                                <Box display='flex' flexDirection='row' gap={1}>
                                    <img src={chatIcon} alt="chatIcon" />
                                    <Box>
                                        <Text mediumBoldBlack sx={{ paddingTop: '5px' }}>Alpha</Text>
                                        <Text mediumLabel sx={{ paddingTop: '5px' }}>AI Chat Bot</Text>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item lg={2} textAlign='end'>
                                <Box display='flex' flexDirection='row' gap={1}>
                                    <img src={minus} alt="minus" />
                                    <img src={cross} alt="cross" onClick={() => setOpenPopup(false)} style={{ cursor: 'pointer' }} />
                                </Box>
                            </Grid>
                        </Grid>
                        :
                        <Grid item lg={2} textAlign='end' pt={2}>
                            <Box display='flex' flexDirection='row' gap={1}>
                                <img src={minus} alt="minus" />
                                <img src={cross} alt="cross" onClick={() => setOpenPopup(false)} style={{ cursor: 'pointer' }} />
                            </Box>
                        </Grid>
                }
            </Grid>
            <Grid item lg={12} sx={{ height: '200px', overflowY: 'scroll' }}>
                {
                    msgData.length > 0 ? '' :
                        <Grid item lg={12} sx={{ padding: '20px 0px 40px 0px' }}>
                            <img src={chatIcon} alt="chatIcon" />
                            <Text mediumBoldBlack sx={{ paddingTop: '5px' }}>Alpha</Text>
                            <Text mediumLabel sx={{ paddingTop: '5px' }}>AI Chat Bot</Text>
                        </Grid>
                }
                {viewMessage && msgData.length > 0 && msgData.map((item) => (
                    <Grid item lg={12} className={classes.sendMsgBox}>
                        <Box className={classes.msg}>
                            <Text sx={{ font: '16px Nunito', fontWeight: `${400}`, color: `${btnTxtBlack.shade4}`, background: '#FFFFFF', textOverflow: 'ellipsis', padding: '8px', borderRadius: '8px 8px 0px 8px' }}>{item}</Text>
                        </Box>
                    </Grid>
                ))
                }
                {/* {recievedData !== '' &&
                    <Grid item lg={12} className={classes.receiveMsgBox}>
                        <Box className={classes.msg}>
                            <Text sx={{ font: '16px Nunito', fontWeight: `${400}`, color: '#FFFFFF', background: '#188CFF', textOverflow: 'ellipsis', padding: '8px', borderRadius: '8px 8px 0px 8px' }}>{msgData}</Text>
                        </Box>
                    </Grid>
                } */}
            </Grid>
            <Grid container lg={12} xs={12} pl={2} textAlign='start' justifyContent='flex-start' alignItems='center'>
                <Grid item lg={12}>
                    <Text smallGrey sx={{ color: '#3B4957 !important' }}>Suggestions</Text>
                </Grid>
                <Grid item lg={12} p={'10px 0px'} display='flex' flexDirection='row' gap={2}>
                    <Box className={classes.suggestions}>
                        <Text smallGrey className={classes.suggestionText} onClick={() => suggestionHandler('Whats the last weekly cycle payroll amount?')}>Whats the last weekly cycle payroll amount?</Text>
                    </Box>
                    {
                        enableSuggestions == false &&
                        <Box alignItems='center' textAlign='center' sx={{ width: '15%', border: '1px solid #3B4957', borderRadius: '8px', padding: '5px 8px', cursor: "pointer" }} onClick={() => setEnableSuggestions(true)}>
                            <Text smallGrey className={classes.suggestionText}> More</Text>
                        </Box>
                    }
                </Grid>
                {
                    enableSuggestions &&
                    <Grid container spacing={2} pb={2}>
                        <Grid item lg={12}>
                            <Box className={classes.suggestions}>
                                <Text smallGrey className={classes.suggestionText} onClick={() => suggestionHandler('How many placements did we do in this month by visa?')}>How many placements did we do in this month by visa?</Text>
                            </Box>
                        </Grid>
                        <Grid item lg={12}>
                            <Box className={classes.suggestions}>
                                <Text smallGrey className={classes.suggestionText} onClick={() => suggestionHandler('How many/much invoices did we raise this month?')}>How many/much invoices did we raise this month?</Text>
                            </Box>
                        </Grid>
                        <Grid item lg={12}>
                            <Box className={classes.suggestions}>
                                <Text smallGrey className={classes.suggestionText} onClick={() => suggestionHandler('How many total employees do we have in the organisation by category ?')}> How many total employees do we have in the organisation by category ?</Text>
                            </Box>
                        </Grid>
                        <Grid item lg={12}>
                            <Box className={classes.suggestions}>
                                <Text smallGrey className={classes.suggestionText} onClick={() => suggestionHandler('How many active clients we have currently?')}>How many active clients we have currently?</Text>
                            </Box>
                        </Grid>
                    </Grid>
                }
            </Grid>
            <Grid item lg={12} sx={{ display: 'flex', flexDirection: 'row', background: '#FFFFFF', padding: '7px 0px' }}>
                <input className={classes.chatInput} placeholder='Ask Anything To Alpha' name='message' value={message} onChange={changeHandler} autoFocus='on' autoComplete='off' />
                {
                    message !== '' &&
                    <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={sendChat}><SendIcon /></Box>
                }
                <Button className={classes.attachbg} component="label">
                    <input hidden name="imgUrl" type="text" />
                    {
                        listening ?
                            <RedMic />
                            :
                            <AddAttachmentIcon onClick={SpeechRecognition.startListening} />
                    }
                </Button>
            </Grid>
        </Grid>
    )
}

export default ChatBot