import React from "react";
import Input from '../../../components/input/Input';
import Text from "../../../components/customText/Text";
import { Box } from '@mui/material';


function I94Fields(props) {
    const { i94Fields, changeHandler, dateChange, Date } = props;

    return (
        <>
            <Input
                formControlProps={{
                    fullWidth: true,
                }}
                inputProps={{
                    name: 'i_94_number',
                    value: i94Fields.i_94_number,
                }}
                clientInput
                handleChange={changeHandler}
                labelText={<Text largeLabel>I-94 Number</Text>}
            />
            <Input
                formControlProps={{
                    fullWidth: true,
                }}
                inputProps={{
                    name: 'country_of_origin',
                    value: i94Fields.country_of_origin,

                }}
                handleChange={changeHandler}
                clientInput
                labelText={<Text largeLabel>Country of Origin</Text>}
            />
            <Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
                <Date
                    labelText={<Text largeLabel>Date Of Issue</Text>}
                    value={i94Fields.date_of_issue}
                    name='date_of_issue'
                    onChange={(value) => dateChange(value, 'date_of_issue')}
                    height='56px'
                />
                <Date
                    labelText={<Text largeLabel>Date Of Expiry</Text>}
                    value={i94Fields.date_of_expiry}
                    name='date_of_expiry'
                    onChange={(value) => dateChange(value, 'date_of_expiry')}
                    height='56px'
                />
            </Box>
        </>
    );

};

export default I94Fields;