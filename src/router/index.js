import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/views/Welcome.vue'
import Mainpage from '@/views/Mainpage.vue'

Vue.use(Router)

export default new Router({

  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },

    {
      path: '/home',
      name: 'Mainpage',
      component: Mainpage,
      // meta: {
      //   requireAuth: true,
      // }
    }
  ]
})


