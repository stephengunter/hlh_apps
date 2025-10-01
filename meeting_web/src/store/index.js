import { createStore } from 'vuex'

import app from './modules/app.module'
import auth from './modules/auth.module'
import posts from './modules/posts.module'
import receives from './modules/receives.module'


const store = createStore({
   modules: {
      app,
      auth,
      posts,
      receives
   }
})

export default store
