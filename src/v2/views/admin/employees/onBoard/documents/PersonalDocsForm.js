import { Grid, Box } from '@mui/material'
import React from 'react'
import SearchSelect from '../../../../../components/selectField/SearchSelect'
import Input from '../../../../../components/input/Input'
import Text from '../../../../../components/customText/Text'
import Button from '../../../../../components/customButton/Button'
import FileInput from '../../../../../components/muiFileInput/FileInput'
import Date from '../../../../../components/datePicker/Date'
import { useEffect } from 'react'
import CustomSelect from '../../../../../components/customSelect/CustomSelect'
import moment from 'moment'
import { dateFormat } from '../../../../../utils/utils'

function PersonalDocsForm({ state, changeHandler, dateChange, edit, error, handleSubmit, docsList, drpData, setState, docError, action, expanded, setExpanded, setAddExpand, addExpand, data, setEditAccIcon, uploadDocs, setEdit }) {
  const statusList = require('../../../../../utils/jsons/Status.json');


  const cancel = () => {
    if (action == 'view') {
      setExpanded(!expanded);
      // setAddExpand(true)
      setEdit(!edit)
   
    } else if (action == 'addNew') {
      setAddExpand(!addExpand);
      setEditAccIcon(2)
     
    }
  }

  const deleteDoc = (args) => {
    state.documents[args].new_document_id = ''
    state.documents[args].document_name = ''
    setState({ ...state })
  }

  useEffect(() => {
    console.log(state,"state")
    console.log(data,"data")
    if (data != undefined || data != null) {
      setState({
        ...state,
        id: data.id,
        document_type_id: data.document_type_id,
        valid_from: data.valid_from,
        valid_till: data.valid_till,
        document_number: data.document_number,
        status: data.status,
        documents: data.documents
      })
     
    }
    // eslint-disable-next-line
  }, [])

  return (
    <Grid container lg={12} spacing={2} columnSpacing={3} pt={2}>
      {
        (drpData && drpData.upload_display) && state.documents.map((item, index) => (
          <Grid item lg={12} pb={1}>
            <Box pt={'9px'}>
              <FileInput
                name='new_document_id'
                handleChange={(e) => uploadDocs(e, index)}
                FileName={item.document_name ? item.document_name : ''}
                actionState={item.document_name ? 1 : ''}
                handleDelete={() => deleteDoc(index)}
                label={<Text largeLabel>Update Document</Text>}
                isDisabled={!edit}
                disabled={!edit}

              />
            </Box>
            {drpData.upload_mandatory && docError && docError.length > 0 ? (
              <Text red>{docError[index] ? docError[index].new_document_id : ''}</Text>
            ) : (
              ""
            )}
          </Grid>
        ))
      }
      <Grid item lg={6}>
        {/* <Box pt={'9px'}> */}
        <SearchSelect
          name='document_type_id'
          value={state.document_type_id}
          onChange={changeHandler}
          options={docsList}
          labelText={<Text largeLabel>Document Type</Text>}
          disabled={!edit}
        />
        {/* </Box> */}
        {error.document_type_id && <Text red>{error.document_type_id ? error.document_type_id : ''}</Text>}
        
      </Grid>
      {(drpData && drpData.number_display) &&
        <Grid item lg={6}>
          <Input
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              name: 'document_number',
              value: state.document_number,
              disabled: !edit
            }}
            handleChange={changeHandler}
            clientInput
            labelText={<Text largeLabel>Document Number</Text>}
          />
          {drpData.number_mandatory == true && <Text red>{error.document_number ? error.document_number : ''}</Text>}
        </Grid>
      }
      {
        (drpData && drpData.valid_from_display) &&
        <Grid item lg={6}>
          <Box pt={'9px'}>
            <Date
              labelText={<Text largeLabel>Valid From</Text>}
              name='valid_from'
              maxDate={moment().format(dateFormat())}
              value={state.valid_from}
              onChange={(value) => dateChange(value, 'valid_from')}
              height='56px'
              disabled={!edit}
            />
          </Box>
          {error.valid_from && drpData.valid_from_mandatory && <Text red>{error.valid_from ? error.valid_from : ''}</Text>}
        </Grid>
      }
      {
        (drpData && drpData.valid_to_display) &&
        <Grid item lg={6}>
          <Box pt={'9px'}>
            <Date
              labelText={<Text largeLabel>Valid To</Text>}
              name='valid_till'
              value={state.valid_till}
              minDate={state.valid_from}
              onChange={(value) => dateChange(value, 'valid_till')}
              height='56px'
              disabled={!edit}
            />
          </Box>
          {drpData.valid_to_mandatory && error.valid_till && <Text red>{error.valid_till ? error.valid_till : ''}</Text>}
        </Grid>
      }
      {
        (drpData && drpData.status_display) &&
        <Grid item lg={6}>
          <Box pt={'9px'}>
            <CustomSelect name='status' disabled={!edit} commonSelect value={state.status} options={statusList} onChange={changeHandler} label={<Text largeLabel>Status</Text>} />
          </Box>
          {error.status && drpData.status_mandatory && <Text red>{error.status ? error.status : ''}</Text>}
        </Grid>
      }
      {
        ((edit || action === 'addNew') && action !== 'new') &&
        <Grid item container m={'25px 0px 10px 0px'}>
          <Grid item lg={6}>
            <Button blackCancel onClick={cancel}>Cancel</Button>
          </Grid>
          <Grid item lg={6} textAlign='end'>
            <Button brownMnSave onClick={() => handleSubmit(action === 'addNew' ? '' : data.id)}>Save</Button>
          </Grid>
        </Grid>
      }
    </Grid >
  )
}

export default PersonalDocsForm