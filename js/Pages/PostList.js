import Parse from 'parse'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { message, Button, Input, List, Skeleton } from 'antd'

import {
  currentUserName,
  login,
  more,
  keyWord,
  posts,
  postsCount,
  loading
} from '../redux/selectors'
import {
  updateAccount,
  updateHeader,
  updateFooter,
  updateMore,
  loadPosts,
  updateKeyWord,
  updateLoading
} from '../redux/actions'

const SkeletonItems = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22
]

const Post = Parse.Object.extend('Post')
const query = new Parse.Query(Post)
query.limit(30)
query.descending('createdAt')

class PostList extends React.Component {
  static propTypes = {
    boundUpdateHeader: PropTypes.func.isRequired,
    boundUpdateKeyWord: PropTypes.func.isRequired,
    boundUpdateAccount: PropTypes.func.isRequired,
    boundLoadPosts: PropTypes.func.isRequired,
    boundUpdateMore: PropTypes.func.isRequired,
    boundUpdateLoading: PropTypes.func.isRequired,
    postsCount: PropTypes.number.isRequired,
    keyWord: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    login: PropTypes.bool.isRequired,
    more: PropTypes.bool.isRequired,
    posts: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)
    props.boundUpdateHeader({
      title: '全部文章',
      onSearch: e => this.onSearch(e),
      onAdd: () => this.onAdd()
    })

    const queryStr = window.location.search
    const arr = queryStr.split('&')
    const postId = arr[0].substr(4)

    if (postId) {
      this.props.history.push(`/post/${postId}`)
    }

    this.state = {}

    if (!props.postsCount) {
      this.onLoadMore()
    }
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

  onSearch = value => {
    const { boundUpdateKeyWord } = this.props
    boundUpdateKeyWord(value)
  }

  onLoadMore = () => {
    const {
      boundUpdateAccount,
      boundLoadPosts,
      boundUpdateMore,
      boundUpdateLoading,
      postsCount,
      keyWord,
      loading
    } = this.props

    if (loading) {
      return
    }

    boundUpdateLoading(true)

    query.skip(postsCount)
    query.matches('title', keyWord)
    query
      .find()
      .then(results => {
        boundLoadPosts(results)
        boundUpdateLoading(false)
        if (results.length < 1) {
          boundUpdateMore(false)
        }
      })
      .catch(err => {
        boundUpdateLoading(false)
        const { code, messge } = err
        if (code && code === Parse.Error.INVALID_SESSION_TOKEN) {
          Parse.User.logOut()
          boundUpdateAccount(null)
          message.error('登录已过期，请重新登录')
        } else {
          message.error(messge)
        }
      })
  }

  onListItem = item => {
    this.props.history.push(`/post/${item.id}`)
  }

  skeletonRender() {
    return (
      <List
        itemLayout="vertical"
        size="large"
        dataSource={[...SkeletonItems]}
        renderItem={item => (
          <List.Item key={item}>
            <Skeleton
              loading={this.props.loading}
              active
              title={false}
              paragraph={{ rows: 1, width: '100%' }}
            />
          </List.Item>
        )}
      />
    )
  }

  render() {
    const { posts, more, loading } = this.props

    const loadMore =
      more && !loading ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 10,
            marginBottom: 10,
            height: 32,
            lineHeight: '32px'
          }}
        >
          <Button onClick={() => this.onLoadMore()}>加载更多</Button>
        </div>
      ) : null

    return (
      <React.Fragment>
        <Input.Search placeholder="请输入关键字" onSearch={() => this.onSearch()} enterButton />
        {posts && posts.length > 0 ? (
          <List
            itemLayout="horizontal"
            loadMore={loadMore}
            dataSource={posts}
            renderItem={item => (
              <List.Item key={item.id}>
                <Skeleton loading={loading} active>
                  <List.Item.Meta
                    title={<a onClick={() => this.onListItem(item)}>{item.get('title')}</a>}
                  />
                </Skeleton>
              </List.Item>
            )}
          />
        ) : null}
        {this.props.loading ? this.skeletonRender() : null}
      </React.Fragment>
    )
  }
}

export default connect(
  state => ({
    currentUserName: currentUserName(state),
    login: login(state),
    more: more(state),
    keyWord: keyWord(state),
    posts: posts(state),
    postsCount: postsCount(state),
    loading: loading(state)
  }),
  dispatch => ({
    boundUpdateAccount: user => dispatch(updateAccount(user)),
    boundUpdateKeyWord: content => dispatch(updateKeyWord(content)),
    boundUpdateHeader: header => dispatch(updateHeader(header)),
    boundUpdateFooter: footer => dispatch(updateFooter(footer)),
    boundUpdateMore: more => dispatch(updateMore(more)),
    boundLoadPosts: posts => dispatch(loadPosts(posts)),
    boundUpdateLoading: loading => dispatch(updateLoading(loading))
  })
)(PostList)
