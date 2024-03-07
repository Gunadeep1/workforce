import { Tabs, Tab } from '@mui/material';
// import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import bdactive from './assets/client/stepper1.svg';
import bdCompleted from './assets/client/stepper2.svg';
import dempty from './assets/client/stepper0.svg';
import StepLabel, { stepLabelClasses } from "@mui/material/StepLabel";
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { styled } from "@mui/styles";
import clsx from 'clsx';
import { makeStyles } from "@mui/styles";
// import {name} from '@mui/material';
import { Tooltip, tooltipClasses } from '@mui/material';

// BrownMons 
const blue = "#0C75EB" 
const red = '#E51A1A'
const orange = '#F59E0B'
const darkSkyBlue = "#054CA6"; //  color is for save button BG
const lightGrey = "#54595E99";
const warning = '#F59E0B';
const lightGreyText = "#525252";
const boxBorder = '#D1D1D1'

const inActiveTextColor = "#D1D1D1" // side menu text in active color
const activeTextColor = "#FFFFFF" // side menu active text color white
const bottomName = "#9B9494" // copy rights text color in sidebar
const sideBarBg = "#2A3042"; // side bar back ground color

const btnBgWhite = "#FFFFFF"; // Button White 
const borderGrey = "#707070";
const addIcon = '#1DB954' // add icon bg color
const sideActiveBg = "#F9A828";// side menu active background color

// ------------------- Button Background Colors ------------------------
const btnBgBlue = {
  shade1: '#E8F3FF', // Edit Icon, Add Pair  Buttons Background.
  shade2: '#F2F7FF', // View Icon Button Background.
  shade3: '#D1E1FF', // Browse Button Background.
  shade4: '#0C75EB', // Common Blue Background.
}

const btnBgRed = {  // PopUps
  shade1: '#FFF0F0', // Delete Icon Button Background.
  shade2: '#E51A1A', // Yes, Cancel || Yes, Delete || Yes Deactivate Buttons Background.
  shade3: '#FD4646', // Prompt 'Yes' Button Background.
  shade4: '#ec4444'
}

const btnBgGreen = {
  shade1: '#4ABE43' // Verified Button Background.
}

const btnBgGrey = {
  shade1: '#EAECF0', // Browse Pin Icon, Mute Notification Buttons .
  shade2: '#9D9E9F', // Browse Button Background.
  shade3: '#E5E5E5', // Prompt 'Close' Button Background.
  shade4: '#E2E5E6', // Add Button Background.
  shade5: '#DFDFDF', // Add Button Background.
  shade6: '#737373', // Text Color
  shade7: '#a9b1ba99',
}


// -------------- Button Text Colors -------------------

const btnTxtWhite = '#FFFFFF' // white Text.

const btnTxtBlack = {
  shade1: '#404040', // Text Color for Back, Re-Open Buttons.
  shade2: '#092333', // Text Color for Cancel Button.
  shade3: '#333333', // Text Color for Next Button.
  shade4: '#171717', // Text Color for Edit Button.
  shade5: '#525252', // Text Color for Edit Button.
}

const btnTxtLightGrey = '#CCCCCC' // Text Color for Prev Button.
const greyButton = '#9A9A9A' // Similar to disable color

const btnTxtBlue = {
  shade1: '#318CF1', // View Button text, Radio Button Color.
  shade2: '#0C75EB', // Text Color for Load, Onboard, Invite, Cancel, Browse Buttons.
  shade3: '#EBF1FF',
}

const cardBg = "#FFFFFF" // dashboard cards background color
const addRecord = '#054CA6'; //Blue Button to Add Record


const btnStroke = {
  red: '#FD4646',       // '-' Icon.
  redMain: '#E51A1A',   // Delete Icon.
  blue: '#5DA5F5',      // Browse Pin Icon.
  blueMain: '#0C75EB',  // View Icon.
  LightBlue: '#3A90ED', // Edit Icon.
  grey: '#344054',      // Filter, Cloud Download Icons.
  lightRed: '#FF4B55',  // Filter Icon Indication Dot.
  white: '#FFFFFF',     // White Color Stroke.
  black: '#000000',     // Bell Icon.
  dark: '#4F4F4F',      // X Close Icon.
}


