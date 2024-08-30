<script setup>
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { isEmptyObject, deepClone , onErrors, areObjectsEqual, reviewedOptions,
	setValues, badRequest, tryParseInt, copyFromQuery
} from '@/utils'
import { INIT_DOCS, FETCH_DOCS, STORE_DOC } from '@/store/actions.type'

import { WIDTH, ROUTE_NAMES, ACTION_TYPES, ENTITY_TYPES, POST_TYPES } from '@/consts'

const name = 'DocView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {   
	
}
const state = reactive(deepClone(initialState))

</script>

<template>
<div >
   <v-row dense style="font-size: 1.2rem;">
      <v-col class="ml-3" cols="12">
         <h1>應司法院秘書處交辦，特建置此網站進行舊公文系統資料清查</h1>
         <a target="_blank" href="http://172.17.129.56:8080/20240819/%E8%8A%B1%E8%93%AE%E9%AB%98%E5%88%86%E9%99%A2-%E5%85%AC%E6%96%87%E7%B3%BB%E7%B5%B1%E6%9C%AA%E7%B5%90%E6%B8%85%E5%96%AE~(%E8%AB%8B%E6%96%BC%E6%B8%85%E6%9F%A5%E5%BE%8C%E5%86%8D%E5%9B%9E%E8%A6%86).htm">秘書處交辦信函請點此查看</a>
         
         <ul>
            <li>
               這裡都是舊公文系統中的未結案件，即狀態非『已歸檔』的資料(承辦中/存查...等)。
            </li>
            <li>
               早期舊案可能為承辦人測試、移入個人工作簿或離職人員未結案件等(作業流程未完全結束，或沒有實際作編目、系統沒有走完結案或發文流程..等原因)
            </li>
            <li>
               為確實清查院內公文辦理情形，避免未辦或遺失等相關責任問題，故請各科室承辦人自行清查，並於此網頁提交清查結果。
            </li>           
            <li>
               已先將資料分為
               <ul class="ml-6">
                  <li>
                     A類：承辦人目前仍在本院服務，且包含近期資料
                  </li>
                  <li>
                     B類：承辦人目前仍在本院服務，但資料較舊
                  </li>
                  <li>
                     C類：承辦人已離職或測試資料
                  </li>
                  <li>
                     審判公文，隨券歸檔
                  </li>
               </ul>
            </li>
         </ul>
         
         
      </v-col>
      <v-col cols="12">
         <h3 style="color: brown;">8/29日已進行第一次清查。</h3>
         <h3 style="color: brown;">為求慎重，請同仁於9月3日(三)之前，在A類和B類再次確認您要保留的資料和其狀態。</h3>
         操作方式請 <a href="http://172.17.129.56:8080/new_doc/after/keep.html" target="_blank">點此查看說明</a>
         <h3 style="color: brown;">未被保留的資料將於新系統設定隱藏。</h3>
         <h3 style="color: brown;">請科室承辦人自行確認並查找公文是否仍在身邊，紙本是否有簽奉核定與核章紀錄，避免誤設隱藏(規避公文書簽辦責任)。</h3>        
      </v-col>
      <v-col cols="12">
         如有疑問，請電洽：<br>
         文書科 林孟宗<br>
         資訊室 <br>
      </v-col>
   </v-row>
</div>
</template>