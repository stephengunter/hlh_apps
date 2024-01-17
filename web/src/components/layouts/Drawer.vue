<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { SET_DRAWER } from '@/store/mutations.type'

const store = useStore()

const drawer = computed({
	get() {
		return store.getters.drawer
	},
	set(val) {
		store.commit(SET_DRAWER, val)
	}
})

</script>

<template>
	<v-navigation-drawer app v-model="drawer">
		<v-list nav>
			<v-list-item prepend-icon="mdi-home" to="/" title="首頁" value="home" />
			<v-list-item prepend-icon="mdi-puzzle" to="/games" title="小遊戲" value="games" />
			<v-list-item prepend-icon="mdi-tools" to="/tools" title="工具箱" value="tools" />	
		</v-list>
	</v-navigation-drawer>
</template>
