<template>
   <v-btn :class="class_name" :color="color"
    :loading="loading" :disabled="launching || loading"
   @click="launch" 
   >
      <slot>
         {{ text }}
         <v-icon right>mdi-cloud-upload</v-icon>
      </slot>
      
      <input ref="inputUpload" style="display: none;" type="file" 
      :multiple="multiple" :accept="accept" @click="charge"
      @change="onFileChange" 
      >
   </v-btn>
</template>

<script>
export default {
   name: 'UploadButton',
   props: {
      color: {
         type: String,
         default: 'info'
      },
      text: {
         type: String,
         default: '上傳圖片'
      },
      class_name: {
         type: String,
         default: ''
      },
      multiple: {
         type: Boolean,
         default: true
      },
      allow_types: {
         type: Array,
         default: null
      },
      is_media: {
         type: Boolean,
         default: true
      },
   },
   data () {
		return {
         launching: false,
         loading: false,
			image_types: ['image/png', 'image/gif', 'image/jpeg'],
         accept: '',
         exclude: [],
         files: [],
         thumbnails: [],

         references: {}
		}
   },
   computed: {
      inputUpload() {
			if(this.$refs.inputUpload) return this.$refs.inputUpload;
			else if (this.references.inputUpload) return this.references.inputUpload;
			return null;
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
         if(this.is_media) this.accept = this.image_types.toString();
         else this.accept = this.allow_types.toString();
      },
      launch() {
         if(this.launching) return;

         this.launching = true;
         this.inputUpload.value = '';
         this.files = [];
         this.thumbnails = [];


         this.inputUpload.click();
         this.$emit('launch');
      },
      charge() {
         let vm = this;
         document.body.onfocus = () => { setTimeout(vm.checkOnCancel, 100); };
      },
      checkOnCancel() {
         this.launching = false;
         if(this.inputUpload) {
            if(this.inputUpload.value.length === 0) {
               this.setLoading(false);
               this.$emit('cancel');
            }
         }

         document.body.onfocus = null;
      },
      setLoading(val) {
         this.loading = val;
         if(val) this.$emit('loading');
      },
      onFileChange(e) {
         this.launching = false;
         
         let files = e.target.files || e.dataTransfer.files;
         if (!files.length) return;

         this.setLoading(true);
         let addFiles = [];
         for (let i = 0; i < files.length; i++) {
            if (this.fileCanAdd(files[i])) {
               addFiles.push(this.addFile(files[i]));
            }
         }
         let vm = this;
         Promise.all(addFiles).then(() => {
            if(this.is_media) {
               vm.$emit('file-added', { files: vm.files, thumbs: vm.thumbnails });
            }else {
               vm.$emit('file-added', vm.files);
            }
            
            vm.loading = false;
         });
      },
      isImage(type) {
         return this.image_types.includes(type);
      },
      fileCanAdd(file) {
         if (this.fileExist(file.name)) return false;
         if (this.exclude.includes(file.name)) return false;
         return true;
      },
      fileExist(name) {
         let index = this.findFileIndex(name);
         return index >= 0;
      },
      findFileIndex(name) {
         let index = this.files.findIndex(item => {
               return item.name === name;
         });
         return index;
      },
      createImage(file) {
         let vm = this;
         return new Promise((resolve, reject) => {
            if (!vm.isImage(file.type)) resolve(null);

            const reader = new FileReader();
            reader.onerror = (error) => {
               reader.abort();
               reject(error);
            };

            reader.onload = () => {
               resolve(reader.result);
            };
            reader.readAsDataURL(file);
         });
      },
      addFile(file) {
         let vm = this;
         if(this.is_media) {
            return new Promise((resolve, reject) => {
               let image = vm.createImage(file);
               image.then(data => {
                  let thumb = {
                     data: data,
                     name: file.name,
                     type: file.type,
                  };
                  vm.files.push(file);
                  vm.thumbnails.push(thumb);

                  resolve(true);

               }).catch(error => {
                  console.error(error);
                  reject();
               })
            });
         }else {
            return new Promise((resolve) => {
               vm.files.push(file);
               resolve(true);
            });
         }
         

      },
      removeFile(name) {
         let index = this.findFileIndex(name);
         if (index >= 0) this.files.splice(index, 1);

         this.removeThumb(name);
      },
      removeThumb(name) {
         let thumbIndex = this.thumbnails.findIndex(item => {
            return item.name == name;
         });
         if (thumbIndex >= 0) this.thumbnails.splice(thumbIndex, 1);
      },
      getFiles() {
         return this.files;
      },
      getThunbnails() {
         return this.thumbnails;
      }
   }
}
</script>

<style>

</style>