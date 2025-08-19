import formidable from 'formidable'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

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

  console.log('Supabase upload request received')

  try {
    const form = formidable({
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
          try {
            // Read file buffer
            const fs = require('fs')
            const fileBuffer = fs.readFileSync(file.filepath)
            
            // Generate unique filename
            const fileName = `${Date.now()}-${file.originalFilename}`
            const filePath = `kids-fashion/${fileName}`
            
            // Upload to Supabase Storage
            const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'product-images'
            console.log('Using bucket name:', bucketName)
            
            const { data, error } = await supabase.storage
              .from(bucketName)
              .upload(filePath, fileBuffer, {
                contentType: file.mimetype,
                cacheControl: '3600',
                upsert: false
              })
            
            if (error) {
              console.error('Supabase upload error:', error)
              throw new Error(`Failed to upload ${file.originalFilename}: ${error.message}`)
            }
            
            // Get public URL
            const { data: urlData } = supabase.storage
              .from(bucketName)
              .getPublicUrl(filePath)
            
            console.log('Supabase upload result:', data)
            
            uploadedFiles.push({
              filename: file.originalFilename,
              path: urlData.publicUrl,
              size: file.size,
              type: file.mimetype,
              supabase_path: filePath
            })
          } catch (uploadError) {
            console.error('Supabase upload error:', uploadError)
            throw new Error(`Failed to upload ${file.originalFilename}: ${uploadError.message}`)
          }
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