// -------------------- Button Border Colors ----------------------
const btnBorder = {
  //   blue: '#0C75EB',       // Border Color for Load, Onboard, invite Buttons.
  //   LightBlue: '#318CF1',  // Border Color for View Button.
  //   red: '#E51A1A',        // Border Color for Cancel Button.
  //   grey: '#C7CCD3',       // Border Color for Back, Filter, Cloud Download, Home Buttons.
  //   LightGrey1: '#E7E7E7', // Border Color for Edit, Retry Buttons.
  //   LightGrey2: '#F1F1F1', // Border Color for Page Buttons.
  //   green: '#4ABE43',      // Border Color for Verified Button.

  // }



  // const btnStroke = {
  //   red: '#FD4646',       // '-' Icon.
  //   redMain: '#E51A1A',   // Delete Icon.
  //   blue: '#5DA5F5',      // Browse Pin Icon.
  //   blueMain: '#0C75EB',  // View Icon.
  //   LightBlue: '#3A90ED', // Edit Icon.
  //   grey: '#344054',      // Filter, Cloud Download Icons.
  //   lightRed: '#FF4B55',  // Filter Icon Indication Dot.
  //   white: '#FFFFFF',     // White Color Stroke.
  //   black: '#000000',     // Bell Icon.
  //   dark: '#4F4F4F',      // X Close Icon.
  // }



  // export const BrownMnCustomisedConnector = styled(StepConnector)(() => ({
  //   [`&.${stepConnectorClasses.active}`]: {
  //     [`& .${stepConnectorClasses.line}`]: {
  //       backgroundColor: "#0C75EB",
  //     },
  //   },
  //   [`&.${stepConnectorClasses.completed}`]: {
  //     [`& .${stepConnectorClasses.line}`]: {
  //       backgroundColor: "#0C75EB",
  //     },
  //   },
  //   [`& .${stepConnectorClasses.line}`]: {
  //     height: 2,
  //     border: "5px",
  //     backgroundColor: "#d2d2d2",
  //     borderRadius: 1,
  //   },
  // }));

  // export const BrownMnColorlibStepLabel = styled(StepLabel)(({ theme }) => ({
  //   [`& .${stepLabelClasses.label}`]: {
  //     [`&.${stepLabelClasses.completed}`]: {
  //       color: "#2A3042 !important",
  //       fontSize: '14px !important',
  //       marginTop: '-5px !important',
  //     },
  //     [`&.${stepLabelClasses.active}`]: {
  //       color: "#323232 !important",
  //       fontSize: '10px !important',
  //       marginTop: '-5px !important',
  //       fontWeight: 'medium !important'
  //     },
  //     color: "#d1cccc !important",
  //     fontSize: '14px !important',
  //     marginTop: '-5px !important',
  //   }
  // }));

  // export const BrownMnCustomStepIcon = (props) => {
  //   const classes = makeStyles();
  //   const { active, completed } = props;
  //   const stepIcons = {
  //     1: <img src={active ? bdactive : completed ? bdCompleted : ''} alt='Basic Details' height='20px' width='20px' />,
  //     2: <img src={active ? bdactive : completed ? bdCompleted : dempty} alt='Documents' height='20px' width='20px' />,
  //   };

  //   return (
  //     <div
  //       className={clsx(classes.root, {
  //         [classes.active]: active,
  //         [classes.completed]: completed,
  //       })}
  //     >
  //       {stepIcons[String(props.icon)]}
  //     </div>
  //   );
  // };

  // export const clientStepper = (props) => {
  //   const classes = makeStyles();
  //   const { active, completed } = props;
  //   const stepIcons = {
  //     1: <img src={active ? bdactive : completed ? bdCompleted : ''} alt='Company Details' height='20px' width='20px' />,
  //     2: <img src={active ? bdactive : completed ? bdCompleted : dempty} alt='Contact Details' height='20px' width='20px' />,
  //     3: <img src={active ? bdactive : completed ? bdCompleted : dempty} alt='InVoice' height='20px' width='20px' />,
  //     4: <img src={active ? bdactive : completed ? bdCompleted : dempty} alt='Time Sheet' height='20px' width='20px' />,
  //   };
  red: '#FD4646',       // '-' Icon.
  redMain: '#E51A1A',   // Delete Icon.
  blue: '#5DA5F5',      // Browse Pin Icon.
  blueMain: '#0C75EB',  // View Icon.
  LightBlue: '#3A90ED', // Edit Icon.
  grey: '#C7CCD3',      // Filter, Cloud Download Icons.  
  lightRed: '#FF4B55',  // Filter Icon Indication Dot.
  white: '#FFFFFF',     // White Color Stroke.
  black: '#000000',     // Bell Icon.
  dark: '#4F4F4F',      // X Close Icon.
}


