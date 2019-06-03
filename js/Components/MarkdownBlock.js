import ReactMarkdown from 'react-markdown'
import React from 'react'

import CodeBlock from './CodeBlock'

import '../github-markdown.css'

export default function MarkdownBlock(props) {
  return (
    <ReactMarkdown
      className="markdown-body"
      skipHtml
      source={props.content}
      renderers={{ code: CodeBlock }}
    />
  )
}
