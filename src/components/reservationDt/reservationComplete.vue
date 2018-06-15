<template>
  <div id="appoint-info">
    <!-- <sub-header :headerMark="headerMark"></sub-header> -->
    <div class="appoit-info-box" ref="appoitInfoBox">
      <div sytle="position: relative;">
        <!--1.0 停车场显示车牌 停车位显示车位编号 坐标和地址 不管是预约还是在停车都要显示-->
        <div class="content">
          <div class="guide-show" v-if="orderData.type === 2">
            <div class="imgstyle">
             <div class="img-car-text">
               <span v-if="orderData.type === 2">
                 <span class="border-text">车位</span><span>编号</span>
               </span>
             </div>
              <div class="car-ploate">
                <div v-if="orderData.parklocNumber !== null">
                  {{orderData.parklocNumber}}
                </div>
              </div>
            </div>
          </div>

          <div class="plate">
              <div class="plate-info">
                <p>
                  <span  class="name-text">{{orderData.parklotName}}</span>
                  <span class="yellow-s" v-if="orderData.parklotKind === 0">室内</span>
                  <span class="yellow-s" v-else-if="orderData.parklotKind === 1">室外</span>
                  <span class="yellow-s" v-else-if="orderData.parklotKind === 2">室内+室外</span>
                </p>
                <p calss="red" v-if="orderData.state == 1301">
                    ￥{{orderData.parkingFee}}
                </p>
                <p calss="red" v-else-if="orderData.state != 1301">
                    ￥{{orderData.totalFee}}
                </p>
                <p calss="red" v-else></p>
              </div>
            <div class="plate-content">
              {{orderData.address}}
            </div>
          </div>
        </div>
        <div class="plate-card">
          <template v-if="orderData.state === 1301">
            <div class="p-message">
              <div class="time-info">
                <span class="name-text">入场时间</span>
                <div class="time-add">
                  <div class="time-style">{{hour}}</div>
                  <div class="time-text">时</div>
                  <div class="time-style">{{minutes}}</div>
                  <div class="time-text">分</div>
                  <div class="time-style">{{seconds}}</div>
                </div>
              </div>
            </div>
          </template>

            <div class="p-message">
              <div class="time-info">
                <span class="name-text">订单状态</span>
                <span class="ta-info">{{orderData.dstateInfo}}</span>
              </div>
            </div>
            <div class="p-message">
              <div class="time-info">
                <span class="name-text">订单编号</span>
                <span class="ta-info">{{orderData.serialNumber}}</span>
              </div>
            </div>
        </div>

        <div class="order-info">
          预约订单明细
        </div>
        <div class="plate-card">
          <div class="p-message">
            <div class="time-info">
              <span class="name-text">预约时间</span>
              <span class="ta-info">{{orderData.dHandler}}</span>
            </div>
          </div>
          <div class="p-message">
            <div class="time-info">
              <span class="name-text">预约费</span>
              <span class="ta-info">￥ {{orderData.reserveFee}}</span>
            </div>
          </div>

        </div>
        <div class="order-info" v-if="orderData.payChannelReserve">
          预约支付明细
        </div>
        <div class="plate-card" v-if="orderData.payChannelReserve">
          <div class="p-message">
            <div class="time-info">
              <span class="name-text">支付方式</span>
              <span class="ta-info">
                <span v-if="orderData.payChannelReserve === 1">
                  支付宝：￥ {{orderData.zpayReserve}}
                  <span v-if="orderData.reserveCouponFee !== null">
                    优惠券：￥ {{orderData.reserveCouponFee}}
                  </span>
                </span>
                <span v-else-if="orderData.payChannelReserve === 2">
                  微信：￥ {{orderData.zpayReserve}}
                  <span v-if="orderData.reserveCouponFee !== null">
                    优惠券：￥ {{orderData.reserveCouponFee}}
                  </span>
                </span>
                <span v-else-if="orderData.payChannelReserve === 3">
                  现金：￥ {{orderData.reserveFee}}
                </span>
                <span v-else-if="orderData.payChannelReserve === 4">
                  优惠券：￥ {{orderData.reserveCouponFee}}
                </span>
                <span v-else-if="orderData.payChannelReserve === 5">
                  微信：￥ {{orderData.zpayReserve}}
                  <span v-if="orderData.reserveCouponFee !== null">
                    优惠券：￥ {{orderData.reserveCouponFee}}
                  </span>
                </span>
                <span v-else-if="orderData.payChannelReserve === 6">
                  微信：￥ {{orderData.zpayReserve}}
                  <span v-if="orderData.reserveCouponFee !== null">
                    优惠券：￥ {{orderData.reserveCouponFee}}
                  </span>
                </span>
              </span>
            </div>
          </div>
          <div class="p-message" v-if="orderData.reserveTradeNo != null">
            <div class="time-info">
              <span class="name-text">支付流水号</span>
              <span class="ta-info">{{orderData.reserveTradeNo}}</span>
            </div>
          </div>
          <div class="p-message" v-if="orderData.reserveCouponCode !== null">
            <div class="time-info">
              <span class="name-text">优惠券编号</span>
              <span class="ta-info">{{orderData.reserveCouponCode}}</span>
            </div>
          </div>
        </div>

        <div class="order-info"  v-if="orderData.state != 1309 && orderData.state != 1308">
            停车订单明细
        </div>
        <div class="plate-card" v-if="orderData.state != 1309 && orderData.state != 1308">
          <div class="p-message">
            <div class="time-info">
              <span class="name-text">入场时间</span>
              <span class="ta-info">{{orderData.enterTime}}</span>
            </div>
          </div>
          <div class="p-message">
            <div class="time-info">
              <span class="name-text">离场时间</span>
              <span class="ta-info">{{orderData.leaveTime}}</span>
            </div>
          </div>
          <div class="p-message" v-if="orderData.overTime !== null">
            <div class="time-info">
              <span class="name-text">超时时长</span>
              <span class="ta-info">{{orderData.overTime}}</span>
            </div>
          </div>
          <div class="p-message" v-if="orderData.parkingFee !== null">
            <div class="time-info">
              <span class="name-text">停车费</span>
              <span class="ta-info">￥{{orderData.parkingFee}}</span>
            </div>
          </div>
          <div class="p-message" v-if="orderData.overTimeFee !== 0">
            <div class="time-info">
              <span class="name-text">超时金额</span>
              <span class="ta-info red">￥{{orderData.overTimeFee}}</span>
            </div>
          </div>
        </div>

        <div class="order-info lastOne" v-if="orderData.state != 1309 && orderData.state != 1308">
            停车支付明细
        </div>
        <div class="plate-card" v-if="orderData.state != 1309 && orderData.state != 1308">
          <div class="p-message">
            <div class="time-info">
              <span class="name-text">支付方式</span>
              <span class="ta-info">
                 <span v-if="orderData.payChannelParking === 1">
                    支付宝：￥{{orderData.zpayParking}}
                    <span v-if="orderData.parkingCouponFee !== null">优惠券：￥{{orderData.parkingCouponFee}}</span>
                  </span>
                  <span v-if="orderData.payChannelParking === 2">
                    微信：￥{{orderData.zpayParking}}
                    <span v-if="orderData.parkingCouponFee !== null">优惠券：￥{{orderData.parkingCouponFee}}</span>
                  </span>
                  <span v-if="orderData.payChannelParking === 3">
                    现金：￥{{orderData.zpayParking}}
                  </span>
                  <span v-if="orderData.payChannelParking === 4">
                    优惠券：￥{{orderData.parkingCouponFee}}
                  </span>
                  <span v-if="orderData.payChannelParking === 5">
                    微信：￥{{orderData.zpayParking}}
                    <span v-if="orderData.parkingCouponFee !== null">优惠券：￥{{orderData.parkingCouponFee}}</span>
                  </span>
                  <span v-if="orderData.payChannelParking === 6">
                    微信：￥{{orderData.zpayParking}}
                    <span v-if="orderData.parkingCouponFee !== null">优惠券：￥{{orderData.parkingCouponFee}}</span>
                  </span>
              </span>
            </div>
          </div>
          <div class="p-message" v-if="orderData.parkingTradeNo">
            <div class="time-info">
              <span class="name-text">支付流水号</span>
              <span class="ta-info">{{orderData.parkingTradeNo}}</span>
            </div>
          </div>
          <div class="p-message" v-if="orderData.parkingCouponCode !== null">
            <div class="time-info">
              <span class="name-text">优惠券编号</span>
              <span class="ta-info">{{orderData.parkingCouponCode}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { formatTimeStamp } from '../../common/js/H5plugin';

import BScroll from 'better-scroll';
import subHeader from './header';
import {Indicator,Toast} from 'mint-ui';
import {canCelMyAppoint, getOrderInfo,lockChange} from '../../server/getData';
// import { setTimeout, clearInterval } from 'timers';
import { MessageBox } from 'mint-ui';
import { asyncAMap } from '../../common/js/H5plugin';
export default {
  name:'reservationInfo',
  data () {
    return {
      headerMark:'预约详情',
      orderId:'',  //根据后台返回的订单号
      estateName:'', //车场名
      startTime:'',  //开始时间
      plateNo: '', //车牌号
      createTime:'', //预约订单创建时间
      createFmTime:'', //处理后的订单创建时间
      endTime:'',  //最晚入场时间
      address:'',  //停车场地址
      orderData:{},
      islockshow: false, // 模态框是否 显示
      lockId:null,
      network:true,
    }
  },
  components: {
    subHeader
  },
  methods: {
    // Interval(){
    //   setInterval(this.getOrder, 10000)
    // },
    //添加页面滚动
    _initScroll(){
      this.$nextTick(()=>{
        if(!this.scroll){
          this.scroll = new BScroll(this.$refs.appoitInfoBox,{
            probeType:3,
            scrollY:true,
            click:true
          });
          //滚动刷新事件
        }else{
          this.scroll.refresh();
        }
      });
    },
    // 获取预约订单详情的
    async getOrder(){
      let orderId = window.localStorage.getItem("orderId");
      // let orderId = 2773
      // let orderId = 4135;
      let res = await getOrderInfo(orderId);
      // alert(JSON.stringify(res))
      // console.log(res);
      if(res.error_code === 2000){
        this.lockId = null;
        this.desX = res.data.lng;
        this.desY = res.data.lat;
        this.lockId = res.data.lockId;
        this.dispoceOrderDat(res.data);
        this.orderData = res.data;
        this.parklotId = res.data.parklotId;
      }else{
        console.log(res,'错误码是'+res.error_code);
      }
    },
    // 预处理 订单详情的数据
    dispoceOrderDat(objDatas){
      // 计算预约支付的费用
      let zpayReserve = 0;
      if(objDatas.reserveCouponFee === null){
        zpayReserve = objDatas.reserveFee;
      }else{
        let payFee = null;
        payFee = (objDatas.reserveFee - objDatas.reserveCouponFee).toFixed(2);
        zpayReserve = payFee <= 0 ? 0 : payFee;
      }
      this.$set(objDatas,'zpayReserve',zpayReserve);
       // 计算停车支付的费用
      let zpayParking = 0;
      if(objDatas.parkingCouponFee === null){
        zpayParking = objDatas.parkingFee;
      }else{
        let payFee = null;
        payFee = (objDatas.parkingFee - objDatas.parkingCouponFee).toFixed(2);
        zpayParking = payFee <= 0 ? 0 : payFee;
      }
      this.$set(objDatas,'zpayParking',zpayParking);
      // 预约时间
      let dstartTime = formatTimeStamp(objDatas.startTime);
      let dendTime = formatTimeStamp(objDatas.endTime);
      objDatas.dHandler = dstartTime.substr(5,11) + ' 至 ' + dendTime.substr(5,11);

      // 实际 入场时间 和 离场时间
      if(objDatas.enterTime === null){
        objDatas.enterTime = '————';
      }else{
        let enterTime = formatTimeStamp(objDatas.enterTime);
        objDatas.enterTime = enterTime.substr(0,16);
      }
      if(objDatas.leaveTime === null){
        objDatas.leaveTime = '————';
      }else{
        let leaveTime = formatTimeStamp(objDatas.leaveTime);
        objDatas.leaveTime = leaveTime.substr(0,16);
      }
      this.countdown = objDatas.enterCountdownTime;
    //   this.downCounts();
      // 预约超时时间计算
      if(objDatas.overTime !== null){
        let hours = parseInt((objDatas.overTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = parseInt((objDatas.overTime % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = (objDatas.overTime % (1000 * 60)) / 1000;
        objDatas.overTime = hours + ':' + minutes + ':' + seconds;
      }
       // 订单状态
      if(objDatas.state === 1300){
        objDatas.dstateInfo = '未支付'
      }else if(objDatas.state === 1301){
        objDatas.dstateInfo = '已预约'
      }else if(objDatas.state === 1302){
        objDatas.dstateInfo = '停车中'
      }else if(objDatas.state === 1303){
        objDatas.dstateInfo = '离场未支付'
      }else if(objDatas.state === 1304){
        objDatas.dstateInfo = '已完成'
      }else if(objDatas.state === 1309){
        objDatas.dstateInfo = '已取消'
      }else if(objDatas.state === 1308 || item.state === 1307 || item.state === 1310){
        objDatas.dstateInfo = '超时已取消'
      }
      // 如果是1302 状态 对停车时间进行累加操作
      if(objDatas.state === 1302){
        // Test 测试数据 stopTime = 1200000 20分钟
        var stopTime = objDatas.stopTime;
        // this.addTime(stopTime);
      }
    },

  },
  created () {
    this._initScroll();
  },
  activated () {
    //从预约列表页面带获取传入的参数值
    // this.orderId = JSON.parse(localStorage.getItem('orderId'));
    this.getOrder();
  },
}
</script>
<style lang="stylus">
@import '../../common/css/base.stylus'
@import '../../common/css/mixin.stylus'
.ordermessage-info
  padding: 0 .5rem;
#appoint-info
  position absolute
  width 100%
  top 0
  bottom 0
  background-color #F4F4F4
  overflow hidden
  .name-text
    font-size 0.9375rem
    color #000
    font-weight 600
  .content
    z-index 1
    .guide-show
      padding 0rem 1.625rem
      background-color #ffffff
      box-sizing border-box
      border-bottom 0.0625rem solid #E6E6E6
      height 7.5rem
      .imgstyle
        height 100%
        position relative
        bg-img('../../assets/img/mine_order_bg')
      .img-car-text
        position absolute
        top 15%
        left 5%
        color #fff
        font-size  0.8125rem
      .border-text
        padding-bottom 0.375rem
        border-bottom 2px solid #fff
      .car-ploate
        position absolute
        height 100%
        width 100%
        display flex
        justify-content center
        align-items center
        font-size 2.375rem
        color #fff
    .plate
      padding 0.9375rem 1rem 1.125rem 0.875rem
      background-color #fff
      color #1A1A1A
      border-bottom 0.0625rem solid #E6E6E6
      .plate-info
        display flex
        justify-content space-between
        font-size  0.9375rem
      .red
        color #d01d95
      .yellow-s
        font-size 0.625rem
        color #fff
        // padding-right 0.2125rem
        padding 0.2125rem
        background-color #f7bd3d
        border-radius 10px
      .daohang-img
        width 1.125rem
        height 1.125rem
        bg-img('../../assets/img/parking_go')
      .plate-content
        margin-top 0.525rem
        font-size 0.8125rem
        color #656565
  .order-info
    padding 0.4rem 0 0.4rem 0.875rem
    font-size  0.8125rem
    color #656565
  .lastOne
    bottom 3.375rem
  .plate-card
    border-top 2px solid #E6E6E6
    background-color #fff
    padding-left 0.875rem
    color #1A1A1A
    margin-top 0.625rem
    .p-message
      padding-right 1rem
      // border-bottom  0.0625rem solid #E6E6E6
    .time-info
      height 3.5rem
      display flex
      justify-content space-between
      align-items center
    .time-add
      display flex
    .time-style
      height 1.75rem
      width 1.75rem
      background-color #3f3f3f
      color #FFF
      text-align center
      line-height 1.75rem
      border-radius 0.266667rem
    .time-text
      font-size 0.9375rem
      line-height 1.75rem
      padding-right 0.3125rem
      padding-left 0.3125rem
    .ta-info
      font-size  0.8125rem
      color #656565
    .red
      color #d01d95
  .cancel
    position fixed
    width 100%
    height 3.375rem
    line-height 3.375rem
    background-color #D01D95
    font-size 1rem
    bottom 0
    margin-bottom 0
    z-index 1000
    color #FFF
  .btnbgc
    height 4rem
    width 100%
    background-color rgb(245,245,245)
    position absolute
    bottom 0rem

    .off-order
      position absolute
      width 60%
      height 3rem
      line-height 3rem
      color #FFF
      background-color #D01D95
      font-size 1.2rem
      margin-bottom 0
      z-index 1000
      bottom 0.5rem
      margin-bottom 0
      margin-left 20%
      border-radius 2rem
      background url("../../assets/img/Background@3x.png") no-repeat
      background-size cover
      // position relative
  .appoit-info-box
    position absolute
    width 100%
    // top 3.9375rem
    top 0rem
    bottom 3.5rem
    // overflow hidden
  .item2-sytle
    display inline-block
    color #fff
    width 50%
    float right
    height 100%
  .canle-style
    height 100%
    width 50%
    background-color #fff
    color #d01d95
    display inline-block
    float left
  .alert-index
    position absolute
    top 0
    left 0
    // z-index 5
    background-color rgba(0,0,0,.4)
    width 100%
    height 100%
    display flex
    justify-content center
    align-items center
  .al-info
    width 18rem
    z-index 2006
    background-color #fff
    border-radius 0.633333rem
  .al-header
    height 2.5rem
    text-align center
    line-height 2.5rem
  .al-conter
    height 8.25rem
    display flex
    justify-content center
    align-items center
    border-bottom 0.0625rem solid #E6E6E6
    border-top 0.0625rem solid #E6E6E6
  .lock-img
    width 50%
    display flex
    justify-content center
    align-items center
  .lock-up
    bg-img('../../assets/img/mine_time_more_up')
  .lock-down
    bg-img('../../assets/img/mine_time_more_down')
  .lock-wh
    width 5.6875rem
    height 5.6875rem
</style>


