import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/page/home'
import RoomManage from '@/page/systemService/roomManage'
import EmployeeManage from '@/page/systemService/employeeManage'
import AllOrderManage from '@/page/orderService/allOrderManage'
import BasicManage from '@/page/systemService/basicManage'
import Layout from '@/page/layout'
import Login from '@/page/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/layout',
      name: 'layout',
      component: Layout,
      children: [
        {
          path: '/layout/roomManage',
          name: 'roomManage',
          component: RoomManage
        },
        {
          path: '/layout/employeeManage',
          name: 'employeeManage',
          component: EmployeeManage
        },
        {
          path: '/layout/allOrderManage',
          name: 'allOrderManage',
          component: AllOrderManage
        },
        {
          path: '/layout/basicManage',
          name: 'basicManage',
          component: BasicManage
        }
      ]
    }
  ]
})
