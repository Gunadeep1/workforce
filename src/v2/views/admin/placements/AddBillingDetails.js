import React, { useEffect } from 'react'
import AddBillingDetailsStyles from './AddBillingDetailsStyles'
import { Box, Breadcrumbs, Grid, Stack, Typography } from '@mui/material'
import Input from '../../../components/input/Input'
import Text from '../../../components/customText/Text'
import CustomSelect from '../../../components/customSelect/CustomSelect'
import Date from '../../../components/datePicker/Date'
import RadioGroup from '../../../components/customButton/RadioGroup'
import Button from '../../../components/customButton/Button';
import LocalStorage from '../../../../v2/utils/LocalStorage';
import { useState } from 'react'
import { float_validation, isValid, validate_emptyField, validate_toHours, validates_float, validates_handlechange_float } from '../../../components/Validation'
import moment from 'moment';
import { addErrorMsg, addSuccessMsg, addWarningMsg, dateFormat } from '../../../../v2/utils/utils';
import PlacementApi from '../../../apis/admin/placements/PlacementApi'
import { useLocation, useNavigate } from 'react-router-dom';

function AddBillingDetails() {
  const location = useLocation();
  // const placementID = location && location.state && location.state.data.id
  const placemnetData = location && location.state && location.state.data
  const navigate = useNavigate();
  const classes = AddBillingDetailsStyles()
  const discountTypeList = require('../../../utils/jsons/DiscountType.json');
  const otPayRateConfigOptions = [
    { id: 1, title: <Text className={classes.radioText}>Same as Payrate</Text>, value: 1 },
    { id: 2, title: <Text className={classes.radioText}>Fixed Value</Text>, value: 2 },
    { id: 3, title: <Text className={classes.radioText}>Variable</Text>, value: 3 }
  ]
  const clntData = location && location.state && location.state.clientDetails
  const [errors, setErrors] = useState({});
  const [sample, setSample] = useState('');
  const [data, setData] = useState({
    bill_type: 1,
    bill_rate: "",
    effective_from: clntData.start_date,
    ot_bill_rate: "",
    bill_rate_discount: "",
    ot_pay_rate_config_type: 1,
    ot_pay_rate: "",
    bill_rate_discount_type: "",
    ot_pay_rate_multiplier: "",
    payRate: "",
  })

  const billOptions = [
    {
      value: "Hourly",
      id: 1
    }
  ]

  const getPayrollAmount = (e, id, args) => {
    let getData = {
      request_id: LocalStorage.uid(),
      employee_id: id,
      placement_id: placemnetData.id,
      bill_rate: args
    }
    PlacementApi.payRate(getData).then((res) => {
      if (res.data.statusCode === 1003) {
        setData({
          ...data,
          payRate: res.data.data.value,
          ot_pay_rate: res.data.data.value,
          bill_type: 1,
          ot_pay_rate_config_type: data.ot_pay_rate_config_type,
          // effective_from: clntData.start_date
        }, handleValidate(e))
      }
    })
  }

  const callApi = (args) => {
    setSample(args)
  }
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getPayrollAmount(sample, placemnetData && placemnetData.employee_id, sample.target.value);
      // Send Axios request here
    }, 300)

    return () => clearTimeout(delayDebounceFn)
    // eslint-disable-next-line
  }, [sample])

  const changeHandler = (e) => {
    if (e.target.name == 'bill_rate') {
      setData({ ...data, [e.target.name]: e.target.value }, handleValidate(e))
      callApi(e)
    } 
    else if (e.target.name == 'bill_rate_discount_type') {
      data[e.target.name] = e.target.value
      data['bill_rate_discount'] = ''
      setData({ ...data })
    }
    else if (e.target.name == 'bill_rate_discount') {
      if (data.bill_rate_discount_type == 1) {
        if (e.target.value > 100) {
          addWarningMsg('Percentage is not allowed more than 100%')
        } else {
          data[e.target.name] = e.target.value
          setData({ ...data })
        }
      } else {
        data[e.target.name] = e.target.value
        setData({ ...data })
      }
    }
    else if (e.target.name == 'ot_pay_rate_config_type') {
      if (e.target.value == 2 || e.target.value == '2') {
        setData({
          ...data, [e.target.name]: e.target.value,
          ot_pay_rate: '',
          ot_pay_rate_multiplier: ''
        }, handleValidate(e))
      } else {
        setData({
          ...data, [e.target.name]: e.target.value,
          ot_pay_rate: data.payRate
        },errors.ot_pay_rate = '', handleValidate(e))
      }
    }
    else if (e.target.name == 'ot_pay_rate_multiplier') {
      if (e.target.value > 100) {
        addWarningMsg('Please enter the value less than 100')
      } else {
        setData({
          ...data,
          [e.target.name]: e.target.value,
          ot_pay_rate: (e.target.value * data.payRate).toFixed(2)
        }, handleValidate(e))
      }
    }
    else {
      setData({ ...data, [e.target.name]: e.target.value })
    }
    handleValidate(e)
  }

  const dateChange = (e, name) => {
    let date = e.$d
    let event = {
      target: {
        name: name,
        value: date
      }
    }
    setData({
      ...data,
      [name]: moment(date).format(dateFormat())
    }, handleValidate(event))
  }

  const handleValidate = (e) => {
    const input = e.target
    switch (input.name || input.tagName) {
      case 'effective_from':
        errors.effective_from = validate_emptyField(input.value)
        break
      case 'payRate':
        errors.payRate = validate_toHours(input.value)
        break
      case 'ot_pay_rate_config_type':
        errors.ot_pay_rate_config_type = validate_emptyField(input.value)
        break
      case 'bill_rate':
        errors.bill_rate = float_validation(input.value)
        break
      case 'ot_pay_rate':
        errors.ot_pay_rate = float_validation(input.value)
        break
      case 'bill_rate_discount_type':
        errors.bill_rate_discount_type = validate_emptyField(input.value)
        break
      case 'bill_rate_discount':
        errors.bill_rate_discount = validates_float(input.value);
        break
      case 'ot_pay_rate_multiplier':
        errors.ot_pay_rate_multiplier = float_validation(input.value);
        break
      case 'ot_bill_rate':
        errors.ot_bill_rate = validates_handlechange_float(input.value);
        break
      default:
        break
    }
    setErrors({ ...errors })
  }

  let validateAll = () => {
    let { bill_rate_discount, bill_rate, payRate, effective_from, ot_pay_rate, ot_pay_rate_multiplier } = data
    let errors = {}
    errors.bill_rate = float_validation(bill_rate);
    errors.payRate = validate_emptyField(payRate);
    errors.effective_from = validate_emptyField(effective_from);
    errors.ot_pay_rate = data.ot_pay_rate_config_type == 2 ? float_validation(ot_pay_rate) : '';
    errors.bill_rate_discount = data.bill_rate_discount_type == '' || data.bill_rate_discount_type == null || data.bill_rate_discount_type == undefined ? '' : validates_float(bill_rate_discount);
    errors.ot_pay_rate_multiplier = data.ot_pay_rate_config_type == 3 ? float_validation(ot_pay_rate_multiplier) : '';
    console.log(data.bill_rate_discount_type, "rate");
    return errors
  }

  const handleSubmit = () => {
    let errorsList = validateAll();
    if (isValid(errorsList)) {
      data['request_id'] = LocalStorage.uid()
      data['placement_id'] = placemnetData.id
      PlacementApi.billingDetailsStore(data, LocalStorage.getAccessToken()).then((res) => {
        if (res.data.statusCode === 1003) {
          addSuccessMsg('Billing Details Added Successfully');
          navigate('/placements/addPlacement', { state: { actionState: 'addFlow' } })
        } else {
          addErrorMsg(res.data.message);
        }
      })
    } else {
      let s1 = { errors }
      s1 = errorsList
      setErrors(s1);
      addWarningMsg('Please verify and resubmit the form as some fields have not been filled in or contain invalid data');
    }
  }

  const onNumberOnlyChange = (event) => {
    const keyCode = event.keyCode || event.which
    const keyValue = String.fromCharCode(keyCode)
    const isValid = new RegExp('[0-9.]').test(keyValue)
    if (!isValid) {
      event.preventDefault()
      return
    }
  }

  return (
    <Grid container component={'main'} className={classes.main} pl={{ lg: 15, md: 12, sm: 11, xs: 11 }}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Breadcrumbs aria-label="breadcrumb">
          <Text mediumGrey sx={{ cursor: 'pointer' }} onClick={() => navigate('/placements/dashboard')}>Placement Dashboard</Text>
          <Text mediumGrey sx={{ cursor: 'pointer' }} onClick={() => navigate('/placements')}>All Placements</Text>
          <Text mediumGrey sx={{ cursor: 'pointer' }} onClick={() => navigate('/placements/addPlacement', { state: { actionState: 'cancel' } })}>Add placements</Text>
          <Text mediumBlack>Add Billing Details</Text>
        </Breadcrumbs>
      </Grid>
      <Grid container ml={{ lg: 30, md: 10 }} mr={{ lg: 30, md: 10 }} mt={5} p={3} className={classes.mainCard}>
        <Grid item lg={12} md={12} sm={12} xs={12}><Typography className={classes.breadcrumbsName}>New Billing Details</Typography></Grid>
        <Grid container spacing={{ lg: 3, md: 3, sm: 3, xs: 0 }}>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <Box pt={'10px'}>
              <CustomSelect disabled name='bill_type' value={data.bill_type} commonSelect onChange={changeHandler} label={<Text largeLabel>Bill Rate Type </Text>}
                options={billOptions}
              />
            </Box>

          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12} my={1}>
            <Input
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                name: 'bill_rate',
                value: data.bill_rate,
                inputProps: { maxLength: 7 }
              }}
              handleChange={changeHandler}
              clientInput
              labelText={<Text largeLabel>Bill Rate / Hour</Text>}
            />
            {
              errors.bill_rate ?
                <Text red>{errors.bill_rate ? errors.bill_rate : ''}</Text> : ''
            }
          </Grid>
        </Grid>
        <Grid container spacing={{ lg: 3, md: 3, sm: 3, xs: 0 }}>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <Box pt={'3px'}>
              <CustomSelect name='bill_rate_discount_type' value={data.bill_rate_discount_type} commonSelect onChange={changeHandler} label={<Text largeLabel>Discount Type<span style={{ color: "#C7CCD3" }}>( Optional )</span></Text>}
                options={discountTypeList}
              />
            </Box>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12} >
            <Input
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                name: 'bill_rate_discount',
                value: data.bill_rate_discount
              }}
              handleChange={changeHandler}
              iconText
              clientInput1
              tooltipTitle='If Discount Type is Added bill Discount is Mandatory'
              labelText={<Text largeLabel>Bill Discount{data.bill_rate_discount_type == '' || data.bill_rate_discount_type == null || data.bill_rate_discount_type == undefined ? <span style={{ color: "#C7CCD3" }}> ( Optional )</span> : ''}</Text>}
            />
            {
              errors.bill_rate_discount &&
              <Text red>{errors.bill_rate_discount ? errors.bill_rate_discount : ''}</Text>
            }
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item lg={6} md={6} sm={6} xs={12} my={1}>
            <Input
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                name: 'payRate',
                value: data.payRate,
                disabled: true
              }}
              handleChange={changeHandler}
              clientInput
              labelText={<Text largeLabel>Pay Rate</Text>}
            />
            {/* {
              errors.payRate ?
                <Text red>{errors.payRate ? errors.payRate : ''}</Text> : ''
            } */}
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <Box my={1} >
              <Date
                labelText={<Text largeLabel>Effective From</Text>}
                name='effective_from'
                value={data.effective_from}
                minDate={placemnetData.max_invoice_date}
                maxDate={clntData.end_date}
                onChange={(value => dateChange(value, 'effective_from'))}
                height='54px'
              />
            </Box>
            {
              errors.effective_from ?
                <Text red>{errors.effective_from ? errors.effective_from : ''}</Text> : ''
            }
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item lg={6} md={6} sm={6} xs={12} my={1}>
            <Input
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                name: 'ot_bill_rate',
                value: data.ot_bill_rate,
              }}
              handleChange={changeHandler}
              iconText
              clientInput1
              tooltipTitle='If value is not specified it will take bill rate automatically'
              labelText={<Text largeLabel>OT Bill Rate<span style={{ color: "#C7CCD3" }}>( Optional )</span></Text>}
            />
            {
              errors.ot_bill_rate ?
                <Text red>{errors.ot_bill_rate ? errors.ot_bill_rate : ''}</Text> : ''
            }
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <Box pt={1}>
              <Typography className={classes.breadcrumbsName} >OT Pay Rate Config Type</Typography></Box>
            <RadioGroup
              row
              sx={{
                '& .MuiSvgIcon-root': {
                  fontSize: 18,
                  // color:"#737373"
                },
              }}
              name="ot_pay_rate_config_type"
              value={data.ot_pay_rate_config_type}
              onChange={changeHandler}
              items={otPayRateConfigOptions}
            />
            {
              errors.ot_pay_rate_config_type ?
                <Text red>{errors.ot_pay_rate_config_type ? errors.ot_pay_rate_config_type : ''}</Text> : ''
            }
          </Grid>

        </Grid>
        <Grid container spacing={3}>
          {data.ot_pay_rate_config_type == 3 &&
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <Input
                formControlProps={{
                  fullWidth: true
                }}
                // inputProps={{
                //   name: data.ot_pay_rate_config_type == 1 ? 'payRate' : 'ot_pay_rate',
                //   value: data.ot_pay_rate_config_type == 1 ? data.payRate : data.ot_pay_rate,
                //   disabled: data.ot_pay_rate_config_type == 1 ? 'readonly' : ''
                // }}
                inputProps={{
                  name: 'ot_pay_rate_multiplier',
                  value: data.ot_pay_rate_multiplier,
                }}
                handleChange={changeHandler}
                clientInput
                onKeyPress={onNumberOnlyChange}
                labelText={<Text largeLabel>OT Pay Rate Multiplier</Text>}
              />
              {
                errors.ot_pay_rate_multiplier ?
                  <Text red>{errors.ot_pay_rate_multiplier ? errors.ot_pay_rate_multiplier : ''}</Text> : ""
              }
            </Grid>
          }
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <Input
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                name: 'ot_pay_rate',
                value: data.ot_pay_rate,
                disabled: data.ot_pay_rate_config_type == 2 ? false : true
              }}
              handleChange={changeHandler}
              clientInput
              labelText={<Text largeLabel>OT Pay Rate</Text>}
            />
            {
                errors.ot_pay_rate ?
                  <Text red>{errors.ot_pay_rate ? errors.ot_pay_rate : ''}</Text> : ""
              }
          </Grid>
        </Grid>
      </Grid>
      <Grid container lg={12} md={12} ml={{ lg: 40, md: 10 }} mr={{ lg: 40, md: 10 }} mt={2} justifyContent={"end"}>
        <Stack spacing={3} direction={"row"}>
          <Button popupCancel onClick={() => navigate('/placements/addPlacement', { state: { actionState: 'cancel' } })}>Back</Button>
          <Button popupSaveBlue onClick={handleSubmit} >Save</Button>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default AddBillingDetails


