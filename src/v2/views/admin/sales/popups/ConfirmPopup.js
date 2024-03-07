import React from 'react'
import { Box, Stack, IconButton, } from "@mui/material";
import Button from '../../../../components/customButton/Button';
import Text from '../../../../components/customText/Text';
// import { ReactComponent as CloseIcon } from '../../../../assets/svg/closeIcons.svg';
import { ReactComponent as CloseIcon } from '../../../../assets/svg/cross.svg';
// import Input from '../../../../components/input/Input';
// import SearchSelect from '../../../../components/selectField/SearchSelect';
// import InvoiceDashborardStyles from '../invoices/InvoicesDashboardStyles';
// import CommonApi from '../../../../apis/CommonApi';
// import LocalStorage from '../../../../utils/LocalStorage';
// import { isValid, validate_city, validate_emptyField, validate_withCharDigit, validate_zipcode, } from '../../../../components/Validation';
// import InvoicesApi from '../../../../apis/admin/sales/InvoicesApi';
// import { addErrorMsg, addSuccessMsg } from '../../../../utils/utils';
// import LoadingButton from '../../../../components/customButton/LoadingButton';
import SalesStyles from '../SalesStyles';

import GenerateInvoiceIcon from '../../../../assets/svg/GenerateInvoiceIcon.svg';
import ChooseConfigIcon from '../../../../assets/svg/chooseconfig.svg';
import CustomButton from '../../../../components/customButton/Button';





export default function AddressForm(props) {

    const { popupView, setPopupView, openTimesheetpopup, selectTimesheetManually, setOpenPopup } = props;
    // const classes = InvoiceDashborardStyles();
    const classes = SalesStyles();


    // const [loading, setLoading] = useState(false);
    // const [countries, setCountries] = useState([]);
    // const [getStates, setGetStates] = useState([]);
    // const [error, setError] = useState({});

    // const [shippingAdressData, setShippingAddressData] = useState({
    //     request_id: LocalStorage.uid(),
    //     company_id: '',
    //     address_line_one: '',
    //     address_line_two: '',
    //     city: '',
    //     state_id: '',
    //     country_id: '',
    //     zip_code: ''
    // });

    // useEffect(() => {
    //     getCountries();
    //     // eslint-disable-next-line         
    // }, [])


    return (
        <Box sx={{ width: '100%' }}>
            {
                popupView === 1 ?
                    <Box sx={{ width: '562px !important', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <Box sx={{ width: '343px !important', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                            <img src={GenerateInvoiceIcon} alt='gerenate invoice' height={130} width={190} />
                            <Text className={classes.heading2} sx={{ textAlign: 'center !important', mt: 3 }}>Do You Want To Generate Invoice From Timesheets?</Text>
                            <Stack pb={2} direction={'row'} gap={'20px'} mt={3}>
                                <CustomButton outlineBlue sx={{ width: '196px !important', height: '42px !important', borderRadius: '10px !important' }}
                                    onClick={() => selectTimesheetManually()}
                                >No, Enter Manually
                                </CustomButton>
                                <CustomButton saveBtn saveBtnSmall onClick={() => setPopupView(2)}>Yes</CustomButton>
                            </Stack>
                        </Box>
                    </Box> : null
            }

            {
                popupView === 2 ?
                    <Box sx={{ width: '562px !important', padding: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: "relative" }}>
                        {/* <Stack direction={'row'} width={'100%'} justifyContent={'end'} mb={4} > */}
                        <IconButton aria-label="close" onClick={() => setOpenPopup(null)} sx={{ padding: "1px", position: "absolute", top: "1px", right: "14px" }}>
                            <CloseIcon style={{ cursor: 'pointer' }} />
                        </IconButton>

                        {/* </Stack> */}
                        <Box sx={{ width: '430px !important', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                            <Box pt={2} sx={{ width: "100%", height: "240px", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img src={ChooseConfigIcon} alt='gerenate invoice' height={120} width={200} />
                            </Box>
                            <Text className={classes.heading2} sx={{ textAlign: 'center !important', mt: 2 }}>Choose Timesheet Hours Configuration</Text>
                            <Stack direction={'row'} gap={'20px'} my={4}>

                                <Button outlineBlue sx={{ width: '196px !important', height: '42px !important', borderRadius: '10px !important' }}
                                    onClick={() => openTimesheetpopup("default")}
                                >Default Configuration
                                </Button>

                                <Button outlineBlue sx={{ width: '196px !important', height: '42px !important', borderRadius: '10px !important' }}
                                    onClick={() => openTimesheetpopup("custom")}
                                >Custom Configuration
                                </Button>
                            </Stack>
                        </Box>
                    </Box> : null
            }
        </Box>
    )
}
