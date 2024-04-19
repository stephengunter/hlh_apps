export const downloadFile = (data, name) => {
   // Create a URL for the Blob
   const url = window.URL.createObjectURL(new Blob([data]))
   // Create a link element to trigger the download

   const a = document.createElement('a')
   a.style.display = 'none'
   a.href = url
   a.download = name
   document.body.appendChild(a)
   a.click()

   // Cleanup
   window.URL.revokeObjectURL(url)
}