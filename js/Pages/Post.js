import Parse from 'parse'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { message, Card, Select } from 'antd'
import ReactMarkdown from 'react-markdown'

import CommentList from './CommentList'
import CodeBlock from '../Components/CodeBlock'

import { login, currentUserId, currentUser, onePost } from '../redux/selectors'
import { updateHeader, updateFooter } from '../redux/actions'

import '../github-markdown.css'

const query = new Parse.Query(Parse.Object.extend('Post'))

class Post extends React.Component {
  static propTypes = {
    boundUpdateHader: PropTypes.func.isRequired,
    boundUpdateFooter: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    login: PropTypes.bool.isRequired,
    post: PropTypes.object.isRequired,
    postId: PropTypes.object.isRequired,
    currentUserId: PropTypes.string
  }

  static defaultProps = {
    currentUserId: null
  }

  operate = [
    { lable: '编辑', value: 0, action: () => this.onEdit() },
    { lable: '删除', value: 1, action: () => this.onDelete() }
  ]

  constructor(props) {
    super(props)
    this.state = { post: this.props.post }

    const { postId } = this.props
    if (!this.state.post) {
      query.equalTo('objectId', postId)
      query.first().then(item => {
        this.setState({ post: item })
      })
    }
  }

  onEdit = () => {
    const { history, login } = this.props
    const { post } = this.state

    if (!login) {
      history.push('/my')
      return
    }

    history.push(`/edit/${post.id}`)
  }

  onDelete = () => {
    const { history, login } = this.props
    const { post } = this.state

    if (!login) {
      history.push('/my')
      return
    }

    post
      .destroy()
      .then(() => {
        history.push('/')
      })
      .catch(err => {
        message.error(err.message)
      })
  }

  onComment = () => {
    const { history, login } = this.props
    const { post } = this.state

    if (!login) {
      history.push('/my')
      return
    }

    history.push(`/edit_comment/${post.id}`)
  }

  handleOperate = value => this.operate[value].action()

  mediaComp = src => (src ? <div /> : <React.Fragment />)

  descriptionComp = content =>
    content ? (
      <ReactMarkdown className="markdown-body" source={content} renderers={{ code: CodeBlock }} />
    ) : (
      <React.Fragment />
    )

  recommandUrlComp = url => (url ? <a href={url}>阅读</a> : <React.Fragment />)

  contentComp = content =>
    content ? (
      <ReactMarkdown
        className="markdown-body"
        skipHtml
        source={content}
        renderers={{ code: CodeBlock }}
      />
    ) : (
      <React.Fragment />
    )

  operateComp = post => {
    const authorId = post && post.get('author') && post.get('author').id
    const currentId = this.props.currentUserId
    return authorId && currentId && authorId === currentId ? (
      <Select defaultValue="操作" onChange={this.handleOperate}>
        {this.operate.map(operate => (
          <Select.Option key={operate.value}>{operate.lable}</Select.Option>
        ))}
      </Select>
    ) : (
      <div />
    )
  }

  render() {
    const { history, boundUpdateHader, boundUpdateFooter } = this.props
    const { post } = this.state

    boundUpdateHader({ title: post.get('title'), onBack: () => history.push('/') })
    boundUpdateFooter({ onAdd: () => this.onComment() })

    const description = this.descriptionComp(post && post.get('description'))
    const recommandUrl = this.recommandUrlComp(post && post.get('recommendUrl'))
    const content = this.contentComp(post && post.get('content'))

    return post ? (
      <React.Fragment>
        <Card title={post.get('title')} extra={this.operateComp}>
          {description}
          {recommandUrl}
          {content}
        </Card>

        <CommentList
          login={this.props.login}
          currentUserId={this.props.currentUserId}
          post={this.props.post}
          history={history}
        />
      </React.Fragment>
    ) : (
      <React.Fragment />
    )
  }
}

export default connect(
  (state, ownProps) => {
    const { postId } = ownProps.match.params
    return {
      login: login(state),
      currentUserId: currentUserId(state),
      currentUser: currentUser(state),
      post: onePost(state, postId),
      postId
    }
  },
  dispatch => ({
    boundUpdateHader: header => dispatch(updateHeader(header)),
    boundUpdateFooter: footer => dispatch(updateFooter(footer))
  })
)(Post)
