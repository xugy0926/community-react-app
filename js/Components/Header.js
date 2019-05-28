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
          extra={this.props.onAdd ? <Icon type="plus" onClick={() => this.props.onAdd()} /> : null}
        />
      </Affix>
    )
  }
}

export default Header
