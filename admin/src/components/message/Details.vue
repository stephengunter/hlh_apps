<template>
	<v-card>
		<core-close-icon-button @close="cancel" />
		<v-card-text>
			<v-container>
				<v-row>
					<h2>原件</h2>
					<v-col cols="12">
						<p>
							<span class="headline">{{ model.subject }}</span>
							<span class="pl-3">{{ model.createdAtText }}</span>
						</p>
					</v-col>
					<v-col cols="12">
						<p>
							{{ model.content }}
						</p>
					</v-col>
				</v-row>
				<v-row>
					<h2>回覆</h2>
					<v-col cols="12">
						<p>
							<span class="headline">{{ reply.subject }}</span>
							<span class="pl-3">{{ reply.lastUpdatedText }}</span>
						</p>
					</v-col>
					<v-col cols="12">
						<p v-html="reply.content">
							
						</p>
					</v-col>
					
				</v-row>
				<v-row v-if="reply.draft">
					<v-col cols="12">
						<v-checkbox readonly v-model="reply.draft" label="草稿"
						/>
					</v-col>
				</v-row>
			</v-container>
		</v-card-text>
	</v-card>
</template>


<script>
export default {
	name: 'MessageDetails',
	props: {
		model: {
         type: Object,
         default: null
		}
	},
	data () {
		return {
			reply: {
				subject: '',
				content: '',
				draft: false,
			}
		}
	},
	beforeMount() {
		this.reply = this.model.returnContentView;
	},
	methods: {
		cancel(){
         this.$emit('cancel');
		}
	}
}
</script>
