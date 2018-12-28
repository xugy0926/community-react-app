import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Fab from '@material-ui/core/Fab'
import FavoriteIcon from '@material-ui/icons/Favorite'
import AddIcon from '@material-ui/icons/Add'
import UserAvatar from '../Components/UserAvatar'

import { currentUserName, login, footer } from '../redux/selectors'

const styles = theme => ({
  container: {
    position: 'fixed',
    top: 'auto',
    bottom: 0
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto'
  }
})

const Footer = ({ classes, currentUserName, footer }) => {
  const { onAdd, onMy, onFavorite } = footer

  return (
    <AppBar color="primary" className={classes.container}>
      <Toolbar className={classes.toolbar}>
        {onFavorite ? (
          <IconButton color="inherit" aria-label="Open drawer">
            <FavoriteIcon onClick={onFavorite}/>
          </IconButton>
        ) : (
          <div />
        )}
        {onAdd ? (
          <Fab color="secondary" aria-label="Add" className={classes.fabButton}>
            <AddIcon onClick={onAdd} />
          </Fab>
        ) : (
          <React.Fragment />
        )}
        <IconButton color="inherit" onClick={onMy}>
          <UserAvatar char={currentUserName.substr(0, 1)} />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired
}

export default connect(state => {
  return { currentUserName: currentUserName(state), login: login(state), footer: footer(state) }
})(withStyles(styles)(Footer))
