import Snack from '@mui/material/Snackbar';
import { makeStyles } from "@mui/styles";
// core components
import styles from './snackbarContentStyle.js'
import PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'
import Text from '../customText/Text.js'
import { Grid, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material';
import Slide from '@mui/material/Slide';
import { Box } from "@mui/material";

const useStyles = makeStyles(styles)

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

export default function Snackbar(props) {
  const classes = useStyles()
  const { message, color, icon, place, renderElement } = props

  const [open, setClose] = React.useState(true)

  const handleClose = (event, reason) => {
    if (reason == 'clickaway') {
      return
    }
    ReactDOM.unmountComponentAtNode(renderElement)
    setClose(false)
  }

  return (
    <Snack
      autoHideDuration={3000}
      TransitionComponent={TransitionUp}
      anchorOrigin={{
        vertical: place.indexOf('t') == -1 ? 'bottom' : 'top',
        horizontal:
          // place.indexOf('l') != -1
          //   ? 'left'
          //   : place.indexOf('c') != -1
          //   ? 'center'
          //   : 
          'right'
      }}
      open={open}
      message={
        <Box>
          <Grid container item lg={12} spacing={1} alignItems="center" className={classes.snackWidth} >
            <Grid container item md={1} xs={2} justifyContent="center">
              {icon}
            </Grid>
            <Grid item md={10} xs={8}>
              <Text>{message}</Text>
            </Grid>
            <Grid container item md={1} xs={2} justifyContent="flex-end">
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
              >
                <Close fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
        </Box>

      }
      ContentProps={{
        classes: {
          message: classes.message,
          root: classes.root + ' ' + classes[color],
        },
      }}
      onClose={handleClose}
    />
  )
}

Snackbar.propTypes = {
  message: PropTypes.node.isRequired,
  color: PropTypes.oneOf([
    'info',
    'success',
    'warning',
    'danger',
    'primary',
    'black',
  ]),
  close: PropTypes.bool,
  icon: PropTypes.object,
  place: PropTypes.oneOf(['tl', 'tr', 'tc', 'br', 'bl', 'bc']),
  rtlActive: PropTypes.bool,
  closeNotification: PropTypes.func,
}
