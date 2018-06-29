import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/page/home'
import RoomManage from '@/page/systemService/roomManage'
import EmployeeManage from '@/page/systemService/employeeManage'
import AllOrderManage from '@/page/orderService/allOrderManage'
import NowInOrderManage from '@/page/orderService/nowInOrderManage'
import PreInOrderManage from '@/page/orderService/preInOrderManage'
import PreOutOrderManage from '@/page/orderService/preOutOrderManage'
import BasicManage from '@/page/systemService/basicManage'
import Layout from '@/page/layout'
import Login from '@/page/Login'
import Dash from '@/page/dash'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      //name: 'Home',
      component: Dash,
      children: [
        {
          path: '/',
          name: 'home',
          component: Home,
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
              path: '/layout/preInOrderManage',
              name: 'preInOrderManage',
              component: PreInOrderManage
            },
            {
              path: '/layout/nowInOrderManage',
              name: 'nowInOrderManage',
              component: NowInOrderManage
            },
            {
              path: '/layout/preOutOrderManage',
              name: 'preOutOrderManage',
              component: PreOutOrderManage
            },
            {
              path: '/layout/basicManage',
              name: 'basicManage',
              component: BasicManage
            }
          ]
        }
      ]
    }
  ]
})
