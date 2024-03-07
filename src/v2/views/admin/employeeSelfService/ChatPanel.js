import React, { useState, useEffect, useRef } from 'react';
import { Box, Breadcrumbs, Grid, Divider, Avatar, Stack, Typography } from '@mui/material';
import Text from '../../../components/customText/Text';
import { Link, useLocation } from 'react-router-dom';
import EmployeeSelfServiceStyles from './EmployeeSSDshStyles';
import Button from '../../../components/customButton/Button';
import { ReactComponent as NewTag } from '../../../assets/svg/NewTag.svg';
import { ReactComponent as SendIcon } from '../../../assets/svg/messagesendIcon.svg';
import { ReactComponent as AddAttachmentIcon } from '../../../assets/svg/addAttachmentIcon.svg';
import { ReactComponent as DoubleTickIcon } from '../../../assets/svg/doubleTick.svg';
import { addErrorMsg, addSuccessMsg, socket } from '../../../utils/utils';
import EmployeeSSAPI from '../../../apis/admin/employeeSelfService/EmployeeSelfServiceApi';
import Skeleton from '@mui/material/Skeleton';
import LocalStorage from '../../../utils/LocalStorage';
import moment from 'moment';
import CommonApi from '../../../apis/CommonApi';
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { ReactComponent as Information } from '../../../assets/svg/service-info.svg';
import Slide from "@mui/material/Slide";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import clear from '../../../assets/svg/cancel.svg'
import Input from '../../../components/input/Input';

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#393939",
        padding: "8px 10px",
        minWidth: 100,
        border: "1px solid #393939",
        borderRadius: "9px",
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: "#393939",
        "&::before": {
            backgroundColor: "#393939",
            border: "1px solid #393939"
        }
    },
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({

    "& .MuiPaper-root": {
        maxWidth: '740px !important'
    },
    "& .MuiDialog-paper": {
        width: "850px !important",
        height: '568px'
    },
    "& .MuiDialogContent-root": {
        padding: '8px !important',
        margin: '10px !important'
    },
    "& .MuiDialogActions-root": {
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} timeout={200} />;
});

