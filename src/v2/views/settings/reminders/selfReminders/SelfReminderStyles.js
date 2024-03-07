import { makeStyles } from "@mui/styles";
import { blue, btnBgBlue, btnBgGrey, btnBorder, btnStroke, red } from "../../../../theme";
import { useTheme } from "@mui/material";
// import { color } from "d3";

const SelfReminderStyles = makeStyles(() => ({

   mainBox: {
      marginTop: '20px',
      padding: '0px 0px 0px 200px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      background: '#FDFDFD',
      border: '1px solid red'
   },

   subBox: {
      display: 'flex',
      gap: '10px',
      width: '100%',
      alignItems: 'center',
   },

   mainPanel: {
      marginTop: '20px',
      justifyContent: 'center',
   },

   listItems: {
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
   },

   descriptionBoxStyle: {
      backgroundColor: '#FBFBFB',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px'
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
   activeText: {
      font: "16px Nunito Sans, sans-serif !important",
      // fontFamily: "Nunito , Nunito Sans, sans-serif",
      letterSpacing: '0px',
      color: `${blue} !important`,
      opacity: 1,
      fontWeight: `${500} !important`,
      textTransform: 'capitalize !important',
      padding: '0px 25px !important',
      // borderBottom: '3px solid blue !important'
   },
   tabText: {
      font: "16px Nunito Sans, sans-serif !important",
      letterSpacing: '0px',
      color: `#707070 !important`,
      opacity: 1,
      textTransform: 'capitalize !important',
      padding: '0px 25px !important'
   },
   viewText1: {
      borderBottom: '1px solid #EAECF0 !important',
      font: '13px Nunito Sans, sans-serif !important',
      padding: '10px 0px 10px 15px !important',
      "&:hover": {
         background: 'white !important'
      }
   },

   inactive: {
      font: '13px Nunito Sans, sans-serif !important',
      padding: '10px 0px 4px 15px !important'
   },
   editText: {
      borderBottom: '1px solid #EAECF0 !important',
      font: '13px Nunito Sans, sans-serif !important',
      color: `${blue} !important`,
      padding: '10px 0px 10px 15px !important',
      "&:hover": {
         background: 'white !important'
      }
   },
   approveText: {
      borderBottom: '1px solid #EAECF0 !important',
      font: '13px Nunito Sans, sans-serif !important',
      color: "#409C65 !important",
      padding: '10px 0px 10px 15px !important',
      "&:hover": {
         background: 'white !important'
      }
   },
   viewText2: {
      borderBottom: '1px solid #EAECF0 !important',
      font: '13px Nunito Sans, sans-serif !important',
      color: "#0C75EB !important",
      padding: '10px 0px 10px 15px !important',
      "&:hover": {
         background: 'white !important'
      }

   },
   rejectText: {
      borderBottom: '1px solid #EAECF0 !important',
      font: '13px Nunito Sans, sans-serif !important',
      color: `${red} !important`,
      padding: '10px 0px 10px 15px !important',
      "&:hover": {
         background: 'white !important'
      }
   },
   deleteText: {
      font: '13px Nunito Sans, sans-serif !important',
      // color: `${btnBgRed.shade2} !important`,
      padding: '10px 0px 3px 15px !important',
      "&:hover": {
         background: 'white !important'
      }
   },
   Paper: {
      // margin: '6px 0px',
      display: "flex",
      alignItems: "center",
      height: '48px ! important',
      // background: '#FFFFFF !important',
      border: `1px solid ${btnBgGrey.shade4} !important`,
      boxShadow: "none !important",
      borderRadius: '8px !important',
      paddingRight: '10px !important'
   },
   InputBase: {
      flex: 1,
      font: '13px Nunito Sans, sans-serif !important',
      background: '#FFFFFF !important',
      opacity: 1,
      borderRadius: '5px !important',
      fontWeight: `${500} !important`,
      width: '100%',
      height: '30px ! important',
      textAlign: 'left !important',
      '& input': {
         textAlign: 'left !important',
         paddingLeft: '20px !important'
      },
   },

   /// Add Vendor
   browseButton: {
      background: `${btnBgBlue.shade3} !important`,
      color: `${btnStroke.blueMain} !important`,
      textAlign: "center",
      padding: "5px 5px 5px 0px !important",
      borderRadius: "6px !important",
      width: "100px",
      cursor: "pointer !important",
      height: "35px",
      font: '14px Nunito Sans, sans-serif !important',
      textTransform: "none !important",
      boxShadow: "none !important",
      fontWeight: '400 !important'
   },
   autoComplete: {
      padding: "0px !important",
      margin: "0px !important",
      background: "#FFFFFF !important",
      border: `1px solid ${btnBorder.grey} !important`,
      borderRadius: "5px",
      font: '16px Nunito Sans, sans-serif !important',
      "& .MuiButtonBase-root.MuiAutocomplete-clearIndicator": {
         visibility: "hidden !important",
      },
      "& .MuiOutlinedInput-root": {
         borderRadius: "0",
         padding: "0",
      },
      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
         border: "none",
         // padding:'0px !important'
      },
      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
         border: "none",
      },
      "& .MuiAutocomplete-tag": {
         height: "20px !important",
      },
   },
   autoCompleteInput: {
      // font: '16px Nunito Sans, sans-serif !important',
      // background: "#FFFFFF !important",
      // opacity: 1,
      // borderRadius: '8px !important',
      // border: `1px solid ${btnBorder.grey} !important`,
      height: '55px !important',
   },
   optional: {
      font: '14px Nunito Sans, sans-serif !important',
      color: 'rgb(194 188 188) !important',
      marginLeft: '4px !important'
   },
   toggleBox: {
      width: 600,
      [useTheme().breakpoints.down("sm")]: {
         width: 420,
      },
      "@media (max-width:410px)": {
         width: 380,
      },
      "@media (max-width:375px)": {
         width: 320,
      },
   },
   editorHeight: {
      borderRadius: "8px"
   },
   subList: {
      display: 'flex !important',
      flexDirection: 'column !important',
      position: 'absolute !important',
      top: '1.25rem !important',
      left: 0,
      color: 'black !important'
   },
   subListItem: {
      position: 'absolute !important',
   },
   helperTextError: {
      color: '#e72929 !important',
      font: '11px Nunito Sans, sans-serif !important',
      marginLeft: '-5px !important'
   },
   cursor: {
      cursor: 'pointer !important'
   },
   pendingText1: {
      font: '14px Nunito   !important',
      fontWeight: '500 !important',
      lineHeight: '17px !important',
      textAlign: 'left !important',
      color: '#000000 !important'
   },
   descText1: {
      font: '12px Nunito   !important',
      fontWeight: '500 !important',
      lineHeight: '14px !important',
      textAlign: 'left !important',
      color: '#525252 !important'
   },
   timeText1: {
      font: '10px Nunito   !important',
      fontWeight: '600 !important',
      lineHeight: '12px !important',
      textAlign: 'left !important',
      color: '#737373 !important'
   },
   dateText1: {
      font: '12px Nunito   !important',
      fontWeight: '600 !important',
      lineHeight: '14px !important',
      textAlign: 'left !important',
      color: '#737373 !important'
   },
   flexBox1: {
      display: 'flex !important',
      justifyContent: 'center !important',
      alignItems: 'center'
   },
   flexBox2: {
      display: 'flex !important',
      justifyContent: 'center !important',
      alignItems: 'start !important',
      flexDirection: 'column !important',
      gap: '10px !important'
   },
   menuItemText1: {
      font: '12px Nunito !important',
      fontWeight: '500 !important',
      lineHeight: '14px !important',
      textAlign: 'left !important',
      color: '#262626 !important',
      borderBottom: '1px solid #E2E5E6 !important',
      height: '44px'
   },
   menuItemText2: {
      font: '12px Nunito !important',
      fontWeight: '500 !important',
      lineHeight: '14px !important',
      textAlign: 'left !important',
      color: '#262626 !important',
      // borderBottom: '1px solid #E2E5E6 !important',
      height: '44px'
   },
   addReminderText: {
      font: '14px Nunito !important',
      fontWeight: '500 !important',
      lineHeight: '14px !important',
      textAlign: 'left !important',
      color: '#222529 !important'
   },
   inputLabelText: {
      font: '10px Nunito !important',
      fontWeight: '400 !important',
      lineHeight: '13px !important',
      textAlign: 'left !important',
      color: '#737373 !important'
   },
   root: {
      width: '100% !important',
      display: "flex",
      justifyContent: "center",
      backgroundColor: '#FDFDFD !important',
      marginTop: '30px',
      paddingLeft: '70px',
      [useTheme().breakpoints.down('lg')]: {
      },

      [useTheme().breakpoints.down('sm')]: {
      },
   },

   mainContainer: {
      width: '80% !important',
      alignItems: 'start',
      justifyContent: "start",
   },

   header: {
      flexDirection: 'row !important',
      justifyContent: 'space-between !important',
      width: '100% !important',
      alignItems: 'center !important',
      [useTheme().breakpoints.down('lg')]: {
         flexDirection: 'column !important',
         gap: '16px',
         alignItems: 'start !important'
      },
   },
   loadMoreDiv: {
      flexDirection: 'row !important',
      justifyContent: 'center !important',
      width: '100% !important',
      alignItems: 'center !important',
      // [useTheme().breakpoints.down('lg')]: {
      //    flexDirection: 'column !important',
      //    gap: '16px',
      //    alignItems: 'start !important'
      // },
   },

   leftHeader: {
      flexDirection: 'row !important',
      gap: '24px',
      alignItems: 'center !important'
   },
   rightHeader: {
      flexDirection: 'row !important',
      gap: '24px',
      // [useTheme().breakpoints.down('md')]: {
      //    flexDirection: 'column !important',
      //    gap: '16px',
      //    alignItems: 'start !important'
      // },
   },

   header1: {
      font: '22px  Nunito !important',
      color: '#092333 !important',
      fontWeight: `${500} !important`,
   },

   header2: {
      font: '14px  Nunito, Nunito Sans, sans-serif !important',
      fontWeight: `${500} !important`,
      color: `#000000 !important`,
   },

   header3: {
      font: '12px  Nunito, Nunito Sans, sans-serif !important',
      fontWeight: `${500} !important`,
      color: `#525252 !important`,
   },
   header4: {
      font: '10px  Nunito, Nunito Sans, sans-serif !important',
      fontWeight: `${600} !important`,
      color: `#737373 !important`,
      textAlign: 'center'
   },
   header5: {
      font: '12px  Nunito, Nunito Sans, sans-serif !important',
      fontWeight: `${600} !important`,
      color: `#737373 !important`,
   },
   header6: {
      font: '12px  Nunito, Nunito Sans, sans-serif !important',
      fontWeight: `${400} !important`,
      color: `#525252 !important`,
   },
   header7: {
      font: '12px  Nunito, Nunito Sans, sans-serif !important',
      fontWeight: `${400} !important`,
      color: `#0C75EB !important`,
   },
   header8: {
      font: '18px  Nunito, Nunito Sans, sans-serif !important',
      fontWeight: `${500} !important`,
      color: `#000000 !important`,
   },
   header9: {
      font: '14px  Nunito, Nunito Sans, sans-serif !important',
      fontWeight: `${600} !important`,
      color: `#0C75EB !important`,
      cursor: 'pointer !important',

   },
   header10: {
      font: '16px  Nunito, Nunito Sans, sans-serif !important',
      fontWeight: `${500} !important`,
      color: `#0C75EB !important`,
      cursor: 'pointer !important',

   },

   inputYear: {
      padding: '0px 0px 0px 0px !important',
      fontFamily: "Nunito , Nunito Sans, sans-serif !important",
      fontSize: "14px !important",
      color: "#333333 !important",
      fontWeight: "600 !important"
   },

   listContianer: {
      width: '92.5%',
      marginTop: '30px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
   },

   notificationCard: {
      flexDirection: 'row !important',
      justifyContent: 'space-between',
      paddingBottom: '20px',
      marginBottom: '16px',
      width: '100%',
      borderBottom: '1px solid #EAE5E5',
      [useTheme().breakpoints.down('md')]: {
         flexDirection: 'column !important',
         gap: '16px',
         alignItems: 'start !important'
      },
   },

   leftContent: {
      flexDirection: 'row !important',
      gap: '14px',
      alignItems: 'center !important',
   },
   rightContent: {
      flexDirection: 'row !important',
      gap: '100px',
      alignItems: 'center !important',
      paddingRight: '50px'
   },


   NoDataFoundIcon: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      alignItems: 'center',
      marginTop: '100px',
      paddingLeft: '70px',
      gap: '16px',
      font: '18px Nunito !important',
      fontWeight: `${500} !important`,
   },


   // Borderless select styles
   selectMenu: {
      '& .MuiList-root.MuiMenu-list': {
         padding: '0px !important',
      },
      '& .MuiPaper-root': {
         marginTop: '4px !important',
         borderRadius: '4px',
         font: "14px Nunito, sans-serif !important",
         boxShadow: 'none !important',
         border: '1px solid #EAECF0 !important',
         minWidth: '170px !important',
         maxHeight: '226px !important',
      }
   },
   viewText: {
      borderBottom: '1px solid #EAECF0 !important',
      font: '14px Nunito , Nunito Sans, sans-serif !important',
      fontWeight: `${400} !important`,
      padding: '10px 15px 10px 15px !important',
      "&:hover": {
         background: 'white !important'
      }
   },

   selectButton: {
      textTransform: "none !important",
      height: '30px !important',
      minWidth: '116px !important',
      color: '#737373 !important',
      font: "14px Nunito, sans-serif !important",
      fontWeight: `${400} !important`,
      justifyContent: 'center !important',
      gap: '20px',
      "&:hover": {
         background: '#FFFF !important',
      }
   },
   selectButtonNew: {
      textTransform: "none !important",
      height: '30px !important',
      border: 'none',
      minWidth: '116px !important',
      color: '#737373 !important',
      font: "14px Nunito, sans-serif !important",
      fontWeight: `${400} !important`,
      justifyContent: 'center !important',
      gap: '20px',
      // "&:hover": {
         background: '#FFFF !important',
      // }
   },

   divider: {
      borderColor: '#EAECF0 !important',
      // margin: '0px 15px !important'
   },
   selfReminderText: {
      lineHeight: '26px !important',
      textAlign: 'center !important',
      fontSize: "22px !important",
      fontFamily: "Nunito , Nunito Sans, sans-serif !important",
      fontWeight: "500 !important",
      color: "#092333 !important"
   },
   addRemindSuccessText: {
      fontFamily: "Nunito , Nunito Sans, sans-serif !important",
      fontWeight: "600 !important",
      lineHeight: '26px !important',
      textAlign: 'center !important',
      fontSize: "22px !important",
      color: "#15803D !important"
   },
   viewAllBtn: {
      width: '190px !important',
      height: '39px !important',
      padding: '10px 16px 10px 16px !important',
      borderRadius: '8px !important',
      border: '1px solid #737373 !important',
      gap: '10px !important',
      background: 'white !important',
      fontFamily: "Nunito , Nunito Sans, sans-serif !important",
      fontSize: "16px !important",
      fontWeight: "400 !important",
      lineHeight: '19px !important ',
      textTransform: "none !important",

      color: "#404040 !important",
      variant: "outlined",
      "&:hover": {
         transform: "scale3d(1.05, 1.05, 1)",
      }

   },
   gotoBtn: {
      width: '180px !important',
      height: '39px !important',
      padding: '10px 16px 10px 16px !important',
      border: 'none !important',
      gap: '10px !important',
      fontFamily: "Nunito , Nunito Sans, sans-serif !important",
      fontSize: "16px !important",
      fontWeight: "400 !important",
      lineHeight: '19px !important',
      background: `${blue} !important`,
      color: '#FFFFFF !important',
      textTransform: "none !important",
      borderRadius: "8px !important",
      variant: "outlined",
      "&:hover": {
         transform: "scale3d(1.05, 1.05, 1)",
      }
   },

   header11: {
      font: '12px  Nunito, Nunito Sans, sans-serif !important',
      fontWeight: `${400} !important`,
      color: `#000000 !important`,
   },

   avatarSize: {
      height: '53px !important',
      width: '53px !important',
   },

   autoSelect: {
      '& .MuiFilledInput-root': {
         background: 'white !important',
         border: '1px solid #C7CCD3',
         borderRadius: '8px',
         paddingTop: '16px !important'
      },
      '& .MuiInputBase-root.MuiFilledInput-root:before': {
         borderBottom: 'none !important',
      },
      '& .MuiInputBase-root.MuiFilledInput-root:after': {
         borderBottom: 'none !important',
      },
      "& .MuiTypography-root": {
         font: '14px Nunito !important',
         fontWeight: `${400} !important`,
         color: '#737373 !important',
      },
      "& .MuiFormLabel-root": {
         color: '#737373 !important',
         font: '14px Nunito !important',
         fontWeight: `${400} !important`,
      },
      '& .MuiChip-label': {
         padding: '0px 12px 2px 4px !important',
         font: '10px Nunito Sans, sans-serif !important',
         fontWeight: `${500} !important`,
         color: '#181A18 !important',
      },

      '& .MuiChip-root': {
         height: '20px !important',
         backgroundColor: '#EEEEEE !important',
         padding: '2px 2px 2px 4px !important'
      }


   },

   // select field styles
   checkedSelect: {
      "& .MuiSelect-select": {
         padding: '22.28px 35px 10px 12px !important',
         height: '17px !important',
         width: '100% !important',
         background: 'white !important',
         border: '1px solid #C7CCD3 !important',
         borderRadius: '8px !important',
         font: '14px Nunito !important',
         color: '#262626 !imporant',
         fontWeight: `${400} !important`,
      },

      background: 'white !important',
      height: '54px !important',
      borderRadius: '8px !important',


      "& .MuiSvgIcon-root": {
         fill: '#C7CCD3 !important',
         marginRight: '5px !important',
      },

      "& .Mui-disabled": {
         background: "#FAFAFA !important",
         borderRadius: '8px !important',
         border: '1px solid #FAFAFA !important',
         "-webkit-text-fill-color": '#525252 !important',
         fill: '#737373 !important',
      },

      "& .MuiInputBase-root.MuiFilledInput-root.MuiSelect-root.Mui-focused": {
         top: '15px !important'
      },

   },

   // Description field styles
   customScrollbar: {
      maxWidth: '100%',
      '@global': {
         '*::-webkit-scrollbar': {
            width: '4px',
            height: '25px',
            borderRadius: '50px'
         },
         '*::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px white'
         },
         '*::-webkit-scrollbar-thumb': {
            background: "#C7CCD3 !important",
            width: '4px',
            height: '25px',
            borderRadius: '50px',
            outline: 'none'
         }
      }
   },

   sidebar: {
      position: "fixed",
      maxWidth: "75px",
      width: "100%",
      background: "#FFFFFF",
      top: 0,
      left: 0,
      height: "100%",
      overflowY: "auto",
      scrollbarWidth: "none",
      transition: "all .3s ease",
      zIndex: 200,
      boxShadow: "3px 3px 5px -1px rgba(0, 0, 0, 0.05)",
      "&::-webkit-scrollbar": {
         display: 'none',
      },
   },
   sidebarOpen: {
      maxWidth: "260px",
   },

   brand: {
      fontSize: "24px",
      display: "flex",
      alignItems: "center",
      height: "64px",
      fontWeight: 600,
      color: "rgba(24, 26, 24, 1)",
      position: "sticky",
      top: 0,
      left: 0,
      zIndex: 100,
      background: "rgba(255, 255, 255, 1)",
      transition: "all .3s ease",
      // padding: "0 18px",
      padding: "0 12px",
   },

   sideMenu: {
      margin: "32px 0",
      // padding: "0 20px",
      padding: "0 10px",
      transition: "all .3s ease",
      backgroundColor: "rgba(255, 255, 255, 1)",
   },
   sidebarLink: {
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
      color: "rgba(24, 26, 24, 1)",
      padding: "12px 15.5px",
      transition: "all .3s ease",
      borderRadius: "8px",
      margin: "6px 0",
      whiteSpace: "nowrap",
   },

   sidebarLinkActive: {
      backgroundColor: "rgba(12, 117, 235, 1)",
      color: "#FFFFFF",
      transition: "all .3s ease",
   },

   sidebarLinkTextMs: {
      margin: "0px 14px",
      transition: "all .3s ease",
   },
   sidebarLinkTextMl: {
      margin: "0px 26px",
      transition: "all .3s ease",
   },

   sideDropdown: {
      marginLeft: "42px",
      paddingLeft: "8px",
      maxHeight: "0px",
      overflowY: "hidden",
      transition: "all .3s ease",
      "&::-webkit-scrollbar": {
         display: 'none',
      },

      borderLeft: "1px solid rgba(12, 117, 235, 1)"
   },

   sideDropdownShow: {
      maxHeight: "1000px",
      transition: "all .3s ease",
   },
   sidebarSideDropdownLink: {
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
      color: "rgba(24, 26, 24, 1)",
      padding: "10px 14px",
      transition: "all .3s ease",
      borderRadius: "10px",
      margin: "4px 0",
      whiteSpace: "nowrap",
   },






   // Main Content

   content: {
      backgroundColor: "rgba(253, 253, 253, 1)",
      position: "relative",
      // width: "calc(100% - 260px)",
      // left: "260px",
      width: "calc(100% - 60px)",
      left: "60px",
      transition: "all .3s ease",
   },

   // NAV
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

   // NAV




   // MAIN
   main: {
      width: "100%",
      // padding: "10px",
   }, EmployeesSearchInput2: {
      border: "none",
      padding: "0px 0px 0px 10px",
      width: "700px",
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


   checkBox: {

      border: '1px solid #c4c2c2',

      height: '52px',

      borderRadius: '10px', alignItems: 'center !important',

      display: 'flex',

      flexDirection: 'row'

   },

   checkBoxbg: {

      height: '52px',

      borderRadius: '10px', alignItems: 'center !important',

      display: 'flex',

      flexDirection: 'row',

      background: '#FAFAFA !important'

   },
   mediumGreyText: {
      fontSize: "14px !important",
      fontFamily: "Nunito , Nunito Sans, sans-serif",
      letterSpacing: '0px',
      color: "#707070",
      opacity: 1
   },

   // MAIN

   inviteLinkBtn: {
      margin: "12px 0px",
      all: "unset",
      cursor: "pointer",
      textAlign: "center",
      fontSize: "16px",
      fontFamily: "Nunito , Nunito Sans, sans-serif",
      fontWeight: "400",
      width: "150px",
      height: "40px",
      border: "1.5px solid rgba(12, 117, 235, 1)",
      borderRadius: "6px",
      color: "rgba(12, 117, 235, 1)",
      transition: "all .3s ease",
      '&:hover': {
         backgroundColor: 'rgba(12, 117, 235, 1)', color: '#FFFFFF'
      },
   },
   onboardBtn: {
      all: "unset",
      cursor: "pointer",
      textAlign: "center",
      fontSize: "16px",
      fontFamily: "Nunito , Nunito Sans, sans-serif",
      fontWeight: "400",
      width: "150px",
      height: "40px",
      border: "1.5px solid rgba(12, 117, 235, 1)",
      borderRadius: "6px",
      color: "rgba(12, 117, 235, 1)",
      transition: "all .3s ease",
      '&:hover': {
         backgroundColor: 'rgba(12, 117, 235, 1)', color: '#FFFFFF'
      },
   },
   nextBtn: {
      all: "unset",
      padding: "0px 14px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      textAlign: "center",
      fontSize: "16px",
      fontFamily: "Nunito , Nunito Sans, sans-serif",
      fontWeight: "400",
      minWidth: "50px",
      height: "35px",
      border: "1.5px solid rgba(12, 117, 235, 1)",
      backgroundColor: "rgba(12, 117, 235, 1)",
      boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.08)",
      borderRadius: "6px",
      color: "#ffffff",
      transition: "all .3s ease",
      '&:hover': {
         backgroundColor: '#FFFFFF', color: 'rgba(12, 117, 235, 1)'
      },
   },

   cancelBtn: {
      all: "unset",
      padding: "0px 16px",
      margin: "0px 18px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      textAlign: "center",
      fontSize: "16px",
      fontFamily: "Nunito Sans,  sans-serif",
      fontWeight: "400",
      minWidth: "60px",
      height: "35px",
      border: "1px solid rgba(229, 26, 26, 1)",
      backgroundColor: "#FFFFFF",
      borderRadius: "6px",
      color: "rgba(229, 26, 26, 1)",
      transition: "all .3s ease",
      '&:hover': {
         backgroundColor: 'rgba(229, 26, 26, 1)', color: '#FFFFFF'
      },
   },

   btn: {
      padding: "0px 12px",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      textAlign: "center",
      fontSize: "16px",
      fontFamily: "Nunito , Nunito Sans, sans-serif",
      color: '#FFFFFF',
      background: 'rgba(12, 117, 235, 1)',
      borderRadius: '8px',
      border: 'none',
      height: '40px',
      marginTop: '15px',
      // border: "1.5px solid rgba(12, 117, 235, 1)",
      transition: "all .3s ease",
      '&:hover': {
         backgroundColor: '#FFFFFF', color: 'rgba(12, 117, 235, 1)'
      },
      textStyle: {
         fontSize: '16px !important',
         color: 'rgba(38, 38, 38, 1) !important',
         fontFamily: "Nunito Sans, sans-serif !important"
      }
   },

   flexBox: {
      display: "flex", justifyContent: "center", alignItems: "center"
   },
   customAccordion: {
      padding: "6px 18px !important",
      backgroundColor: "#ffffff !important",
      // border: "1px solid #c5c5c526 !important",
      margin: "20px 0px !important",
      borderRadius: "20px !important",
      boxShadow: "5px 5px 10px 0px rgba(0, 0, 0, 0.05) !important",
      '&:before': { display: "none" }
   },
   AccordionSummary: {
      backgroundColor: "#ffffff",
   },
   AccordionSummaryBox: {
      width: "60%", display: "flex", alignItems: "center", gap: 2, borderRight: "1px solid rgba(226, 229, 230, 1)"
   },
   AccordionDetails: {
      backgroundColor: "#f1f8ff", height: "80px", borderRadius: "16px", width: "100%", display: "flex", justifyContent: "space-around", alignItems: "center"
   },
   text1: {
      textAlign: "center !important",
      fontSize: "14px !important",
      fontFamily: "Nunito Sans, sans-serif !important",
      fontWeight: "500 !important",
      color: "rgba(115, 115, 115, 1) !important"
   },
   text2: {
      textAlign: "center !important",
      fontSize: "12px !important",
      fontFamily: "Nunito Sans, sans-serif !important",
      fontWeight: "500 !important",
      color: "rgba(38, 38, 38, 1) !important"
   },
   textVisaType: {
      //styleName: Regular/Base Regular;
      fontFamily: "Nunito Sans, sans-serif !important",
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '17px',
      textAlign: 'center'
   },
   linkText: {
      fontSize: "14px !important",
      fontFamily: "Nunito Sans, sans-serif !important",
      fontWeight: "500 !important",
      color: "rgba(12, 117, 235, 1) !important"
   },
   secondarytext: {
      fontSize: "12px !important",
      fontFamily: "Nunito Sans, sans-serif !important",
      fontWeight: "500 !important",
      color: "rgba(115, 115, 115, 1) !important"
   },
   primarytext: {
      fontSize: "14px !important",
      fontFamily: "Nunito Sans, sans-serif !important",
      display: "flex !important",
      alignSelf: "center !important",
      fontWeight: "500 !important",
      color: "rgba(38, 38, 38, 1) !important"
   },

   profileTooltipText: {
      fontSize: "10px !important",
      fontFamily: "Nunito , Nunito Sans, sans-serif !important",
      fontWeight: "500 !important",
      color: "#FFFFFF !important",
   },
   linkStyle: {
      color: '#849199',
      '&:active': {
         color: '#849199',
         textDecoration: 'none',
      }
   },

   navText1: {
      font: '14px Nunito !important',
      fontWeight: `${500} !important`
   },
   navText2: {
      font: '14px Nunito !important',
      fontWeight: `${600} !important`,
      color: '#092333',
   },

   tabTitle: {
      fontFamily: "Nunito Sans, sans-serif !important",
      color: "#849199 !important",
      textTransform: "capitalize !important",
      fontSize: "16px !important",
      fontWeight: 500,
      margin: "0px 12px !important",
      padding: "20px !important"
   },



   activeTabTitle: {
      color: "#0C75EB !important",
   },

   //Dashboard
   containerMain: {
      padding: '20px auto 0px 50px',
      width: '100% !important',
      // display: "flex",
      // justifyContent: "center",
      // flexDirection: 'column',
      // alignItems: "center",
      // background: ' !important',
   },

   leftContainer: {
      //   borderRight:'1px solid #F5F5F5' , 
      padding: '30px 0px 0px 50px'
   },
   firstBox: {
      height: '890px !important',
      overflowY: 'scroll',
      padding: '30px 0px 0px 50px',
      "&::-webkit-scrollbar": {
         display: 'none !important',

      }
   },
   leftBox: {
      // height: '620px !important',

      padding: '30px 0px 0px 50px',

   },
   firstBox1: {
      paddingLeft: '35px',
   },
   rightContainer: {
      borderLeft: '1px solid #F5F5F5',
      paddingLeft: '25px',
      height: '500px !important',
      overflowY: 'scroll',
      "&::-webkit-scrollbar": {
         display: 'none !important'
      }
   },
   leftcard: {
      padding: '12px',
      height: '120px',
      width: '100%',
      border: '1px solid #EAECF0',
      // boxShadow: '0px 2px 24px 0px #919EAB1F',
      borderRadius: '12px',

   },
   image: {
      height: '20px',
      marginBottom: "-4px",
      marginLeft: "8px !important",
      cursor: 'pointer !important'
   },
   arrow: {
      height: '20px',
      marginBottom: "-4px",

   },



   sideDrawerBox: {
      paddingTop: "30px !important",
   },


   firstGrid: {
      paddingLeft: "50px",
      height: "75vh",
      overflow: "auto",
      overflowY: "scroll",
      "&::-webkit-scrollbar": {
         display: "none !important"
      }
   },
   rightBox: {
      padding: "30px 0px 0px 30px",
   },


   borderGridLeft: {
      borderLeft: "1px solid #DADADA !important",
   },


   listMenu: {
      margin: "22px 50px 0px 0px",
      // padding: "0 20px",
      // padding: "0 10px",
      transition: "all .3s ease",
      backgroundColor: "rgba(255, 255, 255, 1)",
   },

   link: {
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
      color: "rgba(0, 0, 0, 1)",
      padding: "12px 1.5px",
      transition: "all .3s ease",
      borderRadius: "8px",
      margin: "6px 0",
      whiteSpace: "nowrap",
   },
   linkTextDs: {
      fontSize: "14px !important",
      fontFamily: "Nunito Sans, sans-serif !important",
      fontWeight: "400 !important",
      margin: "0px 26px",
      transition: "all .3s ease",
   },
   select: {
      width: '100px !important'
   },
   axis: {
      color: '#999999',
      fontSize: "10px !important",
      fontFamily: "Nunito Sans, sans-serif !important",
      fontWeight: "400 !important",
   },



   keyIcon: {
      color: '#737373',
      cursor: 'pointer',
      marginRight: '6px'
   },
   menu: {
      '& .MuiPaper-root': {
         border: '1px solid #EAECF0 !important',
         // width: custom ? '140px !important' : '350px !important',
         boxShadow: "#0000001F !important",
         borderRadius: '8px !important',
         padding: '0px 2px 0px 0px !important'
      },
   }



}))


export default SelfReminderStyles;