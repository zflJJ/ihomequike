<template>
  <div id="appoint-info">
    <!-- <sub-header :headerMark="headerMark"></sub-header> -->
    <div class="appoit-info-box" ref="appoitInfoBox">

      <div sytle="position: relative;" class="appoint-child">
        <div class="showtext" v-show="loadingFlag == 0">下拉刷新</div>
        <div class="showtext" v-show="loadingFlag == 1">释放刷新</div>
        <div class="showtext" v-show="loadingFlag == 2">刷新中...</div>
        <!--1.0 停车场显示车牌 停车位显示车位编号 坐标和地址 不管是预约还是在停车都要显示-->
        <div class="content">
          <div class="guide-show" v-if="orderData.type == 2">
            <div class="imgstyle">
              <div class="img-car-text">
                <span v-if="orderData.parklocNumber">
                  <span class="border-text">车位</span>
                  <span>编号</span>
                </span>
              </div>
              <div class="car-ploate">
                <div v-if="orderData.parklocNumber">
                  {{orderData.parklocNumber}}
                </div>
              </div>
            </div>
          </div>
          <div class="plate">
            <div class="plate-info">
              <p>
                <span class="name-textOne">{{orderData.parklotName}}</span>
                <span class="yellow-s" v-if="orderData.parklotKind === 0">室内</span>
                <span class="yellow-s" v-else-if="orderData.parklotKind === 1">室外</span>
                <span class="yellow-s" v-else-if="orderData.parklotKind === 2">室内+室外</span>
              </p>
            </div>
            <div class="plate-content">
              {{orderData.address}}
            </div>
          </div>
        </div>
        <!-- 入场车辆 -->
        <div class="plate-card">
          <div class="p-message">
            <div class="time-info">
              <span class="name-text">入场车辆</span>
              <span class="ta-info">{{orderData.plateNo}}</span>
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
              <span class="ta-info">￥ {{parseFloat(orderData.reserveFee).toFixed(2)}}</span>
            </div>
          </div>
        </div>

        <div class="order-info" v-if="orderData.payChannelReserve != 0">
          预约支付明细
        </div>
        <div class="plate-card" v-if="orderData.payChannelReserve != 0">
          <div class="p-message">
            <div class="time-info">
              <span class="name-text">支付方式</span>
              <span class="ta-info">
                <span v-if="orderData.payChannelReserve === 1">
                  支付宝：￥ {{parseFloat(orderData.zpayReserve).toFixed(2)}}
                  <span v-if="orderData.reserveCouponFee !== null">
                    优惠券：￥ {{parseFloat(orderData.reserveCouponFee).toFixed(2)}}
                  </span>
                </span>
                <span v-else-if="orderData.payChannelReserve === 2">
                  微信：￥ {{parseFloat(orderData.zpayReserve).toFixed(2)}}
                  <span v-if="orderData.reserveCouponFee !== null">
                    优惠券：￥ {{parseFloat(orderData.reserveCouponFee).toFixed(2)}}
                  </span>
                </span>
                <span v-else-if="orderData.payChannelReserve === 3">
                  现金：￥ {{parseFloat(orderData.reserveFee).toFixed(2)}}
                </span>
                <span v-else-if="orderData.payChannelReserve === 4">
                  优惠券：￥ {{parseFloat(orderData.reserveCouponFee).toFixed(2)}}
                </span>
                <span v-else-if="orderData.payChannelReserve === 5">
                  微信：￥ {{parseFloat(orderData.zpayReserve).toFixed(2)}}
                  <span v-if="orderData.reserveCouponFee !== null">
                    优惠券：￥ {{parseFloat(orderData.reserveCouponFee).toFixed(2)}}
                  </span>
                </span>
                <span v-else-if="orderData.payChannelReserve === 6">
                  微信：￥ {{parseFloat(orderData.zpayReserve).toFixed(2)}}
                  <span v-if="orderData.reserveCouponFee !== null">
                    优惠券：￥ {{parseFloat(orderData.reserveCouponFee).toFixed(2)}}
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--1.0 支付预约费 的时候显示约车位和约车场的数据-->
    <div class="btnbgc">
      <!-- 车锁计费 -->
      <template v-if="orderData.chargeType === 1">
        <div class="cancel p-a t-c">
          <div class="canle-style" @click="cancelOrder">取消预约</div>
          <button class="item2-sytle" @click="lockModel">开始停车</button>
        </div>
      </template>
      <!-- 道闸计费 -->
      <template v-else-if="orderData.chargeType === 0">
        <div class="charget-type0">
          <div @click="cancelOrder">取消预约</div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { formatTimeStamp } from '../../common/js/H5plugin'
