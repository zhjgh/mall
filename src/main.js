// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import axios from 'axios'
import Vuex from 'vuex'

Vue.config.productionTip = false

Vue.use(VueLazyLoad, {
  loading: '/static/loading-svg/loading-bars.svg'
})
Vue.use(infiniteScroll)
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    nickName: '',
    cartCount: 0
  },
  mutations: {
    //更新用户信息
    updateUserInfo(state, nickName) {
      state.nickName = nickName;
    },
    initCartCount(state, cartCount){
      state.cartCount = cartCount;
    },
    //更新购物车数量
    updateCartCount(state, cartCount) {
      state.cartCount += cartCount;
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  mounted(){
    this.checkLogin()
    this.getCartCount()
  },
  methods: {
    checkLogin() {
      axios.get('api/user/checkLogin').then(response => {
        let res = response.data
        if (res.status == '0') {
          this.$store.commit('updateUserInfo', res.result)
        }else{
          if(this.$route.path != '/goods'){
            this.$router.push('/goods')
          }
        }
      })
    },
    getCartCount() {
      axios.get('api/user/getCartCount').then((response) => {
        let res = response.data
        this.$store.commit('updateCartCount', res.result)
      })
    }
  },
  components: { App },
  template: '<App/>'
})
