import Vue from 'vue'
// import Vuex from 'vuex'
import Router from 'vue-router'
// import home from '../components/home/home'
// import myAcount from '../components/home/myAcount'
// import parkingTicket from '../components/home/parkingTicket'
// import news from '../components/home/news'
// import appointment from '../components/acountComponents/appointment'
// import appoint from '../components/commonComponents/appoint'
// import payMent from '../components/commonComponents/payMent'
// import parkDetail from '../components/commonComponents/parkDetail'
// import counp from '../components/acountComponents/counp'
// import car from '../components/acountComponents/car'
// import addCar from '../components/acountComponents/addCar'
// import appointInfo from '../components/acountComponents/appointInfo'
// import orderInfo from '../components/acountComponents/orderInfo'
// import settingMore from '../components/acountComponents/more'
// import activities from '../components/acountComponents/activities'
// import suggestions from '../components/acountComponents/suggestions'
// import login from '../components/login/login'
//头部
import header from '../components/reservationDt/header'
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

Vue.use(Router);

export default new Router({
    // mode: 'history',
    routes: [
        // {
        //     path: '/',
        //     redirect: '/login',
        // },
        // {
        //     path: '/login',
        //     name: 'login',
        //     component: login
        // },
        // {
        //     path: '/home',
        //     name: 'home',
        //     component: home
        // },
        // {
        //     path: '/myAcount',
        //     name: 'myAcount',
        //     component: myAcount
        // },
        // {
        //     path: '/settingMore',
        //     name: 'settingMore',
        //     component: settingMore
        // },
        // {
        //     path: '/parkingTicket',
        //     name: 'parkingTicket',
        //     component: parkingTicket
        // },
        // {
        //     path: '/appointment',
        //     name: 'appointment',
        //     component: appointment
        // },
        // {
        //     path: '/counp',
        //     name: 'counp',
        //     component: counp
        // },
        // {
        //     path: '/car',
        //     name: 'car',
        //     component: car
        // },
        // {
        //     path: '/addCar',
        //     name: 'addCar',
        //     component: addCar
        // },
        // {
        //     path: '/appoint',
        //     name: 'appoint',
        //     component: appoint
        // },
        // {
        //     path: '/payMent',
        //     name: 'payMent',
        //     component: payMent
        // },
        // {
        //     path: '/appointInfo',
        //     name: 'appointInfo',
        //     component: appointInfo
        // },
        // {
        //     path: '/orderInfo',
        //     name: 'orderInfo',
        //     component: orderInfo
        // },
        // {
        //     path: '/activities',
        //     name: 'activities',
        //     component: activities
        // },
        // {
        //     path: '/suggestions',
        //     name: 'suggestions',
        //     component: suggestions
        // },
        // {
        //     path: '/parkDetail',
        //     name: 'parkDetail',
        //     component: parkDetail
        // },
        // {
        //     path: '/news',
        //     name: 'news',
        //     component: news
        // },


        // {
        //     path: '/header',
        //     name: 'header',
        //     component: header
        // },
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
        },

    ]
})