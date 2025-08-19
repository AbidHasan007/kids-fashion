import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

// Disable the default body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  console.log('Upload request received')

  try {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    console.log('Upload directory:', uploadDir)
    
    if (!fs.existsSync(uploadDir)) {
      console.log('Creating upload directory')
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const form = formidable({
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
      filter: function ({name, originalFilename, mimetype}) {
        console.log('Filtering file:', {name, originalFilename, mimetype})
        // Accept only images
        return mimetype && mimetype.includes("image")
      }
    })

    console.log('Parsing form data')
    const [fields, files] = await form.parse(req)
    console.log('Form parsed:', {fields, files})
    
    const uploadedFiles = []
    
    console.log('Processing files:', files)
    
    // Handle multiple files
    if (files.images) {
      const fileArray = Array.isArray(files.images) ? files.images : [files.images]
      console.log('File array:', fileArray)
      
      for (const file of fileArray) {
        console.log('Processing file:', file)
        if (file.size > 0) {
          const fileName = `${Date.now()}-${file.originalFilename}`
          const newPath = path.join(uploadDir, fileName)
          console.log('New file path:', newPath)
          
          // Rename the uploaded file
          fs.renameSync(file.filepath, newPath)
          console.log('File renamed successfully')
          
          uploadedFiles.push({
            filename: fileName,
            path: `/uploads/${fileName}`,
            size: file.size,
            type: file.mimetype
          })
        }
      }
    } else {
      console.log('No images found in files:', files)
    }

    console.log('Uploaded files:', uploadedFiles)
    res.status(200).json({ 
      success: true, 
      files: uploadedFiles 
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Upload failed: ' + error.message })
  }
}