import requestUrl from '../../server/baseURL'
import BScroll from 'better-scroll'
import subHeader from './header'
import { Indicator, Toast } from 'mint-ui'
import { canCelMyAppoint, getOrderInfo, lockChange } from '../../server/getData'
import { MessageBox } from 'mint-ui'
export default {
  name: 'reservationInfo',
  data() {
    return {
      headerMark: '预约详情',
      orderId: '', //根据后台返回的订单号
      parklotId: '',
      estateName: '', //车场名
      startTime: '', //开始时间
      plateNo: '', //车牌号
      createTime: '', //预约订单创建时间
      createFmTime: '', //处理后的订单创建时间
      endTime: '', //最晚入场时间
      address: '', //停车场地址
      miliSeconds: '00', //倒计时毫秒数
      interval: '', //定时计时器
      // 新增数据
      orderData: {},
      countdown: null, // 倒计时时间戳
      network: true,
      lockType: null,  // 表示车锁类型  0 表示网络控制的车锁  1 表示网关控制的车锁
      lockId: null,   // 车锁ID
      loadingFlag: 0,
      getTime: null,
      lockType: null, // 表示车锁类型
      orderTimeInter: null, // 定时请求后台订单状态的接口 的timeId
      disTimeID: null, // 表示禁止点击取消预约
      disabledFlag: false, // 按钮默认是可以点击的
    }
  },
  components: {
    subHeader
  },
  methods: {
    //添加页面滚动
    _initScroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.appoitInfoBox, {
            probeType: 3,
            scrollY: true,
            click: true,
            pullDownRefresh: {
              threshold: 50,
              stop: 30
            },
          })
          //滚动刷新事件
        } else {
          this.scroll.finishPullDown();
          this.scroll.refresh()
        }
        this.scroll.on('pullingDown', (props) => {
          clearTimeout(this.getTime);
          this.loadingFlag = 2;
          this.getTime = setTimeout(() => {
            this.getOrder();
          }, 1000);
        });
      })
    },
    // 获取预约订单详情的
    getOrder() {
      let _this = this
      let orderId = window.localStorage.getItem('orderId')
      var data = { order_id: orderId, timestamp: new Date().getTime() }
      this.$http.post(requestUrl.requestUrl + 'apiread/order/reserve/detail/query', data)
        .then(res => {
          if (res.body.error_code == 2000) {
            this.lockId = null
            this.lockType = res.body.data.lockType
            if (res.body.data.chargeType === 1) {
              this.lockId = res.body.data.lockId
            } else {
              this.lockId = null;
            }
            this.parklotId = res.body.data.parklotId
            if (res.body.data.parkingState === 1302) {
              localStorage.setItem('orderId', res.body.data.orderParkingId)
              this.$router.push('reservationPaking')
              // 1307表示系统取消，1308表示超时取消，1309表示用户取消，1310表示客服取消
            } else if (res.body.data.state === 1307 || res.body.data.state === 1308 || res.body.data.state === 1309 || res.body.data.state === 1310) {
              console.log(1234)
              this.$router.push('reservationOld');
            }
            this.dispoceOrderDat(res.body.data)
            this.orderData = res.body.data
            // 测试数据
            console.log(res.body.data)
          }
        })
        .catch(e => {
          // Toast('查询订单失败')
        })
    },
    // 预处理 订单详情的数据
    dispoceOrderDat(objDatas) {
      // 计算预约支付的费用
      let zpayReserve = 0
      if (objDatas.reserveCouponFee === null) {
        zpayReserve = objDatas.reserveFee
      } else {
        let payFee = null
        payFee = objDatas.reserveFee * 100 - objDatas.reserveCouponFee * 100
        zpayReserve = payFee <= 0 ? 0 : payFee / 100
      }
      this.$set(objDatas, 'zpayReserve', zpayReserve)
      // 预约时间
      let dstartTime = formatTimeStamp(objDatas.startTime)
      let dendTime = formatTimeStamp(objDatas.endTime)
      objDatas.dHandler =
        dstartTime.substr(5, 11) + ' 至 ' + dendTime.substr(5, 11)

      // 实际 入场时间 和 离场时间
      if (objDatas.enterTime === null) {
        objDatas.enterTime = '————'
      } else {
        let enterTime = formatTimeStamp(objDatas.enterTime)
        objDatas.enterTime = enterTime.substr(0, 16)
      }
      if (objDatas.leaveTime === null) {
        objDatas.leaveTime = '————'
      } else {
        let leaveTime = formatTimeStamp(objDatas.leaveTime)
        objDatas.leaveTime = leaveTime.substr(0, 16)
      }
      this.countdown = Math.floor(objDatas.enterCountdownTime / 1000)
      this.downCounts()
      // 预约超时时间计算
      if (objDatas.overTime !== null) {
        let hours = parseInt(
          (objDatas.overTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        )
        let minutes = parseInt(
          (objDatas.overTime % (1000 * 60 * 60)) / (1000 * 60)
        )
        let seconds = (objDatas.overTime % (1000 * 60)) / 1000
        objDatas.overTime = hours + ':' + minutes + ':' + seconds
      }
      // 订单状态
      if (objDatas.state === 1300) {
        objDatas.dstateInfo = '未支付'
      } else if (objDatas.state === 1301) {
        objDatas.dstateInfo = '已预约'
      } else if (objDatas.state === 1302) {
        objDatas.dstateInfo = '停车中'
      } else if (objDatas.state === 1303) {
        objDatas.dstateInfo = '离场未支付'
      } else if (objDatas.state === 1304) {
        objDatas.dstateInfo = '已支付'
      } else if (objDatas.state === 1309) {
        objDatas.dstateInfo = '已取消'
      } else if (
        objDatas.state === 1308 ||
        item.state === 1307 ||
        item.state === 1310
      ) {
        objDatas.dstateInfo = '超时已取消'
      }
      if (this.scroll) {
        this.scroll.refresh();
        this.scroll.finishPullDown();
      } else {
        this._initScroll();
      }
    },

    //控制车锁的事件
    lockModel() {
      // 弹框提示
      // 弹框提示用，
      if (this.lockType === 1) {
        Toast('仅支持网络控制车锁')
        return;
      } else {
        let htmls =
          `<div class="lock-down-chargetype">
                <div class="is-text">
                  车锁降下后开始停车计费，是否确认？
                </div>
         </div>`
        MessageBox.confirm('', {
          title: '提示',
          message: htmls,
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          closeOnClickModal: false,
        })
          .then(action => {
            this.lockEvnet(2)
          })
          .catch(err => {
            if (err == 'cancel') {
            }
          })
      }
    },
    lockEvnet(item) {
      if (!this.network || !window.navigator.onLine) {
        Toast({
          message: '当前网络无连接',
          position: 'middle',
          duration: 2000
        })
        return false
      } else {
        this.lockDown(item)
        if (item == 1) {
          Toast({
            message: '车锁正在升起',
            position: 'middle',
            duration: 2000
          })
        } else if (item == 2) {
          Toast({
            message: '车锁正在下降',
            position: 'middle',
            duration: 2000
          })
        }
      }
    },
    // 开始停车，重新请求一次数据
    sigNoEvent() {
      this.getOrder()
    },
    // 对车锁进行处理
    async lockDown(item) {
      let res = await lockChange(this.lockId, item)
      if (res.error_code == 2000) {
        this.disabledFlag = true
        this.disTimeID = setTimeout(() => {
          clearTimeout(this.disTimeID)
          this.disabledFlag = false;
        }, 10000)
        Toast({
          message: '车锁下降成功',
          position: 'middle',
          duration: 2000
        })
      } else {
        this.disabledFlag = false
        Toast({
          message: '操作失败',
          position: 'middle',
          duration: 2000
        });
      }
    },

    //入场时间倒计时
    downCounts() {
      if (this.interval != null) {
        clearInterval(this.interval)
      }
      if (this.countdown <= 0) {
        return
      }
      this.interval = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(this.interval)
        }
      }, 1000)
    },

    // 取消预约按钮
    cancelOrder() {
      if (this.disabledFlag) {
        Toast({
          message: '正在控制车锁',
          position: 'middle',
          duration: 2000
        });
        return
      }
      // 这个时间 是动态的
      let freeCancellationTime = this.orderData.freeCancellationTime
      let htmls =
        `
              <div class="ordermessage-info">
                <div class="is-text">
                  车位已经为您保留，` +
        freeCancellationTime +
        `分钟内可免费取消，超过` +
        freeCancellationTime +
        `分钟不退还预约费。是否确认取消预约
                </div>
              </div>`
      MessageBox.confirm('', {
        title: '提示',
        message: htmls,
        confirmButtonText: '取消预约',
        cancelButtonText: '保留预约',
        closeOnClickModal: false
      })
        .then(action => {
          this.cancelAppoint()
        })
        .catch(err => {
          if (err == 'cancel') {
          }
        })
    },

    //取消预约请求(成功的话，表示还没有入场；不成功的话，表示已经入场，那么跳转到预约列表，重新得到订单);
    async cancelAppoint() {
      let res = await canCelMyAppoint(this.orderId)
      if (res.error_code === 2000) {
        localStorage.setItem('myParklotId', this.parklotId)
        Toast('已取消预约')
        this.$router.push({
          name: 'reservationOld',
          query: { parklotId: this.parklotId }
        })
      } else if (res.error_code == 2903) {
        this.$router.push('reservationPaking')
      } else {
        Toast({
          message: res.error_code + res.error_message,
          duration: 1500
        })

        this.getOrder()
      }
    },
    hiddenFun() {
      let vm = this
      if (document.visibilityState == "hidden") {
        clearInterval(vm.interval)
        vm.interval = null
        vm.hiddenDate = new Date().getTime()
        localStorage.setItem('hiddenTime', vm.hiddenDate);
      } else {
        vm.showDate = new Date().getTime()
        let hiddenTime = parseInt(localStorage.getItem('hiddenTime'));
        let secondTime = Math.floor((vm.showDate - hiddenTime) / 1000)
        if (vm.countdown <= secondTime) {
          vm.countdown = 0
        } else {
          vm.countdown = vm.countdown - secondTime;
        }
        vm.downCounts()
      }
    },
    // 5秒中定时请求数据
    getOrderState() {
      clearInterval(this.orderTimeInter)
      this.orderTimeInter = setInterval(() => {
        this.getOrder()
      }, 5000);
    }
  },
  computed: {
    hour() {
      let hour = Math.floor(this.countdown / 3600)
      return hour < 10 ? '0' + hour : hour
    },
    minutes() {
      let _this = this
      let miute = Math.floor((_this.countdown % 3600) / 60)
      return miute < 10 ? '0' + miute : miute
    },
    seconds() {
      let seconds = this.countdown % 60
      return seconds < 10 ? '0' + seconds : seconds
    }
  },
  created() {
    window.addEventListener(
      'online',
      function () {
        this.network = true
        return true
      },
      true
    )
    window.addEventListener(
      'offline',
      function () {
        this.network = false
        Toast({
          message: '当前网络无连接',
          position: 'bottom',
          duration: 2000
        })
        Indicator.close()
        return false
      },
      true
    )

    this._initScroll()
    var lastTime = +new Date()
    let vm = this
  },
  activated() {
    //从预约列表页面带获取传入的参数值
    let _this = this
    this.orderId = JSON.parse(localStorage.getItem('orderId'))
    this.getOrder()
    document.addEventListener('visibilitychange', _this.hiddenFun, false)
    this.getOrderState()
  },
  deactivated() {
    let _this = this
    clearInterval(this.interval)
    localStorage.removeItem('hiddenTime')
    document.removeEventListener('visibilitychange', _this.hiddenFun, false)
    clearInterval(this.orderTimeInter)
    clearTimeout(this.disTimeID)
    this.disabledFlag = false;
  },
  mounted() { },
  beforeRouteLeave(to, from, next) {
    // 将MessageBOx 关闭掉
    MessageBox.close(false)
    next()
  },
  watch: {
    $route(to, from) {
      MessageBox.close(false)
    }
  }
}
</script>
<style lang="stylus">
@import '../../common/css/base.stylus'
@import '../../common/css/mixin.stylus'
button
  margin 0
  padding 0
  border 1px solid transparent // 自定义边框s
  outline none // 消除默认点击蓝色边框效果