// export { blue, red, orange, darkSkyBlue, btnBgBlue, btnBgRed, btnBgGreen, btnBgGrey, btnTxtWhite, btnTxtBlack, btnTxtLightGrey, btnTxtBlue, btnBorder, btnStroke, lightGrey, greyButton }



export const BrownMnCustomisedConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#0C75EB",
      marginBottom: '4px'
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#0C75EB",
      marginBottom: '4px'
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: "5px",
    backgroundColor: "#d2d2d2",
    borderRadius: 1,
    marginBottom: '4px'
  },
}));

export const BrownMnColorlibStepLabel = styled(StepLabel)(({ theme }) => ({
  [`& .${stepLabelClasses.label}`]: {
    [`&.${stepLabelClasses.completed}`]: {
      color: "#2A3042 !important",
      fontSize: '14px !important',
      marginTop: '-5px !important',
    },
    [`&.${stepLabelClasses.active}`]: {
      color: "#323232 !important",
      fontSize: '10px !important',
      marginTop: '-5px !important',
      fontWeight: 'medium !important'
    },
    color: "#d1cccc !important",
    fontSize: '14px !important',
    marginTop: '-5px !important',
  }
}));

export const BrownMnCustomStepIcon = (props) => {
  const classes = makeStyles();
  const { active, completed } = props;
  const stepIcons = {
    1: <img src={active ? bdactive : completed ? bdCompleted : ''} alt='Basic Details' height='20px' width='20px' />,
    2: <img src={active ? bdactive : completed ? bdCompleted : dempty} alt='Documents' height='20px' width='20px' />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {stepIcons[String(props.icon)]}
    </div>
  );
};

export const clientStepper = (props) => {
  const classes = makeStyles();
  const { active, completed } = props;
  const stepIcons = {
    1: <img src={active ? bdactive : completed ? bdCompleted : ''} alt='Company Details' height='20px' width='20px' />,
    2: <img src={active ? bdactive : completed ? bdCompleted : dempty} alt='Contact Details' height='20px' width='20px' />,
    3: <img src={active ? bdactive : completed ? bdCompleted : dempty} alt='InVoice' height='20px' width='20px' />,
    4: <img src={active ? bdactive : completed ? bdCompleted : dempty} alt='Time Sheet' height='20px' width='20px' />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {stepIcons[String(props.icon)]}
    </div>
  );
};

export const AddEmployeeStepper = (props) => {
  const classes = makeStyles();
  const { active, completed } = props;
  const stepIcons = {
    1: <img src={active ? bdactive : completed ? bdCompleted : ''} alt='General' height='20px' width='20px' />,
    2: <img src={active ? bdactive : completed ? bdCompleted : dempty} alt='Documents' height='20px' width='20px' />,
    3: <img src={active ? bdactive : completed ? bdCompleted : dempty} alt='PayConfiguration' height='20px' width='20px' />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {stepIcons[String(props.icon)]}
    </div>
  );
};

