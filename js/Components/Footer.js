import React from 'react'
import { Affix, Layout } from 'antd'

const Footer = () => (
  <Affix offsetBottom={0} style={{ marginTop: '20px' }}>
    <Layout.Footer style={{ textAlign: 'center' }}>
      Javascript ©2019 Created by XuGaoYang
    </Layout.Footer>
  </Affix>
)

export default Footer
