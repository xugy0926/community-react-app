import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import InputBase from '@material-ui/core/InputBase'
import { fade } from '@material-ui/core/styles/colorManipulator'
import SearchIcon from '@material-ui/icons/Search'
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
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200
      }
    }
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

const Search = ({ onSearch, classes }) => {
  return onSearch ? (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        onKeyDown={onSearch}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput
        }}
      />
    </div>
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
        <div className={classes.grow} />
        {Right(props)}
        {Search(props)}
      </Toolbar>
    </AppBar>
  )
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Header)
