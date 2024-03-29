import Vue from 'vue'
import Router from 'vue-router'
const GoodsList = () => import('../page/GoodsList')
const Cart = () => import('../page/Cart')
const Address = () => import('../page/Address')
const AddressList = () => import ('../page/AddressList')
const OrderConfirm = () => import ('../page/OrderConfirm')
const OrderSuccess = () => import ('../page/OrderSuccess')
const OrderList = () => import ('../page/OrderList.vue')
const GoodsDetails = () => import ('../page/GoodsDetails')
const Checkout = () => import ('../page/Checkout')
const About = () => import ('../components/About')
const Contact = () => import ('../components/Contact')
// const login = () =>import ('../admin/adminPages/login')
const index = () => import('../admin/adminPages/index')
import store from '../store/index.js'
Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact
    },
    {
      path: '/goodsdetails',
      name: 'GoodsDetails',
      component: GoodsDetails
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart,
      beforeEnter: (to, from, next) => {
        if(store.state.myName){
          store.state.buynowlist.splice(0,1)
          next()
        }
      }
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    },
    {
      path: '/addresslist',
      name: 'AddressList',
      component: AddressList
    },
    {
      path: '/orderconfirm',
      name: 'OrderConfirm',
      component: OrderConfirm
    },
    {
      path: '/orderinfo',
      name: 'OrderSuccess',
      component: OrderSuccess
    },
    {
      path: '/orderlist',
      name: 'OrderList',
      component: OrderList
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: Checkout
    },
    {
      path: '/adminIndex',
      name: 'adminIndex',
      component: index,
      redirect:'/adminIndex/goodsList',
      children:[{
        path:'/adminIndex/goodsList',
        name:'goodsList',
        component: () => import('../admin/adminComponents/goodsList')
      }, {
        path: '/adminIndex/addGoods',
        name: 'addGoods',
        component: () => import('../admin/adminComponents/addGoods')
        }]
    }
  ]
})
