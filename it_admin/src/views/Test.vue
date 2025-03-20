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
	active: true,
	root: {
		id: 3,
		title: 'rrr',
		subItems: [{
      id: 8,
		  title: 'sss',
      subItems: []
    }]
	}
}
const state = reactive(deepClone(initialState))

onBeforeMount(() => {
	
})
</script>

<template>
	<div>
    <v-row dense>
			<v-col cols="3">
         <CategoryTree :root="state.root" />
			</v-col>
      <v-col cols="9">
				
			</v-col>
		</v-row>
		
	</div>
</template>