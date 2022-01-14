// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App'
import router from './router'
// import store from './store'

Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(ElementUI)

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   // store,
//   router,
//   components: { App },
//   template: '<App/>'
// })

window.vm = new Vue({
  el: '#app',
  router,
  // store,
  components: { App },
  vuetify: new Vuetify({
    theme: {
      themes: {
        light: {
          success: '#00875A',
          warning: '#FF9800',
          error: '#CC0033',
          primary: '#295b9b'
        }
      }
    }
  }),
  template: '<App/>'
}).$refs.app
