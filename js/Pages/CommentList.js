import Parse from 'parse'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import { message, Comment, List } from 'antd'
import ReactMarkdown from 'react-markdown'
import CodeBlock from '../Components/CodeBlock'

import '../github-markdown.css'

class CommentList extends React.Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    login: PropTypes.bool.isRequired,
    currentUserId: PropTypes.string.isRequired
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
    if (!this.props.login) {
      this.props.history.push('/my')
      return
    }
    this.props.history.push(`/edit_comment/${this.postId}`)
  }

  onEdit = item => {
    if (!this.props.login) {
      this.props.history.push('/my')
      return
    }
    this.props.history.push(`/edit_comment/${this.postId}/${item.id}`)
  }

  onDelete = (item, index) => {
    if (!this.props.login) {
      this.props.history.push('/my')
      return
    }
    item
      .destroy()
      .then(() => this.setState(state => ({ items: state.items.splice(index, 1) })))
      .catch(err => message.error(err.message))
  }

  render() {
    const { login, currentUserId } = this.props
    const { items } = this.state
    return (
      <List
        header={`${items.length} 个回复`}
        itemLayout="horizontal"
        dataSource={items}
        renderItem={item => {
          const authorName = item && item.get('authorName')
          const content = item && item.get('content')
          const authorId = item && item.get('author') && item.get('author').id

          const actions = []

          if (login) {
            actions.push(<span onClick={() => this.onReply(item)}>回复</span>)
          }

          if (login && authorId && currentUserId && authorId === currentUserId) {
            actions.push(<span onClick={() => this.onEdit(item)}>编辑</span>)
            actions.push(<span onClick={() => this.onDelete(item)}>删除</span>)
          }

          return (
            <Comment
              actions={actions}
              author={authorName}
              content={
                <ReactMarkdown
                  className="markdown-body"
                  skipHtml
                  source={content}
                  renderers={{ code: CodeBlock }}
                />
              }
              datetime={<span>{moment(item.get('updatedAt')).fromNow()}</span>}
            />
          )
        }}
      />
    )
  }
}

export default CommentList
