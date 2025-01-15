import { FILE_TYPES } from '@/consts'
import { el } from 'date-fns/locale';
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
}

export const isPreviewable = (file) => {
   const fileType = file.type.toLowerCase()
   if(fileType === FILE_TYPES.PNG || fileType === FILE_TYPES.JPEG) return true
   if(fileType === FILE_TYPES.PDF) return true
   return false
}

export const previewClientFile = (file) => {
   const reader = new FileReader()
   reader.onload = (e) => {
      const data = e.target.result
      const blob = new Blob([data], { type: file.type })
      const url = URL.createObjectURL(blob)
      if(isPreviewable(file)) {
         window.open(url, '_blank')
      }else {
         downloadFromBlobUrl(url, file.name)
      }      
   }
   reader.onerror = function(e) {
      console.error('Error reading file:', e.target.error)
   }
   reader.readAsArrayBuffer(file)
   
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