import React from 'react'
import PropTypes from 'prop-types'
import { Affix, Avatar, PageHeader, Icon } from 'antd'

const styles = {
  main: {
    boxShadow: '0 2px 8px #f0f1f2'
  }
}

class Header extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    currentUser: PropTypes.object.isRequired,
    onBack: PropTypes.func,
    onAdd: PropTypes.func
  }

  static defaultProps = {
    onBack: () => {},
    onAdd: () => {}
  }

  render() {
    const { history, title, currentUser, onBack, onAdd } = this.props
    const avatarSrc = currentUser && currentUser.get('avatar')

    return (
      <Affix offsetTop={0} style={{ marginBottom: '20px' }}>
        <PageHeader
          style={styles.main}
          onBack={() => onBack && onBack()}
          title={title}
          extra={
            <div>
              {onAdd ? (
                <Icon type="plus" style={{ marginRight: 20 }} onClick={() => this.props.onAdd()} />
              ) : null}
              <Icon
                type="unordered-list"
                style={{ marginRight: 20 }}
                onClick={() => history.push('/projects')}
              />
              {avatarSrc ? (
                <Avatar size="small" src={avatarSrc} onClick={() => history.push('/my')} />
              ) : (
                <Icon type="user" onClick={() => history.push('/my')} />
              )}
            </div>
          }
        />
      </Affix>
    )
  }
}

export default Header
