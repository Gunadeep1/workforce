import React, { useState } from "react";
import { Box, ButtonGroup } from "@mui/material";
import Passport from "./Passport";
import I94 from "./I94";
import Visa from "./Visa";
import CustomButton from "../../../../../components/customButton/Button";
import { ReactComponent as Plus } from '../../../../../assets/svg/plus.svg';
import disablePlus from '../../../../../assets/client/disablePlus.svg';
import LocalStorage from "../../../../../utils/LocalStorage";

export default function ControlledAccordions() {
  var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
  const [current, setCurrent] = useState("passport");
  const [form, setForm] = useState(false);

  const handleChangeTab = (tab) => {
    setCurrent(tab)
    setForm(false)
  }

  return (
    <Box>

      {
        !["add", "update"].includes(form) ?
          <Box my={2} display={"flex"} justifyContent={"end"}>
            {
              (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "employee_create" && item.is_allowed == true))) ?
                <CustomButton addNew startIcon={<Plus />} onClick={() => setForm("add")}>Add New</CustomButton> :
                <CustomButton addNewDisable startIcon={<img src={disablePlus} alt="add" />}>Add New</CustomButton>
            }
          </Box> : null
      }

      <Box p={1}>
        <ButtonGroup
          variant="outlined"
          fullWidth
          aria-label="outlined button group"
        >
          <CustomButton
            sx={{
              font: "16px Nunito, Nunito Sans, sans-serif ",
              textTransform: 'capitalize ',
              fontWeight: "600",
              borderColor: `${current === "passport" ? "#0C75EB" : "#E2E5E6"} `,
              color: `${current === "passport" ? "#ffffff" : "#849199"} `,
              "&:hover": { borderColor: `${current === "passport" ? "#0C75EB" : "#E2E5E6"} `, }
            }}
            variant={`${current === "passport" ? "contained" : "outlined"}`}
            onClick={() => handleChangeTab("passport")}
          >
            Passport
          </CustomButton>
          <CustomButton
            sx={{
              font: "16px Nunito, Nunito Sans, sans-serif ",
              textTransform: 'capitalize ',
              fontWeight: "600",
              borderLeft: `${current === "passport" ? 'none' : ''}`,
              borderColor: `${current === "i94" ? "#0C75EB" : "#E2E5E6"} `,
              color: `${current === "i94" ? "#ffffff" : "#849199"}`,
              "&:hover": {
                borderColor: `${current === "i94" ? "#0C75EB" : "#E2E5E6"}`,
                borderLeft: "none",
              }
            }}
            variant={`${current === "i94" ? "contained" : "outlined"}`}
            onClick={() => handleChangeTab("i94")}
          >
            I94
          </CustomButton>
          <CustomButton
            sx={{
              font: "16px Nunito, Nunito Sans, sans-serif ",
              textTransform: 'capitalize ',
              fontWeight: "600",
              borderColor: `${current === "visa" ? "#0C75EB" : "#E2E5E6"} `,
              color: `${current === "visa" ? "#ffffff" : "#849199"} `,
              "&:hover": { borderColor: `${current === "visa" ? "#0C75EB" : "#E2E5E6"} `, }
            }}
            variant={`${current === "visa" ? "contained" : "outlined"}`}
            onClick={() => handleChangeTab("visa")}
          >
            Visa
          </CustomButton>
        </ButtonGroup>
      </Box>

      {current === "passport" ? <Passport form={form} closeForm={setForm} /> : null}
      {current === "i94" ? <I94 form={form} closeForm={setForm} /> : null}
      {current === "visa" ? <Visa form={form} closeForm={setForm} /> : null}
    </Box>
  );
}