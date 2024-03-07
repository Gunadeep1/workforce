import { Grid } from '@mui/material'
import React from 'react'
import notFound from '../assets/svg/404.png';
import Text from '../components/customText/Text'

function NotAllowedPage() {
    return (
        <Grid container alignItems="center" justifyContent={"center"}>
            <Grid item md={12} xs={12} textAlign={"center"}>
                <img src={notFound} alt="page not found" />
            </Grid>
            <Text title>Page not found/You are not allowed for this page</Text>
        </Grid>
    )
}

export default NotAllowedPage
