import { makeStyles } from "@mui/styles";
import { btnBgGrey } from "../../../theme";

const MainStyles = makeStyles(() => ({

   mainBox: {
      marginTop: '20px',
      padding: '0px 96px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      background: '#FDFDFD',
      // '&::-webkit-scrollbar': {
      //    display: 'none',
      // }
   },

   subBox: {
      display: 'flex',
      gap: '10px',
      width: '100%',
      alignItems: 'center',
   },

   mainPanel: {
      marginTop: '10px',
      justifyContent: 'center',
   },

   listItems: {
      minHeight: "57px",
      margin: '6px 0px 16px 0px !important',
      borderRadius: "8px !important",
      font: '14px Nunito !important',
      fontWeight: `${600} ! important`,
      color: '#000000',
      transition: "all .3s ease",
      backgroundColor: '#FBFBFB !important',
      '&:hover': {
         backgroundColor: '#FBFBFB !important',
      },
   },

   listItems2: {
      minHeight: "57px",
      margin: '8px 0px 16px 0px !important',
      borderRadius: "8px !important",
      font: '14px Nunito !important',
      fontWeight: `${600} ! important`,
      color: '#000000',
      transition: "all .3s ease",
      backgroundColor: '#FBFBFB !important',
      '&:hover': {
         backgroundColor: '#FBFBFB !important',
      },
   },

   listItemsActive: {
      color: '#FFFFFF !important',
      backgroundColor: '#0C75EB !important',
      transition: "all .3s ease",
      '&:hover': {
         backgroundColor: '#0C75EB !important',
         color: '#FFFFFF !important',
      },
   },

   mainListBox: {
      borderRadius: '8px',
      boxShadow: '0px 2px 24px 0px #919EAB1F',
      padding: '30px 32px',
      marginTop: '16px',
   },

   prefTitle: {
      height: '19px !important',
   },

   activeItemBox: {
      borderRadius: '8px',
      boxShadow: '0px 2px 24px 0px #919EAB1F',
      padding: '30px 32px 15px 32px',

   },
   activeItemBox2: {
      borderRadius: '8px',
      boxShadow: '0px 2px 24px 0px #919EAB1F',
      padding: '30px 32px 40px 32px',
   },

   activeItemBox3: {
      borderRadius: '8px',
      boxShadow: '0px 2px 24px 0px #919EAB1F',
      padding: '30px 32px 41px 32px',

   },

   listContainer: {
      overflowY: 'auto',
      margin: '20px 0px 0px 0px',
      '&::-webkit-scrollbar': {
         display: 'none',
      },
   },

   descriptionBoxStyle: {
      backgroundColor: '#FBFBFB !important',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px',
   },

   descriptionLabel: {
      color: '#000000 !important',
      fontSize: '14px !important',
      fontWeight: '600 !important',
      lineHeight: '16.8px !important'
   },

   subLabel: {
      color: '#737373 !important',
      fontSize: '12px !important',
      fontWeight: '500 !important'
   },

   activeBoxHeading: {
      marginBottom: '28px'
   },


   //
   chipContainerMain: {
      display: 'flex',
      flexDirection: 'column',
      width: '100% !important',
      borderRadius: '8px',
      margin: '26px 0px',
   },
   //
   chipContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '69px !important',
      width: '100% !important',
      border: '1px solid #C7CCD3',
      borderRadius: '8px',

      padding: '10px 8px'
   },


   templateView: {
      padding: '36px 16px 0px 16px',
      height: '78vh',
      width: '82%',
      margin: '0 auto',
      overflowY: 'auto',
      '@media (min-height:730px)': {
         padding: '36px 16px 32px 16px !important',
      },
      '&::-webkit-scrollbar': {
         display: 'none',
      },
      //     "&::-webkit-scrollbar": {
      //       width: 0,  /* Remove scrollbar space */
      //       background: transparent, /* Optional: just make scrollbar invisible */
      //   }
   },

   mainDiv: {
      border: '1px solid #C7CCD3',
      padding: '8px',
      width: 'auto',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      margin: '10px 0px'
   },
   closeIcon: {
      height: '16px',
      width: '16px',
   },
   inputLabel: {
      fontSize: '12px',
      fontWeight: '400',
      color: '#737373',
      marginBottom: '11px',
   },

   EmployeesSearchInput: {
      border: "none",
      padding: "0px 0px 0px 10px",
      width: "215px",
      height: "100%",
      background: "transparent",
      color: "rgba(38, 38, 38, 1)",
      fontFamily: "Nunito",
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

   breadcrumbsLink: {
      fontFamily: "Nunito Sans, sans-serif !important",
      color: "#849199 !important",
      fontSize: "14px !important",
      textDecoration: "none !important",
      cursor: "pointer !important",
   },
   topView: {
      display: 'flex',
      justifyContent: 'space-between',
   },
   breadcrumbsName: {
      fontFamily: "Nunito Sans, sans-serif !important",
      color: "#092333 !important",
      fontSize: "14px !important",
   },

   //organization config

   textarea: {
      width: "100% !important",
      font: "14px Nunito, Nunito Sans, sans-serif !important",
      fontWeight: "400 !important",
      color: `${btnBgGrey.shade6} !important`,
      // padding: " 2px 12px !important",
      // minHeight: " 5px !important",
},
dividerColor: {
   margin:'28px 0px !important'
},
optional: {
   font: '14px Nunito Sans, sans-serif !important',
   color: 'rgb(194 188 188) !important',
   marginLeft: '0px !important'
},
searchField: {
   height: "40px",
   border: "1.5px solid rgba(199, 204, 211, 1)",
   // width: "460px", 
   borderRadius: "6px",
   display: "flex",
   justifyContent: "space-between",
   alignItems: "center"
},
globalSearchInput: {
   border: "none",
   padding: "0px 0px 0px 10px",
   width: "100%",
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
searchIcon: {
   all: "unset",
   display: "flex",
   justifyContent: "center",
   alignItems: "center",
   // cursor: "pointer", 
   textAlign: "center",
   fontSize: "16px",
   fontFamily: "Nunito , Nunito Sans, sans-serif",
   width: "45px",
   height: "38px",
   border: "none",
   // backgroundColor: "#FFFFFF", 
   color: "black !important",
   borderRadius: "6px",

},
}))


export default MainStyles;