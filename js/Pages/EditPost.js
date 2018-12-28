import Parse from 'parse'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

import { login, currentUserName, currentUser, onePost } from '../redux/selectors'
import { updateHeader, updatePost } from '../redux/actions'

const Post = Parse.Object.extend('Post')

const styles = theme => ({
  container: {
    marginTop: 100,
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16
  }
})

class EditPost extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: props.post && props.post.get('title'),
      content: props.post && props.post.get('content'),
      description: props.post && props.post.get('description')
    }
  }

  onSave = () => {
    const { history, alert, boundUpdatePost, currentUser, currentUserName } = this.props
    const { title, content } = this.state
    let { post } = this.props

    post = post || new Post()
    post.set({
      title,
      content,
      author: currentUser,
      authorName: currentUserName
    })

    if (!post.id) {
      const roleACL = new Parse.ACL()
      roleACL.setPublicReadAccess(true)
      roleACL.setWriteAccess(currentUser, true)
      post.setACL(roleACL)
    }

    post
      .save()
      .then(result => {
        boundUpdatePost(result)
        history.goBack()
      })
      .catch(err => {
        alert.show(err.message)
      })
  }

  titleChange = event => {
    this.setState({ title: event.target.value })
  }

  contentChange = event => {
    this.setState({ content: event.target.value })
  }

  render() {
    const { history, classes, boundUpdateHader } = this.props
    boundUpdateHader({
      title: '编辑文章',
      onBack: () => history.goBack(),
      onSave: () => this.onSave()
    })

    return (
      <form className={classes.container} noValidate autoComplete="off">
        <TextField
          id="title"
          label="标题"
          autoFocus
          className={classes.textField}
          margin="dense"
          variant="outlined"
          type="text"
          fullWidth
          value={this.state.title}
          onChange={this.titleChange}
        />
        <TextField
          id="content"
          label="内容"
          multiline
          className={classes.textField}
          margin="dense"
          variant="outlined"
          type="text"
          fullWidth
          value={this.state.content}
          onChange={this.contentChange}
        />
      </form>
    )
  }
}

EditPost.propTypes = {
  classes: PropTypes.object.isRequired
}

export default connect(
  (state, ownProps) => {
    const postId = ownProps.match.params.postId
    return {
      login: login(state),
      currentUserName: currentUserName(state),
      currentUser: currentUser(state),
      post: onePost(state, postId),
      postId
    }
  },
  dispatch => {
    return {
      boundUpdateHader: header => dispatch(updateHeader(header)),
      boundUpdatePost: post => dispatch(updatePost(post))
    }
  }
)(withStyles(styles)(EditPost))
