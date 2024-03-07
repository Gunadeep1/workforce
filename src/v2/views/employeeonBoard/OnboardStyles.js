import { makeStyles } from "@mui/styles";


const OnboardStyles = makeStyles(() => ({

    BrowseMonster: {
        width: "100% !important",
        height: "auto !important",
        background: "#0C75EB !important"
    },

    BrowseMonsterImageStyle: {
        position: "absolute !important",
        top: "20px !important",
        left: "20px !important",
        width: "auto !important",
        height: "40px !important"
    },

    OnBoardLinkImageStyle: {
        width: "100% !important",
        height: "100% !important",
        marginTop: '50px !important'
    },

    Congratulations: {
        fontSize: "22px !important",
        fontFamily: "Nunito, sans-serif !important",
        color: "#FFFFFF !important",
        fontWeight: "600 !important",
        textAlign: "center !important",
        paddingTop: "10px !important"
    },

    ConText: {
        fontSize: "16px !important",
        fontFamily: "Nunito, sans-serif !important",
        color: "#FFFFFF !important",
        fontWeight: "400 !important",
        textAlign: "center !important"
    },

    PDFRendergrid: {
        width: "100% !important",
        height: "100vh !important"
    },
    MainBox: {
        margin: "20px !important"
    },

    PDFRenderBox: {
        position: "relative",
        "@media (max-width:455px)": {
            width: "100% !important",
        },
        cursor: "pointer",
        height: "640px",
        width: "580px",
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: '0.3s'
    },
    PDFBoxDownloadAndViewBox: {
        position: 'absolute !important',
        top: 0,
        left: 0,
        width: '100%',  // Adjust this value
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: '#fff',
        opacity: 0,
        transition: 'opacity 0.3s',
    },
    ButtonBox: {
        display: "flex",
        justifyContent: "end",
        alignItems: "end",
        marginTop: "10px",
        marginRight: "20px"
    },
    RejectButton: {
        color: "#E51A1A !important",
        width: "126px !important",
        height: "44px !important",
        borderRadius: "8px !important",
        border: "1px solid #E51A1A !important",
        textTransform: "none !important",
        fontSize: "16px !important",
        fontFamily: "Nunito, sans-serif !important",
        fontWeight: "400 !important"
    },
    AcceptButton: {
        color: "#FFFFFF !important",
        background: "#0C75EB !important",
        width: "126px !important",
        height: "44px !important",
        borderRadius: "8px !important",
        border: "none !important",
        textTransform: "none !important",
        fontSize: "16px !important",
        fontFamily: "Nunito, sans-serif !important",
        fontWeight: "400 !important"
    },
    MainDialogBox: {
        padding: "10px 25px 25px 25px !important",
    },
    RejectedIconBox: {
        display: "flex !important",
        justifyContent: "end !important"
    },
    DialogContent: {
        width: '500px',
        maxHeight: '450px',
        '&.MuiDialogContent-root': { padding: '0px' }
    },
    DialogContentMainBox: {
        padding: '0px 20px 0px 20px'
    },
    DialogContentText1: {
        fontSize: "18px !important",
        fontFamily: "Nunito, sans-serif !important",
        color: "#54595E !important",
        fontWeight: "600 !important",
        paddingTop: '25px !important'
    },
    DialogContentText2: {
        fontSize: "14px !important",
        fontFamily: "Nunito, sans-serif !important",
        color: "#54595E99 !important",
        fontWeight: "400 !important",
        paddingBottom: '15px !important'
    },
    DialogContentButtonBox: {
        display: "flex",
        justifyContent: "center",
        marginTop: "15px",
        gap: "10px"
    },
    CloseButton: {
        font: "16px Nunito, sans-serif !important",
        width: "126px !important",
        height: "44px !important",
        textTransform: "none !important",
        color: "#0C75EB !important",
        borderRadius: "8px !important",
        border: "1px solid #0C75EB !important",
    },
    OkButton: {
        font: "16px Nunito, sans-serif !important",
        background: `#F85036 !important`,
        color: '#FFFFFF !important',
        textTransform: "none !important",
        borderRadius: "8px !important",
        width: "126px !important",
        height: "44px !important",
        variant: "outlined"
    },
    OfferRejected: {
        backgroundSize: "100% 100% !important",
        backgroundRepeat: "no-repeat !important",
        backgroundPosition: "center center !important",
        display: "flex !important",
        justifyContent: "center !important",
        alignItems: "center !important",
        width: '170px !important',
        height: '139px !important',
        margin: 'auto !important'
    },
    OfferRejectedText: {
        fontSize: "18px !important",
        fontFamily: "Nunito, sans-serif !important",
        color: "#54595E !important",
        fontWeight: "600 !important",
        paddingTop: '25px !important'
    },
    OfferRejectedBox: {
        display: "flex  !important",
        justifyContent: "center  !important",
        marginTop: "40px  !important",
        gap: "10px !important"
    },
    ExitButton: {
        font: "16px Nunito, sans-serif !important",
        width: "126px !important",
        height: "44px !important",
        textTransform: "none !important",
        color: "#0C75EB !important",
        borderRadius: "8px !important",
        border: "1px solid #0C75EB !important",
    },
    BoxCursorPointer: {
        cursor: "pointer !important"
    },
    CheckCircleStyle: {
        color: '#1DB954 !important',
        paddingRight: '5px !important'
    },
    UploadText1: {
        color: '#171717 !important',
        fontSize: "22px !important",
        fontWeight: "600 !important",
        fontFamily: "Nunito, sans-serif !important"
    },
    UploadText2: {
        color: '#171717 !important',
        fontSize: "14px !important",
        fontWeight: "400 !important",
        fontFamily: "Nunito, sans-serif !important",
        marginTop: "7px !important"
    },
    DataDisplayBox: {
        height: '450px !important',
        overflowY: 'auto !important'
    },
    DataDisplayBoxInside: {
        cursor: "pointer",
        '&:hover': { border: '0.5px solid #87bbf5 !important' }
    },
    ItemsName: {
        color: "#525252 !important",
        fontSize: "12px !important",
        fontWeight: "400 !important",
        fontFamily: "Nunito, sans-serif !important"
    },
    DragandDropStyle: {
        cursor: "pointer !important",
        marginTop: '50px !important',
        height: '350px !important',
        width: '100% !important',
        borderRadius: '8px !important',
        border: "2px dashed #87bbf5 !important",
        background: '#E9F3FF !important'
    },
    DragandDropText1: {
        color: '#000000 !important',
        fontSize: "18px !important",
        fontWeight: "600 !important",
        fontFamily: "Nunito, sans-serif !important",
        marginTop: '5px !important'
    },
    DragandDropText2: {
        color: '#000000 !important',
        fontSize: "16px !important",
        fontWeight: "500 !important",
        fontFamily: "Nunito, sans-serif !important",
        marginTop: '5px !important'
    },
    BrowseButton: {
        color: "#0C75EB !important",
        width: "209px !important",
        height: "44px !important",
        borderRadius: "8px !important",
        border: "1px solid #0C75EB !important",
        textTransform: "none !important",
        fontSize: "16px !important",
        fontFamily: "Nunito, sans-serif !important",
        fontWeight: "400 !important",
        marginTop: '18px !important'
    },
    BackButton: {
        color: "#171717 !important",
        width: "126px !important",
        height: "44px !important",
        borderRadius: "8px !important",
        border: "1px solid #171717 !important",
        textTransform: "none !important",
        fontSize: "16px",
        fontFamily: "Nunito, sans-serif !important",
        fontWeight: "400 !important",
    },
    ContinueButton: {
        color: "#FFFFFF !important",
        background: '#0C75EB !important',
        width: "126px !important",
        height: "44px !important",
        borderRadius: "8px !important",
        border: "none !important",
        textTransform: "none !important",
        fontSize: "16px !important",
        fontFamily: "Nunito, sans-serif !important",
        fontWeight: "400 !important",
    },
    SideMiniDrawerBox: {
        height: '550px !important',
        width: '7% !important',
        overflowY: 'auto !important'
    },
    sideMaxDrawerBox: {
        height: '550px !important',
        width: '360px !important',
        overflowY: 'auto !important'
    },
    UploadText: {
        fontSize: "16px !important",
        fontFamily: "Nunito, sans-serif  !important",
        color: "#FFFFFF !important",
        fontWeight: "400 !important",
    },
    sideMainMaxDrawerBox: {
        height: '550px !important',
        overflowY: 'auto !important',
        width: '93% !important',
        position: 'relative !important'
    },
    PDFRenderBoxText: {
        color: "#171717 !important",
        fontSize: "16px !important",
        fontFamily: "Nunito, sans-serif !important",
        fontWeight: "600 !important"
    },
    IdentifiedFieldsText: {
        color: "#171717 !important",
        fontSize: "22px !important",
        fontFamily: "Nunito, sans-serif !important",
        fontWeight: "600 !important",
    },
    EmptyData: {
        display: "flex !important",
        height: "100% !important",
        width: "100% !important",
        flexDirection: "column !important",
        alignItems: "center !important",
        justifyContent: "center !important"
    },
    EmptyDataExtract: {
        color: "#171717 !important",
        fontSize: "14px !important",
        fontFamily: "Nunito, sans-serif !important",
        fontWeight: "400 !important"
    },
    ImgStyle: {
        marginRight: "5px !important"
    },
    DownloadFormText: {
        color: '#404040 !important',
        fontSize: "14px !important",
        fontWeight: "400 !important",
        fontFamily: "Nunito, sans-serif !important",
    },
    DownloadFormButton: {
        color: "#0C75EB !important",
        background: '#EDF5FF !important',
        width: "350px !important",
        height: "56px !important",
        borderRadius: "8px !important",
        border: "1px solid #0C75EB !important",
        textTransform: "none !important",
        fontSize: "16px", fontFamily: "Nunito, sans-serif", fontWeight: "400",
        '&:hover': {
            color: "#EDF5FF !important",
            background: "#0C75EB !important",
        },
    },
    I9DocUploadBoxMain: {
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
    I9DocBox: {
        height: '100% !important',
        width: '100% !important',
        overflow: 'hidden !important'
    },
    I9DocBox2: {
        padding: '5px !important',
        font: '14px Nunito, Nunito Sans, sans-serif !important',
        fontWeight: `${400} !important`,
        color: '#262626 !important',
        pointerEvents: 'none !important',
        overflow: 'hidden !important'
    },
    I9Text: {
        color: "#737373 !important",
        fontSize: "14px !important",
        fontFamily: "Nunito, sans-serif !important",
        fontWeight: "400 !important"
    },
    ViewI9Text: {
        color: "#737373 !important",
        fontSize: "14px !important",
        fontFamily: "Nunito, sans-serif !important",
        fontWeight: "400 !important",
    },
    ClickHere: {
        color: "#0C75EB !important",
        textDecorationLine: "underline !important",
        cursor: "pointer !important"
    },
    ImgMargin: {
        marginRight: "10px !important"
    },
    Card: {
        height: "75vh !important",
        overflowY: "auto !important",
        width: '824px !important',
        padding: '10px !important',
        boxShadow: "0px 0px 20px 1px rgba(0, 0, 0, 0.05) !important",
        borderRadius: '8px !important'
    },
    CardHedertext: {
        color: '#404040 !important',
        fontSize: "14px !important",
        fontWeight: "400 !important",
        fontFamily: "Nunito, sans-serif !important",
    },
    CardContentHeader: {
        color: "#171717 !important",
        fontSize: "16px !important",
        fontWeight: "500 !important",
        fontFamily: "Nunito, sans-serif !important"
    },
    DiloagContextEmergecny: {
        color: "#54595E !important",
        fontSize: "18px !important",
        fontWeight: "600 !important",
        fontFamily: "Nunito, sans-serif !important"
    },
    DiloagContextEmergecny1: {
        lineHeight: "16.8px !important",
        color: "#54595E99 !important",
        fontSize: "14px !important",
        fontWeight: "400 !important",
        fontFamily: "Nunito, sans-serif !important"
    },
    DiloagContextEmergecnyButton: {
        color: "#FFFFFF !important",
        background: '#0C75EB !important',
        width: "274px !important",
        height: "44px !important",
        borderRadius: "8px !important",
        border: "none !important",
        textTransform: "none !important",
        fontSize: "16px !important", 
        fontFamily: "Nunito, sans-serif !important", 
        fontWeight: "400 !important",
    },
    EmegencyOptionalTextColor:{
        color: "#C7CCD3 !important"
    }

}))

export default OnboardStyles;
