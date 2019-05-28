import Parse from 'parse'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { message, Button, Form, Input, Typography } from 'antd'

import { login, currentUserName, currentUser, onePost } from '../redux/selectors'
import { updateHeader } from '../redux/actions'

const Comment = Parse.Object.extend('Comment')

class EditComment extends React.Component {
  static propTypes = {
    boundUpdateHader: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    commentId: PropTypes.string,
    post: PropTypes.object.isRequired,
    currentUserName: PropTypes.string,
    currentUser: PropTypes.object.isRequired
  }

  static defaultProps = {
    commentId: null,
    currentUserName: ''
  }

  constructor(props) {
    super(props)
    this.state = {
      content: ''
    }

    this.comment = null

    if (props.commentId) {
      const query = new Parse.Query(Comment)
      query.equalTo('objectId', props.commentId)

      query.first().then(comment => {
        this.comment = comment
        this.setState({
          content: comment.get('content')
        })
      })
    }
  }

  onBack = () => {
    const { history } = this.props
    history.goBack()
  }

  onSave = () => {
    const { history, currentUser, currentUserName, post } = this.props
    const { content } = this.state

    if (!content || content.length < 3) {
      message.error('内容最少 3 个字')
      return
    }

    const comment = this.comment || new Comment()
    comment.set({
      content,
      author: currentUser,
      authorName: currentUserName,
      parent: post
    })

    if (!comment.id) {
      const roleACL = new Parse.ACL()
      roleACL.setPublicReadAccess(true)
      roleACL.setWriteAccess(currentUser, true)
      comment.setACL(roleACL)
    }

    comment
      .save()
      .then(() => {
        history.goBack()
      })
      .catch(err => message.error(err.message))
  }

  contentChange = event => {
    this.setState({ content: event.target.value })
  }

  render() {
    const { history, boundUpdateHader, post } = this.props
    const { content } = this.state

    boundUpdateHader({
      title: '编辑评论',
      onBack: () => history.goBack(),
      onSave: () => this.onSave()
    })

    return (
      <Form layout="vertical">
        <Typography.Title level={4}>{post && post.get('title')}</Typography.Title>
        <Form.Item>
          <Input.TextArea
            id="content"
            label="评论"
            multiline
            rows={8}
            margin="dense"
            variant="outlined"
            type="text"
            fullWidth
            value={content}
            onChange={this.contentChange}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={() => this.onSave()}>
            回复
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default connect(
  (state, ownProps) => {
    const { postId, commentId } = ownProps.match.params
    return {
      login: login(state),
      currentUserName: currentUserName(state),
      currentUser: currentUser(state),
      post: onePost(state, postId),
      postId,
      commentId
    }
  },
  dispatch => ({
    boundUpdateHader: header => dispatch(updateHeader(header))
  })
)(EditComment)
