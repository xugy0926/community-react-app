import Parse from 'parse'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Route } from 'react-router-dom'
import 'antd/dist/antd.css'

import PostList from './Pages/PostList'
import Post from './Pages/Post'
import EditPost from './Pages/EditPost'
import EditComment from './Pages/EditComment'
import My from './Pages/My'
import App from './App'
import store from './redux/store'

import { parse } from './config'

const sessionKey = 'community-app-session'

const session = window.localStorage.getItem(sessionKey)
Parse.initialize(parse.appId, parse.javascriptKey)
Parse.serverURL = parse.serverURL

if (session) {
  Parse.User.become(session).then(() => window.localStorage.removeItem(sessionKey))
}

const Root = () => (
  <Provider store={store}>
    <App>
      <BrowserRouter>
        <div>
          <Route path="/" exact component={PostList} />
          <Route path="/post/:postId" exact component={Post} />
          <Route path="/edit" exact component={EditPost} />
          <Route path="/edit/:postId" exact component={EditPost} />
          <Route path="/edit_comment/:postId" exact component={EditComment} />
          <Route path="/edit_comment/:postId/:commentId" exact component={EditComment} />
          <Route path="/my" component={My} />
        </div>
      </BrowserRouter>
    </App>
  </Provider>
)

ReactDOM.render(<Root />, document.getElementById('root'))
