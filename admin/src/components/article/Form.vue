<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import { VALIDATE_MESSAGES } from '@/consts'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { WIDTH, HEIGHT, ACTION_TITLES } from '@/consts'
import { deepClone, setValues, statusText, matchPhotoes, resolveImageModel, isEmptyObject } from '@/utils'

const name = 'ArticleEdit'
const props = defineProps({
   model: {
		type: Object,
		default: null
	},
	title: {
		type: String,
		default: ''
	}
})
const emit = defineEmits(['submit', 'cancel', 'remove'])
const store = useStore()

const initialState = {
   form: {
		id: 0,
      active: false,
      title: '',
		content: '',
		summary: '',
		cover: ''
   },
	errors: {
		'content': false
	},
	photoes: {
		active: false,
		items: [],
		cover: {}
	}
}
const state = reactive(deepClone(initialState))

const tiptap = ref(null)

const labels = {
	'active':'狀態',
	'title':'標題',
	'content':'內容',
	'summary':'摘要',
	'cover':'封面圖'
}

const rules = computed(() => {
	return {
		title: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels['title']), required)
		}
	}
})

const v$ = useVuelidate(rules, state.form)

const status_text = computed(() => statusText(state.form.active))

const hasCover = computed(() => !isEmptyObject(state.photoes.cover))

const selectedPhotoes = computed(() => hasCover.value ? [state.photoes.cover] : [])

onBeforeMount(init)

function init() {
	setValues(props.model, state.form)
}

function cancel() {
	emit('cancel')
}
function onContentChanged() {
	state.errors.content = false
}

function listImages() {
	const content = tiptap.value.getContent()
	let matches = matchPhotoes(content)
	if(!matches) return []

	state.photoes.items = matches.map(photo => resolveImageModel(photo))
	if(state.form.cover) {
		state.photoes.cover = state.photoes.items.find(p => p.url === state.form.cover)
	}
}
function selectCover() {
	listImages()
	state.photoes.active = true
}

function onCoverSubmit(items) {
	state.photoes.cover = { ...items[0] }
	state.photoes.active = false
}

function onSubmit() {
	v$.value.$validate().then(valid => {
		if(!valid) return
		if(state.form.active) {
			if(!hasCover) return
		}
		
		if(tiptap.value.isEmpty()) {
			state.errors.content = true
			return
		}
		state.errors.content = false
		state.form.content = tiptap.value.getContent()
		state.form.cover = state.photoes.cover.url
		emit('submit', state.form)
	})
}
function onRemove() {
	emit('remove')
}
function onInputChanged(){
   store.commit(CLEAR_ERRORS)
}
</script>

<template>
	<div>
		<v-card :max-width="WIDTH.M">
			<v-toolbar>
				<v-card-title>
					<span class="text-h5 font-weight-black">{{ props.title }}</span>
					<span v-if="props.model.id" class="headline ml-3">Id : {{ props.model.id }} </span>           
				</v-card-title>
				<template v-slot:append>
					<v-tooltip :text="ACTION_TITLES.CANCEL">
						<template v-slot:activator="{ props }">
							<v-btn v-bind="props" icon="mdi-window-close" 
							@click.prevent="cancel" 
							/>
						</template>
					</v-tooltip>
				</template>
			</v-toolbar>
			<v-card-text>
				<v-container>
					<form @submit.prevent="onSubmit" @input="onInputChanged">
						<v-row>
							<v-col cols="12">
								<v-text-field :label="labels['title']"                
								v-model="state.form.title"
								:error-messages="v$.title.$errors.map(e => e.$message)"                     
								@input="v$.title.$touch"
								@blur="v$.title.$touch"
								/>
							</v-col>
							<v-col cols="12">
								<p style="line-height: 2em;">
									<span class="font-weight-bold text-subtitle-1" v-text="labels['content']"></span>
									<span v-if="state.errors.content" class="text-red ml-2">{{ `*${VALIDATE_MESSAGES.REQUIRED(labels['content'])}`  }}</span>
								</p>
								<EditorTiptap ref="tiptap"  :min_height="HEIGHT.S.toString()"
								:content="state.form.content"
								@ready="listImages" @images="listImages"
								@changed="onContentChanged"
								/>
							</v-col>
							<v-col cols="12">
								<p style="line-height: 2em;">
									<span class="font-weight-bold text-subtitle-1"  v-text="labels['cover']"></span>
									<span v-if="!hasCover" class="text-red ml-2">{{ `*必須選擇${labels['cover']}`  }}</span>
								</p>
								<v-img v-if="hasCover" class="bg-white" width="240" cover
								:src="state.photoes.cover.url"
								/>
								<v-chip v-else variant="flat" color="red" prepend-icon="mdi-alert-circle" v-text="`沒有${labels['cover']}`"> 
								</v-chip>
								<v-btn class="ma-2" variant="outlined" density="comfortable" color="primary" v-text="`選擇${labels['cover']}`" 
								:disabled="state.photoes.items.length < 1" 
								@click.prevent="selectCover"
								/>
							</v-col>
							<v-col cols="12">
								<v-textarea :label="labels['summary']" auto-grow
								v-model="state.form.summary"
								/>
							</v-col>
							
							<v-col cols="6">
								<v-switch
								v-model="state.form.active"
								color="success" :label="status_text"
								/>
							</v-col>
							<v-col cols="6">
								
							</v-col>
						</v-row>
						<v-col cols="12">
							<CoreErrorList />
						</v-col> 
						<v-row>
							<v-col cols="6">
								<v-btn type="submit" color="success">
								{{ ACTION_TITLES.SAVE }}
								</v-btn>
							</v-col>
							<v-col cols="6" class="text-right">
								<v-btn v-if="!props.model.active" @click.prevent="onRemove" color="error">
									{{ ACTION_TITLES.REMOVE }}
								</v-btn>
							</v-col>
						</v-row>
					</form>
				</v-container>
			</v-card-text>
		</v-card>
		<v-dialog v-model="state.photoes.active" :width="WIDTH.M" persistent>
			<PickerPhotoes :title="`選擇${labels['cover']}`"
			:list="state.photoes.items" :multi="false" :selected="selectedPhotoes"
			@cancel="() => state.photoes.active = false" 
			@submit="onCoverSubmit" 
			/>
		</v-dialog>
   </div>
</template>