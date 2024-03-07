import React from 'react'
import { FormControl, RadioGroup as MuiRadioGroup, FormControlLabel, Radio } from '@mui/material';
/* fun starts here */
export default function RadioGroup(props) {

    const { name, value, onChange, items,fontSize } = props;
    /**
     * function is for group of radio buttons or single radio button also
     * ------------------------------------------------------------------
     * @def name :- is for event target purpose excepted type `string`
     * @def value:- is for what is the value of radio button excepted type `string`
     * @def onChange :- for onchange functionality excepted type `function`
     * @def items :- who must pass an object type of data excepted type `Array of objects or objects`
     * 
     * >>>>>example
     * -------------
     * const statusItems = [
     * { id: 'active', title: 'Active' },
     * { id: 'inActive', title: 'In-Active' },
     * ]
     * -------------
     * if it's single radio button just you have to pass object
     * >>>>>example
     * const statusItems ={id: 'active', title: 'Active'}
     * */

    return (
        <FormControl>
            <MuiRadioGroup
                {...props}
                name={name}
                value={value}
                onChange={onChange}

            >
                {
                    items.map(
                        item => (
                            <FormControlLabel
                                disabled={props.disabled ? props.disabled : false}
                                key={item.id}
                                value={item.value}
                                control={
                                    <Radio sx={{
                                        '& .MuiSvgIcon-root': {
                                            fontSize: fontSize ? fontSize : 18,
                                        },
                                    }} />}
                                label={item.title}
                            />
                        )
                    )
                }
            </MuiRadioGroup>
        </FormControl>
    )
}

