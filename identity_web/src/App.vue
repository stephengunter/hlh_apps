<script setup>
   const name = 'App'
</script>
<template>
	<v-app id="app">
		<LayoutToolbar />
		
		<v-container fluid>
			<v-main id="layout-view">
				<router-view />
			</v-main>
		</v-container>

		<LayoutFeedback />
		
	</v-app>
</template>
