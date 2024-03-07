import React from 'react'
import { Grid } from '@mui/material'
import Text from '../../../../../components/customText/Text';
import MainStyles from '../../MainStyles'
import Logo from '../../../../../assets/svg/logo-name.svg';
import InvoiceThemeStyles from './InvoiceThemeStyles';
import { getCurrencySymbol } from "../../../../../utils/utils";
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
function InvoiceThemes({ current, color }) {
// eslint-disable-next-line
  const classes = MainStyles();
  const classes1 = InvoiceThemeStyles()
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: color,
      color: theme.palette.common.white,
      padding: '8px',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      padding: '8px'
    },
  }));
  const rows = [
    createData(1, 'Rahul Raj', 80, getCurrencySymbol() + 1200, getCurrencySymbol() + 1500),

  ];
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  const StyledTableRow = styled(TableRow)(({ theme }) => ({

    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  const cardTitle=[{
    name:"Sub Total",
    amount:`${getCurrencySymbol()}5000.00`
  },{
    name:"Sub Total",
    amount:`${getCurrencySymbol()}5000.00`
  },{
    name:"Payment Made",
    amount:`${getCurrencySymbol()}5000.00`
  },{
    name:"Sub Total",
    amount:`${getCurrencySymbol()}5000.00`
  }]
  return (
    <Grid container lg={12} sx={{
      height: '75vh',
      overflow: 'auto',
      padding: '10px',
    }}>

      <Grid item container lg={12} className={classes1.activeItemBox} >
        <Grid item lg={12} p={3}>
          <img src={Logo} alt="Logo" style={{ height: "54px" }} />

        </Grid>
        <Grid item container lg={12} p={3} sx={{ backgroundColor: color == "#138CBD" ? "#F1FBFF" : "#ECF5FF" }}>
          <Grid item lg={9} >
            <Text className={classes1.label1} sx={{ color: color }}>Invoice</Text>
          </Grid>
          <Grid item lg={3} display={"flex"} flexDirection={"column"} justifyContent={"end"}>
            <Text smallBlack>Invoice Amount</Text>
          </Grid>
          <Grid item lg={9} display={"flex"} flexDirection={"column"} justifyContent={"end"} >
            <Text largeBlack>Invoice No: 123456</Text>
          </Grid>
          <Grid item lg={3} >
            <Text className={classes1.label2} sx={{ color: color }}>{getCurrencySymbol()}5000.00</Text>
          </Grid>
          <Grid item lg={9} >
            <Text largeBlack>Date: Nov-04-2023</Text>
          </Grid>
          <Grid item lg={3} >
            <Text greyLabel>Due Date 12-12-2023</Text>
          </Grid>
        </Grid>
        <Grid item container lg={12} p={3}>
          <Grid item lg={9} >
            <Text boldBlackfont16>Invoice To</Text>
          </Grid>
          <Grid item lg={3} >
            <Text boldBlackfont16>Bill To</Text>
          </Grid>
          <Grid item lg={9} md={6} sm={6} xs={12} container direction={'column'} >
            <Text errorText sx={{ color: "#171717" }}>TekInvaderZ LLC</Text>
            <Text errorText sx={{ color: "#171717" }}>2490 East Oakton St Ste A</Text>
            <Text errorText sx={{ color: "#171717" }}>Arlington Heights, IL 60005</Text>
            <Text errorText sx={{ color: "#171717" }}>U.S.A</Text>
            <Text errorText sx={{ color: "#171717" }}>EIN : 46-5582856</Text>

          </Grid>
          <Grid item lg={3} md={3} sm={3} xs={12} container direction={'column'} >
            <Text errorText sx={{ color: "#171717" }}>Insight Global</Text>
            <Text errorText sx={{ color: "#171717" }}>4211 West Boy Scout</Text>
            <Text errorText sx={{ color: "#171717" }}>Blvd Suite 290</Text>
            <Text errorText sx={{ color: "#171717" }}>Tampa, FL 33607</Text>
            <Text errorText sx={{ color: "#171717" }}>U.S.A</Text>

          </Grid>
          <Grid item lg={12} mt={6}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 600 }} aria-label="customized table">
                <TableHead  >
                  <TableRow >
                    <StyledTableCell >S.no</StyledTableCell>
                    <StyledTableCell align="center">Employee Name</StyledTableCell>
                    <StyledTableCell align="center">Hours</StyledTableCell>
                    <StyledTableCell align="center">Rate</StyledTableCell>
                    <StyledTableCell align="center">Amount</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <StyledTableRow key={row.name}>
                      <StyledTableCell component="th" scope="row">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">{row.calories}</StyledTableCell>
                      <StyledTableCell align="center">{row.fat}</StyledTableCell>
                      <StyledTableCell align="center">{row.carbs}</StyledTableCell>
                      <StyledTableCell align="center">{row.protein}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          {
            cardTitle.map((item, index) => (
              <Grid container mt={index == 0 ? 6 : 0}>
                <Grid item lg={10} display={"flex"} justifyContent={"end"}> <Text errorText sx={{ color: "#171717" }}>{item.name}</Text></Grid>
                <Grid item lg={2} display={"flex"} justifyContent={"end"}><Text errorText sx={{ color: "#171717" }}>{item.amount}</Text></Grid>
              </Grid>
            ))
          }


          <Grid item lg={12} md={12} sm={12} xs={12} mt={6} container direction={'column'} >
            <Text smallBlack sx={{ color: "#171717" }}>Note</Text>
            <Text errorText sx={{ color: "#171717" }}>Please do acknowledge the receipt of Invoice.</Text>
            <Text errorText sx={{ color: "#171717" }}>I would like to request you to please co-operate with us by releasing payments at least 3 to 4 days before the due date.</Text>
            <Text errorText sx={{ color: "#171717" }}>Thanks for your business</Text>
            <Text errorText sx={{ color: "#171717" }}>Terms & Conditions</Text>
            <Text errorText sx={{ color: "#171717" }}>Please pay the due amount on-time.</Text>

          </Grid>
        </Grid>


      </Grid>



    </Grid>
  )
}

export default InvoiceThemes;
