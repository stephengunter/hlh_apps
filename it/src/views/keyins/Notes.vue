<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ACTION_TYPES, ENTITY_TYPES, WIDTH } from '@/consts'
import { INIT_KEYINS_PERSONS, FETCH_KEYINS_PERSONS, DOWNLOAD_KEYINS_PERSONS_TEMPLATE, 
	UPLOAD_KEYINS_PERSONS, STORE_KEYINS_PERSONS, EXPORT_KEYINS_PERSONS_REPORT } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile, showConfirm, hideConfirm,
	onErrors, onSuccess, setValues, is400, bytesToBinary, getMimeType,
	resolveErrorData
} from '@/utils'

const name = 'KeyinsNotesView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ENTITY_TYPE = ENTITY_TYPES.KEYIN
const initialState = {
	
}
const state = reactive(deepClone(initialState))
</script>

<template>
<div>
	<v-row dense>
		<v-col cols="12">
			<h2>使用說明</h2>
			<p style="padding-left: 15px;">
				<ul>
					<li>
						司法院聽打成績查詢 <a target="_blank" href="http://172.16.16.62:8080/reindex.asp">http://172.16.16.62:8080/reindex.asp</a> 
						<span class="ml-3">帳號 HLHADM</span><span class="ml-3">密碼 hlh1234</span>
						<v-img :width="600"  src="@/assets/keyins/login.png"></v-img>
					</li>
					<li>
						打字排行 > 選擇月份 > 查詢 > 匯出
						<v-img :width="600"  src="@/assets/keyins/fetch.png"></v-img>
					</li>
					<li style="padding-top: 30px;">
						上傳各法院成績
						<v-img :width="600"  src="@/assets/keyins/branches.png"></v-img>
						<v-img :width="600" style="padding-top: 30px;"  src="@/assets/keyins/branch_csv.png"></v-img>
						<v-img :width="600" style="padding-top: 30px;"  src="@/assets/keyins/branch_submit.png"></v-img>
					</li>
					<li style="padding-top: 30px;">
						下載各法院成績報表
						<v-img :width="600"  src="@/assets/keyins/branch_report.png"></v-img>
					</li>
					<li style="padding-top: 120px;">
						打字排行 > 法院成績查詢
						<v-img :width="600"  src="@/assets/keyins/person1.png"></v-img>
					</li>
					<li>
						選擇法院 > 選擇月份 > 查詢 > 匯出
						<v-img :width="600"  src="@/assets/keyins/person2.png"></v-img>
					</li>
					<li style="padding-top: 30px;">
						上傳本院個人成績
						<v-img :width="600"  src="@/assets/keyins/person3.png"></v-img>
						<v-img :width="600" style="padding-top: 30px;"  src="@/assets/keyins/person_csv.png"></v-img>
						<v-img :width="600" style="padding-top: 30px;"  src="@/assets/keyins/person_submit.png"></v-img>
					</li>
					
					<li style="padding-top: 30px;">
						下載本院個人成績報表
						<v-img :width="600"  src="@/assets/keyins/person_report.png"></v-img>
					</li>
				</ul>
			</p>
			
		</v-col>
	</v-row>
</div>
</template>
