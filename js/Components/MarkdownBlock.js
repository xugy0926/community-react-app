import ReactMarkdown from 'react-markdown'
import React from 'react'

import CodeBlock from './CodeBlock'

import '../github-markdown.css'
import '../todo-markdown.css'

export default function MarkdownBlock({ theme, content }) {
  return (
    <ReactMarkdown
      className={theme}
      skipHtml
      linkTarget="url"
      source={content}
      softBreak="br"
      renderers={{ code: CodeBlock }}
    />
  )
}
