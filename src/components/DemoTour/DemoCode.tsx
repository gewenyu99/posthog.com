import React, { useState, useEffect, useContext } from 'react'
import { Tab } from 'components/Tab'
import { DemoCodeFence } from './DemoCodeFence'
import { SelectedContext } from './DemoContext'
import { CodeFile, getLanguage, loadFileContents, parseCodeFile } from './LoadDemoCode'
import languageMap from 'components/CodeBlock/languages'

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

    useEffect(() => {
        if (codeFiles?.length) {
            loadFileContents(codeFiles).then(setFileContents)
        }
    }, [codeFiles])

    const handleChange = (index: number) => {
        setSelectedIndex(index)
    }

    return (
        <>
            {codeFiles.length > 0 && Object.keys(fileContents).length === codeFiles.length ? (
                <div className="h-full flex flex-col pb-4">
                    <Tab.Group selectedIndex={selectedIndex} onChange={handleChange}>
                        <div className="px-4 flex items-center gap-[1px] flex-wrap">
                            <Tab.List>
                                {codeFiles.map((option, index) => (
                                    <Tab onClick={() => handleChange(index)} key={option.path}>
                                        {option.fileName}
                                    </Tab>
                                ))}
                            </Tab.List>
                        </div>
                        <Tab.Panels className="flex-1 h-full">
                            {codeFiles.map((option) => (
                                <Tab.Panel key={option.path} className="h-full">
                                    <DemoCodeFence
                                        language={getLanguage(option.extension)}
                                        file={option.fileName}
                                        showLineNumbers
                                    >
                                        {fileContents[option.path]}
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
