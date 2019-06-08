import Parse from 'parse'
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Card,
  Col,
  Button,
  Row,
  Icon,
  Menu,
  Dropdown,
  Input,
  Modal,
  Form,
  List,
  message
} from 'antd'

import { currentUser, projects } from '../redux/selectors'
import { updateHeader, loadProjects, updateProject, deleteProject } from '../redux/actions'

const Plan = Parse.Object.extend('Plan')
const queryPlan = new Parse.Query(Plan)

class Projects extends React.Component {
  static propTypes = {
    boundUpdateHeader: PropTypes.func.isRequired,
    boundLoadProjects: PropTypes.func.isRequired,
    boundUpdateProject: PropTypes.func.isRequired,
    boundDeleteProject: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    projects: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)
    props.boundUpdateHeader({
      history: this.props.history,
      title: 'Projects',
      onBack: () => props.history.push('/')
    })
  }

  state = {
    todoPlan: false,
    editProject: null,
    visible: false
  }

  componentDidMount() {
    this.load(this.props.currentUser)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentUser !== nextProps.currentUser) {
      this.load(nextProps.currentUser)
    }
  }

  load = currentUser => {
    if (currentUser) {
      queryPlan.equalTo('action', 'todo')
      queryPlan.equalTo('author', currentUser)
      queryPlan
        .first()
        .then(this.loadProjects)
        .catch(err => message.error(err.message))
    }
  }

  joinTodoPlan = () => {
    queryPlan.equalTo('action', 'todo')
    queryPlan.equalTo('author', this.props.currentUser)
    queryPlan
      .first()
      .then(plan => {
        plan = plan || new Plan()
        return plan.save({ action: 'todo', author_email: this.props.currentUser.get('email') })
      })
      .then(this.loadProjects)
      .catch(err => message.error(err.message))
  }

  loadProjects = plan => {
    const action = plan && plan.get('action')
    if (action === 'todo') {
      this.setState({ todoPlan: true })
      if (this.props.projects.length < 1) return this.props.boundLoadProjects()
    }

    return Promise.resolve()
  }

  projectMenus = editProject => (
    <Menu>
      <Menu.Item
        onClick={() => {
          this.setState(() => ({ visible: true, editProject }))
        }}
      >
        Edit project
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          Modal.confirm({
            title: 'Warning',
            content: 'Are you sure want to delete it?',
            okText: 'Delete project',
            cancelText: 'Cancel',
            onOk: () =>
              this.props.boundDeleteProject(editProject).catch(err => message.error(err.message))
          })
        }}
      >
        Delete project
      </Menu.Item>
    </Menu>
  )

  onCreateProject = () => {
    const Project = Parse.Object.extend('Project')
    const editProject = new Project()
    this.setState(() => ({
      editProject,
      visible: true
    }))
  }

  onEditeProject = () => {
    this.props.boundUpdateProject(this.state.editProject).catch(err => message.error(err.message))
  }

  render() {
    if (!this.state.todoPlan) {
      return (
        <Card align="center">
          <Button type="primary" onClick={this.joinTodoPlan}>
            参加 Todo 计划
          </Button>
        </Card>
      )
    }

    return (
      <React.Fragment>
        <Row>
          <Col span={12} offset={6}>
            <Card
              size="small"
              title="Projects"
              extra={
                <div>
                  <span style={{ marginRight: 15 }} onClick={() => this.onCreateProject()}>
                    <Icon type="plus" />
                  </span>
                </div>
              }
            >
              <List
                itemLayout="horizontal"
                dataSource={this.props.projects}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Dropdown overlay={() => this.projectMenus(item)}>
                        <Icon type="ellipsis" />
                      </Dropdown>
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Link to={{ pathname: `/todos/${item.id}` }}>{item.get('title')}</Link>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
            <Modal
              title="Modal"
              visible={this.state.visible}
              onOk={() => this.setState(() => ({ visible: false }), () => this.onEditeProject())}
              onCancel={() => this.setState(() => ({ visible: false }))}
              okText="Save project"
              cancelText="Cancel"
            >
              <Form>
                <Input
                  value={(this.state.editProject && this.state.editProject.get('title')) || ''}
                  onChange={e => {
                    const { value } = e.target
                    this.setState(state => {
                      const { editProject } = state
                      editProject.set('title', value)
                      return {
                        editProject
                      }
                    })
                  }}
                />
              </Form>
            </Modal>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default connect(
  state => ({
    currentUser: currentUser(state),
    projects: projects(state)
  }),
  dispatch => ({
    boundUpdateHeader: header => dispatch(updateHeader(header)),
    boundLoadProjects: () => dispatch(loadProjects()),
    boundDeleteProject: project => dispatch(deleteProject(project)),
    boundUpdateProject: project => dispatch(updateProject(project))
  })
)(Projects)
