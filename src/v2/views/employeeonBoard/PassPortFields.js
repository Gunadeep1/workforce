import React from "react";
import Input from '../../components/input/Input';
import Text from "../../components/customText/Text";
import { Box } from '@mui/material';

function PassPortFields(props) {
    const { passportFields, dateChange, changeHandler, Date } = props;

    return (
        <>
            <Input
                formControlProps={{
                    fullWidth: true,
                }}
                inputProps={{
                    name: 'passport_number',
                    value: passportFields.passport_number,

                }}
                handleChange={changeHandler}
                clientInput
                labelText={<Text largeLabel>Passport Number</Text>}
            />

            <Input
                formControlProps={{
                    fullWidth: true,
                }}
                inputProps={{
                    name: 'issued_country',
                    value: passportFields.issued_country,

                }}
                handleChange={changeHandler}
                clientInput
                labelText={<Text largeLabel>Issued Country</Text>}
            />
            <Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
                <Date
                    labelText={<Text largeLabel>Date of Issue</Text>}
                    value={passportFields.date_of_issue}
                    name='date_of_issue'
                    onChange={(value) => dateChange(value, 'date_of_issue')}
                    height='56px'
                />
                <Date
                    labelText={<Text largeLabel>Date of Expense</Text>}
                    value={passportFields.date_of_expiry}
                    name='date_of_expiry'
                    onChange={(value) => dateChange(value, 'date_of_expiry')}
                    height='56px'
                />
            </Box>
        </>
    );

};

export default PassPortFields;