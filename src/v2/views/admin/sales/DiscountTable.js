import React from 'react';
import { Box, tooltipClasses, Typography, Table, TableBody, TableRow, TableCell } from '@mui/material';
// import InvoiceDashborardStyles from './invoices/InvoicesDashboardStyles';
import { getCurrencySymbol } from '../../../utils/utils';
// import Text from '../../../components/customText/Text';
// import Skeleton from '@mui/material/Skeleton';
import { styled } from "@mui/material/styles";
import Tooltip from '@mui/material/Tooltip';
import SalesStyles from './SalesStyles';
import { ReactComponent as Information } from '../../../assets/svg/Information.svg';


const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#393939",
        padding: "6px 14px",
        minWidth: 100,
        border: "1px solid #393939"
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: "#393939",
        "&::before": {
            backgroundColor: "#393939",
            border: "1px solid #393939"
        }
    },
}));

export default function CustomCard(props) {

    const { state, handleChange } = props;
    const classes = SalesStyles();

    return (


        <Table aria-label="customized table">
            <TableBody>
                <TableRow>
                    <TableCell sx={{ border: "none", padding: "12px 2px", font: '15px Nunito, Nunito Sans, sans-serif', fontWeight: 600 }}>Sub Total</TableCell>
                    <TableCell sx={{ border: "none", textAlign: "end", padding: "12px 2px", font: '15px Nunito, Nunito Sans, sans-serif', fontWeight: 600 }}>{state.sub_total_amount}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ border: "none", padding: "12px 2px",font: '15px Nunito, Nunito Sans, sans-serif',}}>
                        <Box sx={{ height: "20px", display: 'flex', alignItems: "center" }}>
                            Adjustments
                            <HtmlTooltip
                                placement="top"
                                arrow
                                title={
                                    <React.Fragment>
                                        <Box className={classes.topTooltip}>
                                            <Typography className={classes.topTooltipText}>
                                                Add any other +ve/-ve charges that need to be applied to adjust the total amount of transaction
                                            </Typography>
                                        </Box>
                                    </React.Fragment>
                                }
                            >
                                <Information style={{ height: "18px", margin: "0px 4px" }} />
                            </HtmlTooltip>
                        </Box>
                    </TableCell>
                    <TableCell sx={{ border: "none", textAlign: "end", padding: "12px 0px" }}>
                        {/* {state.adjustment_amount} */}
                        <input
                            type="text"
                            value={state.adjustment_amount}
                            name="adjustment_amount"
                            placeholder='0.00'
                            maxlength="10"
                            onChange={handleChange}
                            style={{ borderRadius: "2px", textAlign: "end", width: "100px", padding: "3px 6px", backgroundColor: "#FFFFFF", outline: "none", border: "none",font: '15px Nunito, Nunito Sans, sans-serif', fontWeight: 600 }}
                        />
                    </TableCell>
                </TableRow>
                <TableRow sx={{ borderBottom: "2px dashed #C7CCD3" }}>
                    <TableCell sx={{ border: "none", padding: "12px 2px",font: '15px Nunito, Nunito Sans, sans-serif', fontWeight:600 }}>
                        Discount
                        <input type="text" value={state.discount_value} placeholder='0.00' name="discount_value" onChange={handleChange} style={{ borderRadius: "2px", width: "60px", margin: "0px 4px", padding: "3px 6px", backgroundColor: "#FFFFFF", outline: "none", border: "none",font: '15px Nunito, Nunito Sans, sans-serif', fontWeight: 600 }} />
                        <select name="discount_type" value={state.discount_type} onChange={handleChange} style={{ borderRadius: "2px", backgroundColor: "#FFFFFF", outline: "none", border: "none", width: "60px", padding: "3px", margin: "0px 4px",font: '15px Nunito, Nunito Sans, sans-serif', fontWeight: 600 }}>
                            <option value={2}>%</option>
                            <option value={1}>{getCurrencySymbol()}</option>
                        </select>
                    </TableCell>
                    <TableCell sx={{ border: "none", textAlign: "end", padding: "12px 2px", font: '15px Nunito, Nunito Sans, sans-serif', fontWeight: 600 }}>{state.discount_amount}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ border: "none", padding: "12px 2px", font: '15px Nunito, Nunito Sans, sans-serif', fontWeight:600 }}>Total</TableCell>
                    <TableCell sx={{ border: "none", textAlign: "end", padding: "12px 2px", font: '15px Nunito, Nunito Sans, sans-serif', fontWeight: 600 }}>{state.total_amount}</TableCell>
                </TableRow>
            </TableBody>
        </Table>



    )
}
