import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import addIcon from '../../assets/employee/AccordianAdd.svg';
import downArrow from '../../assets/svg/Down-arrow.svg';
import { makeStyles } from '@mui/styles';

const AccordianStyles = makeStyles(() => ({
    addIcon: {
        height: '40px !important',
        width: '40px !important'
    },
    arrow: {
        height: '17px !important',
        width: '17px !important',
    },
    edit: {
        height: '35px !important',
        width: '35px !important'
    }
}))

function CustomAccordion({ expanded, handlechangeaccordion, AccordionHeader, children, icon }) {
    const classes = AccordianStyles();
    return (
        <Accordion expanded={expanded} onChange={handlechangeaccordion} sx={{ boxShadow: '5px 5px 10px 0px #0000000D !important', borderRadius: '10px !important', width: '100% !important' }}>
            <AccordionSummary
                expandIcon={icon == 1 ? <img src={addIcon} alt='add' className={classes.addIcon} /> : icon == 2 ? <img src={downArrow} alt='downArrow' className={classes.arrow} /> : icon == 3 ? '' : ''}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{ height: '85px !important', padding: icon == 1 ? '0px 30px' : icon == 2 ? '0px 30px' : '0px 30px 0px 30px' }}
            >
                {AccordionHeader}
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    )
}

export default CustomAccordion