import React, { useContext } from 'react'
import { SelectedContext } from './context'
import { Heading } from 'components/Heading'
import { InlineCode } from 'components/InlineCode'
import { Blockquote } from 'components/BlockQuote'
import { MdxCodeBlock } from 'components/CodeBlock'
import { ZoomImage } from 'components/ZoomImage'
import Link from 'components/Link'
import { shortcodes } from '../../mdxGlobalComponents'
import Markdown from 'markdown-to-jsx'

interface CodeReferenceProps {
    file: string
    description?: string
    children: React.ReactNode
    language?: string
    lines?: string
}

interface LinkProps {
    to: string
    children: React.ReactNode
    className?: string
}

const A = (props: LinkProps) => <Link {...props} className="text-red hover:text-red font-semibold" />

export default function CodeReference({
    file,
    description,
    children,
    language = 'javascript',
    lines,
}: CodeReferenceProps) {
    const { setSelectedFile, setSelectedLines } = useContext(SelectedContext)

    const handleMouseOver = () => {
        if (!lines) return

        const parsedLines = lines.split(',').flatMap((line) => {
            if (line.includes('-')) {
                const [start, end] = line.split('-')
                return Array.from({ length: parseInt(end) - parseInt(start) + 1 }, (_, i) => parseInt(start) + i)
            } else {
                return [parseInt(line)]
            }
        })

        setSelectedFile(file)
        setSelectedLines(parsedLines)
    }

    const handleMouseLeave = () => {
        setSelectedLines([])
    }

    const options = {
        overrides: {
            h1: (props: React.ComponentProps<typeof Heading>) => <Heading as="h1" {...props} />,
            h2: (props: React.ComponentProps<typeof Heading>) => <Heading as="h2" {...props} />,
            h3: (props: React.ComponentProps<typeof Heading>) => <Heading as="h3" {...props} />,
            h4: (props: React.ComponentProps<typeof Heading>) => <Heading as="h4" {...props} />,
            h5: (props: React.ComponentProps<typeof Heading>) => <Heading as="h5" {...props} />,
            h6: (props: React.ComponentProps<typeof Heading>) => <Heading as="h6" {...props} />,
            code: InlineCode,
            blockquote: Blockquote,
            pre: MdxCodeBlock,
            img: ZoomImage,
            video: (props: React.ComponentProps<typeof ZoomImage>) => (
                <ZoomImage>
                    <video {...props} />
                </ZoomImage>
            ),
            a: A,
            ...shortcodes,
        },
    }

    return (
        <div
            className="my-8 group hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-l-4 hover:border-gray-300 dark:hover:border-gray-700 hover:pl-3 transition-all"
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-mono text-gray-500 dark:text-gray-400">{file}</span>
                {description && <span className="text-sm text-gray-500 dark:text-gray-400">- {description}</span>}
            </div>
            <div className="prose dark:prose-dark max-w-none">
                <Markdown options={options}>
                    {/* The empty space below is load-bearing. */}
                    {children}
                </Markdown>
            </div>
        </div>
    )
}
