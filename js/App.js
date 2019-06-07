import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Layout } from 'antd'
import Header from './Components/Header'
import Footer from './Components/Footer'
import { signin } from './redux/actions'
import { header, footer, currentUser } from './redux/selectors'

const styles = {
  root: {
    backgroundColor: '#FFF'
  },
  main: {
    paddingLeft: 24,
    paddingRight: 24
  }
}

class App extends React.Component {
  static propTypes = {
    header: PropTypes.object.isRequired,
    footer: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    boundSignin: PropTypes.func.isRequired,
    children: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.props.boundSignin()
  }

  render() {
    const { header, footer, currentUser, children } = this.props

    return (
      <Row style={styles.root}>
        <Header {...header} currentUser={currentUser} />
        <Layout style={{ background: '#FFFFFF' }}>
          <Layout.Content style={styles.main}>{children}</Layout.Content>
        </Layout>
        <Footer {...footer} />
      </Row>
    )
  }
}

export default connect(
  store => ({ header: header(store), footer: footer(store), currentUser: currentUser(store) }),
  dispatch => ({ boundSignin: user => dispatch(signin(user)) })
)(App)
