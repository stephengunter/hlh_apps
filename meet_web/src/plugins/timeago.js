import timeago from 'vue-timeago3'
import { zhTW } from 'date-fns/locale'


export const addTimeAgo = (app) => {
   app.use(timeago, {
      // converterOptions: {
      // 	includeSeconds: false,
      // },
      locale: zhTW
   })
}