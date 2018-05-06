import Vue from 'vue'
import Router from 'vue-router'
import myTableChart from '@/components/myTableChart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'myTableChart',
      component: myTableChart
    }
  ]
})
