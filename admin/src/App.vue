<script setup>
const name = 'App'

</script>

<template>
	<v-app id="app">
		<LayoutToolbar />

		<LayoutDrawer />
		
		<v-container fluid>
			<v-main id="layout-view">
				<router-view />
			</v-main>
		</v-container>

		<LayoutFeedback />
		
	</v-app>
</template>