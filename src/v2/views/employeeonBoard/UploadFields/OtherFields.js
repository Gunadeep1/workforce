import React from "react";
import Input from '../../../components/input/Input';
import Text from "../../../components/customText/Text";

function OtherFields(props) {
    const { otherFields , changeHandler } = props;

    return (
        <>
            <Input
                formControlProps={{
                    fullWidth: true,
                }}
                inputProps={{
                    name: 'document_category',
                    value: otherFields.document_category,

                }}
                clientInput
                handleChange={changeHandler}
                labelText={<Text largeLabel>Document Category</Text>}
            />

            <Input
                formControlProps={{
                    fullWidth: true,
                }}
                inputProps={{
                    name: 'document_name',
                    value: otherFields.document_name,
                }}
                handleChange={changeHandler}
                clientInput
                labelText={<Text largeLabel>Document Name</Text>}
            />
        </>
    );
};

export default OtherFields;