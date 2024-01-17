<template>
   <core-container>
		<v-row v-if="ready">
			<v-col cols="12">
				<v-alert outlined type="error"  prominent icon="mdi-tools">
					系統維護中，暫時停止服務。
				</v-alert>
			</v-col>
		</v-row>
   </core-container>
</template>

<script>
import { APP_CLOSED } from '@/config';
export default {
	name: 'CloseView',
	data(){
		return {
			ready: false
		}
	},
	beforeMount() {
		if(APP_CLOSED) this.ready = true;
		else this.$router.push({ path: '/' }); 
	},
	methods: {
		
   }
}
</script>

<style>

</style>