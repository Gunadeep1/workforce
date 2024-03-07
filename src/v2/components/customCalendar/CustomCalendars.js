import * as React from 'react';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Box } from "@mui/material";
import dayjs from 'dayjs';
import Text from '../../components/customText/Text';
import './CustomCalendars.css';
import { Fragment } from 'react';

// Extend dayjs with the isoWeek plugin to handle weeks correctly
dayjs.extend(isoWeek);

export default function CustomCalendars(props) {

  var value = props.value;
  var calendarDetails = props.calendarDetails;

  const day = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  // Calculate the start and end of the month view
  const startOfMonth = value.startOf('month').startOf('isoWeek');
  const endOfMonth = value.endOf('month').endOf('isoWeek');

  // Generate the days for the calendar view
  let days = [];
  let day_of = startOfMonth;
  while (day_of.isBefore(endOfMonth)) {
    days.push(day_of);
    day_of = day_of.add(1, 'day');
  }

  const dateDetailsMap = {};
  calendarDetails.forEach(item => {
    dateDetailsMap[new Date(item.date).getDate()] = item;
  });
  
 // eslint-disable-next-line
  const HolidayDayBox = (prop) => (
    <Box className="calendarBox" key={prop.index} sx={{
      height: '100px',
      textAlign: 'center', border: '1px solid #F6F6F6'
    }}>
      <Box sx={{
        background: "linear-gradient(0deg, #FCF1F3, #FCF1F3)",
        height: '65%', width: '100%'
      }}>
        <Text sx={{ textAlign: "end", padding: '5px' }} verySmallBoldBlack>{prop.day}</Text>
        <Text sx={{ color: "#EE859D", margin: '10px' }}>{prop.total_hours}</Text>
      </Box>
      <Box sx={{ textAlign: 'center', background: "linear-gradient(0deg, #FCF1F3, #FCF1F3)", height: '35%', width: '100%' }}>
        <div style={{ margin: "auto", textAlign: "center", color: "#EE859D", fontSize: '9px', border: '1px solid #EE859D', background: 'white', padding: '2px', width: 'fit-content', borderRadius: "9px" }}>
          Labor Day (U.S.)
        </div>
      </Box>
    </Box>
  );

  const InvoiceReadyBox = (prop) => (
    <Box className="calendarBox" key={prop.index} sx={{
      height: '100px',borderLeft:"2px solid #38A585 !important",
      textAlign: 'center', border: '1px solid #F6F6F6', background: "linear-gradient(0deg, #DAFEF3, #DAFEF3);"
    }}>
      <Text sx={{ textAlign: "end", padding: '5px' }} verySmallBoldBlack>{prop.day}</Text>
      <Text sx={{ color: "#38A585", margin: '12px' }}>{prop.total_hours}</Text>
    </Box>
  );

  const WeekDayBox = (prop) => (
    <Box className="calendarBox" key={prop.index} sx={{
      height: '100px',
      textAlign: 'center', border: '1px solid #F6F6F6', background: "#FAFAFA"
    }}>
      <Text sx={{ textAlign: "end", padding: '5px' }} verySmallBoldBlack>{prop.day}</Text>
      <Text sx={{ color: '#C4C6D0', margin: '12px' }}>{prop.total_hours}</Text>
    </Box>
  );

  const PendingApprovalBox = (prop) => (
    <Box className="calendarBox" key={prop.index} sx={{
      height: '100px',borderLeft:"2px solid #8763FC !important",
      textAlign: 'center', border: '1px solid #F6F6F6', background: "linear-gradient(0deg, #F4F0FF, #F4F0FF);"
    }}>
      <Text sx={{ textAlign: "end", padding: '5px' }} verySmallBoldBlack>{prop.day}</Text>
      <Text sx={{ color: "#8763FC", margin: '12px' }}>{prop.total_hours}</Text>
    </Box>
  );

  const InvoicedBox = (prop) => (
    <Box className="calendarBox" key={prop.index} sx={{
      height: '100px',borderLeft:"2px solid #0C75EB !important",
      textAlign: 'center', border: '1px solid #F6F6F6', background: "linear-gradient(0deg, #E7F2FD, #E7F2FD);"
    }}>
      <Text sx={{ textAlign: "end", padding: '5px' }} verySmallBoldBlack>{prop.day}</Text>
      <Text sx={{ color: "#0C75EB", margin: '12px' }}>{prop.total_hours}</Text>
    </Box>
  );

  const NormalDayBox = (prop) => (
    <Box className="calendarBox" key={prop.index} sx={{
      height: '100px',
      textAlign: 'center', border: '1px solid #FAFAFA', background: "linear-gradient(0deg, #FAFAFA, #FAFAFA);"
    }}>
      <Text sx={{ textAlign: "end", padding: '5px' }} verySmallBoldBlack>{prop.day}</Text>
      <Text sx={{ color: "#0C75EB", margin: '12px' }}></Text>
    </Box>
  );

  return (
    <Fragment>
      <Box sx={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', // Creates 7 columns with equal width
      }}>
        {day.map((weekday, index) => (
          <Box key={index} sx={{
            textAlign: 'center',
            color: "#979CA1",
          }}>
            <Text>{weekday}</Text>
          </Box>
        ))}

        {
          days.map((day, index) => {
            const details = dateDetailsMap[day.date()];
            var dateMatchwithMonth = false;
            if(dateDetailsMap[day.date()] !== undefined){
              dateMatchwithMonth = (dateDetailsMap[day.date()].date === day.format('YYYY-MM-DD'));
            }
            if (details && dateMatchwithMonth) {
              if(day.day() == 6 || day.day() == 0){
                return <WeekDayBox total_hours={details.total_hours} key={index} index={index} day={day.date()}></WeekDayBox>;
              }
              else if (details.invoice_raised==true) {
                  return <InvoicedBox total_hours={details.total_hours} key={index} index={index} day={day.date()}></InvoicedBox>;
                }else if(details.status=="Approved"){
                  return <InvoiceReadyBox total_hours={details.total_hours} key={index} index={index} day={day.date()}></InvoiceReadyBox>;
                }else if(details.status!="Approved"){
                  return <PendingApprovalBox total_hours={details.total_hours} key={index} index={index} day={day.date()}></PendingApprovalBox>;
                } 
              
              // if (details.invoice_ready_timesheet) {
              //   return <InvoiceReadyBox total_hours={details.total_hours} key={index} index={index} day={day.date()}></InvoiceReadyBox>;
              // } else if (details.pending_for_approval) {
              //   return <PendingApprovalBox total_hours={details.total_hours} key={index} index={index} day={day.date()}></PendingApprovalBox>;
              // } 
              // // else if (details.invoiced) {
              // //   return <InvoicedBox total_hours={details.total_hours} key={index} index={index} day={day.date()}></InvoicedBox>;
              // // } 
              // else if (details.invoice_raised==true) {
              //   return <InvoicedBox total_hours={details.total_hours} key={index} index={index} day={day.date()}></InvoicedBox>;
              // } 
              // else if (details.holiday) {
              //   return <HolidayDayBox total_hours={details.total_hours} key={index} index={index} day={day.date()}></HolidayDayBox>;
              // } else if (details.weekoff) {
              //   return <WeekDayBox total_hours={details.total_hours} key={index} index={index} day={day.date()}></WeekDayBox>;
              // }
            }
            return <NormalDayBox key={index} index={index} day={day.date()}></NormalDayBox>;
          })
        }
      </Box>
    </Fragment>
  );
}
