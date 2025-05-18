import React, { createContext, useState, useRef } from 'react'

interface SelectedContextType {
    selectedFile: string | null
    selectedLines: number[]
    selectedReferenceId: number | null
    setSelectedFile: (file: string | null) => void
    setSelectedLines: (lines: number[]) => void
    setSelectedReferenceId: (id: number | null) => void
    useId: () => number
}

export const SelectedContext = createContext<SelectedContextType>({
    selectedFile: null,
    selectedLines: [],
    selectedReferenceId: null,
    setSelectedReferenceId: () => {
        /* noop */
    },
    setSelectedFile: () => {
        /* noop */
    },
    setSelectedLines: () => {
        /* noop */
    },
    useId: () => 0,
})

export function SelectedProvider({ children }: { children: React.ReactNode }): JSX.Element {
    const [selectedFile, setSelectedFile] = useState<string | null>(null)
    const [selectedLines, setSelectedLines] = useState<number[]>([])
    const [selectedReferenceId, setSelectedReferenceId] = useState<number | null>(null)
    const idRef = useRef(0)

    const useId = () => {
        const id = useRef<number | null>(null)
        if (!id.current) {
            idRef.current += 1
            id.current = idRef.current
        }
        return id.current
    }

    return (
        <SelectedContext.Provider
            value={{
                selectedFile,
                selectedLines,
                selectedReferenceId,
                setSelectedFile,
                setSelectedLines,
                setSelectedReferenceId,
                useId,
            }}
        >
            {children}
        </SelectedContext.Provider>
    )
}
