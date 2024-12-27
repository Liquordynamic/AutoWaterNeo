// custom.d.ts
import * as React from 'react'

// 扩展 React 的 InputHTMLAttributes 类型
declare module 'react' {
  interface InputHTMLAttributes<T> extends React.DOMAttributes<T> {
    webkitdirectory?: boolean
    directory?: boolean
  }
}
