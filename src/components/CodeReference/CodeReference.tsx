import React, { useContext } from 'react'
import { SelectedContext } from './context'

interface CodeReferenceProps {
    file: string
    description?: string
    children: React.ReactNode
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
                {children}
            </div>
        </div>
    )
}
