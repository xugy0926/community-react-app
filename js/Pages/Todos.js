import Parse from 'parse'
import update from 'immutability-helper'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Card,
  Col,
  Row,
  Icon,
  Menu,
  Dropdown,
  Input,
  Modal,
  Form,
  Button,
  Tag,
  message
} from 'antd'

import MarkdownBlock from '../Components/MarkdownBlock'
import { currentUser, notes } from '../redux/selectors'
import { updateHeader, loadProject, loadNotes, updateNote, deleteNote } from '../redux/actions'

class Todos extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    boundUpdateHeader: PropTypes.func.isRequired,
    boundLoadProject: PropTypes.func.isRequired,
    boundLoadNotes: PropTypes.func.isRequired,
    boundUpdateNote: PropTypes.func.isRequired,
    boundDeleteNote: PropTypes.func.isRequired,
    currentUser: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    notes: PropTypes.array.isRequired
  }

  state = {
    columns: [
      {
        type: 'todo',
        title: 'Todo',
        createNote: null,
        editNote: null,
        visible: false,
        actions: [
          {
            label: 'Move to inprogress',
            action: note => {
              note.set('type', 'inprogress')
              this.props.boundUpdateNote(note)
            }
          },
          {
            label: 'Move to done',
            action: note => {
              note.set('type', 'done')
              this.props.boundUpdateNote(note)
            }
          }
        ]
      },
      {
        type: 'inprogress',
        title: 'In progress',
        createNote: null,
        editNote: null,
        visible: false,
        actions: [
          {
            label: 'Move to todo',
            action: note => {
              note.set('type', 'todo')
              this.props.boundUpdateNote(note)
            }
          },
          {
            label: 'Move to done',
            action: note => {
              note.set('type', 'done')
              this.props.boundUpdateNote(note)
            }
          }
        ]
      },
      {
        type: 'done',
        title: 'Done',
        createNote: null,
        editNote: null,
        visible: false,
        actions: [
          {
            label: 'Move to todo',
            action: note => {
              note.set('type', 'todo')
              this.props.boundUpdateNote(note)
            }
          },
          {
            label: 'Move to inprogress',
            action: note => {
              note.set('type', 'inprogress')
              this.props.boundUpdateNote(note)
            }
          }
        ]
      }
    ],
    project: null
  }

  componentDidMount() {
    const { history, boundLoadProject, boundUpdateHeader, projectId } = this.props

    boundLoadProject(projectId)
      .then(project => {
        boundUpdateHeader({
          history,
          title: `${project.get('title')} - Todo`,
          onBack: () => history.push('/projects')
        })
        this.setState({ project })
        return this.props.boundLoadNotes(project)
      })
      .catch(err => message.error(err.message))
  }

  columnsMenus = () => (
    <Menu>
      <Menu.Item
        onClick={() => {
          console.log('onClick')
        }}
      >
        Edit column
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          console.log('onClick')
        }}
      >
        Delete column
      </Menu.Item>
    </Menu>
  )

  noteMenus = (index, note) => (
    <Menu>
      <Menu.Item onClick={() => this.state.columns[index].actions[0].action(note)}>
        {this.state.columns[index].actions[0].label}
      </Menu.Item>
      <Menu.Item onClick={() => this.state.columns[index].actions[1].action(note)}>
        {this.state.columns[index].actions[1].label}
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          this.setState(state => ({
            columns: update(state.columns, {
              [index]: { editNote: { $set: note }, visible: { $set: true } }
            })
          }))
        }}
      >
        Edit note
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          Modal.confirm({
            title: 'Warning',
            content: 'Are you sure you want to delete it?',
            okText: 'Delete note',
            cancelText: 'Cancel',
            onOk: () => this.props.boundDeleteNote(note)
          })
        }}
      >
        Delete note
      </Menu.Item>
    </Menu>
  )

  onCreateNote = index => {
    const Note = Parse.Object.extend('Note')
    const createNote = new Note({
      type: this.state.columns[index].type,
      parent: this.state.project
    })
    this.setState(state => ({
      columns: update(state.columns, { [index]: { createNote: { $set: createNote } } })
    }))
  }

  onEditeNote = index => {
    this.props.boundUpdateNote(this.state.columns[index].editNote)
  }

  render() {
    const todoList = [[], [], []]

    this.props.notes.forEach(element => {
      const type = element.get('type')
      if (type === 'todo') {
        todoList[0].push(element)
      } else if (type === 'inprogress') {
        todoList[1].push(element)
      } else if (element) {
        todoList[2].push(element)
      }
    })

    return (
      <React.Fragment>
        <Row gutter={20}>
          {this.state.columns.map((column, index) => (
            <Col span={6} key={column.type}>
              <Card
                size="small"
                title={column.title}
                style={{ background: '#eff1f3' }}
                extra={
                  <div>
                    <span style={{ marginRight: 15 }} onClick={() => this.onCreateNote(index)}>
                      <Icon type="plus" />
                    </span>
                  </div>
                }
              >
                {column.createNote ? (
                  <Card size="small">
                    <Form>
                      <Input.TextArea
                        rows={4}
                        value={
                          (this.state.columns[index].createNote &&
                            this.state.columns[index].createNote.get('content')) ||
                          ''
                        }
                        onChange={e => {
                          const { value } = e.target
                          this.setState(state => {
                            const createNote = state.columns[index].createNote.clone()
                            createNote.set('content', value)
                            return {
                              columns: update(state.columns, {
                                [index]: { createNote: { $set: createNote } }
                              })
                            }
                          })
                        }}
                      />
                      <Form.Item>
                        <Button
                          type="primary"
                          onClick={() =>
                            this.props
                              .boundUpdateNote(this.state.columns[index].createNote)
                              .then(() => this.onCreateNote(index))
                          }
                        >
                          Add
                        </Button>
                        <Button
                          onClick={() =>
                            this.setState(state => ({
                              columns: update(state.columns, {
                                [index]: { createNote: { $set: null } }
                              })
                            }))
                          }
                        >
                          Cancel
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>
                ) : null}
                {todoList[index].map(element => (
                  <Card size="small" key={element.id} style={{ borderRadius: 6, marginTop: 10 }}>
                    <Col span={22}>
                      <div>
                        <Tag color="magenta">magenta</Tag>
                        <Tag color="red">red</Tag>
                        <Tag color="volcano">volcano</Tag>
                        <Tag color="orange">orange</Tag>
                        <Tag color="gold">gold</Tag>
                        <Tag color="lime">lime</Tag>
                        <Tag color="green">green</Tag>
                        <Tag color="cyan">cyan</Tag>
                        <Tag color="blue">blue</Tag>
                        <Tag color="geekblue">geekblue</Tag>
                        <Tag color="purple">purple</Tag>
                      </div>
                      <MarkdownBlock theme="todo-body" content={element.get('content')} />
                    </Col>
                    <Col span={2}>
                      <Dropdown overlay={() => this.noteMenus(index, element)}>
                        <Icon type="ellipsis" />
                      </Dropdown>
                    </Col>
                  </Card>
                ))}
              </Card>
              <Modal
                title="Modal"
                visible={this.state.columns[index].visible}
                onOk={() =>
                  this.setState(
                    state => ({
                      columns: update(state.columns, {
                        [index]: { visible: { $set: false } }
                      })
                    }),
                    () => this.onEditeNote(index)
                  )
                }
                onCancel={() =>
                  this.setState(state => ({
                    columns: update(state.columns, {
                      [index]: { visible: { $set: false } }
                    })
                  }))
                }
                okText="Save note"
                cancelText="Cancel"
              >
                <Form>
                  <Input.TextArea
                    rows={15}
                    value={
                      (this.state.columns[index].editNote &&
                        this.state.columns[index].editNote.get('content')) ||
                      ''
                    }
                    onChange={e => {
                      const { value } = e.target
                      this.setState(state => {
                        const { editNote } = state.columns[index]
                        editNote.set('content', value)
                        return {
                          columns: update(state.columns, {
                            [index]: { editNote: { $set: editNote } }
                          })
                        }
                      })
                    }}
                  />
                </Form>
              </Modal>
            </Col>
          ))}
        </Row>
      </React.Fragment>
    )
  }
}

export default connect(
  (state, ownProps) => {
    const { projectId } = ownProps.match.params
    return {
      currentUser: currentUser(state),
      notes: notes(state, projectId),
      projectId
    }
  },
  dispatch => ({
    boundUpdateHeader: header => dispatch(updateHeader(header)),
    boundLoadProject: id => dispatch(loadProject(id)),
    boundLoadNotes: project => dispatch(loadNotes(project)),
    boundDeleteNote: note => dispatch(deleteNote(note)),
    boundUpdateNote: note => dispatch(updateNote(note))
  })
)(Todos)
