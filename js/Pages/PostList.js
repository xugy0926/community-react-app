import Parse from 'parse'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import LinearProgress from '@material-ui/core/LinearProgress'
import InfiniteScroll from 'react-infinite-scroller'

import { currentUserName, login, more, posts, postsCount } from '../redux/selectors'
import { updateHeader, updateFooter, updateMore, loadPosts } from '../redux/actions'

const styles = theme => ({
  load: {
    flexGrow: 1
  }
})

const Post = Parse.Object.extend('Post')
const query = new Parse.Query(Post)
query.limit(30)
query.descending('createdAt')

class PostList extends React.Component {
  state = { snippet: false }

  handleClose = () => {
    this.setState({ snippet: false })
  }

  onAdd = () => {
    const { history, login } = this.props
    if (login) {
      history.push('/edit')
    } else {
      this.onMy()
    }
  }

  onMy = () => {
    this.props.history.push('./my')
  }

  onFavorite = () => {
    this.setState({ snippet: true })
  }

  loadMore = () => {
    const { boundLoadPosts, boundUpdateMore, postsCount } = this.props
    query.skip(postsCount)
    query.find().then(results => {
      if (results.length < 1) {
        boundUpdateMore(false)
        return
      }

      boundLoadPosts(results)
    })
  }

  onListItem = item => {
    this.props.history.push('/post/' + item.id)
  }

  render() {
    const { classes, boundUpdateHeader, boundUpdateFooter, posts, more } = this.props
    boundUpdateHeader({ title: '全部文章' })
    boundUpdateFooter({
      onFavorite: () => this.onFavorite(),
      onAdd: () => this.onAdd(),
      onMy: () => this.onMy()
    })

    return (
      <React.Fragment>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadMore}
          hasMore={more}
          loader={
            <div className={classes.load} key={-1}>
              <LinearProgress color="secondary" />
            </div>
          }
        >
          {posts.map(item => (
            <ListItem button onClick={() => this.onListItem(item)} key={item.id}>
              <ListItemText primary={item.get('title')} secondary={item.get('description')} />
            </ListItem>
          ))}
        </InfiniteScroll>
        <Dialog open={this.state.snippet} onClose={this.handleClose}>
          <DialogTitle id="alert-dialog-title">知识片段</DialogTitle>
          <DialogContent>
            <DialogContentText>coming soon...</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

PostList.propTypes = {
  classes: PropTypes.object.isRequired
}

export default connect(
  state => {
    return {
      currentUserName: currentUserName(state),
      login: login(state),
      more: more(state),
      posts: posts(state),
      postsCount: postsCount(state)
    }
  },
  dispatch => {
    return {
      boundUpdateHeader: header => dispatch(updateHeader(header)),
      boundUpdateFooter: footer => dispatch(updateFooter(footer)),
      boundUpdateMore: more => dispatch(updateMore(more)),
      boundLoadPosts: posts => dispatch(loadPosts(posts))
    }
  }
)(withStyles(styles)(PostList))
