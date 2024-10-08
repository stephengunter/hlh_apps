<script setup>
import { ref, reactive, computed, watch, onBeforeMount } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { url, required, helpers } from '@vuelidate/validators'
import { DIALOG_MAX_WIDTH } from '@/config'
import { WIDTH, VALIDATE_MESSAGES, ACTION_TYPES } from '@/consts'
import { deepClone, setValues } from '@/utils'

const name = 'AttachmentPicker'
const props = defineProps({
   model: {
      type: Object,
      default: null
   }
})
const emit = defineEmits(['submit'])

const labels = {
   'url':'網址'
}
const type_options = [{
   value: 'exist', title: '現有'
}, {
   value: 'upload', title: '上傳'
}]

const initialState = {
	type: 'upload'
}
const state = reactive(deepClone(initialState))

const rules = {
	url: { 
      required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels['url']), required), 
      url: helpers.withMessage(VALIDATE_MESSAGES.WRONG_FORMAT_OF(labels['url']), url)
   }
}
const v$ = useVuelidate(rules, state.form)

onBeforeMount(() => {
   //setValues(props.model, state.form)
})

function onTypeChanged() {

}

function onSubmit() {
	v$.value.$validate().then(valid => {
		if(valid) emit('submit', state.form)
	})
}


</script>
<template>
   <form @submit.prevent="onSubmit">
      <v-row dense>
         <v-col cols="12">
            <v-radio-group v-model="state.type" inline @update:modelValue="onTypeChanged">
					<v-radio v-for="(item, index) in type_options" :key="index"
					:label="item.title" :value="item.value"
					/>
				</v-radio-group>
         </v-col>
      </v-row>
      <v-row dense>
         <v-col cols="12">
            <v-btn class="float-right" type="submit" color="success">確定</v-btn>
         </v-col>
      </v-row>
   </form>
</template>