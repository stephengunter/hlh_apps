<script setup>
import { reactive, computed, watch, onBeforeMount} from 'vue'
import { useStore } from 'vuex'
import { MqResponsive } from 'vue3-mq'
import { useRoute, useRouter } from 'vue-router'
import { ARTICLE_DETAILS } from '@/store/actions.type'
import { converCustomTags, isEmptyObject } from '@/utils'

const name = 'ArticlesView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {
   model: {
		title: '',
		content: ''
	}
}
const state = reactive({
   ...initialState,
})
const content = computed(() => converCustomTags(state.model.content))

watch(route, init)
onBeforeMount(init)

function init() {
	fetchData(route.params.id ? route.params.id : 0)
}
function fetchData(id) {
   store.dispatch(ARTICLE_DETAILS, id)
	.then(model => state.model = { ...model })
   .catch(error => {
      console.log(error);
   })
}
</script>

<template>
	<v-container>
		<MqResponsive target="md+">
			<v-row>
				<v-col cols="9">
					<v-row>
                  <v-col cols="12">
                     <p class="text-h5">
								{{ state.model.title }}
							</p>
                  </v-col>
						<v-col cols="12">
							<ArticlesBottom :model="state.model" />
                  </v-col>
						<v-col cols="12">
							<article v-html="content">
   						</article>
                  </v-col>
						<v-col cols="12">
							<SocialLine url="https://learn.microsoft.com/zh-tw/aspnet/core/tutorials/first-web-api?view=aspnetcore-8.0&tabs=visual-studio" 
							/>
							<ShareNetwork
								network="facebook"
								url="https://news.vuejs.org/issues/180"
								title="Say hi to Vite! A brand new, extremely fast development setup for Vue."
								description="This week, I’d like to introduce you to 'Vite', which means 'Fast'. It’s a brand new development setup created by Evan You."
								quote="The hot reload is so fast it\'s near instant. - Evan You"
								hashtags="vuejs,vite"
							>
								Share on Facebook
							</ShareNetwork>
						</v-col>
               </v-row>
				</v-col>
				<v-col cols="3">
					<sides-right />
				</v-col>
			</v-row>

		</MqResponsive>
		<MqResponsive target="sm-">
			<v-fade-transition mode="out-in">
				<v-row dense>
					<v-col cols="12">
						<p class="text-h5">
							{{ state.model.title }}
						</p>
					</v-col>
					<v-col cols="12">
						<ArticlesBottom :model="state.model" />
					</v-col>
					<v-col cols="12">
						<article v-html="content">
   					</article>
					</v-col>
					<v-col cols="12">
						<SocialLine />
						<SocialTwitter />
						<SocialFacebook />
					</v-col>
					<v-col cols="12">
						<div class="tags">
							<a href="#" class="tag-item">#花蓮</a>
						</div>
					</v-col>
				</v-row>
         </v-fade-transition>
		</MqResponsive>
	</v-container>
</template>