export const AddEmpSubStepper = (props) => {
  const classes = makeStyles();
  const { active, completed } = props;
  // const stepIcons = {
  //     1: <img src={active ? bdactive : completed ? bdCompleted : ''} alt='Company Details' height='20px' width='20px' />,
  //     2: <img src={active ? bdactive : completed ? bdCompleted : dempty} alt='Contact Details' height='20px' width='20px' />,
  //     3: <img src={active ? bdactive : completed ? bdCompleted : dempty} alt='InVoice' height='20px' width='20px' />,
  //     4: <img src={active ? bdactive : completed ? bdCompleted : dempty} alt='Time Sheet' height='20px' width='20px' />,
  //     5: <img src={active ? bdactive : completed ? bdCompleted : dempty} alt='Time Sheet' height='20px' width='20px' />,
  // };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {/* {stepIcons[String(props.icon)]} */}
      {/* <Box style={{
                background: 'red',
                height:'20px'
            }} /> */}
    </div>
  );
};

export const TooltipIndicator = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: '#696969',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#696969',
    fontSize: '9px Poppins',
    padding: '10px',

  },
}));

export const AddEmpCont = (props) => {
  const classes = makeStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    />
  );
};

//   return (
//     <div
//       className={clsx(classes.root, {
//         [classes.active]: active,
//         [classes.completed]: completed,
//       })}
//     >
//       {stepIcons[String(props.icon)]}
//     </div>
//   );
// };



// custom Tabs
const CustomTabs = styled(Tabs)({
  borderBottom: '1.7px solid #E2E5E6 !important',
  '& .MuiTabs-indicator': {
    borderBottom: '2px solid #0C75EB !important',
  },

});



// custom Tab
const CustomTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  fontFamily: "Nunito !important",
  color: "#849199 !important",
  fontSize: "16px !important",
  fontWeight: 500,
  margin: "0px !important",
  padding: "20px !important",
  textTransform: 'none !important',
  minWidth: 0,
  '&.Mui-selected': {
    color: '#0C75EB !important',
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#d1eaff !important',
  },
}));


const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#393939 !important",
    padding: "10px 10px",
    minWidth: 100,
    font: '14px Nunito !important',
    borderRadius: '8px',
    border: "1px solid #393939 !important"
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#393939",
    "&::before": {
      backgroundColor: "#393939",
      border: "1px solid #393939"
    }
  },
}));


export {
  blue, red, orange, darkSkyBlue, btnBgBlue, btnBgRed, btnBgGreen, btnBgGrey, btnStroke, cardBg, addRecord, greyButton, lightGrey,
  btnTxtWhite, btnTxtBlack, btnTxtLightGrey, btnTxtBlue, btnBorder, warning, lightGreyText,btnBgWhite,borderGrey,boxBorder,addIcon,sideActiveBg, CustomTabs, CustomTab, CustomTooltip,
  inActiveTextColor,  activeTextColor, bottomName,sideBarBg
  
}

export const clientandEndclientStepper = (props) => {
  const classes = makeStyles();
  const { active, completed } = props;
  const stepIcons = {
    1: <img src={active ? bdactive : completed ? bdCompleted : ''} alt='Company Details' height='20px' width='20px' />,
    2: <img src={active ? bdactive : completed ? bdCompleted : dempty} alt='Contact Details' height='20px' width='20px' />,
    3: <img src={active ? bdactive : completed ? bdCompleted : dempty} alt='InVoice' height='20px' width='20px' />,
    4: <img src={active ? bdactive : completed ? bdCompleted : dempty} alt='Time Sheet' height='20px' width='20px' />,
    5: <img src={active ? bdactive : completed ? bdCompleted : dempty} alt='Time Sheet' height='20px' width='20px' />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {stepIcons[String(props.icon)]}
    </div>
  );
};


// btnStroke, addRecord, cardBg