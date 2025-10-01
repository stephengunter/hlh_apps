
class Doc {
   constructor({ id, department, role, name, ad, tel }) {
      this.id = id
      this.department = department
      this.role = role
      this.name = name
      this.ad = ad
      this.tel = tel

      this.roles = role.split('_')
      this.tels = tel.split('_')
   }
}

export default Doc