import { Box, Grid, Typography, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionSummary from '@mui/material/AccordionSummary';
import Accordion from '@mui/material/Accordion';
import DashboardStyles from '../admin/DasboardStyles';
import VersionNote from './versionNotes/VersionNote';
import Json from './releaseNotes.json';


function ReleaseNotes() {
  const [value, setValue] = useState("");
  const accordionToggle = (data) => {
    if (value == data) {
      setValue(false);
    } else {
      setValue(data);
    }
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    setValue(queryParams.get('version'));
    // eslint-disable-next-line
  }, []);
  const classes = DashboardStyles();
  return (
    <Grid container display={"flex"} justifyContent={"center"} >
      <Grid item container p={2} sx={{ width: "80%" }}>
        <Grid item lg={12}>
          <Typography sx={{ fontSize: "28px", fontFamily: "Nunito , Nunito Sans, sans-serif", display: "flex", alignSelf: "center", fontWeight: "800", color: "#171717" }}>
            Release Notes
          </Typography>
        </Grid>
        <Grid item lg={12}>
          {
            Json.map((note, key) => (
              <Accordion
                key={key}
                className={classes.customAccordion}
                expanded={value == note.version} onClick={() => accordionToggle(note.version)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  className={classes.AccordionSummary}
                >
                  <Stack direction="row" spacing={2} width={"100%"} >
                    <Box
                      className={classes.AccordionSummaryBox}
                    >
                      <Typography sx={{ fontSize: "22px", fontFamily: "Nunito , Nunito Sans, sans-serif", fontWeight: "500", color: "rgba(38, 38, 38, 1)" }}>
                        Version - {note.version}
                      </Typography>
                    </Box>
                    <Box sx={{ width: "40%", display: "flex", alignItems: "center", gap: 2 }}>

                      <Box sx={{ width: "100%", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                        <Typography
                        >
                          Date: {note.date}
                        </Typography>
                        <Typography>
                          Time: {note.time}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <VersionNote note={note.releaseNotes} />
                </AccordionDetails>
              </Accordion>
            ))
          }
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ReleaseNotes


// "releaseNotes": {
//   "newFeatures": {
//     "columns": [
//       "Sno",
//       "Module",
//       "Description"
//     ],
//       "rows": [
//         {
//           "Sno": "",
//           "Module": "",
//           "Description": "",
//         }
//       ]
//   },
//   "bugFixes": {
//     "columns": [
//       "Sno",
//       "Issue",
//       "Jira",
//       "Description",
//       "Status"
//     ],
//       "rows": [
//         {
//           "Sno": "",
//           "Issue": "",
//           "Jira": "",
//           "Description": "",
//           "Status": ""
//         }
//       ]
//   },
//   "changesToPreviousRelease": {
//     "title": "Changes to previous release notes",
//       "columns": [
//         "Sno",
//         "Module",
//         "Description"
//       ],
//         "rows": [
//           {
//             "Sno": "",
//             "Module": "",
//             "Description": "",
//           }
//         ]
//   }
// }
