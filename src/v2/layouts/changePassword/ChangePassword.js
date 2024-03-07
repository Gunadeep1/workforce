// import {
//     Box,
//     Card,
//     CardContent,
//     CardHeader,
//     Grid,
//   } from "@mui/material";
//   import React, {useState } from "react";
//   import ChangePasswordForm from "./ChangePasswordForm";
//   import ChangePasswordStyles from "./ChangePasswordStyles";
//   import LocalStorage from "../../utils/LocalStorage";
//   // import userApi from "../../apis/old/userApi";
//   import Text from "../../components/customText/Text";
//   import Button from "../../components/customButton/Button";
//   import Male from '../../assets/svg/employee/Male.svg';
//   import Female from '../../assets/svg/employee/Female.svg'
//   import { useNavigate } from "react-router-dom";
//   import { useEffect } from "react";
  
//   function ChangePassword() {
  
//     const classes = ChangePasswordStyles();
//   const navigate = useNavigate();
//     const [getData, setGetData] = useState({});
  
//     useEffect(() => {
//       setGetData(LocalStorage.getUserData())
//     }, [])
  
//     /*fun is for based on id get data for card details*/
//     // const getApi = () => {
//     //   const id = '6321dcba88a1d72cd2f12d06';
//     //   userApi.singleEmpData(LocalStorage.uid(), id, LocalStorage.getAccessToken(), LocalStorage.getTenant())
//     //     .then((response) => {
//     //       if (response.data.status_code == 1003) {
//     //         setGetData(response.data.data[0])
//     //       }
//     //       else {
//     //         addErrorMsg(response.data.message);
//     //       }
//     //     }
//     //     )
//     // }
  
//     const handleEdit =()=>{
//       LocalStorage.setEmployeeId(LocalStorage.getUserData().login_id);
//       navigate('/employees/personal-details');
//     }
  
//     return (
//       <div>
//         <Grid container columnGap={2} className={classes.primaryGrid}>
//           <Grid item lg={3} md={4} sm={12} xs={12}>
//             <Card className={classes.card1} >
//               <Box justifyContent="center" pt={6}>
//                 <Box display="flex" justifyContent="center" alignItems="center">
//                   <img src={getData.gender == "Male" ? Male : Female} alt="profile" width="79px" height="77px" className={classes.Img} />
//                 </Box>
//                 <Grid item display="inline-grid" pt={1}>
//                   <Text header>{getData.full_name == "" ? '-' : getData.full_name} </Text>
//                   <Text smallLabel>
//                     {getData.roleName == "" ? '-' : getData.roleName}
//                   </Text>
//                   <Text smallLabel>{getData.employee_reference_id ? getData.employee_reference_id : '--'}</Text>
//                   <Text smallLabel pt={2}>
//                     {getData.email_iD == "" ? '-' : getData.email_iD}
//                   </Text>
//                   <Text smallLabel>
//                     {getData.contactNumber ? getData.contactNumber:"--"}
//                   </Text>
//                   <Grid item xs={12} pt={2}>
//                     <Button className={classes.button} onClick={handleEdit}>Edit Profile</Button>
//                   </Grid>
//                 </Grid>
//               </Box>
//             </Card>
//           </Grid>
//           <Grid item lg={8} md={7} xs={12} sm={12} className={classes.secondaryGrid}>
//             <Card className={classes.formCard}>
//               <CardHeader
//                 title={<Text className={classes.title} whiteColorText>Sign In & Security</Text>}
//                 className={classes.cardHeader}
//                 titleTypographyProps={{ variant: "h8" }}
//               />
//               <CardContent className={classes.cardContent}>
//                 <ChangePasswordForm />
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </div>
//     );
//   }
  
//   export default ChangePassword;
  
  