import Parse from 'parse'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Col, Button, Typography } from 'antd'

import { github } from '../config'

import { currentUser } from '../redux/selectors'
import { updateHeader } from '../redux/actions'

class My extends React.Component {
  static propTypes = {
    boundUpdateHader: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    currentUser: PropTypes.object
  }

  static defaultProps = {
    currentUser: null
  }

  onLogin = () => {
    window.location.href = `${github.authURI}?client_id=${
      github.clientId
    }&scope=user&redirect_uri=${github.redirectURI}`
  }

  onLogout = () => {
    Parse.User.logOut()
  }

  render() {
    const { history, boundUpdateHader, currentUser } = this.props
    boundUpdateHader({ title: '我的', onBack: () => history.goBack() })

    return (
      <Col>
        {currentUser ? (
          <div>
            <Typography.Title level={4}>{currentUser.get('email')}</Typography.Title>
            <Button onClick={() => this.onLogout()}>退出</Button>
          </div>
        ) : (
          <Button button onClick={() => this.onLogin()}>
            使用 Github 账户登录
          </Button>
        )}
      </Col>
    )
  }
}

export default connect(
  store => ({ currentUser: currentUser(store) }),
  dispatch => ({ boundUpdateHader: header => dispatch(updateHeader(header)) })
)(My)
