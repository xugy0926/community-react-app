import Parse from 'parse'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Form, Input } from 'antd'

import { login, onePost } from '../redux/selectors'
import { updateHeader, updatePost } from '../redux/actions'
import Layout from '../Components/Layout'

const Post = Parse.Object.extend('Post')

class EditPost extends React.Component {
  static propTypes = {
    boundUpdateHader: PropTypes.func.isRequired,
    boundUpdatePost: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    const { post, boundUpdateHader, history } = props
    boundUpdateHader({ history, title: '编辑文章', onBack: () => history.goBack() })

    this.state = {
      title: (post && post.get('title')) || '',
      content: (post && post.get('content')) || ''
    }
  }

  onSave = () => {
    const post = this.props.post || new Post()
    this.props
      .boundUpdatePost({ post, title: this.state.title, content: this.state.content })
      .then(() => this.props.history.goBack())
  }

  render() {
    return (
      <Layout>
        <Form layout="vertical">
          <Form.Item label="标题">
            <Input
              id="title"
              label="标题"
              type="text"
              value={this.state.title}
              onChange={e => this.setState({ title: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="正文">
            <Input.TextArea
              id="content"
              rows={10}
              fullWidth
              value={this.state.content}
              onChange={e => this.setState({ content: e.target.value })}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => this.onSave()}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Layout>
    )
  }
}

export default connect(
  (state, ownProps) => {
    const { postId } = ownProps.match.params
    return {
      login: login(state),
      post: onePost(state, postId)
    }
  },
  dispatch => ({
    boundUpdateHader: header => dispatch(updateHeader(header)),
    boundUpdatePost: post => dispatch(updatePost(post))
  })
)(EditPost)
