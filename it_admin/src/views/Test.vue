<script setup>
import { ref, reactive, computed, onBeforeMount, nextTick } from 'vue'
import { setValues, getValue, isValidURL, deepClone, isEmptyObject } from '@/utils'

onBeforeMount(() => {
	console.log(isValidURL('http://localhost:3000'))
})
const quantity = ref(1);
const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};
</script>

<template>
	<div>
    <v-row dense>
			<v-col cols="3">
        <CommonPickerQuantity label="數量" />
			</v-col>
      <v-col cols="9">
				
			</v-col>
		</v-row>
		
	</div>
</template>