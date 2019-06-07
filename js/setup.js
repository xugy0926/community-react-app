import Parse from 'parse'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Route } from 'react-router-dom'

import PostList from './Pages/PostList'
import Post from './Pages/Post'
import EditPost from './Pages/EditPost'
import EditComment from './Pages/EditComment'
import My from './Pages/My'
import Todos from './Pages/Todos'
import Projects from './Pages/Projects'
import App from './App'
import store from './redux/store'

import { parse } from './config'

Parse.initialize(parse.appId, parse.javascriptKey)
Parse.serverURL = parse.serverURL

const Root = () => (
  <Provider store={store}>
    <BrowserRouter>
      <App>
        <Route path="/" exact component={PostList} />
        <Route path="/post/:postId" exact component={Post} />
        <Route path="/edit" exact component={EditPost} />
        <Route path="/edit/:postId" exact component={EditPost} />
        <Route path="/edit_comment/:postId" exact component={EditComment} />
        <Route path="/edit_comment/:postId/:commentId" exact component={EditComment} />
        <Route path="/my" component={My} />
        <Route path="/todos/:projectId" component={Todos} />
        <Route path="/projects" component={Projects} />
      </App>
    </BrowserRouter>
  </Provider>
)

ReactDOM.render(<Root />, document.getElementById('root'))
