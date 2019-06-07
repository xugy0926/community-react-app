import Parse from 'parse'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { message, Button, Form, Input, Typography } from 'antd'

import { currentUser } from '../redux/selectors'
import { updateHeader } from '../redux/actions'
import Layout from '../Components/Layout'

const Post = Parse.Object.extend('Post')
const Comment = Parse.Object.extend('Comment')

class EditComment extends React.Component {
  static propTypes = {
    boundUpdateHader: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
    commentId: PropTypes.string,
    currentUser: PropTypes.object.isRequired
  }

  static defaultProps = {
    commentId: null
  }

  constructor(props) {
    super(props)
    this.state = {
      post: null,
      comment: null,
      content: ''
    }

    if (props.postId) {
      const query = new Parse.Query(Post)
      query.equalTo('objectId', props.postId)
      query.first().then(post => {
        this.setState({ post })
      })
    }

    if (props.commentId) {
      const query = new Parse.Query(Comment)
      query.equalTo('objectId', props.commentId)

      query.first().then(comment => {
        this.setState({
          comment,
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
    const { history, currentUser } = this.props
    const { content } = this.state

    if (!currentUser) {
      history.push('/my')
      return
    }

    if (!content || content.length < 3) {
      message.error('内容最少 3 个字')
      return
    }

    const comment = this.state.comment || new Comment()
    comment.set({
      content,
      parent: this.state.post
    })

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
    const { history, boundUpdateHader } = this.props
    const { post, content } = this.state

    boundUpdateHader({
      history,
      title: '编辑评论',
      onBack: () => history.goBack(),
      onSave: () => this.onSave()
    })

    return (
      <Layout>
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
      </Layout>
    )
  }
}

export default connect(
  (state, ownProps) => {
    const { postId, commentId } = ownProps.match.params
    return {
      currentUser: currentUser(state),
      postId,
      commentId
    }
  },
  dispatch => ({
    boundUpdateHader: header => dispatch(updateHeader(header))
  })
)(EditComment)
