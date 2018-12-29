import Parse from 'parse'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'

import { parse } from './config'

class Token extends React.Component {
  componentDidMount() {
    const query = this.props.location.search
    const arr = query.split('&')
    const session = arr[0].substr(3)
    Parse.initialize(parse.appId, parse.javascriptKey)
    Parse.serverURL = parse.serverURL
    Parse.User.become(session).then(() => {
      window.location.href = config.clientURL
    })
  }
  render() {
    return <div>saving session</div>
  }
}

ReactDOM.render(
  <BrowserRouter>
    <Route path="/" component={Token} />
  </BrowserRouter>,
  document.getElementById('root')
)
