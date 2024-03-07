import { makeStyles } from "@mui/styles";



const CustomRoleTableStyles = makeStyles(() => ({
  tableContainer: {
    height: "371px !important",
    borderRadius: "12px !important",
    '&::-webkit-scrollbar': {
      display: 'none !important'
    },
    '& thead': {
      '& .MuiTableCell-root': {
        background: '#F6F6F6'
      }
    }
  },
  popover: {
    "& .MuiPaper-root": {
      boxShadow: ' 0px 2px 6px #919EAB1F !important',
      borderRadius: '4px !important',
    }
  }
  // tableHead: {
  //   "&.MuiTableHead-root": {
  //     backgroundColor: '#F6F6F6 !important',
  //     boxShadow: 'none !important'
  //   },
  // },
  // tableStyle: {
  //   "&.MuiTableContainer-root": {
  //     borderRadius: '12px !important',
  //     boxShadow: 'none !important',
  //     maxHeight: '403px',
  //     overFlow: 'hidden',
  //     backgroundColor: '#ffffff'
  //   }
  // },
  // tableCellStyle: {
  //   "&.MuiTableCell-root": {
  //     borderBottom: 'none !important',
  //     root: {
  //       borderBottom: 'none !important'
  //     }
  //   },
  //   "& .MuiTableCell-root": {
  //     borderBottom: 'none !important'
  //   }
  // },

  // mainTableStyle: {
  //   maxHeight: '403px !important',
  //   "&.MuiTableBody-root": {
  //     height: '300px !important',
  //   },

  // },
  // scrollBar: {
  //   '&::-webkit-scrollbar': {
  //     width: '0'
  //   },
  //   // '&::-webkit-scrollbar-track': {
  //   //   '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
  //   // },
  //   '&::-webkit-scrollbar-thumb': {
  //     backgroundColor: 'none !important',
  //     outline: 'none'
  //   }
  // },
  // cellText: {
  //   color: '#171717 !important',
  //   fontWeight: '500 !important',
  //   fontSize: '16px !important',
  //   fontFamily: 'Nunito sans !important'
  // },
  // rowText: {
  //   color: '#171717 !important',
  //   fontSize: '12px !important',
  //   fontWeight: '500 !important',
  //   fontFamily: 'Nunito sans !important'
  // },
  // subTable: {
  //   backgroundColor: '#FAFAFA',
  //   borderRadius: '12px'
  // },
  // subTableHead: {
  //   color: '#737373 !important',
  //   fontSize: '14px !important',
  //   fontWeight: '500 !important',
  //   fontFamily: 'Nunito sans !important'
  // },
  // subTableRow: {
  //   color: '#171717 !important',
  //   fontSize: '14px !important',
  //   fontWeight: '500 !important',
  //   fontFamily: 'Nunito sans !important'
  // },

  // customRowTableHeader: {
  //   "&.MuiTableRow-root": {
  //     backgroundColor: 'green',
  //     borderRadius: '12px 12px 0px 0px !important'
  //   }
  // },
  // tableHeaderRoot: {
  //   "&.MuiTableHead-root": {
  //     backgroundColor: 'red',
  //     borderRadius: '12px 12px 0px 0px !important'
  //   }
  // }


}))

export default CustomRoleTableStyles;