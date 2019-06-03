import Parse from 'parse'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Layout } from 'antd'
import Header from './Components/Header'
import Footer from './Components/Footer'
import { updateAccount } from './redux/actions'
import { header, footer } from './redux/selectors'

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
    boundUpdateAccount: PropTypes.func.isRequired,
    children: PropTypes.object.isRequired
  }

  render() {
    const { header, footer, boundUpdateAccount, children } = this.props
    boundUpdateAccount(Parse.User.current())

    return (
      <Row style={styles.root}>
        <Header {...header} />
        <Layout style={{ background: '#FFFFFF' }}>
          <Layout.Content style={styles.main}>{children}</Layout.Content>
        </Layout>
        <Footer {...footer} />
      </Row>
    )
  }
}

export default connect(
  store => ({ header: header(store), footer: footer(store) }),
  dispatch => ({ boundUpdateAccount: user => dispatch(updateAccount(user)) })
)(App)
