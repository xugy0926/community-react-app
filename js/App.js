import Parse from 'parse'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Header from './Components/Header'
import Footer from './Components/Footer'
import { updateAccount } from './redux/actions'
import { header, footer } from './redux/selectors'

const styles = theme => ({
  main: {
    marginTop: 70,
    marginBottom: 63,
    width: '100%'
  }
})

const App = ({ classes, header, footer, boundUpdateAccount, children }) => {
  boundUpdateAccount(Parse.User.current())

  const { title, onBack, onSave } = header
  const { onAdd, onMy } = footer
  return (
    <React.Fragment>
      <Header title={title} onBack={onBack} onSave={onSave} />
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item sm={6} className={classes.main}>
          <React.Fragment>{children}</React.Fragment>
        </Grid>
      </Grid>
      <Footer onAdd={onAdd} onMy={onMy} />
    </React.Fragment>
  )
}

App.propTypes = {
  classes: PropTypes.object.isRequired
}

export default connect(
  store => {
    return { header: header(store), footer: footer(store) }
  },
  dispatch => {
    return { boundUpdateAccount: user => dispatch(updateAccount(user)) }
  }
)(withStyles(styles)(App))
