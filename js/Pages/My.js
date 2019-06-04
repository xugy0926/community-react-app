import Parse from 'parse'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Typography } from 'antd'

import { github } from '../config'

import { currentUser } from '../redux/selectors'
import { updateHeader, logout } from '../redux/actions'
import Layout from '../Components/Layout'

class My extends React.Component {
  static propTypes = {
    boundUpdateHader: PropTypes.func.isRequired,
    boundLogout: PropTypes.func.isRequired,
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

  render() {
    const { history, boundUpdateHader, currentUser } = this.props
    boundUpdateHader({ history, title: '我的', onBack: () => history.goBack() })

    return (
      <Layout>
        {currentUser ? (
          <div>
            <Typography.Title level={4}>{currentUser.get('email')}</Typography.Title>
            <Button onClick={() => this.props.boundLogout()}>退出</Button>
          </div>
        ) : (
          <Button button onClick={() => this.onLogin()}>
            使用 Github 账户登录
          </Button>
        )}
      </Layout>
    )
  }
}

export default connect(
  store => ({ currentUser: currentUser(store) }),
  dispatch => ({
    boundUpdateHader: header => dispatch(updateHeader(header)),
    boundLogout: () => dispatch(logout())
  })
)(My)
