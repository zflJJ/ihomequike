 <template>
  <div id="appoint-info">
    <div class="appoit-info-box" ref="appoitInfoBox">
      <div sytle="position: relative;">
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
              <span class="ta-info">未支付</span>
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
      </div>
    </div>
    <div class="cancel t-c">
      <button class="cancel-order t-c" @click="cancelOrder" v-if="orderData.type === 1 || orderData.type === 2" :disabled="cancelOrderFlag">取消预约</button>
      <button class="item2-sytle" @click="payGo" :disabled="paygoFlag">立即支付</button>
    </div>
  </div>
</template>
<script>
import { formatTimeStamp } from '../../common/js/H5plugin';
import BScroll from 'better-scroll';
import subHeader from './header';
import { Indicator, Toast } from 'mint-ui';
import { canCelMyAppoint, getOrderInfo, lockChange } from '../../server/getData';
import { MessageBox } from 'mint-ui';
export default {
  name: 'reservationBookingUnpaid',
  data() {
    return {
      headerMark: '预约详情',
      orderId: '',  //根据后台返回的订单号
      orderData: {},
      createTime: null,//订单创建时间
      cancelOrderFlag: false,  // 表示可以取消
      paygoFlag:false, // 表示可以支付
    }
  },
  methods: {
    //添加页面滚动
    _initScroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.appoitInfoBox, {
            probeType: 3,
            scrollY: true,
            click: true
          });
          //滚动刷新事件
        } else {
          this.scroll.refresh();
        }
      });
    },
    // 获取预约订单详情的
    async getOrder(num) {
      let orderId = window.localStorage.getItem("orderId");
      let res = await getOrderInfo(orderId);
      console.log(res);
      this.cancelOrderFlag = false;
      this.paygoFlag = false
      if (res.error_code === 2000) {
        if (res.data.state === 1300) {
          this.dispoceOrderDat(res.data);
          this.createTime = res.data.createTime;
          this.orderData = res.data;
          localStorage.setItem("H5_fees", res.data.reserveFee);
          window.localStorage.setItem("myParklotId", res.data.parklotId);
          if (num === 1) {
            this.$router.push('payMentDt')
          }
        } else if (res.data.state === 1301) {    
          this.$router.push('reservationInfo')
        } else if (res.data.state === 1302 || res.data.state === 1303) {
          localStorage.setItem('orderId', res.data.orderParkingId)
          this.$router.push('reservationPaking')
        } else {
          localStorage.removeItem('orderId')
          let htmls = `
              <div class="ordermessage-info-1333">
                <div class="is-text">
                  我知道了
                </div>
              </div>`;
          MessageBox({
            title: '温馨提示',
            message: htmls,
            showConfirmButton: true,
            confirmButtonText: '确认',
            showCancelButton: false,
            closeOnClickModal: false,
          }).then(action => {
            if (action == 'confirm') {
              this.$router.push('reservationOld')
            }
          }).catch(err => {
          })
        }
        // 1300表示已预留（未支付预约费），1301表示已预约，1302表示已停车，1303表示已离开未支付，1304表示已支付
      } else {
        Toast(res.error_message)
      }
    },
    // 预处理 订单详情的数据
    dispoceOrderDat(objDatas) {
      // 预约时间
      let dstartTime = formatTimeStamp(objDatas.startTime);
      let dendTime = formatTimeStamp(objDatas.endTime);
      objDatas.dHandler = dstartTime.substr(5, 11) + ' 至 ' + dendTime.substr(5, 11);
    },

    // 取消预约按钮
    cancelOrder() {  // 这个时间 是动态的
      this.cancelOrderFlag = true
      let newTime = +new Date().getTime();
      if (newTime - this.createTime >= 300000) {
        Toast({
          message: '页面超时，正在为您获取最新数据。',
          duration: 3000
        })
        let timeOutId = setTimeout(() => {
          clearTimeout(timeOutId);
          this.getOrder()
        }, 3000);
      } else {
        let htmls = `
              <div class="ordermessage-info-booking">
                <div class="is-text">
                  是否取消预约？
                </div>
              </div>`;
        MessageBox.confirm('', {
          title: '提示',
          message: htmls,
          confirmButtonText: '取消预约',
          cancelButtonText: '保留预约',
          closeOnClickModal: false,
        }).then(action => {
          this.cancelAppoint();
        }).catch(err => {
          if (err == 'cancel') {
            this.cancelOrderFlag = false
          }
        });
      }
    },

    async cancelAppoint() {
      let res = await canCelMyAppoint(this.orderId);
      if (res.error_code === 2000) {
        this.cancelOrderFlag = false;
        this.$router.push('reservationOld');
      } else {
        this.cancelOrderFlag = false;
        Toast(res.error_message)
      }
    },

    //立即支付
    payGo() {
      this.paygoFlag = true
      let newTime = +new Date().getTime();
      if (newTime - this.createTime >= 300000) {
        this.paygoFlag = false
        let htmls = `
              <div class="ordermessage-info-1300">
                <div class="is-text">
                  支付超时
                </div>
              </div>`;
        MessageBox.confirm('', {
          title: '提示',
          message: htmls,
          closeOnClickModal: false,
        }).then(action => {
          this.$router.push('reservationOld');
        }).catch(err => {
          this.$router.push('reservationOld');
        });
        return false;
      } else {
        let timeOutId = setTimeout(() => {
          clearTimeout(timeOutId)
          this.getOrder(1);
        }, 3000);
      }
    },
  },
  created() {
    this._initScroll();
  },
  activated() {
    //从预约列表页面带获取传入的参数值
    this.orderId = JSON.parse(localStorage.getItem('orderId'));
    this.getOrder();
  },
  deactivated() {
    MessageBox.close(false)
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
button 
  margin 0;
  padding 0
  border 1px solid transparent  //自定义边框
  outline none    //消除默认点击蓝色边框效果
.ordermessage-info
  padding 0 0.5rem
.ordermessage-info-booking
  line-height 2.35rem
.ordermessage-info-1300
  line-height 2.35rem
.ordermessage-info-1333
  line-height 2.35rem
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
    font-size 1rem
    bottom 0
    margin-bottom 0
    z-index 1000
    color #FFF
    display flex
  .appoit-info-box
    position absolute
    width 100%
    top 0
    // top 3.9375rem
    bottom 3.5rem
  .cancel-order
    /* display inline-block */
    background-color #FFF
    color #d01d95
    width 50%
    float left
    height 100%
  .item2-sytle
    flex 1
    color #fff
    background-color #D01D95
    height 100%
    text-align center
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
    z-index 2005
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


