import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '',
      redirect: '/postList'
    },
    {
      path: '/usersList',
      name: 'usersList',
      component: () => import('../admin/components/usersList')
    },
    {
      path: '/postList',
      name: 'postList',
      component: () => import('./components/postList')
    },
    {
      path: '/commentList',
      name: 'commentList',
      component: () => import('./components/commentList')
    },
    {
      path: '/statisticalInformation',
      name: 'statisticalInformation',
      component: () => import('./components/statisticalInformation')
    },
    {
      path: '/imageList',
      name: 'imageList',
      component: () => import('./components/imageList')
    },
    {
      path: '/uploadPicture',
      name: 'uploadPicture',
      component: () => import('./components/uploadPicture')
    },
    {
      path: '/systemInformationList',
      name: 'systemInformationList',
      component: () => import('./components/systemInformationList')
    },
    {
      path: '/releaseSystemMessage',
      name: 'releaseSystemMessage',
      component: () => import('./components/releaseSystemMessage')
    },
    {
      path: '/modifySystemInformation',
      name: 'modifySystemInformation',
      component: () => import('./components/modifySystemInformation')
    }
  ]
})
