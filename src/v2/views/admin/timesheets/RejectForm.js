import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
// import { Link, useLocation, } from 'react-router-dom';
// import { Link } from 'react-router-dom';
import TimesheetApi from '../../../apis/admin/timesheets/TimesheetApi';
// import TimesheetStyles from './TimesheetStyles';
import CustomButton from '../../../components/customButton/Button';
import Text from '../../../components/customText/Text';
import { styled } from "@mui/material/styles";
import BaseTextareaAutosize from '@mui/material/TextareaAutosize';
import LocalStorage from '../../../utils/LocalStorage';
import { addErrorMsg, addSuccessMsg } from '../../../utils/utils';
import LoadingButton from '../../../components/customButton/LoadingButton';


const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    width: 415px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
   
    border: 2px solid #C7CCD3;
    &:focus-visible {
        outline: 0;
      }
  `,
);

export default function RejectForm(props) {

    const { handleClosePopUp, id, formData, handleOpenDialog } = props;
    // const classes = TimesheetStyles();
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [commentError, setCommentError] = useState("");


    const updateTimesheetStatus = () => {
        let data = {
            request_id: LocalStorage.uid(),
            timesheet_id: id,
            placement_id: formData.placement_id,
            status: "Rejected",
            comments: comment,
        };
        let errors = validation(data.comments);

        if (errors == "") {
            setLoading(true);
            TimesheetApi.updateTimesheetStatus(data).then((response) => {
                setTimeout(() => {
                    setLoading(false)
                    if (response.data.statusCode == 1003) {
                        addSuccessMsg(response.data.message);
                        handleOpenDialog(3);
                    } else {
                        addErrorMsg(response.data.message);
                    }
                }, 400)
            });
        }

    }

    const handleChange = (e) => {
        setComment(e.target.value);
        validation(e.target.value);
    }

    const validation = (value) => {
        let msg = "";
        if (value == "") {
            msg = "This Field is required";
        } else {
            if (value.length > 100) {
                msg = "Please Enter 100 Or less then 100 characters";
            } else {
                msg = "";
            }
        }
        setCommentError(msg);
        return msg;
    }

    return (
        <Box>
            <Box sx={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                <Text largeBlack>Timesheet Rejection </Text>
            </Box>
            <Box my={3}>
                <Typography sx={{ color: "#000000", font: '14px  Nunito , Nunito Sans, sans-serif', fontWeight: 400, }}>
                    Please explain why this timesheet was rejected, In few words.
                </Typography>
                <Textarea sx={{ mt: "10px", width: "100%" }} type="text" aria-label="minimum height" minRows={5} value={comment} onChange={handleChange} />

                <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                    <Text errorText>{commentError}</Text>
                    <Text sx={{ display: 'flex', justifyContent: "right" }} largeGrey>{comment.length}/100</Text>
                </Box>
            </Box>
            <Box my={0} sx={{ width: '100%', display: 'flex', justifyContent: "right", gap: '20px' }} >
                <CustomButton cancelBtnBorder onClick={() => handleClosePopUp()}>
                    Back
                </CustomButton>
                <LoadingButton saveLoader loading={loading} onClick={() => updateTimesheetStatus()}>
                    Submit
                </LoadingButton>
            </Box>
        </Box>
    )
};