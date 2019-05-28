import Parse from 'parse'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { message, Button, Form, Input } from 'antd'

import { login, currentUserName, currentUser, onePost } from '../redux/selectors'
import { updateHeader, updatePost } from '../redux/actions'

const Post = Parse.Object.extend('Post')

class EditPost extends React.Component {
  static propTypes = {
    boundUpdateHader: PropTypes.func.isRequired,
    boundUpdatePost: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    currentUser: PropTypes.string,
    currentUserName: PropTypes.string
  }

  static defaultProps = {
    currentUser: null,
    currentUserName: ''
  }

  constructor(props) {
    super(props)
    this.state = {
      title: props.post && props.post.get('title'),
      content: props.post && props.post.get('content')
    }
  }

  onSave = () => {
    const { history, boundUpdatePost, currentUser, currentUserName } = this.props
    const { title, content } = this.state
    let { post } = this.props

    post = post || new Post()
    post.set({
      title,
      content,
      author: currentUser,
      authorName: currentUserName
    })

    if (!post.id) {
      const roleACL = new Parse.ACL()
      roleACL.setPublicReadAccess(true)
      roleACL.setWriteAccess(currentUser, true)
      post.setACL(roleACL)
    }

    if (!title || title.length < 4) {
      message.error('标题最少 4 个字')
      return
    }

    if (!content || content.length < 10) {
      message.error('内容最少 10 个字')
      return
    }

    post
      .save()
      .then(result => {
        boundUpdatePost(result)
        history.goBack()
      })
      .catch(err => message.error(err.message))
  }

  titleChange = event => {
    this.setState({ title: event.target.value })
  }

  contentChange = event => {
    this.setState({ content: event.target.value })
  }

  render() {
    const { history, boundUpdateHader } = this.props
    boundUpdateHader({
      title: '编辑文章',
      onBack: () => history.goBack()
    })

    return (
      <Form layout="vertical">
        <Form.Item label="标题">
          <Input
            id="title"
            label="标题"
            type="text"
            value={this.state.title}
            onChange={this.titleChange}
          />
        </Form.Item>
        <Form.Item label="正文">
          <Input.TextArea
            id="content"
            rows={10}
            fullWidth
            value={this.state.content}
            onChange={this.contentChange}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={() => this.onSave()}>
            保存
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default connect(
  (state, ownProps) => {
    const { postId } = ownProps.match.params
    return {
      login: login(state),
      currentUserName: currentUserName(state),
      currentUser: currentUser(state),
      post: onePost(state, postId),
      postId
    }
  },
  dispatch => ({
    boundUpdateHader: header => dispatch(updateHeader(header)),
    boundUpdatePost: post => dispatch(updatePost(post))
  })
)(EditPost)
