import { LOAD_PROJECTS, UPDATE_PROJECT, DELETE_PROJECT } from '../actionTypes'

const R = require('ramda')

const initialState = {
  projects: []
}

const assign = oldObj => newObj => Object.assign({}, oldObj, newObj)

export default function(state = initialState, action) {
  switch (action.type) {
    case LOAD_PROJECTS: {
      const { projects } = action.payload
      return assign(state)({ projects: [...state.projects, ...projects] })
    }
    case UPDATE_PROJECT: {
      const { project } = action.payload
      const has = !!R.find(R.propEq('id', project.id), state.projects)

      if (has) {
        const newPrjects = state.projects.map(oldProject =>
          oldProject.id === project.id ? project : oldProject
        )
        return assign(state)({ projects: [...newPrjects] })
      }
      return assign(state)({ projects: [project, ...state.projects] })
    }
    case DELETE_PROJECT: {
      const { project } = action.payload
      const projects = R.filter(item => item.id !== project.id, state.projects)

      return assign(state)({ projects: [...projects] })
    }
    default:
      return state
  }
}
