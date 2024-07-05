import { FILE_TYPES } from '@/consts'
export const getMimeType = (extension) => {
   switch (extension.toLowerCase().replace(/\./g, '')) {
      case 'pdf':
         return 'application/pdf';
      case 'txt':
         return 'text/plain';
      case 'jpg':
      case 'jpeg':
         return 'image/jpeg';
      case 'png':
         return 'image/png';
      case 'gif':
         return 'image/gif';
      // Add more cases for other file types as needed
      default:
         return 'application/octet-stream'; // Default to binary data if MIME type is unknown
   }
}


export const bytesToBinary = (bytes) => Uint8Array.from(atob(bytes), c => c.charCodeAt(0))

export const createBlobFromFileBytes = (fileBytes, ext) => {
   const type = getMimeType(ext)
   return new Blob([bytesToBinary(fileBytes)], { type })
}

export const downloadFile = (blob, name) => {
   // Create a URL for the Blob
   const url = window.URL.createObjectURL(blob)
   downloadFromBlobUrl(url, name)
}
export const downloadFromBlobUrl = (blobUrl, name) => {
   const a = document.createElement('a')
   a.style.display = 'none'
   a.href = blobUrl
   a.download = name
   document.body.appendChild(a)
   a.click()

   // Cleanup
   window.URL.revokeObjectURL(blobUrl)
}

export const previewClientFile = (file) => {
	if(file.type === FILE_TYPES.PDF) {
      const reader = new FileReader()
      reader.onload = function(event) {
         const data = event.target.result
         const blob = new Blob([data], { type: 'application/pdf' })
         const url = URL.createObjectURL(blob)
         window.open(url, '_blank')
      }
      reader.onerror = function(event) {
         console.error('Error reading file:', event.target.error)
      }
      reader.readAsArrayBuffer(file)
   }
}

export const extractUUIDFromBlobURL = (blobURL) => {
   try {
      const url = new URL(blobURL)
      return url.pathname.replace(url.origin, '').substring(1)  // Remove the leading '/'
   } catch (error) {
      console.error('Invalid URL:', error)
      return null
   }
}

export const getFilenameWithoutExtension = (filename) => {
   const lastDotPosition = filename.lastIndexOf('.')
  
   // If no period is found, return the original filename
   if (lastDotPosition === -1) {
      return filename
   }
   
   // Extract and return the filename without the extension
   return filename.substring(0, lastDotPosition)
}