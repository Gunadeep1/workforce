import { makeStyles } from "@mui/styles";

const NewSignUpStyles = makeStyles(() => ({

    activeItemBox: {
        borderRadius: '8px',
        boxShadow: '0px 2px 24px 0px #919EAB1F',
        padding: '30px 32px 15px 32px',
  
     },
     activeBoxHeading: {
        marginBottom: '28px'
     },
     optional: {
      font: '14px Nunito Sans, sans-serif !important',
      color: 'rgb(194 188 188) !important',
      marginLeft: '4px !important'
   },
   textarea: {
      width: "100% !important",
      font: "14px Nunito, Nunito Sans, sans-serif !important",
      fontWeight: "400 !important",
      color: `#737373 !important`,
      // padding: " 2px 12px !important",
      // minHeight: " 5px !important",
},
     
 
}))

export default NewSignUpStyles