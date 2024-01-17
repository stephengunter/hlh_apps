class Category {
   constructor(items, selectedId = 0) {
      this.items = items;
      this.models = [];
      this.selected = {
         index: 0,
         item: null,
         idList: [],
         itemList: []
      };

      this.loadSelectedItem(selectedId);
   }

   loadSelectedItem(selectedId) {
      let selectedItem = this.getItemById(selectedId);
      
      if(selectedItem) {
         let parentId = selectedItem.parentId;
         let parentModels = this.getParentModelList(selectedItem);
         let startIndex = parentModels.length;
         if(parentModels.length) parentId = parentModels[parentModels.length - 1].selectedId;
         else parentId = 0;

         let selectedIds = [selectedItem.id];
         let models = this.getModels(startIndex , parentId, selectedIds);
         
         this.setModels(parentModels.concat(models));

         // startIndex 等於 selected index
         this.setSelectedItem(selectedItem, startIndex);

      }else {
         let models = this.getModels();
         this.setModels(models);
         
         this.setSelectedItem(null, -1);
      }

      this.setSelectedList();
   }

   getItemById(id) {
      return id ? this.items.find(item => item.id === id) : null;
   }

   getSubItems(parentId) {
      return this.items.filter(item => item.parentId === parentId);
   }

   getParentModelList(selectedItem) {
      let models = [];
      let parentItem = this.getItemById(selectedItem.parentId);
      while (parentItem) {
         let selectedId = parentItem.id;
         let items = this.getSubItems(parentItem.parentId);
         models.push({
            selectedId, items
         });
         parentItem = this.getItemById(parentItem.parentId);
      }
   
      return models.length ? models.reverse() : [];
   }

   getModels(startIndex = 0, parentId = 0, selectedIds = []) {
      //從前到後
      let i = 0;
      let models = [];
      let hasSubItems = true;

      do {
         let items = this.getSubItems(parentId);
         if(items && items.length) hasSubItems = true;
         else hasSubItems = false;
         
         let selectedId = 0;
         if(selectedIds[i]) selectedId = selectedIds[i];

         if(selectedId) parentId = selectedId;
         else parentId = hasSubItems ? items[0].id : 0;

         if(hasSubItems) {
            models.push({
               selectedId, items
            });
         }

         i++;
      } while (hasSubItems);

      return models;
   }

   setModels(models, idx = 0) {
      if(idx === 0) this.models = models;
      else {
         let correctLength = idx + models.length;
         if(correctLength > this.models.length) {
            for(let i = 0; i < models.length; i++) {
               if(idx >= this.models.length) {
                  this.models.push(models[i]);
               }else {
                  this.models.splice(idx, 1, models[i]);
               }
               idx += 1;
            }
         }else {
            let needRemove = this.models.length - correctLength;
            if(needRemove) {
               this.models.splice(correctLength, needRemove);
            }

            for(let i = 0; i < models.length; i++) {
               this.models.splice(idx, 1, models[i]);
               idx += 1;
            }
         }
      }
   }

   setSelectedItem(item, index) {
      this.selected.item = item;
      this.selected.index = index;
   }

   setSelectedList() {
      let ids = [];
      let items = [];
      for(let i = 0; i < this.models.length; i++) {
         let selectedId = this.models[i].selectedId;
         if(selectedId) {
            ids.push(selectedId);
            items.push(this.models[i].items.find(x => x.id === selectedId));
         } 
      }
      this.selected.idList = ids;
      this.selected.itemList = items;
   }
}

export default Category;