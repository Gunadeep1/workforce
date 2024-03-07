import { Grid, Box } from '@mui/material'
import React from 'react'
import SearchSelect from '../../../../../components/selectField/SearchSelect'
import Input from '../../../../../components/input/Input'
import Text from '../../../../../components/customText/Text'
import Button from '../../../../../components/customButton/Button'
import Date from '../../../../../components/datePicker/Date'
import FileInput from '../../../../../components/muiFileInput/FileInput'
import moment from 'moment'
import { dateFormat } from '../../../../../utils/utils'
import { useEffect } from 'react'

function EducationForm(props) {
    const { education, data, edc, error, changeHandler, countries, states, setEducation, action, setEditAccIcon, setAddExpand, addExpand, edit, expanded, setExpanded, dateChange, setEdit } = props;

    const cancel = () => {
        console.log(addExpand,"out")
        if (action == 'view') {
            // setAddExpand(true);
            setEdit(!edit)
            setExpanded(!expanded);
        } else if (action == 'addNew') {
            console.log(addExpand,"addNew")
            setAddExpand(!addExpand);
            setEditAccIcon(2);
        }
    }

    useEffect(() => {
        // if (action == 'addNew') {
        //     setEducation({
        //         education_level_id: '',
        //         field_of_study: '',
        //         state_id: '',
        //         country_id: '',
        //         university_name: '',
        //         start_date: '',
        //         end_date: '',
        //         documents: [
        //             {
        //                 name: '',
        //                 id: '',
        //                 description: '',
        //                 new_document_id: ''
        //             }
        //         ]
        //     })
        // } else {
        if (data != undefined || data != null) {
            setEducation({
                ...education,
                id: data.id,
                education_level_id: data.education_level_id,
                field_of_study: data.field_of_study,
                state_id: data.state_id,
                country_id: data.country_id,
                university_name: data.university_name,
                start_date: data.start_date,
                end_date: data.end_date,
                documents: data.documents
            })
        }
        // }
        // eslint-disable-next-line
    }, [data, edit, action])

    const deleteDoc = (args) => {
        education.documents[args].new_document_id = ''
        education.documents[args].name = ''
        setEducation({ ...education })
      }


    return (
        <Grid container lg={12} spacing={2} columnSpacing={2}>
            {
                education.documents.map((item, index) => (
                    <Grid item lg={12} m={'8px 0px'}>
                        <Box pt={'9px'}>
                            <FileInput
                                name='new_document_id'
                                actionState={item.name ? 1 : ''}
                                handleDelete={() => deleteDoc(index)}
                                FileName={item.name ? item.name : ''}
                                handleChange={(e) => changeHandler(e, index, 'visadocs')}
                                label={<Text largeLabel>Educational Certification</Text>}
                                disabled={!edit}
                                isDisabled={!edit}
                            />
                        </Box>
                    </Grid>
                ))
            }
            <Grid item lg={6}>
                <Box pt={'8px'}>
                    <SearchSelect
                        name='education_level_id'
                        value={education.education_level_id}
                        onChange={changeHandler}
                        options={edc}
                        labelText={<Text largeLabel>Education Level</Text>}
                        disabled={!edit}
                    />
                    {error.education_level_id && <Text red>{error.education_level_id ? error.education_level_id : ''}</Text>}
                </Box>
            </Grid>
            <Grid item lg={6}>
                <Box pt={'8px'}>
                    <Input
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            name: 'university_name',
                            value: education.university_name,
                            disabled: !edit
                        }}
                        handleChange={changeHandler}
                        clientInput
                        labelText={<Text largeLabel>University Name</Text>}
                    />
                    {error.university_name && <Text red>{error.university_name ? error.university_name : ''}</Text>}
                </Box>
            </Grid>
            <Grid item lg={6}>
                <Box pt={'8px'}>
                    <Input
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            name: 'field_of_study',
                            value: education.field_of_study,
                            disabled: !edit
                        }}
                        handleChange={changeHandler}
                        clientInput
                        labelText={<Text largeLabel>Field of Study</Text>}
                    />
                    {error.field_of_study && <Text red>{error.field_of_study ? error.field_of_study : ''}</Text>}
                </Box>
            </Grid>
            <Grid item lg={3}>
                <Box pt={'8px'}>
                    <Date
                        labelText={<Text largeLabel>Start Date</Text>}
                        name='start_date'
                        value={education.start_date}
                        maxDate={moment().format(dateFormat())}
                        onChange={(value) => dateChange(value, 'start_date')}
                        height='56px'
                        disabled={!edit}
                    />
                    {error.start_date && <Text red>{error.start_date ? error.start_date : ''}</Text>}
                </Box>
            </Grid>
            <Grid item lg={3}>
                <Box pt={'8px'}>
                    <Date
                        labelText={<Text largeLabel>End Date</Text>}
                        name='end_date'
                        value={education.end_date}
                        minDate={education.start_date}
                        onChange={(value) => dateChange(value, 'end_date')}
                        height='56px'
                        disabled={!edit}
                    />
                    {error.end_date && <Text red>{error.end_date ? error.end_date : ''}</Text>}
                </Box>
            </Grid>
            <Grid item lg={6}>
                <Box pt={'9px'}>
                    <SearchSelect
                        name='country_id'
                        value={education.country_id}
                        onChange={changeHandler}
                        options={countries}
                        labelText={<Text largeLabel>Country</Text>}
                        disabled={!edit}
                    />
                    {error.country_id && <Text red>{error.country_id ? error.country_id : ''}</Text>}
                </Box>
            </Grid>
            <Grid item lg={6}>
                <Box pt={'9px'}>
                    <SearchSelect
                        name='state_id'
                        value={education.state_id}
                        onChange={changeHandler}
                        options={states}
                        labelText={<Text largeLabel>State</Text>}
                        disabled={!edit}
                    />
                    {error.state_id && <Text red>{error.state_id ? error.state_id : ''}</Text>}
                </Box>
            </Grid>
            {
                ((edit || action === 'addNew') && action !== 'new') &&
                <Grid item container m={'25px 0px 10px 0px'}>
                    <Grid item lg={6}>
                        <Button blackCancel onClick={cancel}>Cancel</Button>
                    </Grid>
                    <Grid item lg={6} textAlign='end'>
                        <Button brownMnSave onClick={() => props.handleSubmit(action === 'addNew' ? '' : data.id)}>Save</Button>
                    </Grid>
                </Grid>
            }
        </Grid>
    )
}

export default EducationForm