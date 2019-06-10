import React from 'react'
import PropTypes from 'prop-types'
import { Card, Col, Dropdown, Icon } from 'antd'
import MarkdownBlock from './MarkdownBlock'

const Todo = ({ id, content, menus }) => (
  <Card size="small" key={id} style={{ borderRadius: 6, marginTop: 10 }}>
    <Col span={22}>
      <MarkdownBlock theme="todo-body" content={content} />
    </Col>
    <Col span={2}>
      <Dropdown overlay={menus}>
        <Icon type="ellipsis" />
      </Dropdown>
    </Col>
  </Card>
)

Todo.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  menus: PropTypes.object.isRequired
}

export default Todo
