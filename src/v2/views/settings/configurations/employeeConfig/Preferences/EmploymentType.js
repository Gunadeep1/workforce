import React, { useEffect,useState } from 'react'
import { Box, Grid ,Skeleton} from '@mui/material'
import Text from '../../../../../components/customText/Text';
import MainStyles from '../../MainStyles'
import EmployeeTypesApi from '../../../../../apis/configurations/employee/EmployeeTypesApi';

function EmploymentType({ current }) {

    const classes = MainStyles()
    const [getList, setGetList] = React.useState([]);
    const [loading, setLoading] = useState(true);
   useEffect(()=>{
    setTimeout(() => {
        setLoading(true);
        employementTypeApi()
    },300)
    
   },[])

   const employementTypeApi=()=>{
    setLoading(true);
    EmployeeTypesApi.getAllEmployeeTypes().then((res)=>{
        setTimeout(()=>{
            setLoading(false)
            setGetList(res.data.data)
        },300)
      
    })
   }



    return (
        <Box sx={{
            height: '75vh',
            overflow: 'auto',
            padding: '16px',
        }}>


            <Box className={classes.activeItemBox} >

                <Box className={classes.activeBoxHeading}>
                    <Text blackHeader >{current}</Text>
                </Box>

                {loading ? <>
                   {[1,2,3].map((item, index) => (
                    <Grid container  key={index} mt={3}>
                    <Grid item lg={8}>
                    <Skeleton animation="wave" width="200px" />
                    <Skeleton animation="wave" width="200px" />
      
                    </Grid>
                    <Grid item lg={3}>
                    <Skeleton animation="wave" width="200px" />
                    <Skeleton animation="wave" width="200px" />
      
                    </Grid>
                 </Grid>
                   ))} 
                 
               
                
                </>
                :
                
                getList.map((item, index) => (

                    <Box className={classes.descriptionBoxStyle} key={index}>
                        <Grid container alignItems="center">
                            <Grid item lg={9} md={6} sm={6} xs={12} container direction={'column'} gap={1}>
                                <Text mediumBlackColor>{item.name}</Text>
                                <Text greyLabel>{item.description}</Text>
                            </Grid>
                            <Grid item lg={3} md={3} sm={3} xs={12} container direction={'column'} gap={1}>
                                <Text mediumBlackColor>Created By</Text>
                                <Text greyLabel>{item.created_by}</Text>
                            </Grid>
                        </Grid>
                    </Box>))}
            </Box>
        </Box>)
}

export default EmploymentType;
