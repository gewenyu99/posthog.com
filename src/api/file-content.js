const fs = require('fs')
const path = require('path')

export default function handler(req, res) {
    const { path: filePath } = req.query

    if (!filePath) {
        return res.status(400).json({ error: 'No file path provided' })
    }

    try {
        const content = fs.readFileSync(filePath, 'utf8')
        res.status(200).send(content)
    } catch (error) {
        console.error('Error reading file:', error)
        res.status(500).json({ error: 'Error reading file' })
    }
} 