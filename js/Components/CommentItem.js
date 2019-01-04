import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import blue from '@material-ui/core/colors/blue'
import ReplyIcon from '@material-ui/icons/Reply'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'

import ReactMarkdown from 'react-markdown'

import CodeBlock from '../Components/CodeBlock'

const styles = theme => ({
  card: {
    maxWidth: 'auto'
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  actions: {
    display: 'flex',
    justify: 'right'
  },
  iconButton: {
    padding: 4
  },
  avatar: {
    height: 32,
    width: 32,
    backgroundColor: blue[500]
  }
})

const CommentItem = ({ classes, item, login, currentUserId, onReply, onEdit, onDelete }) => {
  const authorName = item && item.get('authorName')
  const content = item && item.get('content')
  const authorId = item && item.get('author') && item.get('author').id

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar aria-label="Recipe" className={classes.avatar}>
            {authorName.substr(0, 1)}
          </Avatar>
        }
        subheader={authorName}
      />
      <CardContent>
        <ReactMarkdown className="markdown-body" skipHtml={true} source={content} renderers={{ code: CodeBlock }} />
      </CardContent>
      <CardActions className={classes.actions} disableActionSpacing>
        {login ? (
          <IconButton
            aria-label="reply"
            className={classes.iconButton}
            onClick={() => onReply(item)}
          >
            <ReplyIcon />
          </IconButton>
        ) : (
          <React.Fragment />
        )}
        {login && authorId && currentUserId && authorId === currentUserId ? (
          <React.Fragment>
            <IconButton
              aria-label="edit"
              className={classes.iconButton}
              onClick={() => onEdit(item)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              className={classes.iconButton}
              onClick={() => onDelete(item)}
            >
              <DeleteIcon />
            </IconButton>
          </React.Fragment>
        ) : (
          <React.Fragment />
        )}
      </CardActions>
    </Card>
  )
}

CommentItem.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(CommentItem)
