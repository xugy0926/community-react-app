import Parse from 'parse'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import { message, Comment, List, Button } from 'antd'

import MarkdownBlock from '../Components/MarkdownBlock'

class CommentList extends React.Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      items: []
    }

    this.postId = props.post ? props.post.id : ''
    this.count = 0
    this.more = true
    this.loadMore()
  }

  loadMore = () => {
    const Comment = Parse.Object.extend('Comment')
    const query = new Parse.Query(Comment)
    query.equalTo('parent', this.props.post)
    query.skip(this.count)
    query.limit(50)
    query.find().then(results => {
      if (results.length === 0) {
        this.more = false
      }
      this.count += results.length
      this.setState(state => ({ items: [...state.items, ...results] }))
    })
  }

  onReply = () => {
    if (!this.props.currentUser) {
      this.props.history.push('/my')
      return
    }
    this.props.history.push(`/edit_comment/${this.postId}`)
  }

  onEdit = item => {
    if (!this.props.currentUser) {
      this.props.history.push('/my')
      return
    }
    this.props.history.push(`/edit_comment/${this.postId}/${item.id}`)
  }

  onDelete = (item, index) => {
    if (!this.props.currentUser) {
      this.props.history.push('/my')
      return
    }

    item
      .destroy()
      .then(() =>
        this.setState(state => {
          state.items.splice(index, 1)
          return { items: state.items }
        })
      )
      .catch(err => message.error(err.message))
  }

  render() {
    const { currentUser } = this.props
    const { items } = this.state
    return (
      <List
        header={
          currentUser ? (
            <Button
              size="small"
              type="primary"
              onClick={() => {
                this.props.history.push(`/edit_comment/${this.props.post.id}`)
              }}
            >
              回复
            </Button>
          ) : null
        }
        itemLayout="horizontal"
        dataSource={items}
        renderItem={(item, index) => {
          const authorName = item && item.get('authorName')
          const content = item && item.get('content')
          const authorId = item && item.get('author') && item.get('author').id

          const actions = []

          if (currentUser) {
            actions.push(<span onClick={() => this.onReply(item)}>回复</span>)
          }

          if (currentUser && authorId && currentUser.id && authorId === currentUser.id) {
            actions.push(<span onClick={() => this.onEdit(item)}>编辑</span>)
            actions.push(<span onClick={() => this.onDelete(item, index)}>删除</span>)
          }

          return (
            <Comment
              actions={actions}
              author={authorName}
              content={<MarkdownBlock theme="markdown-body" content={content} />}
              datetime={<span>{moment(item.get('updatedAt')).fromNow()}</span>}
            />
          )
        }}
      />
    )
  }
}

export default CommentList
