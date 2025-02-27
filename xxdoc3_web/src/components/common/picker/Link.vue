<script setup>
import { ref, reactive, computed, watch, onBeforeMount } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { url, required, helpers } from '@vuelidate/validators'
import { DIALOG_MAX_WIDTH } from '@/config'
import { WIDTH, VALIDATE_MESSAGES, ACTION_TYPES } from '@/consts'
import { deepClone, setValues } from '@/utils'

const name = 'CommonPickerLink'
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

const initialState = {
	form: {
	   url: '',
      new_window: true
	}
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
   setValues(props.model, state.form)
})

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
            <v-text-field
            :label="labels['url']"
            v-model="state.form.url"
            :error-messages="v$.url.$errors.map(e => e.$message)"
            @input="v$.url.$touch"
            @blur="v$.url.$touch"
            />
            <v-switch color="primary" label="開新視窗" hide-details 
            v-model="state.form.new_window"
            />
         </v-col>
         
      </v-row>
      <v-row dense v-show="!props.auto_submit">
         <v-col cols="12">
            <v-btn class="float-right" type="submit" color="success">確定</v-btn>
         </v-col>
      </v-row>
   </form>
</template>