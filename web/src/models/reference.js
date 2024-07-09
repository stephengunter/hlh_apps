
class Reference {
   constructor({ id, uuid, postType, postId, title, url, order }) {
      this.id = id
      this.uuid = uuid ? uuid : ''
      this.postType = postType
      this.postId = postId
      this.title = title
      this.url = url
      this.order = order

      this.attachmentId = 0
      this.attachment = null
      this.file = null
   }
   setAttachment(attachment) {
      this.attachmentId = attachment.id
      this.attachment = attachment
   }
   setFile(file) {
      this.file = file
   }
}

export default Reference