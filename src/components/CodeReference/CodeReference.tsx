import React, { useContext } from 'react'
import { SingleCodeBlock } from 'components/CodeBlock'
import { Heading } from 'components/Heading'
import { SelectedContext } from './context'

interface CodeReferenceProps {
    file: string
    description?: string
    children: string
    language?: string
    lines?: string
}

export default function CodeReference({
    file,
    description,
    children,
    language = 'javascript',
    lines,
}: CodeReferenceProps) {
    const { setSelectedFile, setSelectedLines, selectedFile, selectedLines } = useContext(SelectedContext)

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

        console.log(parsedLines)
    }

    const handleMouseLeave = () => {
        setSelectedLines([])
    }

    const highlightLines = selectedFile === file ? selectedLines : []

    return (
        <div className="my-8" onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
            <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-mono text-gray-500 dark:text-gray-400">{file}</span>
                {description && <span className="text-sm text-gray-500 dark:text-gray-400">- {description}</span>}
            </div>
            {children}
        </div>
    )
}
