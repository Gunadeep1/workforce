import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
// import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box } from "@mui/material";
// import DownloadSvg from "../../../../../assets/svg/downloadIcon.svg";
// import EditSvg from "../../../../../assets/svg/editIcon.svg";
// import DeleteSvg from "../../../../../assets/svg/deleteIcon.svg";

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    borderBottom: `1.5px solid ${theme.palette.divider}`,
    "&:before": {
        display: "none",
    },
    padding: "10px 0px",
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ fontSize: "2rem" }} />}
        {...props}
        sx={{ border: "none" }}
    />
))(({ theme }) => ({
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
        transform: "rotate(180deg)",
    },
    "& .MuiAccordionSummary-content": {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
    border: "none",
}));

export default function CustomizedAccordions(props) {
    const { serial_no, accordionSummary, accordionDetails } = props;
    const [expanded, setExpanded] = React.useState(null);

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(expanded === panel ? null : panel);
    };


    return (
        <Box p={1}>
            <Accordion
                expanded={expanded === `panel${serial_no}`}
                onChange={handleChange(`panel${serial_no}`)}
            >
                <AccordionSummary aria-controls={`panel${serial_no}-content`} id={`panel${serial_no}-header`}>
                    {accordionSummary}
                </AccordionSummary>
                <AccordionDetails>
                    {accordionDetails}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}