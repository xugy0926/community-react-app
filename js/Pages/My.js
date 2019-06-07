import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Typography, Modal, Form, Input, message } from 'antd'

import { github } from '../config'

import { currentUser } from '../redux/selectors'
import { updateHeader, signup, signinWithAccount, logout } from '../redux/actions'
import Layout from '../Components/Layout'

class My extends React.Component {
  static propTypes = {
    boundUpdateHader: PropTypes.func.isRequired,
    boundSignup: PropTypes.func.isRequired,
    boundSigninWithAccount: PropTypes.func.isRequired,
    boundLogout: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    currentUser: PropTypes.object
  }

  static defaultProps = {
    currentUser: null
  }

  constructor(props) {
    super(props)
    this.state = {
      visibleSignin: false,
      visibleSignup: false,
      username: '',
      password: '',
      email: ''
    }
  }

  onGithubLogin = () => {
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
            <Button
              onClick={() => this.props.boundLogout().catch(err => message.error(err.message))}
            >
              退出
            </Button>
          </div>
        ) : (
          <React.Fragment>
            <Button type="primary" onClick={() => this.onGithubLogin()}>
              使用 Github 账户登录
            </Button>
            <Button
              style={{ marginLeft: 15 }}
              onClick={() => this.setState({ visibleSignin: true })}
            >
              登录
            </Button>
            <Button
              style={{ marginLeft: 15 }}
              onClick={() => this.setState({ visibleSignup: true })}
            >
              注册
            </Button>
            <Modal
              title="注册"
              visible={this.state.visibleSignup}
              onOk={() =>
                this.props
                  .boundSignup(this.state.username, this.state.email, this.state.password)
                  .then(() => this.setState({ visibleSignup: false }))
                  .catch(err => message.error(err.message))
              }
              onCancel={() => this.setState({ visibleSignup: false })}
            >
              <Form>
                <Form.Item label="昵称">
                  <Input onChange={e => this.setState({ username: e.target.value })} />
                </Form.Item>
                <Form.Item label="密码">
                  <Input onChange={e => this.setState({ password: e.target.value })} />
                </Form.Item>
                <Form.Item label="邮箱">
                  <Input onChange={e => this.setState({ email: e.target.value })} />
                </Form.Item>
              </Form>
            </Modal>
            <Modal
              title="登录"
              visible={this.state.visibleSignin}
              onOk={() =>
                this.props
                  .boundSigninWithAccount(this.state.email, this.state.password)
                  .then(() => this.setState({ visibleSignin: false }))
                  .catch(err => message.error(err.message))
              }
              onCancel={() => this.setState({ visibleSignin: false })}
            >
              <Form>
                <Form.Item label="邮箱">
                  <Input onChange={e => this.setState({ email: e.target.value })} />
                </Form.Item>
                <Form.Item label="密码">
                  <Input onChange={e => this.setState({ password: e.target.value })} />
                </Form.Item>
              </Form>
            </Modal>
          </React.Fragment>
        )}
      </Layout>
    )
  }
}

export default connect(
  store => ({ currentUser: currentUser(store) }),
  dispatch => ({
    boundUpdateHader: header => dispatch(updateHeader(header)),
    boundSignup: (username, email, password) => dispatch(signup(username, email, password)),
    boundSigninWithAccount: (email, password) => dispatch(signinWithAccount(email, password)),
    boundLogout: () => dispatch(logout())
  })
)(My)
