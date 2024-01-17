<template>
   <core-container>
      <v-row>
         <v-col cols="12" sm="6">
            <v-select label="角色" @update:modelValue="onParamsChanged"
            :items="roleOptions" v-model="params.role"
            />
         </v-col>
         <v-col cols="12" sm="6">
            <CoreSearch
            @search="(val) => {
               params.keyword = val
               onParamsChanged()
            }"
            />
         </v-col>
      </v-row>
      <v-row>
         <v-col cols="12">
            <UserTable :list="dataList"
				/>
         </v-col>
      </v-row>
   </core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { FETCH_USERS } from '@/store/actions.type'
import { onError, scrollToTop } from '@/utils'

export default {
   name: 'UsersView',
   data: () => ({
      params: {
         role: '',
         keyword: '',
         page: -1,
         pageSize: 10
      }      
   }),
   computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			pagedList: state => state.users.pagedList,
         roleOptions: state => state.users.roleOptions
		}),
      dataList() {
			if(this.pagedList) {
				return this.pagedList.viewList
			} return []
		}
	},
   beforeMount() {
      this.fetchData()
   },
   methods: {
      fetchData() {
         this.$store.dispatch(FETCH_USERS, this.params)
         .then(() => {
            if(this.params.page < 1) this.params.page = 1
         })
         .catch(error => {
            onError(error)
         })
      },
      onParamsChanged() {
         this.params.page = 1
         this.$nextTick(this.fetchData)
      }
   }
}
</script>

