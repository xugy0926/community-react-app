import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Input, List, Skeleton } from 'antd'
import Layout from '../Components/Layout'

import { currentUser, more, keyWord, posts, postsCount, loading } from '../redux/selectors'
import { updateHeader, updateFooter, loadPosts, updateKeyWord } from '../redux/actions'

class PostList extends Component {
  static propTypes = {
    boundUpdateHeader: PropTypes.func.isRequired,
    boundUpdateKeyWord: PropTypes.func.isRequired,
    boundLoadPosts: PropTypes.func.isRequired,
    postsCount: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    more: PropTypes.bool.isRequired,
    posts: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.props.boundUpdateHeader({
      history: this.props.history,
      title: '全部文章',
      onAdd: () => this.onAdd()
    })

    const queryStr = window.location.search
    const arr = queryStr.split('&')
    const postId = arr[0].substr(4)

    if (postId) {
      this.props.history.push(`/post/${postId}`)
      return
    }

    this.state = {}

    if (!this.props.postsCount) {
      this.onLoadMore()
    }
  }

  onAdd = () => {
    const { history, currentUser } = this.props
    if (currentUser) {
      history.push('/edit')
    } else {
      this.onMy()
    }
  }

  onMy = () => {
    this.props.history.push('./my')
  }

  onSearch = value => {
    const { boundUpdateKeyWord, boundLoadPosts } = this.props
    boundUpdateKeyWord(value)
    boundLoadPosts()
  }

  onLoadMore = () => {
    const { boundLoadPosts, loading } = this.props

    if (loading) {
      return
    }

    boundLoadPosts()
  }

  onListItem = item => {
    this.props.history.push(`/post/${item.id}`)
  }

  skeletonRender() {
    return (
      <List
        itemLayout="vertical"
        size="large"
        dataSource={[1, 2, 3]}
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
      <Layout>
        <Input.Search
          placeholder="请输入关键字"
          onSearch={value => this.onSearch(value)}
          enterButton
        />
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
      </Layout>
    )
  }
}

export default connect(
  state => ({
    currentUser: currentUser(state),
    more: more(state),
    keyWord: keyWord(state),
    posts: posts(state),
    postsCount: postsCount(state),
    loading: loading(state)
  }),
  dispatch => ({
    boundUpdateKeyWord: content => dispatch(updateKeyWord(content)),
    boundUpdateHeader: header => dispatch(updateHeader(header)),
    boundUpdateFooter: footer => dispatch(updateFooter(footer)),
    boundLoadPosts: posts => dispatch(loadPosts(posts))
  })
)(PostList)
