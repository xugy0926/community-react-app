import Parse from 'parse'
import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Card from '@material-ui/core/Card'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import AddIcon from '@material-ui/icons/Add'

import UserAvatar from '../Components/UserAvatar'

import { github } from '../config'

import { currentUser } from '../redux/selectors'
import { updateHeader } from '../redux/actions'

const styles = {}

class My extends React.Component {
  onLogin = () => {
    window.location.href = `${github.authURI}?client_id=${
      github.clientId
    }&scope=user&redirect_uri=${github.redirectURI}`
  }

  onLogout = () => {
    Parse.User.logOut()
    this.setState({ currentUser: null })
  }

  render() {
    const { history, boundUpdateHader, currentUser } = this.props
    boundUpdateHader({ title: '我的', onBack: () => history.goBack() })

    return (
      <Card>
        <List>
          {currentUser ? (
            <ListItem button onClick={() => this.onAccount()}>
              <ListItemAvatar>
                <UserAvatar src={currentUser.get('avatar')} />
              </ListItemAvatar>
              <ListItemText primary={currentUser.get('email')} />
            </ListItem>
          ) : (
            <div />
          )}
          {currentUser ? (
            <ListItem button onClick={() => this.onLogout()}>
              <ListItemText primary="退出" />
            </ListItem>
          ) : (
            <ListItem button onClick={() => this.onLogin()}>
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="使用 Github 账户登录" />
            </ListItem>
          )}
        </List>
      </Card>
    )
  }
}

export default connect(
  store => {
    return { currentUser: currentUser(store) }
  },
  dispatch => {
    return { boundUpdateHader: header => dispatch(updateHeader(header)) }
  }
)(withStyles(styles)(My))
