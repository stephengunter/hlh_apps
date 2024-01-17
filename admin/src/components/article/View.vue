<template>
	<v-card>
		<core-close-icon-button @close="cancel" />
		<v-card-text>
			<v-container grid-list-md>
				<v-layout wrap>
					<span class="font-weight-thin">原件</span>
					<v-flex xs12>
						<p>
							<span class="headline">{{ model.subject }}</span>
							<span class="pl-3">{{ model.createdAtText }}</span>
						</p>
					</v-flex>
					<v-flex xs12>
						<p>
							{{ model.content }}
						</p>
					</v-flex>
				</v-layout>
				<v-layout wrap class="mt-3">
					<span class="font-weight-thin">回覆</span>
					<v-flex xs12>
						<p>
							<span class="headline">{{ reply.subject }}</span>
							<span class="pl-3">{{ reply.lastUpdatedText }}</span>
						</p>
					</v-flex>
					<v-flex xs12>
						<p v-html="reply.content">
							
						</p>
					</v-flex>
					
				</v-layout>
				<v-layout wrap v-if="reply.draft">
					<v-flex xs6>
						<v-checkbox readonly v-model="reply.draft" label="草稿"
						/>
					</v-flex>
					<v-flex xs6>
						
					</v-flex>
				</v-layout>
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