export default function ChatPanel() {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const location = useLocation();
    const data = location && location.state && location.state.formData;
    const raise = location && location.state && location.state.raise;
    const recieve = location && location.state && location.state.recieve;
    const classes = EmployeeSelfServiceStyles();
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [current, setCurrent] = useState(data);
    const messagesEndRef = useRef(null);
    const [isTyping, setisTyping] = useState({});
    const [popUpOpen, setPopUpOpen] = useState(false);

    const filterData = {
        limit: 20,
        page: 1,
        search: '',
        self_service: [],
        status: [],
        from_date: '',
        to_date: '',
        received: location.state.status === 'created' ? false : recieve,
        raised: location.state.status === 'created' ? true : raise,
        employee: false,
    };

    useEffect(() => {
        getAllEmployees(filterData);
        scrollToBottom();
        if (!location.state.RequestData) {
            setCurrent(data);
        }
        // eslint-disable-next-line
    }, []);

    const getAllEmployees = (filter) => {
        setLoading(true)
        EmployeeSSAPI.getAllEmployees(filter).then((response) => {
            setTimeout(() => {
                setLoading(false)
                if (response.data.statusCode == 1003) {
                    if (response.data.data.length > 0) {
                        if (location.state.requestData) {
                            let dataId = response.data.data.filter((item) => item.id == location.state.requestData.id);
                            setCurrent(dataId[0]);
                            console.log(dataId[0], "dataId")

                        }
                    }
                    setEmployees(response.data.data);
                } else {
                    addErrorMsg(response.data.message);
                }
            }, 400)
        });
    }

    const [chatlist, setChatlist] = useState([]);
    // eslint-disable-next-line 
    const [socketUsername, setsocketUsername] = useState(LocalStorage.getUserData().full_name);
    const [roomID, setroomID] = useState(data && data.id);

    useEffect(() => {
        socket.on("joinedRoom", data => { setChatlist(data.messages) });
        // eslint-disable-next-line
    }, [roomID])
    useEffect(() => {
        socket.emit("join_room", { username: socketUsername, room: roomID, socketID: socket.id });
        // eslint-disable-next-line
    }, [roomID])
    useEffect(() => {
        socket.on("messageResponse", data => setChatlist([...chatlist, data]));
    }, [chatlist])
    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [chatlist]);

    const [chatmsg, setChatmsg] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [fileId, setFileId] = useState('');
    const [formData, setFormData] = useState({
        employee_id: '',
        employee_name: '',
        reference_id: '',
        ticket_id: '',
        self_service_type_name: '',
        subject: '',
        description: '',
        documents: [
            {
                new_document_id: '',
                document_name: ''
            }
        ]
    })
    useEffect(() => {
        socket.on("isTyping", data => setisTyping(data));
        socket.on("stopTyping", data => setisTyping(data));
        scrollToBottom()
    }, [isTyping, chatmsg]);

    const suggestionHandler = (e, args) => {
        e.preventDefault();
        if (imgUrl === '' && args.trim() == "") {
            return false;
        }
        socket.emit("new_message",
            {
                chat_document: imgUrl,
                document_id: fileId,
                message: args,
                username: socketUsername,
                room: roomID,
                socketID: socket.id,
                __created_at__: new Date(),
            }
        );
        setChatlist([...chatlist, {
            chat_document: imgUrl,
            message: args,
            username: socketUsername,
            room: roomID,
            socketID: socket.id,
            __created_at__: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        }])
        setChatmsg('');
        setImgUrl('')
        socket.emit("stopTyping", { room: roomID })
        employees['label'] = 'old'
        getAllEmployees(filterData);
        scrollToBottom();
    }

    const sendChatMsg = (e) => {
        e.preventDefault();
        if (imgUrl === '' && chatmsg.trim() == "") {
            return false;
        }
        // console.log(chatmsg, 'chatmsg')
        socket.emit("new_message",
            {
                chat_document: imgUrl,
                document_id: fileId,
                message: chatmsg,
                username: socketUsername,
                room: roomID,
                socketID: socket.id,
                __created_at__: new Date(),
            }
        );
        setChatlist([...chatlist, {
            chat_document: imgUrl,
            message: chatmsg,
            username: socketUsername,
            room: roomID,
            socketID: socket.id,
            __created_at__: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        }])
        setChatmsg('');
        setImgUrl('')
        socket.emit("stopTyping", { room: roomID })
        employees['label'] = 'old'
        getAllEmployees(filterData);
        scrollToBottom();
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            socket.emit("stopTyping", { room: roomID })
            // Send Axios request here
        }, 2000)

        return () => clearTimeout(delayDebounceFn)
        // eslint-disable-next-line
    }, [chatmsg])

    const handleChange = (e) => {
        socket.emit("isTyping", { room: roomID })
        setChatmsg(e.target.value);
    }

    const uploadFile = (e) => {
        // console.log(e, "E");
        const formData = new FormData();
        formData.append("files", e.target.files[0]);
        formData.append("tenant_id", LocalStorage.getUserData().tenant_id);
        CommonApi.documentUpload("chat-document", formData, LocalStorage.getAccessToken())
            .then((response) => {
                if (response.data.statusCode == 1003) {
                    setFileId(response.data.data.id);
                    setImgUrl(response.data.data.document_url);
                    // uploadLogo(docInfo.id, docInfo.document_url);
                } else {
                    addErrorMsg(response.data.message);
                }
            });
    }


    const handleUserData = (current, status) => {
        let data = {
            request_id: LocalStorage.uid(),
            status: status
        }
        current.status = status
        setCurrent(current);
        EmployeeSSAPI.updateStatusApi(current.id, data).then((res) => {
            if (res.data.statusCode == 1003) {
                addSuccessMsg('Ticket status has been changed');
                getAllEmployees(filterData);
            } else {
                addErrorMsg(res.data.message);
            }
        })
    }

    const handleClosePopUp = () => {
        setPopUpOpen(false);
    };

    const handleView = () => {
        setPopUpOpen(true)
        console.log(current, "current")
        setFormData(current)
    }

    return (
        <Box className={classes.containerMain} >
            <Box width={'100%'}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link to='/employee-self-service' className={classes.linkStyle}><Text className={classes.navText1}>Employees Self Service</Text></Link>
                    <Text className={classes.navText2}>View</Text>
                </Breadcrumbs>
            </Box>
            {
                <Grid container sx={{ height: '78vh !important', mt: '32px' }} >
                    <Box lg={4} sx={{ display: 'flex', overflow: 'auto', flexDirection: 'column', height: '78vh', justifyContent: 'start', alignItems: 'start' }} >
                        {
                            employees.map((item, key) => (
                                <Box
                                    className={`${(current.id == item.employee_id || current.id == item.id) ? classes.chatBoxSelected : classes.chatBox1}`}
                                    key={key}
                                    onClick={() => { setCurrent(item); setroomID(item.id) }}
                                >
                                    <Box className={classes.upperData}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar src={item.profile_picture_url} sx={{ marginRight: "16px" }} />
                                            <Box mr={'10px'}>
                                                <Text sx={{ font: '16px Nunito', fontWeight: `${600}`, color: '#171717', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '140px', textTransform: 'capitalize !important' }} >{item.employee_name}</Text>
                                                <Text sx={{ font: '12px Nunito', fontWeight: `${500}`, color: '#737373', textOverflow: 'ellipsis', mt: '4px' }} >{item.self_service_type_name}</Text>
                                            </Box>
                                            {
                                                item.label == 'new' && <NewTag />
                                            }
                                        </Box>
                                        <Box>
                                            <Text sx={{ font: '12px Nunito', fontWeight: `${500}`, color: '#0C75EB', textOverflow: 'ellipsis', overflow: 'hidden' }} >{item.reference_id}</Text>
                                        </Box>
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.lowerData}>
                                        <Box sx={{ display: 'flex', gap: '10px' }}>
                                            <Text sx={{ font: '12px Nunito', fontWeight: `${500}`, color: '#737373', textOverflow: 'ellipsis', }} >Date</Text>
                                            <Text sx={{ font: '12px Nunito', fontWeight: `${500}`, color: '#737373', textOverflow: 'ellipsis', }} >{item.raised_on}</Text>
                                        </Box>
                                        <Text sx={{ font: '12px Nunito', fontWeight: `${500}`, color: `${item.status_name !== 'pending' ? '#16A34A' : '#F59E0B'}`, textOverflow: 'ellipsis', textTransform: 'capitalize' }} >{item.status_name}</Text>
                                    </Box>
                                </Box>
                            ))
                        }
                        {
                            loading &&
                            [1, 2, 3, 4, 5].map((key) => (
                                <Box
                                    sx={{ width: '390px !important' }}
                                    className={classes.chatBox}
                                    key={key}
                                >
                                    <Box className={classes.upperData}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Skeleton variant="circular" sx={{ width: "40px", height: "40px" }} />

                                            <Box ml={'15px'} >
                                                <Skeleton variant="text" sx={{ fontSize: '19px', width: "80px" }} />
                                                <Skeleton variant="text" sx={{ fontSize: '12px', width: "80px" }} />
                                            </Box>
                                        </Box>
                                        <Box>
                                            <Skeleton variant="text" sx={{ fontSize: '16px', width: "50px" }} />
                                        </Box>
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.lowerData}>
                                        <Box sx={{ display: 'flex', gap: '10px' }}>
                                            <Skeleton variant="text" sx={{ fontSize: '14px', width: "30px" }} />
                                            <Skeleton variant="text" sx={{ fontSize: '14px', width: "70px" }} />
                                        </Box>
                                        <Skeleton variant="text" sx={{ fontSize: '16px', width: "50px" }} />
                                    </Box>
                                </Box>
                            ))
                        }
                    </Box>
                    <Grid item container lg={8} sx={{ height: '78vh' }}>
                        {!loading && employees.length !== 0 ? <Box className={classes.chatDisplay}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '20px 29px 20px 20px', alignItems: 'center', height: '100px' }}>
                                <Box display={'flex'} alignItems={'center'} gap={'18px'} >
                                    <Avatar sx={{ width: '60px', height: '60px' }} src={current.profile_picture_url} alt={current.employee_name && current.employee_name[0]} />
                                    <Box display={'flex'} flexDirection={'column'} gap={'8px'}>
                                        <Stack direction='row' spacing={1}>
                                            <Text sx={{ font: '18px Nunito', fontWeight: `${600}`, color: '#000000', textOverflow: 'ellipsis', textTransform: 'capitalize !important', }} >{current.employee_name}</Text>
                                            <Grid sx={{ marginTop: '2px !important' }}>
                                                <HtmlTooltip
                                                    placement="right"
                                                    arrow
                                                    title={
                                                        <React.Fragment>
                                                            <Box className={classes.sideTooltip}>
                                                                <Typography className={classes.sideTooltipText}>
                                                                    Please Click Here To View Ticket Information
                                                                </Typography>
                                                            </Box>
                                                        </React.Fragment>
                                                    }
                                                >
                                                    <Information cursor='pointer' marginTop='10px' onClick={handleView} />
                                                </HtmlTooltip>
                                            </Grid>

                                        </Stack>
                                        <Text sx={{ font: '12px Nunito', fontWeight: `${600}`, color: '#737373', textOverflow: 'ellipsis', }} >{current.reference_id}</Text>
                                    </Box>
                                </Box>
                                {current.status === 'Closed' ?
                                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_self_service_edit" && item.is_allowed == true))) ?
                                        <Button reopenBtn onClick={() => {
                                            setCurrent({ ...current, status: false })
                                            handleUserData(current, 'Reopen');
                                        }} >Re-Open</Button> :
                                        <Button addNewDisable>Re-Open</Button> :
                                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_self_service_edit" && item.is_allowed == true))) ?
                                        <Button addNew sx={{ width: '192px' }} onClick={() => {
                                            setCurrent({ ...current, status: true })
                                            handleUserData(current, 'Closed');
                                        }}>Mark As Resolved</Button> :
                                        <Button addNewDisable sx={{ width: '192px' }} >Mark As Resolved</Button>
                                }
                            </Box>
                            <Divider light />
                            <Box sx={{ height: '52vh', overflow: 'auto', background: '#fAFAFA', display: 'flex', flexDirection: 'column', padding: '20px', }}>
                                {/* <Box className={classes.chatSection}> */}
                                <Box className={classes.chatBox}>
                                    {
                                        chatlist.map((chat, key) => (
                                            <Box key={key} className={classes.msgBox}>
                                                {
                                                    chat.chat_bot ?
                                                        <Box textAlign='center'>
                                                            <Text largeLabel>{chat.message}</Text>
                                                        </Box> :
                                                        <>
                                                            <Box
                                                                className={ // eslint-disable-next-line
                                                                    `${chat.username == socketUsername ? classes.sendMsgBox : null}` + " " +
                                                                    `${chat.username != socketUsername ? classes.receiveMsgBox : null}`
                                                                }
                                                            >
                                                                {
                                                                    chat.username == 'ChatBot' ? '' :
                                                                        <Box display='flex' flexDirection='row' gap={1}>
                                                                            <Box>
                                                                                {
                                                                                    chat.profile_picture_url ?
                                                                                        <img src={chat.profile_picture_url} alt="developerImg" className={classes.userImgBox} />
                                                                                        :
                                                                                        <Avatar src={'/broken-image.jpg'} sx={{ height: '15px', width: '15px' }} />
                                                                                }
                                                                                {/* <img src={chat.profile_picture_url} alt="developerImg" className={classes.userImgBox} /> */}
                                                                            </Box>
                                                                            <Text largeBlack> {chat.username} </Text>
                                                                        </Box>
                                                                }
                                                            </Box>
                                                            <Box
                                                                className={ // eslint-disable-next-line
                                                                    `${chat.username == socketUsername ? classes.sendMsgBox : null}` + " " +
                                                                    `${chat.username != socketUsername ? classes.receiveMsgBox : null}`
                                                                }
                                                            >
                                                                <Box className={classes.msg}>
                                                                    {
                                                                        chat.chat_document !== '' &&
                                                                        <img src={chat.chat_document} alt='upload' style={{ height: '80px', width: '80px' }} />
                                                                    }
                                                                    {
                                                                        (chat.message !== '' && chat.message !== null) &&
                                                                        <Text sx={{ font: '16px Nunito', fontWeight: `${400}`, color: '#FFFFFF', background: '#188CFF', textOverflow: 'ellipsis', padding: '8px', borderRadius: '8px 8px 0px 8px' }} >
                                                                            {chat.message}
                                                                        </Text>
                                                                    }
                                                                </Box>
                                                            </Box>
                                                            <Box
                                                                className={ // eslint-disable-next-line
                                                                    `${chat.username == socketUsername ? classes.sendMsgBox : null}` + " " +
                                                                    `${chat.username != socketUsername ? classes.receiveMsgBox : null}`
                                                                }
                                                            >
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }} pb={2}>
                                                                    <DoubleTickIcon />
                                                                    <Text sx={{ font: '12px Nunito', fontWeight: `${500}`, color: '#737373', textOverflow: 'ellipsis', }} >{chat.__created_at__}</Text>
                                                                </Box>
                                                            </Box>
                                                        </>
                                                }
                                            </Box>
                                        ))
                                    }
                                    {
                                        isTyping && isTyping.message ? isTyping.status === true ? isTyping.message : '' : ''
                                    }
                                    <div ref={messagesEndRef} />
                                </Box>
                                {(current.status === 'Closed') && <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                    <Text sx={{ font: '14px Nunito', fontWeight: `${500}`, color: '#737373', textOverflow: 'ellipsis', }} >This Ticket Has Been Closed</Text>
                                </Box>}
                            </Box>
                            <Box sx={{ background: '#fAFAFA', padding: '0px 0px 17px 20px' }}>
                                <Grid item lg={12}>
                                    <Box display='flex' flexDirection='row' gap={2}>
                                        <Box className={classes.suggestionsBox} onClick={(e) => suggestionHandler(e, 'Okay Thank You!')}>
                                            <Text smallGrey className={classes.suggestionText}>Okay Thank You!</Text>
                                        </Box>
                                        <Box className={classes.suggestionsBox} onClick={(e) => suggestionHandler(e, 'Sure')}>
                                            <Text smallGrey className={classes.suggestionText}>Sure</Text>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Box>
                            {(current.status === 'In Progress' || current.status === 'Reopen') &&
                                <Box component={"form"} onSubmit={sendChatMsg} sx={{ display: 'flex', background: '#FFFFF', height: '75px', alignItems: 'center', gap: '8px', padding: '28px 25px 24px 20px' }}>
                                    <Button className={classes.attachbg} component="label">
                                        <input hidden name="imgUrl" type="file" onChange={(e) => uploadFile(e)} />
                                        <AddAttachmentIcon />
                                    </Button>
                                    <input className={classes.chatInput} placeholder='Reply..' name='name' value={chatmsg} onChange={handleChange} autoFocus='on' autoComplete='off' />
                                    {
                                        imgUrl &&
                                        <Box>
                                            <Box onClick={() => { setImgUrl(''); setFileId('') }} sx={{ position: "absolute", color: 'red', marginTop: "-10px", paddingLeft: "25px", cursor: 'pointer' }}>x</Box>
                                            <img src={imgUrl} alt='upload' style={{ height: '30px', width: '30px' }} />
                                        </Box>
                                    }
                                    <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={sendChatMsg}><SendIcon /></Box>
                                </Box>}
                        </Box> : null}
                        {
                            loading && (
                                <Box className={classes.chatDisplay}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '20px 29px 20px 20px', alignItems: 'center', height: '100px' }}>
                                        <Box display={'flex'} alignItems={'center'} gap={'18px'} >
                                            <Skeleton variant="circular" sx={{ width: "62px", height: "60px" }} />
                                            <Box display={'flex'} flexDirection={'column'} gap={'8px'}>
                                                <Text sx={{ font: '18px Nunito', fontWeight: `${600}`, color: '#000000', textOverflow: 'ellipsis', }} >{current.raised_employee_name}</Text>
                                                <Text sx={{ font: '12px Nunito', fontWeight: `${600}`, color: '#737373', textOverflow: 'ellipsis', }} >{current.reference_id}</Text>
                                            </Box>
                                        </Box>
                                        <Button addNew sx={{ width: '192px' }} onClick={() => {
                                        }}> <Skeleton variant="text" sx={{ fontSize: '25px', width: "150px" }} /></Button>
                                    </Box>
                                    <Divider light />
                                    <Box sx={{ height: '58vh', overflow: 'auto', background: '#fAFAFA', display: 'flex', flexDirection: 'column', alignItems: 'end', padding: '20px', }}>
                                        {chatlist.map((message) => (
                                            <Box sx={{ minHeight: '67px' }}>
                                                <Box>
                                                    <Skeleton variant="text" sx={{ fontSize: '32px', width: "180px" }} />
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <DoubleTickIcon />
                                                    <Skeleton variant="text" sx={{ fontSize: '14px', width: "50px" }} />
                                                </Box>
                                            </Box>
                                        ))}
                                        <div ref={messagesEndRef} />
                                        {current.status && <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                            <Skeleton variant="text" sx={{ fontSize: '32px', width: "250px" }} />
                                        </Box>}
                                    </Box>
                                    {!current.status && <Box sx={{ display: 'flex', background: '#FFFFF', height: '75px', alignItems: 'center', gap: '8px', padding: '28px 25px 24px 20px' }}>
                                        <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} ><AddAttachmentIcon /></Box>
                                        <Box className={classes.chatInput}  >    <Skeleton variant="text" sx={{ fontSize: '32px', width: "90px" }} /> </Box>
                                        <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} ><SendIcon /></Box>
                                    </Box>}
                                </Box>
                            )
                        }
                    </Grid>
                </Grid >
            }
            <BootstrapDialog
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="customized-dialog-title"
                open={popUpOpen}
            >
                <DialogContent >

                    <>
                        <Grid lg={12} className={classes.cancel} position='fixed' display='flex' justifyContent='end' >
                            <img style={{ cursor: "pointer", height: '20px', }} src={clear} alt='clear' onClick={handleClosePopUp} />
                        </Grid>
                        {/* <Text sx={{ mb: '32px' }}>Raise a Request</Text> */}
                        <Grid container spacing={4} px={2} pt={2} sx={{
                            '&::-webkit-scrollbar': {
                                display: 'none',
                            },
                        }}>
                            <Grid item lg={12} md={12} sm={12} xs={12}><Text headerBlack>Request Details</Text></Grid>

                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <Box >


                                    {/* <CustomSelect
                                        commonSelect
                                        name='employee_id'
                                        // value={formData.employee_name}
                                        labelText='Employee Name'

                                    /> */}
                                    <Input
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            name: 'employee_name',
                                            value: formData.employee_name,
                                            disabled: true
                                        }}


                                        clientInput
                                        labelText='Employee Name'
                                    />
                                </Box>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>

                                <Input
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        name: 'reference_id',
                                        value: formData.reference_id,
                                        disabled: true
                                    }}
                                    clientInput
                                    labelText='Ticket ID'
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <Box >
                                    {/* <CustomSelect
                                        commonSelect
                                        // options={serviceTypes}
                                        name='self_service_types_id'
                                        // value={formData.self_service_types_id}
                                        labelText='Service Type'

                                    /> */}

                                    <Input
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            name: 'self_service_type_name',
                                            value: formData.self_service_type_name,
                                            disabled: true
                                        }}
                                        clientInput
                                        labelText='Service Type'
                                    />

                                </Box>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>

                                <Input
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        name: 'subject',
                                        value: formData.subject,
                                        disabled: true
                                    }}

                                    clientInput
                                    labelText='Subject'
                                />


                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>

                                <Input
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        name: 'description',
                                        disabled: true,
                                        value: formData.description
                                    }}
                                    rows={6}
                                    multiline={true}

                                    descriptionFormControl
                                    descriptionInput
                                    labelText={'Description'}
                                />

                            </Grid>


                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <Box >
                                    {/* <FileInput
                                        name={"document_name"}
                                        // FileName={formData.documents[0] ? formData.documents[0].document_name : ""}

                                        label={<Text largeLabel>Upload A Document</Text>}
                                        isDisabled={false} /> */}
                                    <Input
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            name: 'document_url',
                                            disabled: true,
                                            value: formData.documents[0] ? formData.documents[0].document_url : ""
                                        }}
                                        clientInput
                                        labelText={'Uploaded Document'}
                                    />
                                </Box>
                            </Grid>





                        </Grid>
                    </>

                </DialogContent>
            </BootstrapDialog>
        </Box >
    )
}

