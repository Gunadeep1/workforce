import React from "react";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { Stack } from "@mui/material";
// import { LoadingButton } from "@mui/lab";
import Text from "../customText/Text";
import { btnTxtBlack } from "../../theme";

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 0,
  margin: "-1px !important",
  "& .MuiDataGrid-virtualScroller": {
    // overflow:'hidden'
    width: '2px'
  },
  // color:'#171717 !important',
  // boxShadow: '0px 0px 2px 0px #919EAB4D !important',
  boxShadow: "0px 0px 20px 1px rgba(0, 0, 0, 0.05) !important",
  borderRadius: '12px 12px 0px 0px !important',

  [`& .${gridClasses.columnHeader}`]: {
    backgroundColor: '#F6F6F6 !important',
    color: `${btnTxtBlack.shade4} !important`,
    font: "16px Nunito Sans, sans-serif !important",
    fontWeight: "500 !important",
    opacity: 1,
    border: 0,
    outline: 'none !important'
  },

  "&.MuiDataGrid-root .MuiDataGrid-cell": {
    borderBottom: "none !important"    
  },
  "MuiDataGrid-root .MuiDataGrid-cell:focus":{
    outline: 'none !important'
  },
  "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within":{
    outline: 'none !important'
  },

  "& .MuiDataGrid-columnHeaders": {
    borderRadius: '12px 12px 0px 0px !important',
    borderBottom: "none !important",
    backgroundColor: '#F6F6F6 !important',
    border: '0px 0px 1px 0px !important',
    font: "16px Nunito Sans, sans-serif !important",
    color: `${btnTxtBlack.shade4} !important`,
  },

  "& .MuiInputBase-root": {
    backgroundColor: "white !important",
    padding: "0px !important",
    border: "1px solid #D1D1D1 !important",
    opacity: 0.8,
    // marginRight: '899px !important',

    "& .MuiTablePagination-select": {
      color: "#2D2D2D !important",
      paddingTop: "7px !important",
      opacity: 1,
    },
  },

  "& .MuiButtonBase-root.Mui-disabled": {
    background: "#D1D1D1  !important",
    color: "#8F8F8F  !important",
    padding: "0px !important",
    opacity: 0.8,
    marginRight: "10px !important",
  },

  "& .MuiTablePagination-displayedRows": {
    color: "#242424 !important",
    opacity: 1,
    font: "14px  Nunito Sans, sans-serif !important",
  },

  "& .MuiTablePagination-selectLabel": {
    color: "#8F8F8F !important",
    opacity: 0.4,
    font: "14px  Nunito Sans, sans-serif !important",
  },

  "& .MuiDataGrid-iconSeparator": {
    display: "none",
  },
  ".MuiDataGrid-columnHeaderTitle": {
    fontWeight: `${500} !important`,
    opacity: 0.8,
    fontSize: '16px !important',
    fontFamily: 'Nunito Sans, sans-serif',
    // color: `${btnTxtBlack.shade4} !important`
    color: 'black'
    //  #171717 - Text-color
  },

  ".MuiDataGrid-cell:focus": {
    outline: 0,
  },

  "& .MuiDataGrid-renderingZone": {
    maxHeight: "none !important",
  },

  "& .MuiDataGrid-cell": {
    lineHeight: "unset !important",
    maxHeight: "none !important",
    whiteSpace: "normal !important",
  },

  "& .MuiDataGrid-row": {
    maxHeight: "none !important",
  },

  "MuiButtonBase-root-MuiIconButton-root.Mui-disabled": {
    backgroundColor: "#a9aeb3 !important",
    color: "#a9aeb3 !important",
  },
  "& .MuiDataGrid-footerContainer": {
    border: "0px !important",
  },
  // "&.MuiDataGrid-root.MuiDataGrid-root .MuiDataGrid-row": {
  //   backgroundColor: 'grey !important'
  // },
  "&. MuiTablePagination-root": {
    paddingBottom: "40px !important",
    paddingRight: "0px !important",
  },

  "&. MuiDataGrid-selectedRowCount": {
    visibility: "hidden !important",
  },

  // [`& .${gridClasses.row}.odd`]: {
  //   background: "white !important",
  //  color: `${btnTxtBlack.shade4} !important`,
  //   font: "13px Nunito Sans, sans-serif !important",
  //   fontWeight: "500 !important",
  //   "&:hover": {
  //     transform: "scale3d(1, 1, 1)",
  //     boxShadow: "0 0 11px rgba(33,33,33,.2) !important",
  //     cursor: "pointer"
  //   }

  // },

  [`& .${gridClasses.row}`]: {
    backgroundColor: "#FFFFFF",
    opacity: 1,
    color: `${btnTxtBlack.shade4} !important`,
    font: "13px Nunito Sans, sans-serif !important",
    fontWeight: "500 !important",
    minHeight: '70px !important',
    alignItems: 'center !important',
    borderBottom: '1px solid #EAECF0 !important',
    "&:hover": {
      backgroundColor: "#FFFFFF !important",
      // transform: "scale3d(1, 1, 1)",
      // boxShadow: "0 0 11px rgba(33,33,33,.2) !important",
      // cursor: "pointer"
    },
    "&.Mui-selected": {
      backgroundColor: "#FFFFFF !important",
    }
  },

  // '& .MuiDataGrid-cell:first-child': {
  //   position: 'sticky',
  //   top: '0',
  //   left: '0',
  //   paddingLeft: '1.5rem',
  //   zIndex: 999,
  //   background:"transparent",
  // },
  // '& .MuiDataGrid-columnHeader:first-child': {
  //   position: 'sticky',
  //   top: '0',
  //   left: '0',
  //   paddingLeft: '1.5rem',
  //   border: 'none',
  //   zIndex: 999,
  // },

  // "& .MuiTablePagination-spacer": {
  //   flex: "none !important",
  //   textAlign: "left",
  //   color: "red"
  // }
}));

export default function Table(props) {
  const { rows, columns, rowCount, hidePagination, hideFooter, autoHeight, currentPage, onRowClick, onCellDoubleClick, isLoading, loader } = props;
  return (
    <div
      style={{
        height: props.height ? props.height : 450,
        width: props.width ? props.width : '100%',
      }}
    >
      <StripedDataGrid
        // {...data}
        {...props}
        rowHeight={40}
        rows={rows}
        // showFirstButton
        // showLastButton
        columns={columns}
        rowCount={rowCount}
        rowsPerPageOptions={[10, 20, 50]}
        pagination
        paginationMode="server"
        headerHeight={55}
        hideFooterSelectedRowCount={true}
        hideFooter={hideFooter ? hideFooter : rows.length <= 0 ? true : false}
        hideFooterPagination={hidePagination ? true : false}
        autoHeight={autoHeight ? autoHeight : false}
        onRowClick={onRowClick ? onRowClick : false}
        onCellDoubleClick={onCellDoubleClick ? onCellDoubleClick : false}
        disableSelectionOnClick
        // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        // getRowClassName={(params) =>
        //   params.indexRelativeToCurrentPage % 2 == 0 ? "odd" : "even"
        // }
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No Data Available
            </Stack>
          ),
          LoadingOverlay: () => (
            loader ? loader :
              <Stack height="100%" alignItems="center" justifyContent="center">
                <Text text> Fetching data... </Text>
              </Stack>
          )
        }}
        initialState={{
          pagination: {
            pageSize: 10,
            page: currentPage ? currentPage : 0
          },
        }}
        loading={isLoading}
      />
    </div>
  );
}
