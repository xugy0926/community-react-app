import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'

const styles = theme => ({
  container: {
    position: 'fixed',
    top: 0,
    bottom: 'auto',
    marginBottom: 50
  },
  grow: {
    flex: 1
  }
})

const Left = ({ onBack }) => {
  return onBack ? (
    <IconButton color="inherit" aria-label="Back" onClick={onBack}>
      <KeyboardArrowLeftIcon />
    </IconButton>
  ) : (
    <React.Fragment />
  )
}

const Right = ({ onSave }) => {
  return onSave ? (
    <Button color="inherit" onClick={onSave}>
      保存
    </Button>
  ) : (
    <React.Fragment />
  )
}

const Title = ({ classes, title }) => {
  return title ? (
    <Typography variant="h6" color="inherit" className={classes.grow}>
      {title}
    </Typography>
  ) : (
    <React.Fragment />
  )
}

const Header = props => {
  const { classes } = props
  
  return (
    <AppBar className={classes.container}>
      <Toolbar>
        {Left(props)}
        {Title(props)}
        {Right(props)}
      </Toolbar>
    </AppBar>
  )
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Header)
