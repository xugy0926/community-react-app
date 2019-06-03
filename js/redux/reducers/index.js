import { combineReducers } from 'redux'
import app from './app'
import posts from './posts'
import notes from './notes'
import projects from './projects'

export default combineReducers({ app, posts, projects, notes })
