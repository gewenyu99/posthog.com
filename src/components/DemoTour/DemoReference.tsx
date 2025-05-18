import React, { useContext } from 'react'
import { SelectedContext } from './DemoContext'

interface DemoReferenceProps {
    file: string
    description?: string
    children: React.ReactNode
    language?: string
    lines?: string
}

export default function DemoReference({ file, children, lines }: DemoReferenceProps) {
    const { setSelectedFile, setSelectedLines, selectedReferenceId, setSelectedReferenceId, useId } =
        useContext(SelectedContext)
    const id = useId()

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
        setSelectedReferenceId(id)
    }

    return (
        <div
            className={`my-8 group border ${
                selectedReferenceId === id
                    ? 'bg-gray-50 dark:bg-gray-900 border-light dark:border-dark border-l-4 border-l-light dark:border-l-dark rounded-md pl-3'
                    : 'border-transparent'
            } transition-all`}
            onMouseOver={handleMouseOver}
        >
            <div className="prose dark:prose-dark max-w-none">
                {/* <Markdown options={options}> */}
                {children}
                {/* </Markdown> */}
            </div>
        </div>
    )
}
