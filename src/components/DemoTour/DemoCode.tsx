import React, { useState, useEffect, useContext } from 'react'
import { Tab } from 'components/Tab'
import { DemoCodeFence } from './DemoCodeFence'
import { SelectedContext } from './DemoContext'

interface CodeFile {
    path: string
    tabName: string
    extension: string
}

interface DemoCodeProps {
    codeFiles: CodeFile[]
}

export const DemoCode = ({ codeFiles }: DemoCodeProps) => {
    const [fileContents, setFileContents] = useState<Record<string, string>>({})
    const { selectedFile, setSelectedFile } = useContext(SelectedContext)
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        if (selectedFile) {
            const index = codeFiles.findIndex((file) => file.path === selectedFile)
            if (index !== -1) {
                setSelectedIndex(index)
            }
        }
    }, [selectedFile, codeFiles])

    const handleChange = (index: number) => {
        setSelectedIndex(index)
        setSelectedFile(codeFiles[index].path)
    }

    const getLanguage = (extension: string) => {
        // Map common file extensions to supported languages
        const extensionMap: Record<string, string> = {
            js: 'javascript',
            jsx: 'jsx',
            ts: 'typescript',
            tsx: 'jsx',
            py: 'python',
            rb: 'ruby',
            php: 'php',
            java: 'java',
            kt: 'kotlin',
            go: 'go',
            rs: 'rust',
            swift: 'swift',
            dart: 'dart',
            html: 'html',
            css: 'css',
            scss: 'css',
            less: 'css',
            json: 'json',
            yaml: 'yaml',
            yml: 'yaml',
            xml: 'xml',
            sql: 'sql',
            sh: 'bash',
            bash: 'bash',
            md: 'markdown',
            mdx: 'mdx',
            graphql: 'graphql',
            git: 'git',
        }
        return extensionMap[extension] || 'text'
    }

    const loadFileContents = async () => {
        const contents: Record<string, string> = {}
        for (const file of codeFiles) {
            try {
                const response = await fetch(`/${file.path}`)
                const content = await response.text()
                contents[file.path] = content
            } catch (error) {
                console.error(`Error loading file ${file.path}:`, error)
                contents[file.path] = 'Error loading file content'
            }
        }
        setFileContents(contents)
    }

    useEffect(() => {
        if (codeFiles?.length) {
            loadFileContents()
        }
    }, [codeFiles])

    if (!codeFiles?.length) {
        return <div className="p-4">No code examples found</div>
    }

    // Create the language options array
    const languageOptions = codeFiles.map((file) => ({
        language: getLanguage(file.extension),
        label: file.tabName,
        file: file.tabName,
        code: fileContents[file.path] || 'Loading...',
    }))

    return (
        <>
            {codeFiles.length > 0 && Object.keys(fileContents).length === codeFiles.length ? (
                <div className="h-full flex flex-col pb-4">
                    <Tab.Group selectedIndex={selectedIndex} onChange={handleChange}>
                        <div className="px-4 flex items-center gap-[1px] flex-wrap">
                            <Tab.List>
                                {languageOptions.map((option, index) => (
                                    <Tab onClick={() => handleChange(index)} key={option.file}>
                                        {option.label}
                                    </Tab>
                                ))}
                            </Tab.List>
                        </div>
                        <Tab.Panels className="flex-1 h-full">
                            {languageOptions.map((option) => (
                                <Tab.Panel key={option.file} className="h-full">
                                    <DemoCodeFence language={option.language} showLineNumbers>
                                        {option.code}
                                    </DemoCodeFence>
                                </Tab.Panel>
                            ))}
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            ) : (
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            )}
        </>
    )
}
