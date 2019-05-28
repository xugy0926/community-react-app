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

class UserAvatar extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    src: PropTypes.string,
    char: PropTypes.string
  }

  static defaultProps = {
    src: '',
    char: ''
  }

  render() {
    if (this.props.src) {
      return <Avatar src={this.props.src} className={this.props.classes.avatar} />
    }
    if (this.props.char) {
      return <Avatar className={this.props.classes.charAvatar}>{this.props.char}</Avatar>
    }
    return <AccountCircle />
  }
}

export default withStyles(styles)(UserAvatar)
