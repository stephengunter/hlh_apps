<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted } from 'vue'
import { isEmptyObject, deepClone, getValue } from '@/utils'

const name = 'PropertySourceTable'
const props = defineProps({
   model: {
		type: Object,
		default: null
	},
	labels: {
      type: Object,
      default: null
   },
   loading: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['remove', 'options_changed'])

const initialState = {
   
}
const state = reactive(deepClone(initialState))

const headers = computed(() => {
   let items = [{
      title: '',
      align: 'center',
      width: '3%',
      sortable: false,
      key: 'remove',
   },{
      title: getLabel('propertyType'),
      align: 'start',
      width: '5%',
      sortable: false,
      key: 'propertyTypeText',
   },{
      title: '分類',
      align: 'start',
      width: '5%',
      sortable: false,
      key: 'categoryName',
   },{
      title: getLabel('title'),
      align: 'start',
      width: '10%',
      sortable: false,
      key: 'titleNameText',
   },{
      title: getLabel('number'),
      align: 'start',
      width: '10%',
      sortable: false,
      key: 'numberText',
   },{
      title: getLabel('brand'),
      align: 'start',
      width: '5%',
      sortable: false,
      key: 'brandName',
   },{
      title: getLabel('type'),
      align: 'start',
      width: '8%',
      sortable: false,
      key: 'type',
   },{
      title: getLabel('userName'),
      align: 'start',
      width: '5%',
      sortable: false,
      key: 'userName',
   },{
      title: getLabel('location'),
      align: 'start',
      width: '8%',
      sortable: false,
      key: 'locationName',
   },{
      title: getLabel('getDate'),
      align: 'start',
      width: '8%',
      sortable: false,
      key: 'getDateText',
   }
   // ,{
   //    title: getLabel('downDate'),
   //    align: 'start',
   //    width: '5%',
   //    sortable: false,
   //    key: 'DownDateText',
   // }
   ]
   return items
})



const list = computed(() => isEmptyObject(props.model) ? [] : props.model.list)

function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}

function onPageChanged(page) {
   emit('options_changed', {
      page
   })
}     
function onPageSizeChanged(size) {
   emit('options_changed', {
      size 
   })
}

</script>
<template>
   <div v-if="!isEmptyObject(props.model)"> 
      <v-table hover>
         <thead>
            <tr>
               <th v-for="(header, index) in headers" :style="`width: ${header.width};`">{{ header.title }}</th>
            </tr>
         </thead>
         <tbody>
            <tr v-for="item in list" :key="item.uId" >
               <td v-for="header in headers" :class="item.removed ? 'line-through' : ''">
                  <v-btn v-if="header.key === 'remove'" color="error" icon="mdi-delete" variant="text" 
                  @click.prevent="() => emit('remove', item.uId)" 
                  />
                  <span v-else>{{ item[header.key] }}</span>                  
               </td>
            </tr>   
         </tbody>      
      </v-table>
      <CommonTablePager :can_size="true"
      list_key="list" :model="model" 
      @page_changed="onPageChanged" @size_changed="onPageSizeChanged"
      />
   </div>
</template>
<style scoped>
.line-through {
  text-decoration: line-through;
}

</style>
