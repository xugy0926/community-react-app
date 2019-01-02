import Parse from 'parse'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import ReactMarkdown from 'react-markdown'

import CommentList from '../Components/CommentList'
import CodeBlock from '../Components/CodeBlock'

import { login, currentUserId, currentUser, onePost } from '../redux/selectors'
import { updateHeader, updateFooter } from '../redux/actions'

import '../github-markdown.css'

const styles = {
  media: {
    height: 140
  },
  commentbtn: {
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: -8
  }
}

const query = new Parse.Query(Parse.Object.extend('Post'))

class Post extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      post: this.props.post
    }

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

    history.push('/edit/' + post.id)
  }

  onDelete = () => {
    const { history, alert, login } = this.props
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
        alert.show(err.message)
      })
  }

  onComment = () => {
    const { history, alert, login } = this.props
    const { post } = this.state

    if (!login) {
      history.push('/my')
      return
    }

    history.push('/edit_comment/' + post.id)
  }

  mediaComp(src) {
    return src ? <CardMedia className={this.props.classes.media} /> : <React.Fragment />
  }

  descriptionComp(content) {
    return content ? (
      <ReactMarkdown className="markdown-body" source={content} renderers={{ code: CodeBlock }} />
    ) : (
      <React.Fragment />
    )
  }

  recommandUrlComp(url) {
    return url ? <a href={url}>阅读</a> : <React.Fragment />
  }

  contentComp(content) {
    return content ? (
      <ReactMarkdown className="markdown-body" source={content} renderers={{ code: CodeBlock }} />
    ) : (
      <React.Fragment />
    )
  }

  editComp(post) {
    const authorId = post && post.get('author') && post.get('author').id
    const currentId = this.props.currentUserId
    return authorId && currentId && authorId === currentId ? (
      <CardActions>
        <Button size="small" color="primary" onClick={this.onEdit}>
          编辑
        </Button>
        <Button size="small" color="primary" onClick={this.onDelete}>
          删除
        </Button>
      </CardActions>
    ) : (
      <div />
    )
  }

  render() {
    const { classes, history, boundUpdateHader, boundUpdateFooter, postId } = this.props
    const { post } = this.state

    boundUpdateHader({ onBack: () => history.push('/') })
    boundUpdateFooter({ onAdd: () => this.onComment() })

    const media = this.mediaComp(post && post.get('media'))
    const description = this.descriptionComp(post && post.get('description'))
    const recommandUrl = this.recommandUrlComp(post && post.get('recommendUrl'))
    const content = this.contentComp(post && post.get('content'))
    const editComp = this.editComp(post)

    return post ? (
      <React.Fragment>
        <Card className={classes.card}>
          {media}
          <CardContent>
            <Typography gutterBottom variant="h4" component="h4">
              {post.get('title')}
            </Typography>
            {description}
            {recommandUrl}
            {content}
          </CardContent>
          {editComp}
        </Card>

        <CommentList
          alert={this.props.alert}
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

Post.propTypes = {
  classes: PropTypes.object.isRequired
}

export default connect(
  (state, ownProps) => {
    const postId = ownProps.match.params.postId
    return {
      login: login(state),
      currentUserId: currentUserId(state),
      currentUser: currentUser(state),
      post: onePost(state, postId),
      postId
    }
  },
  dispatch => {
    return {
      boundUpdateHader: header => dispatch(updateHeader(header)),
      boundUpdateFooter: footer => dispatch(updateFooter(footer))
    }
  }
)(withStyles(styles)(Post))
