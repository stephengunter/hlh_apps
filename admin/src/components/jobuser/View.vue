<script setup>

const name = 'JobUserProfilesView'
const props = defineProps({
	model: {
      type: Object,
      default: null
   }
})
const labels = {
	'userId': '任職人員',
	'ps': '備註',
	'startDate': '開始日期',
	'endDate': '結束日期'
}
</script>

<template>
	<v-row dense>
		<v-col cols="12">
			<v-text-field :label="labels['userId']"
			readonly :model-value="model.userProfiles.name"
			/>
		</v-col>
		<v-col cols="6">
			<v-text-field :label="labels['startDate']"
			readonly :model-value="model.startDateText"
			/>
		</v-col>
		<v-col cols="6">
			<v-text-field :label="labels['endDate']"
			readonly :model-value="model.endDateText"
			/>
		</v-col>
		<v-col cols="12">
			<v-textarea :label="labels['ps']"
			readonly :model-value="model.ps"
			/>
		</v-col>
	</v-row>
</template>