import React from "react";
import Input from '../../components/input/Input';
import Text from "../../components/customText/Text";
import { Box } from '@mui/material';


function EducationalDocumentFields(props) {
    const { educationalDocumentFields , changeHandler, dateChange, Date } = props;

    return (
        <>
            <Input
                formControlProps={{
                    fullWidth: true,
                }}
                inputProps={{
                    name: 'field_of_study',
                    value: educationalDocumentFields.field_of_study,

                }}
                clientInput
                handleChange={changeHandler}
                labelText={<Text largeLabel>Field Of Study</Text>}
            />
            <Input
                formControlProps={{
                    fullWidth: true,
                }}
                inputProps={{
                    name: 'university_name',
                    value: educationalDocumentFields.university_name,

                }}
                clientInput
                handleChange={changeHandler}
                labelText={<Text largeLabel>University Name</Text>}
            />

            <Input
                formControlProps={{
                    fullWidth: true,
                }}
                inputProps={{
                    name: 'education_level',
                    value: educationalDocumentFields.education_level,
                }}
                clientInput
                handleChange={changeHandler}
                labelText={<Text largeLabel>Education Level</Text>}
            />
            <Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
                <Date
                    labelText={<Text largeLabel>Start Date</Text>}
                    value={educationalDocumentFields.start_date}
                    name='start_date'
                    onChange={(value) => dateChange(value, 'start_date')}
                    height='56px'
                />
                <Date
                    labelText={<Text largeLabel>End Date</Text>}
                    value={educationalDocumentFields.end_date}
                    name='end_date'
                    onChange={(value) => dateChange(value, 'end_date')}
                    height='56px'
                />
            </Box>

            <Input
                formControlProps={{
                    fullWidth: true,
                }}
                inputProps={{
                    name: 'country',
                    value: educationalDocumentFields.country,
                }}
                clientInput
                handleChange={changeHandler}
                labelText={<Text largeLabel>Country</Text>}
            />

            <Input
                formControlProps={{
                    fullWidth: true,
                }}
                inputProps={{
                    name: 'state',
                    value: educationalDocumentFields.state,
                }}
                clientInput
                handleChange={changeHandler}
                labelText={<Text largeLabel>State</Text>}
            />

        </>
    );

};

export default EducationalDocumentFields;