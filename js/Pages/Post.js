import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { message, Card, Select } from 'antd'

import MarkdownBlock from '../Components/MarkdownBlock'
import CommentList from './CommentList'

import { currentUser } from '../redux/selectors'
import { updateHeader, loadPost } from '../redux/actions'
import Layout from '../Components/Layout'

class Post extends React.Component {
  static propTypes = {
    boundUpdateHeader: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    boundLoadPost: PropTypes.func.isRequired,
    postId: PropTypes.object.isRequired,
    currentUser: PropTypes.object
  }

  static defaultProps = {
    currentUser: null
  }

  operate = [
    { lable: '编辑', value: 0, action: () => this.onEdit() },
    { lable: '删除', value: 1, action: () => this.onDelete() }
  ]

  constructor(props) {
    super(props)
    const { boundUpdateHeader, boundLoadPost, postId, history } = props

    this.state = { post: null }

    boundLoadPost(postId).then(post => {
      this.setState({ post }, () =>
        boundUpdateHeader({
          history,
          title: post && post.get('title'),
          onAdd: () => this.onComment(),
          onBack: () => history.push('/')
        })
      )
    })
  }

  onEdit = () => {
    const { history, currentUser } = this.props
    const { post } = this.state

    if (!currentUser) {
      history.push('/my')
      return
    }

    history.push(`/edit/${post.id}`)
  }

  onDelete = () => {
    const { history, currentUser } = this.props
    const { post } = this.state

    if (!currentUser) {
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
    const { history, currentUser } = this.props
    const { post } = this.state

    if (!currentUser) {
      history.push('/my')
      return
    }

    history.push(`/edit_comment/${post.id}`)
  }

  handleOperate = value => this.operate[value].action()

  mediaComp = src => (src ? <div /> : <React.Fragment />)

  descriptionComp = content =>
    content ? <MarkdownBlock theme="markdown-body" content={content} /> : <React.Fragment />

  recommandUrlComp = url => (url ? <a href={url}>阅读</a> : <React.Fragment />)

  contentComp = content =>
    content ? <MarkdownBlock theme="markdown-body" content={content} /> : <React.Fragment />

  operateComp = post => {
    const authorId = post && post.get('author') && post.get('author').id
    const currentId = this.props.currentUser && this.props.currentUser.id
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
    const { history, currentUser } = this.props
    const { post } = this.state

    const description = this.descriptionComp(post && post.get('description'))
    const recommandUrl = this.recommandUrlComp(post && post.get('recommendUrl'))
    const content = this.contentComp(post && post.get('content'))

    return post ? (
      <Layout>
        <Card title={post.get('title')} extra={this.operateComp(post)}>
          {description}
          {recommandUrl}
          {content}
        </Card>

        <CommentList currentUser={currentUser} post={post} history={history} />
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
      currentUser: currentUser(state),
      postId
    }
  },
  dispatch => ({
    boundUpdateHeader: header => dispatch(updateHeader(header)),
    boundLoadPost: id => dispatch(loadPost(id))
  })
)(Post)
