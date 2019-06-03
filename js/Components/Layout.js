import React from 'react'
import { Col } from 'antd'

export default function Layout({ children }) {
  return (
    <Col xs={24} sm={24} md={24} lg={{ span: 12, offset: 6 }}>
      {children}
    </Col>
  )
}
