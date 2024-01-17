import { createStore } from 'vuex'

import app from './modules/app.module'
import auth from './modules/auth.module'
import articles from './modules/articles.module'

const store = createStore({
   modules: {
      app,
      auth,
      articles
   }
})

export default store