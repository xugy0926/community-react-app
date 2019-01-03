import Parse from 'parse'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { withAlert } from 'react-alert'

import { login, currentUserName, currentUser, onePost } from '../redux/selectors'
import { updateHeader } from '../redux/actions'

const Comment = Parse.Object.extend('Comment')

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  dense: {
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16
  }
})

class EditComment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      content: ''
    }

    this.comment = null

    if (props.commentId) {
      const Comment = Parse.Object.extend('Comment')
      const query = new Parse.Query(Comment)
      query.equalTo('objectId', props.commentId)

      query.first().then(comment => {
        this.comment = comment
        this.setState({
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
    const { history, currentUser, currentUserName, post, alert } = this.props
    const { content } = this.state

    if (!content || content.length < 3) {
      alert.show('内容最少 3 个字')
      return
    }

    const comment = this.comment || new Comment()
    comment.set({
      content,
      author: currentUser,
      authorName: currentUserName,
      parent: post
    })

    if (!comment.id) {
      const roleACL = new Parse.ACL()
      roleACL.setPublicReadAccess(true)
      roleACL.setWriteAccess(currentUser, true)
      comment.setACL(roleACL)
    }

    comment
      .save()
      .then(() => {
        history.goBack()
      })
      .catch(err => alert.show(err.message))
  }

  contentChange = event => {
    this.setState({ content: event.target.value })
  }

  render() {
    const { history, classes, boundUpdateHader, post } = this.props
    const { content } = this.state

    boundUpdateHader({
      title: '编辑评论',
      onBack: () => history.goBack(),
      onSave: () => this.onSave()
    })

    return (
      <form className={classes.container} noValidate autoComplete="off">
        <Typography gutterBottom variant="h5" component="h2">
          {post && post.get('title')}
        </Typography>
        <TextField
          id="content"
          label="评论"
          multiline
          margin="dense"
          variant="outlined"
          type="text"
          fullWidth
          value={content}
          onChange={this.contentChange}
        />
      </form>
    )
  }
}

EditComment.propTypes = {
  classes: PropTypes.object.isRequired
}

export default connect(
  (state, ownProps) => {
    const postId = ownProps.match.params.postId
    const commentId = ownProps.match.params.commentId
    return {
      login: login(state),
      currentUserName: currentUserName(state),
      currentUser: currentUser(state),
      post: onePost(state, postId),
      postId,
      commentId
    }
  },
  dispatch => {
    return {
      boundUpdateHader: header => dispatch(updateHeader(header))
    }
  }
)(withStyles(styles)(withAlert(EditComment)))
