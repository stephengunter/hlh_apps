<script setup>
import { ENTITY_TYPES, DB_BACKUP_TYPES } from '@/consts'
import { getValue, isEmptyObject, formatTime, isValidTime, isEnableText } from '@/utils'



const name = 'ITDbBackupPlanTable'
const props = defineProps({
	list: {
      type: Array,
      default: () => []
   },
	labels: {
      type: Object,
      default: null
   }
})
const emit = defineEmits(['edit'])
function edit(id) {
	emit('edit', id)
}
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function getTypeTitle(item) {
	if(item.type === DB_BACKUP_TYPES.FULL.name) return DB_BACKUP_TYPES.FULL.title
	else if(item.type === DB_BACKUP_TYPES.DIFF.name) return DB_BACKUP_TYPES.DIFF.title
	return ''
}

function getStatusText(val) {
	return isEnableText(val)
}
function getTimeTitle(val) {
	return formatTime(val)
}
function getTargetServer(item) {
	if(item.targetServerId) {
		return item.targetServer.name
	}
	return 'localhost'
}
function getIntervalTitle(item) {
	if(item.type === DB_BACKUP_TYPES.FULL.name) return ''
	else if(item.type === DB_BACKUP_TYPES.DIFF.name) return item.minutesInterval
	return ''
}

</script>

<template>
	<v-table>
		<thead>
			<tr>
				<th style="width: 10%;">
					狀態
				</th>
				<th style="width: 15%;" v-text="getLabel('type')">
				</th>
				<th style="width: 15%;" v-text="getLabel('startTime')">					
				</th>
				<th style="width: 15%;" v-text="getLabel('minutesInterval')">			
				</th>
				<th style="width: 15%;" v-text="getLabel('targetServerId')">			
				</th>
				<th style="width: 15%;" v-text="getLabel('targetPath')">			
				</th>
				<th style="width: 10%;">
					
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="item in list" :key="item.id">
				<td>
					<v-chip size="small" :color="item.active ? 'success' : ''">					
					{{ getStatusText(item.active) }}
					</v-chip>
      		</td>
				<td>{{ getTypeTitle(item) }}</td>
				<td>
					{{ getTimeTitle(item.startTime) }}
				</td>
				<td>{{ getIntervalTitle(item) }}</td>
				<td>{{ getTargetServer(item) }}</td>
				<td>{{ item.targetPath }}</td>
				<td>
					<CommonButtonEdit size="x-small" 
					@edit="edit(item.id)"
					/>
				</td>
			</tr>
		</tbody>
  </v-table>
</template>