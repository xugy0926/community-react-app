import Parse from 'parse'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import PostList from './Pages/PostList.js'
import Post from './Pages/Post.js'
import EditPost from './Pages/EditPost.js'
import EditComment from './Pages/EditComment.js'
import My from './Pages/My.js'
import App from './App'
import store from './redux/store'

import { parse } from './config'

const sessionKey = 'community-app-session'

const session = window.localStorage.getItem(sessionKey)
Parse.initialize(parse.appId, parse.javascriptKey)
Parse.serverURL = parse.serverURL

session &&
  Parse.User.become(session).then(() => {
    window.localStorage.removeItem(sessionKey)
  })

const options = {
  position: 'bottom center',
  timeout: 5000,
  offset: '30px',
  transition: 'scale'
}

const Root = () => {
  return (
    <Provider store={store}>
      <App>
        <BrowserRouter>
          <AlertProvider template={AlertTemplate} {...options}>
            <Route path="/" exact component={PostList} />
            <Route path="/post/:postId" exact component={Post} />
            <Route path="/edit" exact component={EditPost} />
            <Route path="/edit/:postId" exact component={EditPost} />
            <Route path="/edit_comment/:postId" exact component={EditComment} />
            <Route path="/edit_comment/:postId/:commentId" exact component={EditComment} />
            <Route path="/my" component={My} />
          </AlertProvider>
        </BrowserRouter>
      </App>
    </Provider>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'))
