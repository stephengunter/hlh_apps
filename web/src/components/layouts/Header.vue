<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { TOGGLE_DRAWER } from '@/store/mutations.type'
import { SITE_TITLE } from '@/config'

const store = useStore()
const router = useRouter()

const currentUser = computed(() => store.getters.currentUser)

const title = ref(SITE_TITLE)

function toggleDrawer() {
   store.commit(TOGGLE_DRAWER)
}

function home() {
	console.log('home')
	
}
function logout() {
	router.push('/')
	console.log('logout')
}

</script>

<template>
	<v-app-bar>
		<template v-slot:prepend>
			<v-app-bar-nav-icon @click.stop="toggleDrawer" />
		</template>
		<MqResponsive target="md+">
			<v-app-bar-title class="pl-0">
				<a class="text-h5" href="/" style="text-decoration: none; color: black;">
					<v-avatar image="@/assets/logo.png" rounded="0" class="me-3">
					</v-avatar>
					<span class="text-h5" style="line-height: 1.5rem;">{{ title }}</span>
				</a>
			</v-app-bar-title>
		</MqResponsive>
		<MqResponsive target="sm-">
         <v-app-bar-title>
				<a href="/" style="text-decoration: none;">
					<v-avatar image="@/assets/logo.png" rounded="0" class="me-3">
					</v-avatar>
				</a>
			</v-app-bar-title>
      </MqResponsive>
		<v-spacer />
		<v-btn icon>
			<v-icon>mdi-magnify</v-icon>
		</v-btn>
		<v-btn icon>
			<v-icon>mdi-dots-vertical</v-icon>
		</v-btn>

		
		<v-menu v-if="currentUser">
			<template v-slot:activator="{ props }">
				<v-btn icon v-bind="props">
					<v-avatar color="red">
						<span class="text-h5">N</span>
					</v-avatar>
				</v-btn>
			</template>
			<v-list>
				<v-list-item min-width="120" max-width="180" @click.prevent="logout">
					<template v-slot:prepend>
						<v-icon icon="mdi-logout-variant"></v-icon>
					</template>
					<v-list-item-title>登出</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>
	</v-app-bar>
</template>
