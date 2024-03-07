import { makeStyles } from "@mui/styles";

const FileInputStyles = makeStyles(() => ({

  root: {
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

  rootDisabled: {
    display: 'flex !important',
    position: 'relative !important',
    height: '54px !important',
    width: '100% !important',
    borderRadius: '8px !important',
    border: '1px solid white !important',
    background: '#FAFAFA !important',
    padding: '10px 12px !important',
    justifyContent: 'end !important'
  },

  inputField: {
    height: '100%',
    width: '100%',
    overflow: 'hidden !important'
  },

  label: {
    position: 'absolute !important',
    top: '17px',
    font: '14px Nunito, Nunito Sans, sans-serif !important',
    fontWeight: `${400} !important`,
    color: '#737373 !important',
  },

  labelActive: {
    position: 'absolute !important',
    top: '8px',
    font: '11px Nunito, Nunito Sans, sans-serif !important',
    fontWeight: `${400} !important`,
    color: '#737373 !important',
    transform: 'translateY(-2px)',
    transition: 'all 0.3s ease !important',
    pointerEvents: 'none'
  },


  fileName: {
    paddingTop: '15px !important',
    font: '14px Nunito, Nunito Sans, sans-serif !important',
    fontWeight: `${400} !important`,
    color: '#262626 !important',
    pointerEvents: 'none',
    overflow: 'hidden !important'
  },

  input: {
    display: 'none'
  },
  viewIcon: {
    height: '18px !important',
    width: '18px !important',
    marginTop: '7px !important',
    cursor: 'pointer'
  },
  IconBg: {
    background: '#F2F7FF !important',
    height: '35px !important',
    width: '45px !important',
    textAlign: 'center !important',
    borderRadius: '6px !important'
  },
  deleteBg: {
    background: '#FFF0F0 !important',
    height: '35px !important',
    width: '45px !important',
    textAlign: 'center !important',
    borderRadius: '6px !important'
  },
  deleteIcon: {
    height: '22px !important',
    width: '22px !important',
    marginTop: '5px !important',
    cursor: 'pointer'
  },
  deisableDelete: {
    height: '22px !important',
    width: '22px !important',
    marginTop: '5px !important',
    cursor: 'not-allowed !important',
    color:'grey !important',    
  }
}));

export default FileInputStyles