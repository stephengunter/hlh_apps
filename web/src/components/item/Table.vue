<script setup>
import { previewClientFile, previewAttachment } from '@/utils'

const name = 'ItemTable'
const props = defineProps({
	read_only: {
      type: Boolean,
      default: false
   },
   list: {
      type: Array,
      default: () => []
   }
})
const emit = defineEmits(['edit', 'remove'])

function getUrl(model) {
	if(model.url) return model.url
	return model.file.name
	
}
function preview(file) {
	previewClientFile(file)	
}
function remove(index) {
	emit('remove', index)
}
function edit(index) {
	emit('edit', index)
}

</script>
<template>
   <v-table v-if="read_only">
      <tbody>
			<tr v-for="(model, index) in list" :key="index">
				<td >
					{{ model.title }}
				</td>
				<td style="width: 50%;">
					<a v-if="model.url" :href="model.url" target="_blank"
					v-text="model.url">
					</a>
					<AttachmentIcon v-else 
					:model="model.attachment"
					@click="previewAttachment(model.attachment)"
					/>
					
				</td>
			</tr>
		</tbody>
   </v-table>
	<v-table v-else>
      <tbody>
			<tr v-for="(model, index) in list" :key="index">
            <td style="width: 60px;">
					<CommonButtonEdit size="x-small" :icon_only="true" color="success"
					@edit="edit(index)"
               />
				</td>
				<td>
					{{ model.title }}
				</td>
				<td v-if="model.id">
					<AttachmentIcon v-for="(attachment, index) in model.attachments"
					:model="attachment"
					@click="previewAttachment(attachment)"
					/> 
					<!-- <v-tooltip v-if="model.file" top>
						<template  v-slot:activator="{ props }">
							<a href="#" v-bind="props"
							@click.prevent="previewClientFile(model.file)" v-text="model.file.name">
							</a>
						</template>
						<span>預覽</span>
					</v-tooltip> -->
					
				</td>
				<td v-else>
					<v-tooltip top v-for="(file, index) in model.files">
						<template v-slot:activator="{ props }">
							<a href="#" v-bind="props" class="ma-3"
							@click.prevent="preview(file)" v-text="file.name">
							</a>
						</template>
						<span>預覽</span>
					</v-tooltip>
					
				</td>
				<td style="width: 60px;">
					<CommonButtonRemove size="x-small" :icon_only="true"
					@remove="remove(index)"
               />
				</td>
			</tr>
		</tbody>
  </v-table>
</template>