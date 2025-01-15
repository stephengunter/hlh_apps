<script setup>
const name = 'JobUserProfilesTable'
const props = defineProps({
	list: {
      type: Array,
      default: () => []
   }
})
const emit = defineEmits(['edit'])
function edit(id) {
	emit('edit', id)
}

</script>

<template>
	<v-table>
		<thead>
			<tr>
				<th style="width: 10%;">
					狀態
				</th>
				<th style="width: 20%;">
					任職人員
				</th>
				<th>
					開始日期
				</th>
				<th>
					結束日期
				</th>
				<th style="width: 10%;">
					
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="item in list" :key="item.id">
				<td>{{ item.active }}</td>
				<td>{{ item.userProfiles.name }}</td>
				<td>{{ item.startDateText }}</td>
				<td>{{ item.endDateText }}</td>
				<td>
					<CommonButtonEdit size="x-small" 
					@edit="edit(item.id)"
					/>
				</td>
			</tr>
		</tbody>
  </v-table>
</template>