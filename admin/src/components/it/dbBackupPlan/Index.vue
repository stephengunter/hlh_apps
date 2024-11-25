<script setup>
import { reactive, computed, onBeforeMount } from 'vue'
import { isEmptyObject, deepClone, getValue } from '@/utils'
import {
   INIT_IT_CREDENTIALINFOS, FETCH_IT_CREDENTIALINFOS, CREATE_IT_CREDENTIALINFO, STORE_IT_CREDENTIALINFO, 
   IT_CREDENTIALINFO_DETAILS, EDIT_IT_CREDENTIALINFO, UPDATE_IT_CREDENTIALINFO, UPDATE_IT_CREDENTIALINFO_PASSWORD, 
   REMOVE_IT_CREDENTIALINFO, EDIT_IT_CREDENTIALINFO_PASSWORD
} from '@/store/actions.type'

const name = 'ITCredentialInfoIndex'
const props = defineProps({
	entity_type: {
      type: String,
      default: null
   },
	entity_id: {
      type: Number,
      default: 0
   },
	max_width: {
      type: Number,
      default: 600
   },
})

onBeforeMount(() => {
	console.log(props.entity_type)
})
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
</script>

<template>
	<div>
		<v-card :max-width="max_width">
			<CommonCardTitle :show_id="false" :title="state.server.credentialInfoes.length ? '' : '查無資料'"
			:can_cancel="false"
			@create="addCredentialInfo" :tooltip="`新增${CREDENTIALINFO.title}`"
			/>
			<v-card-text>
				<ItCredentialInfoTable :list="state.server.credentialInfoes"
				:labels="credentialInfo_labels"
				@edit="editCredentialInfo" @edit-pw="editCredentialInfoPw"
				/>
			</v-card-text>
		</v-card>
	</div>
</template>