import React from 'react'
import PropTypes from 'prop-types'
import { Affix, PageHeader, Icon } from 'antd'

const styles = {
  main: {
    boxShadow: '0 2px 8px #f0f1f2'
  }
}

class Header extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    onBack: PropTypes.func,
    onAdd: PropTypes.func
  }

  static defaultProps = {
    onBack: () => {},
    onAdd: () => {}
  }

  render() {
    return (
      <Affix offsetTop={0} style={{ marginBottom: '20px' }}>
        <PageHeader
          style={styles.main}
          onBack={() => this.props.onBack()}
          title={this.props.title}
          extra={
            <div>
              {this.props.onAdd ? (
                <Icon type="plus" style={{ marginRight: 20 }} onClick={() => this.props.onAdd()} />
              ) : null}
              <Icon
                type="unordered-list"
                style={{ marginRight: 20 }}
                onClick={() => this.props.history.push('/projects')}
              />
              <Icon type="user" onClick={() => this.props.history.push('/my')} />
            </div>
          }
        />
      </Affix>
    )
  }
}

export default Header
