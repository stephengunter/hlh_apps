import { MENUS } from '@/consts'
import { isNullOrEmpty } from '@/utils'

class Page {
   constructor({ name, path, view, icon, title, menus, parent = '', alias = ''}) {
      this.name = name
      this.path = path
      this.view = view
      this.meta = {
         icon, title, menus, parent
      }
      this.meta.subs = []
      this.meta.subNames = []
      this.meta.allSubNames = []

      if(alias) this.alias = alias

      this.active = false
      this.expand = false
   }
   setActive(val) {
      this.active = val
   }
   setExpand(val) {
      this.expand = val
   }
   setType(type) {
      this.meta['type'] = type
   }
   setOrder(order) {
      this.meta['order'] = order
   }
   loadSubItems(list) {
      this.meta.subs = list.filter(item => item.meta.parent === this.name)
      if (!this.meta.subNames) this.meta.subNames = []
      this.meta.subNames.push(
         ...this.meta.subs
             .map(item => item.name)
             .filter(name => !this.meta.subNames.includes(name))
      )
      this.meta.subs.forEach(child => {
         child.loadSubItems(list)
         this.meta.allSubNames.push(...child.meta.allSubNames); // Add all descendant IDs
      })
      this.meta.allSubNames.push(...this.meta.subNames);
      this.meta.allSubNames = [...new Set(this.meta.allSubNames)]
   }
   allSubNames(entity) {
      if(!entity) entity = this
      let allNames = entity.SubIds ? [...entity.SubIds] : [];

      // Recursively add SubIds from all children
      if (entity.SubItems) {
         entity.SubItems.forEach(child => {
               allIds.push(...allSubIds(child));
         });
      }

      // Return a unique list of IDs
      return [...new Set(allIds)];
   }
   hasSubs() {
      if(this.hasOwnProperty('meta') && this.meta.hasOwnProperty('subs')) {
         return this.meta.subs.length > 0
      }
      return false
   }
   setSubs(subs) {
      this.meta['subs'] = subs
   }
   isMainMenuItem() {
      return this.meta.hasOwnProperty('menus') && this.meta.menus.includes(MENUS.MAIN)
   }
   hasParent(name) {
      return this.meta.hasOwnProperty('parent') && this.meta.parent === name
   }
   isRoot() {
      if(!this.meta.hasOwnProperty('parent')) return true
      return isNullOrEmpty(this.meta.parent)
   }
   getSubitems() {
      return this.meta.hasOwnProperty('subs') ? this.meta.subs : []
   }
}

export default Page