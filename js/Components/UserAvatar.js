import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'
import Avatar from '@material-ui/core/Avatar'
import AccountCircle from '@material-ui/icons/AccountCircle'

const styles = () => ({
  avatar: {
    width: 24,
    height: 24
  },
  charAvatar: {
    backgroundColor: red[500]
  }
})

const UserAvatar = props => {
  if (props.src) {
    return <Avatar src={props.src} className={props.classes.avatar} />
  } else if (props.char) {
    return (
      <Avatar className={props.classes.charAvatar}>
        {props.char}
      </Avatar>
    )
  } else {
    return <AccountCircle />
  }
}

UserAvatar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(UserAvatar)
