import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material";
import { activeTextColor, bottomName, inActiveTextColor, sideActiveBg, sideBarBg } from "../../theme";

const drawerWidth = 260;
const LINES_TO_SHOW = 1;

const SidebarStyles = makeStyles(()=> ({
   
     // Navbar

     nav: {
        backgroundColor: "#FFFFFF",
        height: "68px",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        gridGap: "28px",
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 100,
    },
    globalSearchInput: {
        border: "none",
        padding: "0px 0px 0px 10px",
        width: "440px",
        height: "100%",
        background: "transparent",
        color: "rgba(38, 38, 38, 1)",
        fontFamily: "Nunito , Nunito Sans, sans-serif",
        fontSize: "14px",
        fontWeight: "600",
        transition: "all .3s ease",
        '&::-webkit-input-placeholder': {
            color: "rgba(199, 204, 211, 1)",
        },
        '&:focus': {
            outline: "none"
        }
    },
   
    searchIcon:{
    all: "unset", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    cursor: "pointer", 
    textAlign: "center", 
    fontSize: "16px", 
    fontFamily: "Nunito , Nunito Sans, sans-serif", 
    width: "45px", 
    height: "38px", 
    border: "none", 
    backgroundColor: "#FFFFFF", 
    borderRadius: "6px", 

},

     searchField:{ 
        height: "40px", 
        border: "1.5px solid rgba(199, 204, 211, 1)", 
        width: "460px", 
        borderRadius: "6px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center" 
    },

    rightItems:{ 
    width: "100%", 
    display: "flex", 
    justifyContent: "end", 
    alignItems: "center", 
    gap: "14px", 
    padding: "0px 22px",
 },

 bellButton:{ 
    all: "unset", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    cursor: "pointer", 
    textAlign: "center", 
    fontSize: "16px", 
    fontFamily: "Nunito , Nunito Sans, sans-serif", 
    width: "32px", 
    height: "32px", 
    border: "1.5px solid rgba(199, 204, 211, 1)", 
    backgroundColor: "#FFFFFF", 
    borderRadius: "6px", 
},

image:{
    height:'20px',
    width:'20px'
},
 Avatar:{
    height:'35px',
    width:'35px',
 },
 appBar: {
    background: '#FFFFFF ! important',
    color: 'gray ! important',
    boxShadow: 'none !important',
    borderBottom: "1px solid #C9C7C7 !important"
},
menuIcon: {
    marginRight: 2,
},
defaultHomeIcon: {
    color: "#FFFFFF !important"
},
paperBox: {
    marginLeft: "400px",
    "@media (min-width:2560px)": {
        marginLeft: "1000px"
    },
    [useTheme().breakpoints.down('lg')]: {
        marginLeft: "130px"
    },
    [useTheme().breakpoints.down('md')]: {
        marginLeft: "150px"
    },
    [useTheme().breakpoints.down('sm')]: {
        marginLeft: "0px"
    },
},
paper: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 520,
    backgroundColor: "#f4f4f4 !important",
    height: "33px",
    boxShadow: "none !important",
    "@media (min-width:2560px)": {
        width: 850,
    },
    [useTheme().breakpoints.down('lg')]: {
        width: 350
    },
    [useTheme().breakpoints.down('sm')]: {
        width: "100%"
    },
},
inputBase: {
    marginLeft: "20px !important",
    flex: 1,
    font: '13px Poppins !important',
    // color:"#C9C7C7 !important"
},
// searchIcon: {
//     padding: "10px",
//     color: '#C9C7C7 !important',
//     background: '#f4f4f4 !important',
//     width: '70px !important',
//     height: '35px',
//     borderRadius: '5px !important',
//     marginRight: '-5px !important',
//     '&:hover, &:focus': {
//         color: '#FFFFFF !important',
//         background: `#f9a828 !important`,
//     },
// },
rightBox: {
    paddingLeft: "130px !important",
    display: "flex",
    "@media (min-width:2560px)": {
        paddingLeft: "200px !important",
    },
    // "@media (max-width:1700px) and (min-width:1510px)": {
    //     paddingLeft: "280px !important",
    // },
    // "@media (max-width:1800px) and (min-width:1701px)": {
    //     paddingLeft: "380px !important",
    // },
    // "@media (max-width:1900px) and (min-width:1801px)": {
    //     paddingLeft: "480px !important",
    // },
    [useTheme().breakpoints.down("lg")]: {
        paddingLeft: "80px !important",
    },
    [useTheme().breakpoints.down("md")]: {
        display: "none",

    }
},
iconButton: {
    width: '45px !important',
    height: '32px !important',
    borderRadius: '10px !important',
    background: '#F5F5F5 !important',
    marginTop: "-2px !important",
    marginRight: '-14px !important',
    [useTheme().breakpoints.down('lg')]: {
        width: '40px !important',
    },
    [useTheme().breakpoints.down('md')]: {
        width: '40px !important',
        height: '36px !important',
    }
},
pfButton: {
    padding: '0px !important',
    marginTop: "-2px !important",
    '&:hover': {
        background: 'none !important'
    }
},
nameIcon: {
    padding: '0px !important',
    marginTop: "-2px !important",
    paddingLeft: "10px !important",
    '&:hover': {
        background: 'none !important'
    }
},
badgeRed: {
    background: "#B63F3F !important",
    color: "#FFFFFF",
    marginTop: "-10px",
    marginRight: "-10px"
},
badgeGreen: {
    background: "#1DB954"
},
avatar: {
    width: "31px !important",
    height: "31px !important",
    [useTheme().breakpoints.down('md')]: {
        width: "32px !important",
        height: "32px !important",
    }
},
nameBox: {

    display: 'flex',
    alignItems: "center",

    color: "#707070",
    background: "#FFFFFF !important",
    width: "100px",
    height: "30px",
    marginTop: "2px",
    textAlign: "left",
    [useTheme().breakpoints.down('md')]: {
        width: "80px !important",
        height: "25px !important",
        marginTop: "5px",
    }
},
dispalyName: {
    color: "#707070",
    marginLeft: "5px !important",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": LINES_TO_SHOW,
    "-webkit-box-orient": "vertical",
    [useTheme().breakpoints.down('md')]: {
        fontSize: "14px !important",
    },
},
icons: {
    height: '20px !important',
},
textStyles: {
    font: "13px Poppins !important",
    letterSpacing: '0px',
    color: '#707070 !important',
    opacity: 1
},
menu: {
    marginTop: '48px !important',
    [useTheme().breakpoints.down("sm")]: {
        marginTop: '42px !important',
    }
},
flexBox: {
    flexGrow: 1
},
moreBox: {
    display: "flex",
    textAlign: "right !important"
},
moreIcon: {
    marginRight: "-20px !important"
},

//Notification popper styles

popper: {
    marginTop: "10px",
    marginLeft: "-10px"
},

// Sidebar styles

drawer: {
    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, background: `${sideBarBg}` }
},
leftLogo: {
    paddingTop: "15px !important"
},
title: {
    paddingTop: "15px !important",
    fontSize: '25px ! important',
    color: `${activeTextColor} `,
    fontWeight: 'bold !important',
    cursor: 'pointer'
},
list: {
    width: '100%',
    background: 'background.paper',
    paddingBottom: "0px !important",
    paddingTop: "25px !important"
},
text: {
    color: "#FFFFFF"
},
sideMenuButtonActive: {
    background: `${sideActiveBg} !important`,
    height: '43px',
    // borderTopRightRadius: "30px !important",
    // borderBottomRightRadius: '30px !important'
},

sideMenuButtonInActive: {
    background: `transparent !important`,
    height: '43px',
    '&:hover': {
        background: `${sideActiveBg} !important`,
        // borderTopRightRadius: "30px !important",
        // borderBottomRightRadius: '30px !important'
    }
},

listItemImages: {
    marginTop: "-2px !important",
    height: '15px !important',
    minWidth: '25px !important',
    marginLeft: "25px !important"
},
innerList: {
    // padding: "5px 0px 5px 70px !important",
    padding: "5px 0px 5px 5px !important",
    background: "#343B50"
},
innerListItem: {
    height: "35px !important",
    '&:hover': {
        color: `${sideActiveBg} !important`,
    }
},
subListActiveText: {
    font: '12px Poppins !important',
    color: `${sideActiveBg} !important`,
    opacity: 1
},
subListInactiveText: {
    font: '12px Poppins !important',
    color: `${inActiveTextColor} !important`,
    opacity: 1,
    '&:hover': {
        color: `${sideActiveBg} !important`,
    }
},
listActiveText: {
    font: '12px Poppins !important',
    color: `${activeTextColor} !important`,
    opacity: 1
},
listInactiveText: {
    font: '12px Poppins !important',
    color: `${inActiveTextColor} `,
    opacity: 1,
    "&:hover": {
        color: `${activeTextColor} !important`,
    }
},
listItemHeight: {
    height: '40px !important'
},

bottomTextPosition: {
    position: "fixed",
    bottom: 0,
    textAlign: "center",
    paddingBottom: 5,
    background: `${sideBarBg}`,
    width: drawerWidth
},
downText: {
    fontSize: '10px !important',
    color: `${bottomName} !important`,
    fontFamily: 'poppins !important',
    textAlign: "center",
    marginBottom: "-20px !important"
},
SearchList: {
    position: 'absolute !important',
    width: '460px !important',
    marginLeft:'-28px',
    top: '54px !important',
    background: '#ffff !important',
    maxHeight: '35vh !important',
    overflowY: 'scroll !important',
    overflowX: 'hidden !important'
},
innerBoxmain: {
    // border: '0px solid #82b0e0 !important',
    background: '#f7f7f7 !important',
    borderRadius: '13px !important',
    padding: '4px !important',
    color: '#191919 !important',
    margin: '4px !important',
    textAlign: 'center',
    width: '20%',
    font: "normal normal normal 13px/25px Poppins !important"
},
innerBoxname: {
    display: 'flex !important',
    alignItems: 'center !important',
    justifyItems: 'center !important',
    color: '#191919 !important',
    marginLeft: '15px !important',
    font: "normal normal normal 13px/25px Poppins !important"
},
mainSearchBar: {
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer',
    '&:hover': {
        background: '#e1e6ee'
    }
},
newPaperIconW: {
    color: "#FFFFFF",
    fontSize: "17px !important"
},
newPaperIconB: {
    color: "#B9B9BC",
    fontSize: "17px !important"
},

// toast messages Styles
toast: {
    border: "2px solid #098000",
    width: '400px',
    padding: '0px',
    marginLeft: "-100px",
    [useTheme().breakpoints.down("lg")]: {
        width: '350px',
        marginLeft: "-30px",
    },
    [useTheme().breakpoints.down("md")]: {
        width: '400px',
        marginLeft: "-80px",
    },
    [useTheme().breakpoints.down("sm")]: {
        width: '100%',
        marginLeft: "0px",
    }
},
toastClose: {
    fontSize: "15px !important",
    color: "#000000",
    marginTop: "5px !important",
    marginRight: "5px !important"
},
// progress: {
//     background: "#EA6A47 !important"
// }
routesBox: {
    height: '78vh',
    overflow: 'auto',
    "&::-webkit-scrollbar": {
        width: "6px",
    }, '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#f1f1f1',
        borderRadius: '10px'
    }
},
profileAvatar: {
    width: "28px !important",
    height: "28px !important",
    fontSize: "16px !important"
}

}))


export default SidebarStyles;