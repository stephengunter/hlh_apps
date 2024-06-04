import { Vue3Mq } from 'vue3-mq'

export const addVue3Mq = (app) => {
   app.use(Vue3Mq, {
      preset: 'vuetify'
   })
}