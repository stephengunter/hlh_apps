<script setup>
</script>

<template>
	<v-card>
		<core-close-icon-button @close="cancel" />
		<v-card-title v-if="title">
			<h3>{{ title }}</h3>
		</v-card-title>
		<v-card-text>
			<validation-observer ref="validator">
				<v-container>
					<v-row>
						<v-col cols="6">
							<v-menu full-width max-width="290"
							v-model="startDate.active"
							:close-on-content-click="false"
							>
								<template v-if="required_start" v-slot:activator="{ on }">
									<validation-provider v-slot="{ errors }" name="開始日期" rules="required">
										<v-text-field label="開始日期" readonly
										:value="startDate.val" v-on="on"
										:error-messages="errors"
										/>
									</validation-provider>
								</template>
								<template v-else v-slot:activator="{ on }">
									<v-text-field clearable label="開始日期" readonly
									:value="startDate.val" v-on="on"
									name="開始日期"
									@click:clear="onStartDateClear"
									/>
								</template>
								

								<v-date-picker locale="zh-cn"
								:min="minDate" :max="maxDate"
								v-model="startDate.val"
								@input="onStartDateChanged" 
								/>
							</v-menu>
						</v-col>
						<v-col cols="6">
							<v-menu full-width max-width="290"
							v-model="endDate.active"
							:close-on-content-click="false"
							>
								<template v-if="required_end" v-slot:activator="{ on }">
									<validation-provider v-slot="{ errors }" name="結束日期" rules="required">
										<v-text-field label="結束日期" readonly
										:value="endDate.val" v-on="on"
										:error-messages="errors"
										/>
									</validation-provider>
								</template>
								<template v-else v-slot:activator="{ on }">
									<validation-provider v-slot="{ errors }" name="結束日期" >
										<v-text-field clearable label="結束日期" readonly
										:value="endDate.val" v-on="on"
										:error-messages="errors"
										@click:clear="onEndDateClear"
										/>
									</validation-provider>
								</template>
								<v-date-picker locale="zh-cn"
								:min="minDate" :max="maxDate"
								v-model="endDate.val"
								@input="onEndDateChanged" 
								/>
							</v-menu>
						</v-col>
					</v-row>
					<v-row>
						<v-col class="text-right">
							<v-btn @click.prevent="onSubmit" color="success">
								確定
							</v-btn>
						</v-col>
					</v-row>
				</v-container>
			</validation-observer>
		</v-card-text>
	</v-card>
</template>

<script>
import moment from 'moment';
import { mapState, mapGetters } from 'vuex';
import { addErrorMsg, getErrorMsg, clearErrors } from '@/utils';

export default {
   name: 'PeriodSelector',
   props: {
		title: {
			type: String,
			default: '選擇日期'
		},
		period: {
			type: Array,
			default: null
		},
		start: {
			type: String,
			default: ''
		},
		end: {
			type: String,
			default: ''
		},
		required_start: {
			type: Boolean,
			default: false
		},
		required_end: {
			type: Boolean,
			default: false
		},
		version: {
			type: Number,
			default: 0
		}
	},
   data () {
		return {
			startDate: {
				val: '',
				active: false
			},
			endDate: {
				val: '',
				active: false
         },
         
         references: {}
		}
   },
   computed: {
		validator() {
			if(this.$refs.validator) return this.$refs.validator;
			else if (this.references.validator) return this.references.validator;
			return null;
		},
		minDate() {
			if(this.period && this.period.length) return this.period[0];
			return '';
		},
		maxDate() {
			if(this.period && this.period.length) return this.period[1];
			return '';
		}
	},
	watch: {
		version(val) {
			if(val) this.init();
		}
	},
	beforeMount() {
		this.init();
   },
   mounted() {
		this.references = { ...this.$refs };
	},
   methods: {
		init() {
			this.startDate.val = this.start;
			this.endDate.val = this.end;
		},
		cancel() {
			this.validator.reset();
			this.$emit('cancel');
		},
		onStartDateChanged() {
			this.startDate.active = false;
		},
		onEndDateChanged() {
			this.clearEndDateError();
			this.endDate.active = false;
		},
		onStartDateClear() {
			this.startDate.val = '';
		},
		onEndDateClear() {
			this.endDate.val = '';
			this.clearEndDateError();
		},
		checkDate() {
			let start = this.startDate.val;
			let end = this.endDate.val;

			//如果結束日期空白, 不用驗證
			if(!end) return true;

			//如果起始日期空白, 不用驗證
			if(!start) return true;
			
			let startDate = moment(start);
			let endDate = moment(end);
			return endDate.isSameOrAfter(startDate);
		},
		addEndDateError(msg = '日期錯誤') {
			addErrorMsg(this.validator, '結束日期', msg);
		},
		clearEndDateError() {
			let errors = clearErrors(this.validator.errors, ['結束日期']);
			this.validator.setErrors(errors);
		},
		onSubmit() {
         this.validator.validate().then(valid => {
				if(valid) {
               let dateValid = this.checkDate();
					if(dateValid) {
						this.validator.setErrors({});
						let start = this.startDate.val;
						let end = this.endDate.val;
						this.submit();
					}else {
						this.addEndDateError();
					}
				}
         });         
		},
		submit() {
			let start = this.startDate.val;
			let end = this.endDate.val;
			this.$emit('submit', { start, end });
		},
   }
}
</script>

<style>

</style>