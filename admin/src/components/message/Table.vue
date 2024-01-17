<script setup>
import { ref, onMounted } from 'vue'

const name = 'MessageTable'

const props = defineProps({
   list: {
      type: Array,
      default: () => []
   }
})

const emit = defineEmits(['edit', 'select'])

const headers = ref([{
   text: '', value: 'action', sortable: false, width: '30px'
},{
   text: '狀態', value: 'status', sortable: false, width: '90px'
},{
   text: '日期', value: 'createdAtText', sortable: false, width: '120px'
},{
   text: 'Email', value: 'email', sortable: false, width: '240px'
},{
   text: '主旨', value: 'subject', sortable: false
},{
   text: '內容', value: 'content', sortable: false   
}])

function edit(id) {
   emit('edit', id);
}
function select(item) {
   emit('select', item)
}
</script>
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
         <tr v-for="message in list" :key="message.id" >
            <td>
               <v-btn icon="mdi-pencil" size="x-small" color="success"
               @click.prevent="edit(message.id)"
               />
               <!-- <v-btn @click.prevent="edit(message.id)" icon color="success">
                  <v-icon small>mdi-pencil</v-icon>
               </v-btn> -->
            </td>
            <td>
               <v-chip small>未回覆</v-chip>
            </td>
            <td>
               {{ message.createdAtText }}            
            </td>
            <td>
               {{ message.email }}            
            </td>
            <td>
               {{ message.subject }}            
            </td>
            <td>
               {{ message.content }}            
            </td>
         </tr>
      </tbody>
   </v-table>
   <!-- <v-data-table :headers="headers" :items="list" hide-default-footer :server-items-length="list ? list.length : 0"
   >
      <template v-slot:item.action="{ item }">
         <v-btn @click.prevent="edit(item.id)" icon color="success">
            <v-icon small>mdi-pencil</v-icon>
         </v-btn>
      </template>
      <template v-slot:item.status="{ item }">
         <v-chip small v-if="item.returned" color="success" text-color="white">已回覆</v-chip>
         <v-chip small v-else>未回覆</v-chip>
      </template>
  </v-data-table> -->
</template>

