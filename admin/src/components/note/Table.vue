<template>
   <v-data-table :items="notes" :headers="headers" :server-items-length="notes ? notes.length : 0"
   hide-default-footer item-key="index"
   >
      <template v-slot:body="{ items }">
         <tbody>
            <tr class="row-note" v-for="(item, index) in items" :key="index" >
               <td>
                  {{ item.id }}
               </td>
               <td>
                  {{ item.termId }}
               </td>
               <td>
                  <v-icon v-if="item.active" color="success" style="vertical-align: baseline;">
                     mdi-check-circle
                  </v-icon>
               </td>
               <td>
                  <v-icon v-if="item.important" color="error" style="vertical-align: baseline;">
                     mdi-check-circle
                  </v-icon>
               </td>
               <td style="padding: 10px 16px;">
                  <div v-for="(item, index) in item.attachments" :key="index">
                     <a href="#" @click.prevent="showPhoto(item)">
                        <v-img :src="item.previewPath | photoNameUrl(100)" max-width="100" aspect-ratio="1"
                        />
                     </a>
                     {{ item.title }}
                  </div>
               </td>
               <td>
                  {{ item.title }}
               </td>
               <td style="padding: 10px 16px;">
                  <note-read :model="item"/>
               </td>
               <td>
                  <core-label v-for="(item, index) in item.highlights" :key="index">
                  {{ item }}
                  </core-label>
               </td>
               <td>
                  <ul>
                     <li v-for="(item, index) in item.references"  :key="index">
                     {{ item.text }} 
                     </li>
                  </ul>
               </td>
               <td>
                  <v-btn @click.prevent="edit(item.id)" icon color="success">
                     <v-icon small>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn @click.prevent="remove(item.id)" small icon color="error">
                     <v-icon>mdi-delete-circle</v-icon>
                  </v-btn>
               </td>
            </tr>
         </tbody>
      </template>
   </v-data-table>
</template>


<script>
import { SHOW_PHOTO } from '@/store/actions.type';
export default {
	name: 'NoteTable',
	props: {
      notes: {
         type: Array,
         default: null
      }
	},
	data () {
		return {
			headers: [
            {
					sortable: false,
					text: 'Id',
               value: 'id',
               width: '30px'
            },
            {
					sortable: false,
					text: 'TermId',
               value: 'termId',
               width: '30px'
            },
            {
					sortable: false,
					text: 'Active',
               value: 'active',
               width: '50px'
            },
            {
					sortable: false,
					text: '重要',
               value: 'important',
               width: '60px'
            },
            {
					sortable: false,
					text: '附圖',
               value: 'attachments',
               width: '15%'
            },
            {
					sortable: false,
					text: '標題',
               value: 'title',
               width: '15%'
            },
				{
					sortable: false,
					text: '內容',
               value: 'text',
               width: '35%'
            },
            {
					sortable: false,
               text: '重點標記',
               value: 'highlights',
               width: '15%'
            },
            {
					sortable: false,
               text: '參考',
               value: 'references',
               width: '15%'
            },
            {
					sortable: false,
					text: '',
					width: '50px'
				}
         ]
		}
   },
	methods: {
      edit(id) {
         this.$emit('edit', id);
      },
      remove(id) {
         this.$emit('remove', id);
      },
      showPhoto(photo) {
         Bus.$emit(SHOW_PHOTO, photo);
      }   
	}
}
</script>
