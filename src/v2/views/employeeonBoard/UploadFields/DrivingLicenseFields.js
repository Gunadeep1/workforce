import React from "react";
import Input from '../../../components/input/Input';
import SearchSelect from '../../../components/selectField/SearchSelect';
import Text from "../../../components/customText/Text";


function DrivingLicenseFields(props) {
    const { stateList, countryList ,drivingLicenseFields, changeHandler } = props;

    return (
        <>
            <Input
                formControlProps={{
                    fullWidth: true,
                }}
                inputProps={{
                    name: 'document_number',
                    value: drivingLicenseFields.document_number,

                }}
                clientInput
                handleChange={changeHandler}
                labelText={<Text largeLabel>Document Number</Text>}
            />
            <Input
                formControlProps={{
                    fullWidth: true
                }}
                inputProps={{
                    name: 'address_line_1',
                    value: drivingLicenseFields.address_line_1
                }}
                clientInput
                handleChange={changeHandler}
                labelText={<Text largeLabel>Address Line 1</Text>}
            />
            <Input
                formControlProps={{
                    fullWidth: true
                }}
                inputProps={{
                    name: 'address_line_2',
                    value: drivingLicenseFields.address_line_2
                }}
                clientInput
                handleChange={changeHandler}
                labelText={<Text largeLabel>Address Line 2</Text>}
            />
            <SearchSelect
                name='country'
                value={drivingLicenseFields.country}
                onChange={changeHandler}
                options={countryList}
                labelText={<Text largeLabel>Country</Text>}
            />
            <SearchSelect
                name='state'
                value={drivingLicenseFields.state}
                onChange={changeHandler}
                options={stateList}
                labelText={<Text largeLabel>State</Text>}
            />
            <Input
                formControlProps={{
                    fullWidth: true
                }}
                inputProps={{
                    name: 'zipcode',
                    value: drivingLicenseFields.zipcode,
                    disabled: drivingLicenseFields.country === ''
                }}
                handleChange={changeHandler}
                clientInput
                labelText={<Text largeLabel>Zipcode</Text>}
            />
        </>
    )

}

export default DrivingLicenseFields;