import Parse from 'parse'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Form, Input } from 'antd'

import { login, onePost } from '../redux/selectors'
import { updateHeader, updatePost } from '../redux/actions'
import Layout from '../Components/Layout'

const Post = Parse.Object.extend('Post')

function EditPost(props) {
  const { post, boundUpdateHader, history, boundUpdatePost } = props
  boundUpdateHader({ history, title: '编辑文章', onBack: () => history.goBack() })

  const [title, setTitle] = useState((post && post.get('title')) || '')
  const [content, setContent] = useState((post && post.get('content')) || '')

  const onSave = () => {
    const post = post || new Post()
    boundUpdatePost({ post, title, content }).then(() => history.goBack())
  }

  return (
    <Layout>
      <Form layout="vertical">
        <Form.Item label="标题">
          <Input
            id="title"
            label="标题"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="正文">
          <Input.TextArea
            id="content"
            rows={10}
            fullWidth
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={() => onSave()}>
            保存
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  )
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

EditPost.propTypes = {
  boundUpdateHader: PropTypes.func.isRequired,
  boundUpdatePost: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired
}
