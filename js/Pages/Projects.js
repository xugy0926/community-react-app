import Parse from 'parse'
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Card, Col, Row, Icon, Menu, Dropdown, Input, Modal, Form, List } from 'antd'

import { projects } from '../redux/selectors'
import { updateHeader, loadProjects, updateProject, deleteProject } from '../redux/actions'

class Projects extends React.Component {
  static propTypes = {
    boundUpdateHeader: PropTypes.func.isRequired,
    boundLoadProjects: PropTypes.func.isRequired,
    boundUpdateProject: PropTypes.func.isRequired,
    boundDeleteProject: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    projects: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)
    props.boundUpdateHeader({
      history: this.props.history,
      title: 'Projects',
      onBack: () => props.history.push('/')
    })
    if (props.projects.length < 1) {
      props.boundLoadProjects()
    }
  }

  state = {
    editProject: null,
    visible: false
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
            onOk: () => this.props.boundDeleteProject(editProject)
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
    this.props.boundUpdateProject(this.state.editProject)
  }

  render() {
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
    projects: projects(state)
  }),
  dispatch => ({
    boundUpdateHeader: header => dispatch(updateHeader(header)),
    boundLoadProjects: () => dispatch(loadProjects()),
    boundDeleteProject: project => dispatch(deleteProject(project)),
    boundUpdateProject: project => dispatch(updateProject(project))
  })
)(Projects)
