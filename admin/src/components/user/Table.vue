<template>
   <v-table>
      <thead>
         <tr>
            <th v-for="header in headers" :width="header.width">
            {{ header.text }}
            </th>
         </tr>
      </thead>
      <tbody>
         <tr v-for="user in list" :key="user.id" >
            <td>{{ user.id }}</td>
            <td>{{ user.userName }}</td>
            <td>
               <v-chip v-for="(role, index) in roles(user)" :key="index" small
               :color="roleColor(role)" text-color="white"
               :class="{ 'ml-1' : index > 0 }"
               >
               {{ role }}
               </v-chip>
            </td>
            <td>{{ user.createdAtText }}</td>
         </tr>
      </tbody>
   </v-table>
</template>

<script >
import { getRoleColor } from '@/utils'

export default {
   name: 'UserTable',
   props: {
      list: {
         type: Array,
         default: () => []
      },
      can_remove: {
         type: Boolean,
         default: false
      },
      can_edit: {
         type: Boolean,
         default: true
      }
	},
   data: () => ({
      headers: [{
         sortable: false,
         text: 'Id',
         value: 'id',
         width: '180px'
      },{
         sortable: false,
         text: 'UserName',
         value: 'userName',
         width: '120px'
      },{
         sortable: false,
         text: '角色',
         value: 'roles',
         width: '90px'
      },{
         sortable: false,
         text: '加入日期',
         value: 'createdAtText',
         width: '120px'
      }]
   }),
   methods: {
      roles(user) {
         return user.roles ? user.roles.split(',') : []
      },
      roleColor(role) {
         return getRoleColor(role);
      }
   }
}
</script>
