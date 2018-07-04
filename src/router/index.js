import Vue from 'vue'
import Router from 'vue-router'
// 预约状态 停车中 已预约 预约未支付 已完成
import reservationPaking from '../components/reservationDt/reservationPaking'
import reservationinfo from '../components/reservationDt/reservationinfo'
import reservationBookingUnpaid from '../components/reservationDt/reservationBookingUnpaid'
import reservationComplete from '../components/reservationDt/reservationComplete'

// 老用户预约
import reservationOld from '../components/reservationDt/reservationOld'
// 新用户预约
import reservationNew from '../components/reservationDt/reservationNew'
//添加车牌
import licensePlateAdd from '../components/licensePlateDt/licensePlateAdd'
//我的车牌
import licensePlate from '../components/licensePlateDt/licensePlate'
//我的卡券
import ticket from '../components/ticketDt/ticket'
//支付
import payMentDt from '../components/payMentDt/payMentDt'
//支付完成
import payToComplete from '../components/payMentDt/payToComplete'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/reservationOld'
    },
    {
      path: '/reservationPaking',
      name: 'reservationPaking',
      component: reservationPaking
    },
    {
      path: '/reservationinfo',
      name: 'reservationinfo',
      component: reservationinfo
    },
    {
      path: '/reservationBookingUnpaid',
      name: 'reservationBookingUnpaid',
      component: reservationBookingUnpaid
    },
    {
      path: '/reservationOld',
      name: 'reservationOld',
      component: reservationOld
    },
    {
      path: '/reservationNew',
      name: 'reservationNew',
      component: reservationNew
    },
    {
      path: '/licensePlateAdd',
      name: 'licensePlateAdd',
      component: licensePlateAdd
    },
    {
      path: '/licensePlate',
      name: 'licensePlate',
      component: licensePlate
    },
    {
      path: '/ticket',
      name: 'ticket',
      component: ticket
    },
    {
      path: '/payMentDt',
      name: 'payMentDt',
      component: payMentDt
    },
    {
      path: '/payToComplete',
      name: 'payToComplete',
      component: payToComplete
    },
    {
      path: '/reservationComplete',
      name: 'reservationComplete',
      component: reservationComplete
    }
  ]
})
