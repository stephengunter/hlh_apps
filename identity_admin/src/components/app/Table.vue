<script setup>
import { isEmptyObject, getValue, showPassword } from '@/utils'
import { ACTION_TYPES } from '@/consts'


const name = 'AppTable'
const props = defineProps({
	list: {
      type: Array,
      default: () => []
   },
	labels: {
      type: Object,
      default: null
   }
})
const emit = defineEmits(['edit', 'select'])
function edit(id) {
	emit('edit', id)
}
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function getTitle(model) {
   if(model.DisplayName) return model.title
   return `${model.host.ip} ${model.provider}`
}

</script>

<template>
	<v-table>
		<thead>
			<tr>
				<th style="width: 7%;">
				</th>
            <th style="width: 15%;" v-text="getLabel('displayName')">
				</th>
            <th style="width: 15%;" v-text="getLabel('clientId')">			
				</th>
				<th style="width: 15%;">
					ClientType
				</th>
				<th style="width: 25%;" v-text="getLabel('redirectUris')">					
				</th>
				<th style="width: 15%;" v-text="getLabel('postLogoutRedirectUris')">					
				</th>
				<th style="width: 10%;">
					
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="item in list" :key="item.id">
				<td>
					<CommonButtonEdit size="x-small"
					:tooltip="ACTION_TYPES.EDIT.title"
					@edit="edit(item.id)"
					/>
            </td>
				<td>
					{{ item.displayName }}
            </td>
				<td>
					{{ item.clientId }}
				</td>
				<td>
					{{ item.clientType }}
				</td>
				<td>
					<ul style="list-style: none;">
						<li v-for="uri in item.redirectUris" :key="item.uri">
							{{ uri }}
						</li>
					</ul>
				</td>
				<td></td>
			</tr>
		</tbody>
  </v-table>
</template>