import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/reservationOld',
      component: resolve =>
        require(['@/components/reservationDt/reservationOld'], resolve)
    },
    {
      path: '/reservationPaking',
      name: 'reservationPaking',
      component: resolve =>
        require(['@/components/reservationDt/reservationPaking'], resolve)
    },
    {
      path: '/reservationinfo',
      name: 'reservationinfo',
      component: resolve =>
        require(['@/components/reservationDt/reservationinfo'], resolve)
    },
    {
      path: '/reservationBookingUnpaid',
      name: 'reservationBookingUnpaid',
      component: resolve =>
        require([
          '@/components/reservationDt/reservationBookingUnpaid'
        ], resolve)
    },
    {
      path: '/reservationOld',
      name: 'reservationOld',
      component: resolve =>
        require(['@/components/reservationDt/reservationOld'], resolve)
    },
    {
      path: '/reservationNew',
      name: 'reservationNew',
      component: resolve =>
        require(['@/components/reservationDt/reservationNew'], resolve)
    },
    {
      path: '/licensePlateAdd',
      name: 'licensePlateAdd',
      component: resolve =>
        require(['@/components/licensePlateDt/licensePlateAdd'], resolve)
    },
    {
      path: '/licensePlate',
      name: 'licensePlate',
      component: resolve =>
        require(['@/components/licensePlateDt/licensePlate'], resolve)
    },
    {
      path: '/ticket',
      name: 'ticket',
      component: resolve => require(['@/components/ticketDt/ticket'], resolve)
    },
    {
      path: '/payMentDt',
      name: 'payMentDt',
      component: resolve =>
        require(['@/components/payMentDt/payMentDt'], resolve)
    },
    {
      path: '/payToComplete',
      name: 'payToComplete',
      component: resolve =>
        require(['@/components/payMentDt/payToComplete'], resolve)
    },
    {
      path: '/reservationComplete',
      name: 'reservationComplete',
      component: resolve =>
        require(['@/components/reservationDt/reservationComplete'], resolve)
    }
  ]
})