.lock-down-chargetype
  line-height 2.63rem
.ordermessage-info
  padding 0 0.5rem
#appoint-info
  position absolute
  width 100%
  top 0
  bottom 0
  background-color #F4F4F4
  overflow hidden
  .name-textOne
    font-size 1.1rem
    font-weight normal
    font-stretch normal
    line-height 1.4rem
    letter-spacing 0rem
    color #333333
  .name-text
    font-size 1rem
    color #1a1a1a
    font-weight normal
    font-stretch normal
    line-height 2.7rem
    letter-spacing 0rem
  .content
    z-index 1
    .guide-show
      padding 0rem 1.625rem
      background-color #ffffff
      box-sizing border-box
      border-bottom 0.0625rem solid #E6E6E6
      height 7.7rem
      .imgstyle
        height 100%
        position relative
        bg-img('../../assets/img/mine_order_bg')
      .img-car-text
        position absolute
        top 15%
        left 5%
        color #fff
        font-size 0.8125rem
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
        font-size 0.9375rem
      .yellow-s
        padding 0.1rem 0.3rem 0.2rem 0.3rem
        background-color #f6bc41
        border-radius 0.1rem
        padding 0.2125rem font-size 0.7rem
        font-weight normal
        font-stretch normal
        line-height 1.2rem
        letter-spacing 0rem
        color #ffffff
      .daohang-img
        width 1.125rem
        height 1.125rem
        bg-img('../../assets/img/parking_go')
      .plate-content
        margin-top 0.525rem
        font-size 0.8rem
        font-weight normal
        font-stretch normal
        letter-spacing 0rem
        color #666666
  .order-info
    padding 0.4rem 0 0.1rem 0.875rem
    font-size 0.8125rem
    color #656565
  .lastOne
    bottom 3.375rem
  .plate-card
    border-top 2px solid #E6E6E6
    background-color #fff
    padding-left 0.5rem
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
      height 1.9rem
      width 1.9rem
      background-color #3f3f3f
      text-align center
      border-radius 0.2rem
      font-size 1rem
      font-weight normal
      font-stretch normal
      line-height 1.9rem
      letter-spacing 0rem
      color #ffffff
    .time-text
      font-size 0.9rem
      line-height 1.9rem
      padding-right 0.4rem
      padding-left 0.4rem
    .ta-info
      font-size 0.8125rem
      color #656565
  .charget-type0
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
    text-align center
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
    text-align center
  .appoit-info-box
    position absolute
    width 100%
    top 0rem
    bottom 3.5rem
    .appoint-child
      min-height calc(100% + 6px)
    .showtext
      position absolute
      width 100%
      text-align center
      line-height 2rem
      top -2rem
      left 0
  .item2-sytle
    display inline-block
    color #fff
    width 50%
    float right
    height 100%
    background-color #D01D95
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
    background-color rgba(0, 0, 0, 0.4)
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


