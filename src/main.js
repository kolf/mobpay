import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import Resource from 'vue-resource'
import Validator from 'vue-validator'
import Index from './views/index.vue'
import Binding from './views/binding.vue'
import Agreement from './views/agreement.vue'
// import filters from './filters/filter'

console.log(window.location.search)

Vue.use(Router)
Vue.use(Resource)
Vue.use(Validator)
Vue.http.options.root = 'http://121.40.236.90:8102'

Vue.config.debug = true
// Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))
// 初始化路由
var router = new Router({})

router.map({
  '/': {
    name: 'index',  // 路径别名
    component: Index
  },
  '/binding': {
    name: 'binding',
    component: Binding
  },
  '/agreement': {
    name: 'agreement',
    component: Agreement
  }
})

router.redirect({
  '*': '/'
})

router.start(App, 'app')
