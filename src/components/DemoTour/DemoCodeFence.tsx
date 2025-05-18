import React, { useState, useContext } from 'react'
import Highlight, { defaultProps, Language } from 'prism-react-renderer'
import { darkTheme, lightTheme } from 'components/CodeBlock/theme'
import { useValues } from 'kea'
import { layoutLogic } from 'logic/layoutLogic'
import { AnimatePresence, motion } from 'framer-motion'
import { SelectedContext } from './DemoContext'

interface DemoCodeFenceProps {
    language: string
    children: string
    showLineNumbers?: boolean
}

export const DemoCodeFence = ({ language, children, showLineNumbers = false }: DemoCodeFenceProps) => {
    const { websiteTheme } = useValues(layoutLogic)
    const [tooltipVisible, setTooltipVisible] = useState(false)
    const { selectedLines } = useContext(SelectedContext)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(children.trim())
        setTooltipVisible(true)
        setTimeout(() => {
            setTooltipVisible(false)
        }, 1000)
    }

    return (
        <div className="code-block relative mt-2 mb-4 border-t border-light dark:border-dark rounded-none h-full flex flex-col">
            <Highlight
                {...defaultProps}
                code={children.trim()}
                language={language as Language}
                theme={websiteTheme === 'dark' ? darkTheme : lightTheme}
            >
                {({ className, tokens, getLineProps, getTokenProps }) => (
                    <pre className="w-full m-0 p-0 bg-accent dark:bg-accent-dark flex-1 overflow-auto">
                        <div className="flex whitespace-pre-wrap relative">
                            {showLineNumbers && (
                                <pre className="m-0 py-4 pr-3 pl-5 inline-block font-code font-medium text-sm bg-accent dark:bg-accent-dark">
                                    <span
                                        className="select-none flex flex-col dark:text-white/60 text-black/60 shrink-0 pb-8"
                                        aria-hidden="true"
                                    >
                                        {tokens.map((_, i) => (
                                            <span className="inline-block text-right align-middle" key={i}>
                                                <span>{i + 1}</span>
                                            </span>
                                        ))}
                                    </span>
                                </pre>
                            )}
                            <code
                                className={`${className} block !m-0 p-4 pb-8 shrink-0 font-code font-medium text-sm article-content-ignore`}
                            >
                                {tokens.map((line, i) => {
                                    const { className, ...props } = getLineProps({ line, key: i })
                                    const isHighlighted = selectedLines.includes(i + 1)
                                    return (
                                        <div
                                            key={i}
                                            className={`${className} ${
                                                isHighlighted ? 'bg-yellow/10 dark:bg-yellow/20' : ''
                                            }`}
                                            {...props}
                                        >
                                            {line.map((token, key) => (
                                                <span key={key} {...getTokenProps({ token, key })} />
                                            ))}
                                        </div>
                                    )
                                })}
                            </code>
                        </div>
                    </pre>
                )}
            </Highlight>
        </div>
    )
}
