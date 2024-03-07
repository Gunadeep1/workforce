import React, { useEffect, useState } from 'react'
import { Box, ListItemButton, Grid ,Stack} from '@mui/material';
import MainStyles from '../MainStyles';
import Text from '../../../../components/customText/Text';
import PaymentModes from './Preferences/PaymentModes';
import InvoiceThemes from './Preferences/InvoiceThemes';
import ApprovalConfiguration from './Preferences/ApprovalConfiguration';
import DefaultInvoiceCycle from './Preferences/DefaultInvoiceCycle';
import color1 from "../../../../assets/svg/color1.svg"
import color2 from "../../../../assets/svg/color2.svg"
import color1Select from "../../../../assets/svg/color1Select.svg"
import color2Select from "../../../../assets/svg/color2Select.svg"
import PaymentModesApi from '../../../../apis/configurations/invoices/PaymentModesApi';
import LocalStorage from '../../../../utils/LocalStorage';
import { addErrorMsg, addSuccessMsg } from '../../../../utils/utils';

const prefernces = ['Payment Modes', 'Invoice Theme', 
// 'Invoice Taxes', 'Write Off Reasons',
    'Approval Configuration', 'Default Invoice Cycle'];
function InvoiceConfig() {
    const classes = MainStyles()
    const [expand,setExpand] = useState(false)
    const [color,setColor] = useState("#138CBD")
    const [state,setState] = useState({})// eslint-disable-next-line
    const [firstColor,setFirstColor] = useState(false) 
    const [current, setCurrent] = useState("Payment Modes");
    const handleClick = (args)=>{
        setCurrent(args)
        setExpand(false)
        if(args=='Invoice Theme'){
            setExpand(true)
        }
    }
  useEffect(()=>{
    getInvoiceTheme()
  },[])

  const getInvoiceTheme = () =>{
    PaymentModesApi.getTheme(LocalStorage.getUserData().organization_id).then(
        (res)=>{
            setState(res.data.data[0])
            setColor(res.data.data[0].dark_theme)
        }
    )
  }
  const handleColor=(args)=>{
   
    if(args=="#0C75EB"){
        setFirstColor(true)
        setColor(args) 
    }else if(args=="#138CBD"){
        setColor(args) 
    }
    let data={
        request_id: LocalStorage.uid(),
        invoice_theme: [
            {
                dark_theme: args,
                light_theme: args=="#138CBD" ? "#F1FBFF" : '#ECF5FF'
            }
        ]
    }
    if(color !== args){
        PaymentModesApi.updateTheme(data,LocalStorage.getUserData().organization_id).then(
            (res)=>{
                if(res.data.statusCode == 1003){
                    addSuccessMsg("Invoice theme changed successfully");
                    getInvoiceTheme();
                }
                else{
                    addErrorMsg(res.data.message)
                }
            }
        )
    }
    
     
    }
    return (
        <Box display={'flex'} justifyContent={'center'} width={'100%'}>
            <Box padding={'20px 0px 0px 0px'} width={{ sm: '95%', md: '85%', lg: expand?'105%':'85%' }}>
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} >
                    <Grid item lg={4} md={4} sm={4} xs={12}>
                        <Box className={classes.mainListBox} >
                            <Box className={classes.prefTitle}>
                                <Text blackHeader>Preferences</Text>
                            </Box>
                            <Box className={classes.listContainer} sx={{ maxHeight: '60vh' }}>
                                {
                                    prefernces.map((item, key) => (
                                        <ListItemButton
                                            key={key}
                                            className={`${classes.listItems} ${current === item ? classes.listItemsActive : null}`}
                                            onClick={() => handleClick(item) }
                                            
                                        >
                                            {item}
                                        </ListItemButton>
                                    ))
                                }
                            </Box>
                        </Box>
                    </Grid>
                   {expand?
                     <Grid item lg={1} mt={2} display={"flex"} justifyContent={"center"}>
                        <Stack gap={2}>
                            {console.log(state,'state')}
                            <img style={{width:"40px",height:"40px",cursor:"pointer"}} onClick={()=>handleColor("#138CBD")} src={color === "#138CBD" ? color1Select : color1} alt="color1"/>
                            <img style={{width:"40px",height:"40px",cursor:"pointer"}} onClick={()=>handleColor("#0C75EB")} src={color === "#0C75EB" ? color2Select : color2} alt="color2"/>
                        </Stack>
                     </Grid>
                   :""} 
                    <Grid item lg={expand?7:8} md={8} sm={8} xs={12}>

                        <Box >

                            {
                                current === "Payment Modes" ? <PaymentModes current={current} /> : null
                            }
                            {
                                current === "Invoice Theme" ? <InvoiceThemes current={current} color={color} /> : null
                            }
                            {/* {
                                current === "Invoice Taxes" ? <InvoiceTaxes current={current} /> : null
                            }
                            {
                                current === "Write Off Reasons" ? <WriteOffReasons current={current} /> : null
                            } */}
                            {
                                current === "Approval Configuration" ? <ApprovalConfiguration current={current} /> : null
                            }
                            {
                                current === "Default Invoice Cycle" ? <DefaultInvoiceCycle current={current} /> : null
                            }
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default InvoiceConfig;
