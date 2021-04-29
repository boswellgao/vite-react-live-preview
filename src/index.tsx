import React, { Suspense,lazy } from 'react'
import ReactDom from 'react-dom'
import {MDXProvider,mdx} from '@mdx-js/react'
import Highlight, {defaultProps} from 'prism-react-renderer'
import {LiveProvider, LiveEditor, LiveError, LivePreview} from 'react-live'

import Readme from './Readme.mdx'

const Pre = (props:any) => {
    return <div className='code-box' style={{boxSizing: 'border-box',padding: '8px',margin:'4px',border: '1px solid #f0f0f0'}} {...props} />
}

const CodeBlock =  (props:any) => {
    let {children, className, live, render } = props
    const language = className.replace(/language-/, '')

    const Button = lazy(()=>import('./components/button'))
    const Image = lazy(()=>import('./components/image'))
    let scope = Object.assign({},{mdx},{Button,Image})

    if (live) {
        return (
            <Suspense  fallback=''>
                <LiveProvider
                    code={children.trim()}
                    scope={scope}
                    noInline
                >
                    <LivePreview style={{
                        background: '#fff',
                        padding: '2rem',
                        borderBottom: '1px solid #f0f0f0'
                    }}/>
                    <LiveEditor style={{backgroundColor:'rgb(246,246,255)'}}/>
                    <LiveError />
                </LiveProvider>
            </Suspense>
        )
    }
    if (render) {
        return (
            <Suspense  fallback=''>
                <LiveProvider
                    code={children.trim()}
                    scope={scope}
                    noInline
                >
                    <LivePreview />
                </LiveProvider>
            </Suspense>
        )
    }
    return (
        <Highlight {...defaultProps} code={children.trim()} language={language}>
            {({className, style, tokens, getLineProps, getTokenProps}) => (
                <pre className={className} style={{...style, padding: '20px'}}>
                    {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({line, key: i})}>
                            {line.map((token, key) => (
                                <span key={key} {...getTokenProps({token, key})} />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    )
}

const components = {
    pre: Pre,
    code: CodeBlock
}

const Content =  (props:any) => {
    return (
      <MDXProvider components={components}>
        <main {...props}/>
      </MDXProvider>
    )    
}




ReactDom.render(<Content><Readme /></Content>,document.getElementById('root'))