import Parse from 'parse'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { message, Card, Select } from 'antd'

import MarkdownBlock from '../Components/MarkdownBlock'
import CommentList from './CommentList'

import { login, currentUserId, currentUser, onePost } from '../redux/selectors'
import { updateHeader } from '../redux/actions'
import Layout from '../Components/Layout'

const query = new Parse.Query(Parse.Object.extend('Post'))

class Post extends React.Component {
  static propTypes = {
    boundUpdateHeader: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    login: PropTypes.bool.isRequired,
    post: PropTypes.object,
    postId: PropTypes.object.isRequired,
    currentUserId: PropTypes.string
  }

  static defaultProps = {
    currentUserId: null,
    post: null
  }

  operate = [
    { lable: '编辑', value: 0, action: () => this.onEdit() },
    { lable: '删除', value: 1, action: () => this.onDelete() }
  ]

  constructor(props) {
    super(props)
    const { boundUpdateHeader, post, postId, history } = props

    this.state = { post }

    boundUpdateHeader({
      history,
      title: post && post.get('title'),
      onAdd: () => this.onComment(),
      onBack: () => history.push('/')
    })

    if (!post) {
      query.equalTo('objectId', postId)
      query.first().then(post => {
        this.setState({ post })
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

  descriptionComp = content => (content ? <MarkdownBlock content={content} /> : <React.Fragment />)

  recommandUrlComp = url => (url ? <a href={url}>阅读</a> : <React.Fragment />)

  contentComp = content => (content ? <MarkdownBlock content={content} /> : <React.Fragment />)

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
    const { history, login, currentUserId } = this.props
    const { post } = this.state

    const description = this.descriptionComp(post && post.get('description'))
    const recommandUrl = this.recommandUrlComp(post && post.get('recommendUrl'))
    const content = this.contentComp(post && post.get('content'))

    return post ? (
      <Layout>
        <Card title={post.get('title')} extra={this.operateComp}>
          {description}
          {recommandUrl}
          {content}
        </Card>

        <CommentList login={login} currentUserId={currentUserId} post={post} history={history} />
      </Layout>
    ) : (
      <Layout />
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
    boundUpdateHeader: header => dispatch(updateHeader(header))
  })
)(Post)
