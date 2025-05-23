export interface CodeFile {
    url: string
    fileName: string
    path: string
    extension: string
    dirPath: string
}

export function parseCodeFile(url: string): CodeFile {
    const urlObj = new URL(url)
    const parts = urlObj.pathname.split('/')

    const path = urlObj.pathname
    // For raw GitHub URLs, get path after branch
    const dirPath =
        urlObj.host === 'raw.githubusercontent.com'
            ? '/' + parts.slice(parts.findIndex((p) => p === 'refs') + 3).join('/')
            : urlObj.pathname

    const fileName = dirPath.slice(1)

    return {
        url: url,
        fileName,
        extension: fileName.split('.').pop() || '',
        path: path,
        dirPath: dirPath,
    }
}

export async function loadFileContents(codeFiles: CodeFile[]): Promise<Record<string, string>> {
    const contents: Record<string, string> = {}
    for (const file of codeFiles) {
        try {
            const url = new URL(file.url)
            const response = await fetch(url.toString())
            const content = await response.text()
            contents[file.path] = content
        } catch (error) {
            console.error(`Error loading file ${file.path}:`, error)
            contents[file.path] = 'Error loading file content'
        }
    }
    return contents
}

export function getLanguage(extension: string): string {
    // Map common file extensions to supported languages
    const extensionMap: Record<string, string> = {
        js: 'javascript',
        jsx: 'jsx',
        ts: 'typescript',
        tsx: 'tsx',
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
        scss: 'scss',
        less: 'less',
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
