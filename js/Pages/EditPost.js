import Parse from 'parse'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Form, Input, message } from 'antd'

import { currentUser } from '../redux/selectors'
import { updateHeader, updatePost, loadPost } from '../redux/actions'
import Layout from '../Components/Layout'

const Post = Parse.Object.extend('Post')

class EditPost extends React.Component {
  static propTypes = {
    boundUpdateHader: PropTypes.func.isRequired,
    boundLoadPost: PropTypes.func.isRequired,
    boundUpdatePost: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.state = { post: new Post() }
  }

  componentDidMount() {
    const { boundLoadPost, boundUpdateHader, history, postId } = this.props
    if (postId) {
      boundLoadPost(postId).then(post => {
        this.setState({ post }, () =>
          boundUpdateHader({ history, title: '编辑文章', onBack: () => history.goBack() })
        )
      })
    }
  }

  render() {
    const title = (this.state.post && this.state.post.get('title')) || ''
    const content = (this.state.post && this.state.post.get('content')) || ''
    return (
      <Layout>
        <Form layout="vertical">
          <Form.Item label="标题">
            <Input
              id="title"
              label="标题"
              type="text"
              value={title}
              onChange={e => {
                const { post } = this.state
                post.set('title', e.target.value)
                this.setState({ post })
              }}
            />
          </Form.Item>
          <Form.Item label="正文">
            <Input.TextArea
              id="content"
              rows={10}
              value={content}
              onChange={e => {
                const { post } = this.state
                post.set('content', e.target.value)
                this.setState({ post })
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={() =>
                this.props
                  .boundUpdatePost(this.state.post)
                  .then(() => this.props.history.goBack())
                  .catch(err => message.error(err.message))
              }
            >
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
      currentUser: currentUser(state),
      postId
    }
  },
  dispatch => ({
    boundUpdateHader: header => dispatch(updateHeader(header)),
    boundLoadPost: id => dispatch(loadPost(id)),
    boundUpdatePost: post => dispatch(updatePost(post))
  })
)(EditPost)
