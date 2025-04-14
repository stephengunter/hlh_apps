class PagedList {
   constructor(model) {
      Object.assign(this, model)
   }
   getPaged(pageNumber, pageSize) {
      const startIndex = (pageNumber - 1) * this.pageSize;
      this.list = this.allItems.slice(startIndex, startIndex + this.pageSize)
      return this.allItems.slice(startIndex, startIndex + pageSize);
   }
   goToPage(page = 0, list = null) {
      if(!page) page = this.pageNumber
      if(!list) list = this.allItems
      const startIndex = (page - 1) * this.pageSize
      this.list = list.slice(startIndex, startIndex + this.pageSize)

      this.totalItems = list.length
      this.totalPages = Math.ceil( this.totalItems / this.pageSize);
      this.pageNumber = page
      this.hasPreviousPage = (page >= 1)
      this.hasNextPage = page < this.totalPages
      this.nextPageNumber =  this.hasNextPage ? page + 1 : this.totalPages
      this.previousPageNumber = this.hasPreviousPage ? page - 1 : 1
   }
}

export default PagedList