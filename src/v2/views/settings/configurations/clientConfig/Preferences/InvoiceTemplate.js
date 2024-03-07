import React, {useState} from 'react'
import { Box,Grid } from '@mui/material'
import Text from '../../../../../components/customText/Text';
import { ReactComponent as RemoveIcon } from '../../../../../assets/svg/ChipClose.svg'
import Input from '../../../../../components/input/Input';
import Button from '../../../../../components/customButton/Button';
import CustomSelect from '../../../../../components/customSelect/CustomSelect';
import MainStyles from '../../MainStyles'
import ChipField from '../../../../../components/chipField/ChipField';

function InvoiceTemplate({ current }) {

    const classes = MainStyles();
    const [cards, setCards] = useState([1,2]);

    // const addNewCard = () => {
    //     setCards((prevCards) => [...prevCards, { id: prevCards.length + 1 }]);
    // };

    const removeCard = (id) => {
        setCards((prevCards) => prevCards.filter((card) => card.id !== id));
    };

    const labels = ['BCC Mails', 'CC Mails']


    const options = [
        { title: 'Ravi', year: 1994 },
        { title: 'Ram', year: 1972 },
        { title: 'Vishal Raj', year: 1974 },
        { title: 'Abhi', year: 2008 },
        { title: 'Rahul Raj', year: 1957 },
    ];




    return (
        <Box sx={{
            height: '75vh',
            overflow: 'auto',
            padding: '16px',
        }}>


            <Box className={classes.activeItemBox2} >

                <Box><Text RegularBlack1 >Add Invoice Template</Text></Box>

                <Box className={classes.chipContainerMain}>
                    {cards.map((card, index) => (
                        <Box key={card.id} className={classes.mainDiv} mb={`${index ==0 ? '28px' : '10px' }`}>
                            <Grid container>
                                <Grid item lg={11} md={11} sm={11} xs={11}>
                                    <ChipField
                                        options={options}
                                        labelText={labels[index]}
                                    />
                                </Grid>
                                <Grid container item lg={1} md={1} sm={1} xs={1} alignItems={'center'}>
                                    {card.id > 1 ? <Box sx={{ cursor: 'pointer' }} pt={1} pl={1}><RemoveIcon onClick={() => removeCard(card.id)} /></Box> : null}
                                </Grid>
                            </Grid>
                        </Box>
                    ))}

                </Box>


                <Box ><Text RegularBlack1 >Add Description</Text></Box>
                <Box>
                    <Grid container rowSpacing={'28px'} py={'28px'}>
                        <Grid container item lg={12} md={12} sm={12} xs={12} columnSpacing={{
                            lg: 5,
                            md: 2
                        }}>
                            <Grid item lg={4} md={4} sm={6} xs={12}>

                                <CustomSelect
                                    commonSelect
                                    label={'Text'}
                                    // options={''}
                                    name='text'
                                // value={''}
                                // onChange={handleChange}
                                ></CustomSelect>

                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={12}>

                                <CustomSelect
                                    commonSelect
                                    label={'Text'}
                                    // options={''}
                                    name='text'
                                ></CustomSelect>

                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={12}>
                                <Box>
                                    <Button outlineBlue1>Add New</Button>
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Input
                                formControlProps={{
                                    fullWidth: true
                                }}

                                inputProps={{
                                    // name: 'bankName',
                                    // value: '',
                                    type: 'text',
                                    disabled: false,
                                }}
                                // handleChange={handleChange}
                                clientInput
                                labelText={'Subject'}
                            />

                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Input
                    formControlProps={{
                      fullWidth: true
                    }}
                    multiline={true}
                    rows={3}

                    inputProps={{
                      // name: 'bankName',
                      // value: '',
                      type: 'text',
                      disabled:false,
                    }}
                    // handleChange={handleChange}
                    descriptionFormControl
                    descriptionInput
                    labelText={'Template'}
                    placeholder={'Type Something'}
                  />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Box display={'flex'} justifyContent={'end'} gap={'16px'} mt={'22px'}>
                <Button cancelSm >Cancel</Button>
                <Button saveSm>Save</Button>
            </Box>
        </Box>)
}

export default InvoiceTemplate;
