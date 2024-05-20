<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted } from 'vue'
import { useStore } from 'vuex'
import { isEmptyObject } from '@/utils'
import { ENTITY_TYPES } from '@/consts'

const name = 'ModifyRecordTable'
const store = useStore()

const headers = [{
   title: 'Type',
   align: 'start',
   width: '15%',
   sortable: false,
   key: 'entityType',
},{
   title: 'Id',
   align: 'start',
   width: '15%',
   sortable: false,
   key: 'entityId',
},{
   title: 'Action',
   align: 'start',
   width: '15%',
   sortable: false,
   key: 'action',
},{
   title: 'DateTime',
   align: 'start',
   width: '15%',
   sortable: false,
   key: 'dateTimeText',
},{
   title: 'User',
   align: 'start',
   sortable: false,
   key: 'userId',
},{
   title: 'IP',
   align: 'start',
   sortable: false,
   key: 'remoteIP',
}]

const list = computed(() => store.state.modify_records.list)

</script>


<template>
   <v-table density="compact">
      <thead>
			<tr>
				<th style="width: 10%;">
					Type
				</th>
				<th style="width: 10%;">
					Id
				</th>
				<th>
					Action
				</th>
				<th>
					DateTime
				</th>
				<th>
					User
				</th>
				<th>
					IP
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="item in list" :key="item.id">
				<td>
					{{ item.entityType }}
				</td>
				<td>
					{{ item.entityId }}
				</td>
				<td>
					{{ item.action }}
				</td>
				<td>
					{{ item.dateTimeText }}
				</td>
				<td>
					{{ item.userName }}
				</td>
				<td>
					{{ item.remoteIP }}
				</td>
			</tr>
		</tbody>
	</v-table>
</template>