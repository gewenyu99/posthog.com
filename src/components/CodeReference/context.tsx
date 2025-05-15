import React, { createContext, useState } from 'react'

interface SelectedContextType {
    selectedFile: string | null
    selectedLines: number[]
    setSelectedFile: (file: string | null) => void
    setSelectedLines: (lines: number[]) => void
}

export const SelectedContext = createContext<SelectedContextType>({
    selectedFile: null,
    selectedLines: [],
    setSelectedFile: (file: string | null) => {
        // Default implementation does nothing
        console.warn('Using default setSelectedFile implementation')
    },
    setSelectedLines: (lines: number[]) => {
        // Default implementation does nothing
        console.warn('Using default setSelectedLines implementation')
    },
})

export function SelectedProvider({ children }: { children: React.ReactNode }) {
    const [selectedFile, setSelectedFile] = useState<string | null>(null)
    const [selectedLines, setSelectedLines] = useState<number[]>([])

    return (
        <SelectedContext.Provider
            value={{
                selectedFile,
                selectedLines,
                setSelectedFile,
                setSelectedLines,
            }}
        >
            {children}
        </SelectedContext.Provider>
    )
}
