import Parse from 'parse'
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import InfiniteScroll from 'react-infinite-scroller'
import CommentItem from './CommentItem'

import '../github-markdown.css'

const styles = theme => ({
  name: {
    fontSize: 14
  },
  text: {
    paddingTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2
  },
  list: {
    marginBottom: theme.spacing.unit * 2
  },
  item: {
    marginTop: 10
  },
  subHeader: {
    backgroundColor: theme.palette.background.paper
  },
  load: {
    flexGrow: 1
  }
})

class CommentList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: []
    }

    this.postId = props.post ? props.post.id : ''
    this.count = 0
    this.more = true
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
      const items = [...this.state.items, ...results]
      this.setState({ items })
    })
  }

  onReply = item => {
    if (!this.props.login) {
      this.props.history.push('/my')
      return
    }
    this.props.history.push('/edit_comment/' + this.postId)
  }

  onEdit = item => {
    if (!this.props.login) {
      this.props.history.push('/my')
      return
    }
    this.props.history.push('/edit_comment/' + this.postId + '/' + item.id)
  }

  onDelete = (item, index) => {
    if (!this.props.login) {
      this.props.history.push('/my')
      return
    }
    item
      .destroy()
      .then(() => {
        let items = [...this.state.items]
        items.splice(index, 1)
        this.setState({ items })
      })
      .catch(err => {
        this.props.alert.show(err.message)
      })
  }

  render() {
    const { classes } = this.props
    const { items } = this.state
    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={this.loadMore}
        hasMore={this.more}
        loader={
          <div className={classes.load} key={0}>
            <LinearProgress color="secondary" />
          </div>
        }
      >
        {items.map((item, index) => (
          <div className={classes.item} key={item.id}>
            <CommentItem
              item={item}
              login={this.props.login}
              currentUserId={this.props.currentUserId}
              onReply={this.onReply}
              onEdit={this.onEdit}
              onDelete={i => this.onDelete(i, index)}
            />
          </div>
        ))}
      </InfiniteScroll>
    )
  }
}

CommentList.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(CommentList)
