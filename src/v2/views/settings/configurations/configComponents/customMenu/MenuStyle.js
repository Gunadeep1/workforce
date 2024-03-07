import { makeStyles } from "@mui/styles";
// import { addButton, saveButtonColor } from "../../../theme";

const MenuStyles = makeStyles((theme) => ({
    menuPopup: {
        '& .MuiPaper-root': {
            width: '150px',
            marginTop: '8px !important',
            overflow: 'hidden',
            borderRadius: '8px !important',
            font: '14px Nunito !important',
            background: '#FFFF !important',

        },
        '& .MuiMenu-list': {
            padding: '0px',
            borderRadius: '8px !important',
            font: '14px Nunito !important',
            background: '#FFFF !important',

        },

        '& .MuiPopover-paper': {
            boxShadow: ' 0px 2px 6px #919EAB1F !important',

            borderRadius: '8px !important',
            background: 'black',


        },
        //.MuiPaper-root.MuiMenu-paper.MuiPaper-root


    },

    line: {
        margin: '0px !important',
        borderColor: '#F2F4F7 !important',
        borderWidth: '1px !important'
    },

    menuItemStyle: {
        // margin:'5px 0px !important'
        padding: '10px 10px !important',
    }
}));

export default MenuStyles;
