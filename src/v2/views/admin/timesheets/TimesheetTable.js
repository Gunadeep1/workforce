import React from "react";
import { Box } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import moment from "moment";


export default function TimesheetTable(props) {


    const { hoursArr, handleChangeHours, tableIndex, editscreen, formData,location,edit} = props;
    const getTotalHours = (target) => {
        var start = "00:00";
        for (var i = 0; i < hoursArr.length; i++) {
            start = sumOfHours(start, hoursArr[i][target]);
        }
        return start;
    }

    function sumOfHours(time1, time2) {
        // Split time into hours and minutes

        if (time1 === "") {
            return time2
        }

        if (time2 === "") {
            return time1
        }

        var [hours1, minutes1] = time1.split(':');
        var [hours2, minutes2] = time2.split(':');
        if (hours1 == '' || hours1 == undefined) {
            hours1 = 0;
        } else if (hours2 == '' || hours2 == undefined) {
            hours2 = 0;
        } else if (minutes1 == '' || minutes1 == undefined) {
            minutes1 = 0;
        } else if (minutes2 == '' || minutes2 == undefined) {
            minutes2 = 0;
        }

        // Convert time to minutes
        var totalMinutes = parseInt(hours1) * 60 + parseInt(minutes1) + parseInt(hours2) * 60 + parseInt(minutes2);

        // Convert minutes back to HH:MM format
        var hours = isNaN(totalMinutes) ? 0 : Math.floor(totalMinutes / 60);
        var minutes = isNaN(totalMinutes) ? 0 : totalMinutes % 60;

        // Add leading zeros if necessary
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        // console.log(hours, "  hours");
        // console.log(minutes, "  minutes");

        return hours + ':' + minutes;
    }

    const TableInput = (data, target, key) => {
        return (
            <input
            type="text"
            name={target}
            value={data[target]}
            onChange={(e) => handleChangeHours(e, key, tableIndex)}
            style={{ color: "#404040", fontWeight: 400, font: "12px Nunito, Nunito Sans, sans-serif", width: "100%", height: "48px", textAlign: "center", border: "none", }}
        />
          
        );
    }

    // border: "2px solid #B0B0B0",

    // borderRadius: "8px"

    return (
        <Box sx={{ border: "1px solid #B0B0B0", borderRadius: "8px" }}>
            <Table size="small" sx={{ borderRadius: "8px" }} >
                <TableHead>
                    <TableRow
                        sx={{ height: '48px' }}
                    >
                        <TableCell sx={{ width: '140px', textAlign: "center", color: "#171717", fontWeight: 600, font: "16px Nunito, Nunito Sans, sans-serif", }}>Timesheet 1</TableCell>
                        {
                            hoursArr.map((timesheet, key) => (
                                <TableCell sx={{ borderLeft: " 1px solid #B0B0B0", borderRight: " 1px solid #B0B0B0", textAlign: "center", }} key={key}>
                                    <p style={{ font: "14px Nunito, Nunito Sans, sans-serif", color: "#171717", fontWeight: 500 }}>{timesheet.date === "" ? null : moment(timesheet.date).format('ddd')}</p>
                                    <p style={{ font: "12px Nunito, Nunito Sans, sans-serif", color: "#404040", fontWeight: 400 }}>{timesheet.date}</p>
                                </TableCell>
                            ))
                        }
                        <TableCell sx={{ width: '140px', textAlign: "center", color: "#171717", fontWeight: 600, font: "16px Nunito, Nunito Sans, sans-serif" }}>Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {console.log("editscreen",editscreen,"is_editable",formData.is_editable,)}
                    <TableRow sx={{ height: '48px' }} >
                        <TableCell sx={{ padding: 0, textAlign: "center", color: "#171717", fontWeight: 500, font: "14px Nunito, Nunito Sans, sans-serif" }}>OT Hours</TableCell>
                        {hoursArr.map((i, key) => (
                            <TableCell key={key} sx={{ borderLeft: " 1px solid #B0B0B0", borderRight: " 1px solid #B0B0B0", padding: 0, textAlign: "center", color: "#404040", fontWeight: 400, font: "12px Nunito, Nunito Sans, sans-serif" }}>
                                {editscreen ? formData.is_editable ? location.state.name == 'Invoice Ready Timesheet'&& edit? i.ot_hours: TableInput(i, "ot_hours", key) : i.ot_hours : TableInput(i, "ot_hours", key)}
                            </TableCell>
                        ))}
                        <TableCell sx={{ padding: 0, textAlign: "center", color: "#404040", fontWeight: 400, font: "12px Nunito, Nunito Sans, sans-serif" }}>
                            {getTotalHours("ot_hours")}
                        </TableCell>
                    </TableRow>


                    <TableRow sx={{ height: '48px' }}>
                        <TableCell sx={{ padding: 0, textAlign: "center", color: "#171717", fontWeight: 500, font: "14px Nunito, Nunito Sans, sans-serif" }}>Billable Hours</TableCell>
                        {hoursArr.map((i, key) => (
                            <TableCell key={key} sx={{ borderLeft: " 1px solid #B0B0B0", borderRight: " 1px solid #B0B0B0", padding: 0, textAlign: "center", color: "#404040", fontWeight: 400, font: "12px Nunito, Nunito Sans, sans-serif" }}>
                                {editscreen ? formData.is_editable ? location.state.name == 'Invoice Ready Timesheet' && edit? i.ot_hours: TableInput(i, "billable_hours", key) : i.billable_hours : TableInput(i, "billable_hours", key)}
                            </TableCell>
                        ))}
                        <TableCell sx={{ padding: 0, textAlign: "center", color: "#404040", fontWeight: 400, font: "12px Nunito, Nunito Sans, sans-serif" }}>
                            {getTotalHours("billable_hours")}
                        </TableCell>
                    </TableRow>


                    <TableRow sx={{ height: '48px' }} >
                        <TableCell sx={{ textAlign: "center", color: "#171717", fontWeight: 500, font: "14px Nunito, Nunito Sans, sans-serif" }}>Total Hours</TableCell>
                        {hoursArr.map((i, key) => (
                            <TableCell key={key} sx={{ borderLeft: " 1px solid #B0B0B0", borderRight: " 1px solid #B0B0B0", padding: 0, textAlign: "center", backgroundColor: "#DCFCDC", color: "#404040", fontWeight: 400, font: "12px Nunito, Nunito Sans, sans-serif" }}>
                                {i.total_hours}
                            </TableCell>
                        ))}
                        <TableCell sx={{ textAlign: "center", backgroundColor: "#037847", color: "#FFFFFF", borderRadius: "0px 0px 8px 0px" }}>
                            {getTotalHours("total_hours")}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Box>
    )
};