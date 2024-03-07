import React from "react";
import Input from '../../components/input/Input';
import SearchSelect from '../../components/selectField/SearchSelect';
import Text from "../../components/customText/Text";


function CopyVoidChequeFields(props) {

    const { copyVoidChequeFields, changeHandler } = props;

    return (
        <>
            <Input
                formControlProps={{
                    fullWidth: true,
                }}
                inputProps={{
                    name: 'account_number',
                    value: copyVoidChequeFields.account_number,

                }}
                clientInput
                handleChange={changeHandler}
                labelText={<Text largeLabel>Account Number</Text>}
            />

            <Input
                formControlProps={{
                    fullWidth: true,
                }}
                inputProps={{
                    name: 'routing_number',
                    value: copyVoidChequeFields.routing_number,

                }}
                handleChange={changeHandler}
                clientInput
                labelText={<Text largeLabel>Routing Number</Text>}
            />

            <Input
                formControlProps={{
                    fullWidth: true,
                }}
                inputProps={{
                    name: 'bank_name',
                    value: copyVoidChequeFields.bank_name,

                }}
                handleChange={changeHandler}
                clientInput
                labelText={<Text largeLabel>Bank Name</Text>}
            />
            <SearchSelect
                name='account_type'
                value={copyVoidChequeFields.account_type}
                onChange={changeHandler}
                options={[{ id: "savings", value: "Savings" }, { id: "current", value: "Current" }]}
                labelText={<Text largeLabel>Account Type</Text>}
            />
        </>
    );
}

export default CopyVoidChequeFields;
