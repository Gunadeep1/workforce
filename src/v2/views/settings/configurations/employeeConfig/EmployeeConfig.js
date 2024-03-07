import React, { useState } from 'react'
import { Box, ListItemButton, Grid } from '@mui/material';
import MainStyles from '../MainStyles';
import EmploymentType from './Preferences/EmploymentType';
import EmploymentCategory from './Preferences/EmploymentCategory';
import Department from './Preferences/Department';
import Team from './Preferences/Team';
import PersonalDocuments from './Preferences/PersonalDocuments';
import Text from '../../../../components/customText/Text';
import RelationshipType from './Preferences/RelationshipType';
import EducationLevel from './Preferences/EducationLevel';
import Skills from './Preferences/Skills';
import OnboardingDocuments from './Preferences/OnboardingDocuments';
import WorkAuthorization from './Preferences/workAuthorization/WorkAuthorization';
import OffboardingChecklist from './Preferences/OffboardingChecklist';





const prefernces = ['Employment Type', 'Employment Category', 'Department', 'Team',
    'Personal Documents', 'Onboarding Documents','Offboarding Checklist' , 'Work Authorization',
    'Skills', 'Education Level', 'Relationship Type'];

function EmployeeConfig() {
    const classes = MainStyles()

    const [current, setCurrent] = useState("Employment Type");

    return (
        <Box display={'flex'} justifyContent={'center'} width={'100%'}>
            <Box padding={'20px 0px 0px 0px'} width={{ sm: '95%', md: '85%', lg: '85%' }}>
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} >
                    <Grid item lg={4} md={4} sm={4} xs={12}>
                        <Box  className={classes.mainListBox} >
                            <Box className={classes.prefTitle}>

                                <Text blackHeader>Preference</Text>

                            </Box>
                            <Box className={classes.listContainer} sx={{ maxHeight: '60vh' }}> 

                                {
                                    prefernces.map((item, key) => (
                                        <ListItemButton
                                            key={key}
                                            className={`${classes.listItems} ${current === item ? classes.listItemsActive : null}`}
                                            onClick={() => setCurrent(item)} >
                                            {item}
                                        </ListItemButton>
                                    ))
                                }
                                
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item lg={8} md={8} sm={8} xs={12}>

                        <Box >
                            {
                                current === "Employment Type" ? <EmploymentType current={current} /> : null
                            }
                            {
                                current === "Employment Category" ? <EmploymentCategory current={current} /> : null
                            }
                            {
                                current === "Department" ? <Department current={current} /> : null
                            }
                            {
                                current === "Team" ? <Team current={current} /> : null
                            }
                            {
                                current === "Personal Documents" ? <PersonalDocuments current={current} /> : null
                            }
                            {
                                current === "Relationship Type" ? <RelationshipType current={current} /> : null
                            }
                            {
                                current === "Education Level" ? <EducationLevel current={current} /> : null
                            }
                            {
                                current === "Onboarding Documents" ? <OnboardingDocuments current={current} /> : null
                            }
                            {
                                current === "Offboarding Checklist" ? <OffboardingChecklist current={current} /> : null
                            }
                            {
                                current === "Skills" ? <Skills current={current} /> : null
                            }
                            {
                                current === "Work Authorization" ? <WorkAuthorization current={current} /> : null
                            }
                        </Box>

  

                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default EmployeeConfig;
