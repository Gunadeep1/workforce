import { makeStyles } from "@mui/styles";
 
const ChipFieldStyle = makeStyles(() => ({
 
  mainDiv: {
    border: '1px solid #C7CCD3',
    padding: '8px',
    width: 'auto',
    borderRadius: '8px',
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

}))
 
 
export default ChipFieldStyle;