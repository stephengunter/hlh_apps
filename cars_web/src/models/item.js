
class Item {
   constructor({ id, uuid, postType, postId, title, order, done }) {
      this.id = id
      this.uuid = uuid ? uuid : ''
      this.postType = postType
      this.postId = postId
      this.title = title
      this.order = order
      this.done = done

      this.files = []
   }
   setFiles(files) {
      this.files = files
   }
}

export default Item