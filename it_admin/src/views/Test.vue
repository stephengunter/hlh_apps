<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ROUTE_NAMES, ENTITY_TYPES, WIDTH, ACTION_TYPES, WARNING, ERRORS } from '@/consts'
import { INIT_DEVICES, FETCH_DEVICES, CREATE_DEVICE, STORE_DEVICE, EDIT_DEVICE, UPDATE_DEVICE, 
	REMOVE_DEVICE
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile, showConfirm, hideConfirm,
	onErrors, onSuccess, setValues, is400, now,
	resolveErrorData
} from '@/utils'

const initialState = {
	items: ['foo', 'bar', 'fizz', 'buzz'],
	val: ''
}
const state = reactive(deepClone(initialState))

onBeforeMount(() => {
	
})

function test() {
	state.val = ''
}
</script>

<template>
	<div>
      <v-row dense>
			<v-col cols="12">
				<v-autocomplete
					v-model="state.val"
					:items="state.items"
					label="Default"
				></v-autocomplete>
			</v-col>
			<v-col cols="12">
				<v-btn @click.prevent="test" >Test</v-btn>
			</v-col>
		</v-row>
		
	</div>
</template>