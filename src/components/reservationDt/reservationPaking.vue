<template>
  <div id="appoint-info">
    <div class="appoit-info-box" ref="appoitInfoBox">
      <div class="appoint-parking-info">
        <div class="showtext" v-show="loadingFlag == 0">下拉刷新</div>
        <div class="showtext" v-show="loadingFlag == 1">释放刷新</div>
        <div class="showtext" v-show="loadingFlag == 2">刷新中...</div>
        <!--1.0 停车场显示车牌 停车位显示车位编号 坐标和地址 不管是预约还是在停车都要显示-->
        <div class="content">
          <div class="guide-show" v-if="orderData.type === 2">
            <div class="imgstyle">
              <div class="img-car-text">
                <span v-if="orderData.type === 2">
                  <span class="border-text">车位</span>
                  <span>编号</span>
                </span>
              </div>
              <div class="car-ploate">
                <div v-if="orderData.type === 2 && orderData.parklocNumber !== null">
                  {{orderData.parklocNumber}}
                </div>
              </div>
            </div>
          </div>
          <div class="plate">
            <div class="plate-info">
              <p>
                <span class="name-text">{{orderData.parklotName}}</span>
                <span class="yellow-s" v-if="orderData.parklotKind === 0">室内</span>
                <span class="yellow-s" v-else-if="orderData.parklotKind === 1">室外</span>
                <span class="yellow-s" v-else-if="orderData.parklotKind === 2">室内+室外</span>
              </p>
              <span v-if="orderData.state === 1303" class="plate-price-text">￥ {{parseFloat(orderData.totalFee).toFixed(2)}}</span>
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
                    优惠券：￥ {{parseFloat(orderData.reserveCouponFee).toFixe(2)}}
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
        <div class="order-info lastOne">停车订单明细</div>
        <div class="plate-card">
          <div class="p-message" v-if="orderData.state === 1302 || orderData.state === 1303">
            <div class="time-info">
              <span class="name-text">入场时间</span>
              <span class="ta-info">{{orderData.enterTime}}</span>
            </div>
          </div>
          <div class="p-message" v-if="orderData.state === 1303">
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
          <div class="p-message" v-if="orderData.state === 1303">
            <div class="time-info">
              <span class="name-text" v-if="orderData.chargeType === 0">停车费</span>
              <span class="name-text" v-if="orderData.chargeType === 1">服务费</span>
              <span class="ta-info">￥ {{parseFloat(orderData.parkingFee).toFixed(2)}}</span>
            </div>
          </div>
          <div class="p-message" v-if="orderData.overTime !== null">
            <div class="time-info">
              <span class="name-text">超时金额</span>
              <span class="ta-info">￥ {{parseFloat(orderData.overTimeFee).toFixed(2)}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 要进行呢改动 -->
    <div>

      <template v-if="orderData.state === 1302">
        <!-- 这个是道闸计费 -->
        <template v-if="orderData.chargeType === 0">
          <div class="cancel p-a t-c" v-if="orderData.lockId">
            <div class="item2-sytle2" @click="lockModel">控制车锁</div>
          </div>
        </template>
        <!-- 这个是车锁计费 -->
        <template v-else>
          <div class="cancel p-a t-c">
            <div class="item2-sytle2" @click="endParking">结束停车</div>
          </div>
        </template>
      </template>

      <!-- 这个是离场未支付 -->
      <template v-else-if="orderData.state === 1303">
        <div class="cancel p-a t-c">
          <div class="item2-sytle2" @click="goPay(2)">立即支付</div>
        </div>
      </template>
    </div>
    <!--车锁层-->
    <div class="alert-index" v-show="islockshow" @click="closeModel">
      <div @click="closeCs" class="al-info">
        <div class="al-header">控制车锁</div>
        <div class="al-conter">
          <div class="lock-img">
            <div class="lock-up lock-wh" @click="lockEvnet(1)"></div>
          </div>
          <div class="lock-img">
            <div class="lock-down lock-wh" @click="lockEvnet(2)"></div>
          </div>
        </div>
        <div class="al-header" @click="closeModel">关闭</div>
      </div>
    </div>
    <div style="display:none" id="gdAMp"></div>
  </div>
</template>
<script>
import { formatTimeStamp } from '../../common/js/H5plugin';
import BScroll from 'better-scroll';
import subHeader from './header';
import { Indicator, Toast } from 'mint-ui';
import { canCelMyAppoint, getOrderInfo, lockChange } from '../../server/getData';
import requestUrl from '../../server/baseURL';
import { MessageBox } from 'mint-ui';
export default {
  name: 'appointInfo',
  data() {
    return {
      orderId: '',  //根据后台返回的订单号
      estateName: '', //车场名
      startTime: '',  //开始时间
      plateNo: '', //车牌号
      createTime: '', //预约订单创建时间
      createFmTime: '', //处理后的订单创建时间
      endTime: '',  //最晚入场时间
      address: '',  //停车场地址
      hour: '00', //倒计时小时
      minutes: '00', //倒计时分钟数
      seconds: '00', //倒计时秒数
      miliSeconds: '00', //倒计时毫秒数
      interval: '',  //定时计时器
      //导航
      orgX: '',  // 定位的坐标
      orgY: '',  // 定位的坐标
      desX: '',  // 车场的坐标
      desY: '',  // 车场的坐标
      // 新增数据
      orderData: {},
      countdown: null, // 倒计时时间戳
      islockshow: false, // 模态框是否 显示
      seconds1302: '00',  // 停车秒数
      minutes1302: '00',// 停车分数
      hours1302: '00',// 停车小时
      AMAP: null, // 高德地图的实例
      lockId: null,
      network: true,
      goPayFlag: true,//是否执行
      intervalMy: null,
      visibFlag: true, // 阈值
      leaveFlag: false,
      loadingFlag: 0,
      orderState: null,   // 短轮询的定时器
      lockType: null,   // 车锁的状态
    }
  },
  components: {
  },
  /*这里没有必要再做处理，直接在上一级页面做处理即可*/
  computed: {
  },
  methods: {

    // 离场支付（1） 或者 立即支付（2）
    goPay(item) {
      this.getOrder(item);
    },
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
          });
          //滚动刷新事件
        } else {
          this.scroll.finishPullDown();
          this.scroll.refresh()
        }
        this.scroll.on('pullingDown', (props) => {
          clearTimeout(this.getTime);
          this.text = '加载中...';
          this.loadingFlag = 2;
          this.getTime = setTimeout(() => {
            this.getOrder();
          }, 1000);
        });
      });
    },
    // 获取预约订单详情的
    getOrder(num) {
      let data = { order_id: localStorage.getItem('orderId'), timestamp: new Date().getTime() }//localStorage.getItem('orderId')
      this.$http.post(requestUrl.requestUrl + "apiread/order/reserve/detail/query", data).then(res => {
        if (this.leaveFlag) {
          return
        }
        this.leaveFlag = true
        if (res.body.error_code === 2000) {
          this.leaveFlag = false
          this.loadingFlag = null;
          this.lockType = res.body.data.lockType
          localStorage.setItem('routerFlag', "reservationPaking");//保存跳转来源页,在支付完成调用
          localStorage.setItem('goBackFlag', "reservationPaking");//保存跳转来源页,在返回调用
          if (res.body.data.state == 1303) {   //   1302 || 1303 的状态   
            localStorage.setItem('orderId', res.body.data.orderId);  //保存停车订单ID
            if (res.body.data.payFee == 0) {
              if (num === 1 || num === 2) {
                localStorage.setItem('H5_fees', res.body.data.payFee);  //保存的支付金额
                this.$router.push('payToComplete');
              }
            } else if (res.body.data.payFee != 0) {
              localStorage.setItem('H5_fees', res.body.data.payFee)
              localStorage.setItem('H5_order_state', res.body.data.state)
              if (num === 1 || num === 2) {
                this.$router.push('payMentDt');
              }
            }
          } else if (res.body.data.state == 1302) {
            if (num === 1 || num === 2) {
              Indicator.close();
              Toast({
                message: '请先离场再支付',
                position: 'middle',
                duration: 2000
              });
            }
          } else {
            this.$router.push('payToComplete');
          }
          this.lockId = null;
          this.lockId = res.body.data.lockId;
          this.dispoceOrderDat(res.body.data);
          this.orderData = res.body.data;
        } else {
          this.leaveFlag = false
        }
      }).catch(res => {
        this.leaveFlag = false;
        this.loadingFlag = 0
        // Toast('查询订单失败')
      })
    },
    endParking() {
      let htmls =
        `<div class="lock-up-chargetype">
            <div class="is-text">
              升起车锁后结束本次停车。
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
          this.lockEvnet(1)
        })
        .catch(err => {
          if (err == 'cancel') {
          }
        })
    },
    // 预处理 订单详情的数据
    dispoceOrderDat(objDatas) {
      // 计算预约支付的费用
      console.log('处理数据')
      let zpayReserve = 0;
      if (objDatas.reserveCouponFee === null) {
        zpayReserve = objDatas.reserveFee;
      } else {
        let payFee = null;
        payFee = (objDatas.reserveFee - objDatas.reserveCouponFee).toFixed(2);
        zpayReserve = payFee <= 0 ? 0 : payFee;
      }
      this.$set(objDatas, 'zpayReserve', zpayReserve);

      // 预约时间
      let dstartTime = formatTimeStamp(objDatas.startTime);
      let dendTime = formatTimeStamp(objDatas.endTime);
      objDatas.dHandler = dstartTime.substr(5, 11) + ' 至 ' + dendTime.substr(5, 11);

      let zpayParking = 0;
      if (objDatas.parkingCouponFee === null) {
        zpayParking = objDatas.parkingFee;
      } else {
        let payFee = null;
        payFee = (objDatas.totalFee - objDatas.reserveFee - objDatas.parkingCouponFee).toFixed(2);
        zpayParking = payFee <= 0 ? 0 : payFee;
      }
      this.$set(objDatas, "zpayParking", zpayParking);
      // 实际 入场时间 和 离场时间
      if (objDatas.enterTime === null) {
        objDatas.enterTime = '————';
      } else {
        let enterTime = formatTimeStamp(objDatas.enterTime);
        objDatas.enterTime = enterTime.substr(5, 11);
      }
      if (objDatas.leaveTime === null) {
        objDatas.leaveTime = '————';
      } else {
        let leaveTime = formatTimeStamp(objDatas.leaveTime);
        objDatas.leaveTime = leaveTime.substr(5, 11);
      }

      // 超时时间
      if (objDatas.overTime !== null && objDatas.overTime > 0) {
        let hours = parseInt(objDatas.overTime / (60 * 60 * 1000));
        let minutes = parseInt((objDatas.overTime % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = parseInt((objDatas.overTime % (1000 * 60)) / 1000);
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        objDatas.overTime = hours + ":" + minutes + ":" + seconds;
      } else {
        objDatas.overTime = null
      }
      // 订单状态
      if (objDatas.state === 1302) {
        objDatas.dstateInfo = '停车中'
      } else if (objDatas.state === 1303) {
        objDatas.dstateInfo = '离场未支付'
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
      // this.getOrder(str)
      this.islockshow = true;
    },
    closeModel() {
      this.islockshow = false;
    },
    closeCs(event) {
      // 阻断事件冒泡
      event.cancelBubble = true
    },
    lockEvnet(item) {
      if (!this.network || !window.navigator.onLine) {
        Toast({
          message: '当前网络无连接',
          position: 'bottom',
          duration: 2000
        });
        return false;
      } else if (this.lockType === null || this.lockType === 1) {
        Toast({
          message: '仅支持网络控制车锁',
          position: 'bottom',
          duration: 2000
        });
      } else {
        this.lockDown(item);
        if (item == 1) {
          Toast({
            message: '车锁正在升起',
            position: 'bottom',
            duration: 2000
          });
        } else if (item == 2) {
          Toast({
            message: '车锁正在下降',
            position: 'bottom',
            duration: 2000
          });
        }
      }

    },
    // 对车锁进行处理
    async lockDown(item) {
      let res = await lockChange(this.lockId, item);
      if (res.error_code === 2000) {
      } else {
        Toast('车锁控制失败')
      }
    },
    // 前端短轮训查询数据
    getOrderState() {
      clearInterval(this.orderState)
      this.orderState = setInterval(() => {
        this.getOrder()
      }, 5000)
    }
  },
  created() {
    window.addEventListener("online", function () {
      vm.network = true;
      return true;
    }, true);
    window.addEventListener("offline", function () {
      vm.network = false;
      Toast({
        message: '当前网络无连接',
        position: 'bottom',
        duration: 2000
      })
      Indicator.close();
      return false;
    }, true);

    this._initScroll();
    var lastTime = +new Date;
    let vm = this;

  },
  activated() {
    //从预约列表页面带获取传入的参数值
    this.getOrder();
    this.lockType = null
    this.leaveFlag = false
    this.getOrderState()
  },
  deactivated() {
    clearInterval(this.orderState)
    clearTimeout(this.getTime)
  },
  beforeRouteLeave(to, from, next) {
    MessageBox.close(false)
    next();
  },
  watch: {
    '$route'(to, from) {
      MessageBox.close(false);
    }
  }
}
</script>
<style lang="stylus">
@import '../../common/css/base.stylus'
@import '../../common/css/mixin.stylus'
.lock-up-chargetype
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
  .appoint-parking-info
    position absolute
    width 100%
    min-height calc(100% + 6px)
    .showtext
      position absolute
      width 100%
      text-align center
      line-height 2rem
      top -2rem
      left 0
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
        .plate-price-text
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
    padding 1rem 0 0.4375rem 0.875rem
    font-size 0.8125rem
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
      font-size 0.8125rem
      color #656565
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
    .cancelOrder
      position fixed
      width 60%
      height 3.375rem
      line-height 3.375rem
      font-size 1.2rem
      color #FFF
      z-index 1000
      bottom 0.5rem
      margin-bottom 0
      margin-left 20%
      border-radius 2rem
      background url('../../assets/img/Background@3x.png') no-repeat
      background-size cover
  .appoit-info-box
    position absolute
    width 100%
    top 0
    bottom 3.375rem
  .item2-sytle
    // display flex
    // display inline-block
    color #fff
    width 50%
    float right
    height 100%
  .item2-sytle2
    // display flex
    display inline-block
    color #fff
    width 100%
    text-align center
    float right
    height 100%
  .canle-style
    // width 50%
    // background-color #fff
    // color #000
    height 100%
    width 50%
    background-color #fff
    color #d01d95
    display inline-block
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


