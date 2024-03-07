import React from "react";
import Input from '../../../components/input/Input';
import Text from "../../../components/customText/Text";
import { Box } from '@mui/material';


function WorkAuthorizationFields(props) {
    const { workAuthorizationFields, changeHandler,dateChange,Date } = props;

    return (
        <>
            { /* <SearchSelect
                name='visa_type'
                value={1}
                options={[{ id: 1, value: "H1-b" }, { id: 2, value: "H1-c" }]}
                labelText={<Text largeLabel>Visa Type</Text>}
            />*/}
            <Input
                formControlProps={{
                    fullWidth: true,
                }}
                inputProps={{
                    name: 'visa_type',
                    value: workAuthorizationFields.visa_type,

                }}
                clientInput
                handleChange={changeHandler}
                labelText={<Text largeLabel>Visa Type</Text>}
            />

            <Input
                formControlProps={{
                    fullWidth: true,
                }}
                inputProps={{
                    name: 'visa_number',
                    value: workAuthorizationFields.visa_number,

                }}
                clientInput
                handleChange={changeHandler}
                labelText={<Text largeLabel>Visa Number</Text>}
            />
            <Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
                <Date
                    labelText={<Text largeLabel>Date of Issue</Text>}
                    value={workAuthorizationFields.date_of_issue}
                    name='date_of_issue'
                    onChange={(value) => dateChange(value, 'date_of_issue')}
                    height='56px'
                />
                <Date
                    labelText={<Text largeLabel>Date of Expense</Text>}
                    value={workAuthorizationFields.date_of_expiry}
                    name='date_of_expiry'
                    onChange={(value) => dateChange(value, 'date_of_expiry')}
                    height='56px'
                />
            </Box>
        </>
    );

}

export default WorkAuthorizationFields;