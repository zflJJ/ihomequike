<template>
  <div id="pay-ment" ref="payment">
    <div class="pay-ment-box" ref="payMentBox">
      <div class="content">
        <div class="coup">
          <div class="ct-info" style="margin-top: .5rem">选择优惠券信息</div>
          <div class="ct-item clearfix" @click="goCounp">优惠券
            <span class="coup-ic f-r"></span>
            <span class="coup-num f-r">{{counpsTips}}</span>
          </div>
        </div>
        <div class="payWays p-r">
          <div class="ct-info">请选择支付方式</div>
          <div class="pay-item ct-item p-r clearfix" v-for="(item,index) in payWays" :key="item.name" @click="selectPayWays(item,index)">
            <div class="pay-ic p-a" :class="[item.class]"></div>
            <div class="pay">
              <div class="name">{{item.name}}</div>
              <div class="info">{{item.info}}</div>
            </div>
            <!--对打钩做选择-->
            <div class="choose-ic p-a" v-show="currentIndex == index"></div>
          </div>
        </div>
        <div class="comfirm t-c" @click="confirmPay">
          <span class="t-c">确认支付：{{payAmounts}}元</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import subHeader from '../reservationDt/header';
import BScroll from 'better-scroll';
import { Toast, Indicator } from 'mint-ui';
import { pay, getMyAppointInfo, getMyCounpLists } from '../../server/getData';
import baseURL from '../../server/baseURL';
import { escape } from 'querystring';
import common from '../../common/js/common.js';
import { MessageBox } from 'mint-ui';

export default {
  name: 'payMent',
  data() {
    return {
      // headerMark:'立即支付',
      headerMark: '支付订单',
      currentIndex: 0,   //当前选中的支付项
      payFees: 0,  //支付金额
      // payWays:['余额支付','支付宝','微信支付'],   //支付方式
      discounts: 0,   //优惠的金额
      myAcounts: 0,   //余额
      counpNum: 0,  //优惠券数量
      couponId: -1, //选择的优惠券id
      orderId: '',  //点击预约是产生的订单id
      isChoosed: false, //是否选过优惠券
      onlyYuErPay: false, //只能是余额支付
      payWays: [
        {
          name: '微信支付',
          info: '推荐微信5.0以上用户使用',
          class: 'weixin'
        },
      ],  //支付方式
      url: "",
      type: 5,
      payState: false, // 支付状态
      payUrl: '', // 支付的Url
      orderState: null, // 表示是预约费支付 还是 停车费支付
      timeInter: null, // 时间ID
      time: 0,  // 表示过的分钟数
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
          this.scroll = new BScroll(this.$refs.payMentBox, {
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
    //获取优惠券数量
    async getCounpNum() {
      let userId = localStorage.getItem('userId');
      // let userId = 30;
      let res = await getMyCounpLists(userId, 0);
      if (res.error_code === 2000) {
        this.counpNum = res.data.coupons.length;
      } else {
        Toast('获取优惠券信息失败');
      }
    },
    //点击确认提交
    async confirmPay() {
      if (this.couponId === -1) {
        this.couponId = null;
      }
      if (this.orderState === true) {  // 停车费支付
        this.payUrl = 'apiwrite/parking/pay'
      } else {  // 预约费支付
        this.payUrl = 'apiwrite/reserve/pay'
      }
      this.wxPay();
    },

    // 提示用户，支付超时，跳转 到预约界面
    messInfo() {
      let htmls = null
      if (this.orderState) {
        htmls = `
                      <div class="paymessage-info">
                        <div class="is-text">支付失败</div>
                      </div>`
      } else {
        htmls = `
                      <div class="paymessage-info">
                        <div class="is-text">支付超时，请重新支付。</div>
                      </div>`
      }
      MessageBox({
        title: '温馨提示',
        message: htmls,
        showConfirmButton: true,
        confirmButtonText: '确认',
        showCancelButton: false,
      }).then(action => {
        if (action == 'confirm') {
          clearInterval(this.timeInter);
          if (this.orderState) {
            this.$router.push("reservationPaking")
          } else {
            localStorage.removeItem('orderId')
            this.$router.push("reservationOld")
          }
        }
      }).catch(err => {
      })
    },
    //选择支付方式
    selectPayWays(item, key) {
      if (this.onlyYuErPay) {
        this.currentIndex = 0;
        return;
      }
      this.currentIndex = key;
      localStorage.setItem('H5_currentIndex', key);
    },

    //微信支付方式
    async wxPay() {
      let spbillCreateIp = localStorage.getItem("mobileId");
      let channel = 5; // 支付方式
      // alert(JSON.stringify(this.payUrl));
      // alert(JSON.stringify(this.orderId));
      // alert(channel);
      // alert(JSON.stringify(this.couponId));
      // alert(JSON.stringify(spbillCreateIp));
      let openId = localStorage.getItem('openId');
      let wapUrl = null
      alert(JSON.stringify(openId))
                        // (url, orderId, channel, couponId, wapUrl, spbillCreateIp, openId)
      let res = await pay(this.payUrl, this.orderId, channel, this.couponId, wapUrl,spbillCreateIp, openId);
      if (res.error_code === 2000) {
        // alert(JSON.stringify(res));
        if (res.data.isZero === 1) {
          // 做跳转预约详情界面
          Toast({
            message: '支付成功',
            duration: 1500
          })
          setTimeout(() => {
            // 清除缓存 跳转到 订单详情页
            // 支付成功之后，将订单ID + 订单状态 + 订单金额
            localStorage.removeItem('H5_fees');   // 支付金额
            localStorage.removeItem('H5_order_state'); // 支付的订单状态
            clearInterval(this.timeInter);
            // alert(this.orderState);
            if (this.orderState) {
              //停车费跳转到支付成功页面
              this.$router.push({ name: 'payToComplete', params: { flag: 1 } });
            } else {
              this.$router.push('payToComplete');
            }
          }, 1500);
        } else {
          let params = {};
          // 公众号id	appId	是	String(16)	wx8888888888888888	商户注册具有支付权限的公众号成功后即可获得
          // 时间戳	timeStamp	是	String(32)	1414561699	当前的时间，其他详见时间戳规则
          // 随机字符串	nonceStr	是	String(32)	5K8264ILTKCH16CQ2502SI8ZNMTM67VS	随机字符串，不长于32位。推荐随机数生成算法
          // 订单详情扩展字符串	package	是	String(128)	prepay_id=123456789	统一下单接口返回的prepay_id参数值，提交格式如：prepay_id=***
          // 签名方式	signType	是	String(32)	MD5	签名类型，默认为MD5，支持HMAC-SHA256和MD5。注意此处需与统一下单的签名类型一致
          // 签名	paySign	是	String(64)	C380BEC2BFD727A4B6845133519F3AD6	签名，详见签名生成算法
          params.appId = res.data.appId;
          params.timeStamp = res.data.timeStamp;
          params.nonceStr = res.data.nonceStr;
          params.package = "prepay_id=" + res.data.prepayId;
          params.signType = "MD5";
          params.paySign = res.data.sign;
          // 开始调起微信支付
          if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
              document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
              document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
              document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
          } else {
            // alert('可以调起微信支付了');
            this.onBridgeReady(params);
          }
        }
      } else {
        this.messInfo()
      }
    },
    //公总号微信支付
    onBridgeReady(params) {
      let vm = this;
      // alert(JSON.stringify(params));
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest", {
          "appId": params.appId,     //公众号名称，由商户传入
          "timeStamp": params.timeStamp,         //时间戳，自1970年以来的秒数
          "nonceStr": params.nonceStr, //随机串
          "package": params.package,
          "signType": params.signType,         //微信签名方式：
          "paySign": params.paySign //微信签名
        },
        function (res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            Toast({
              message: '支付成功',
              duration: 1500
            })
            setTimeout(() => {
              // 支付成功之后， + 订单状态 + 订单金额
              localStorage.removeItem('H5_fees');   // 支付金额
              localStorage.removeItem('H5_order_state'); // 支付的订单状态
              clearInterval(this.timeInter);
              if (vm.orderState) {
                //停车费跳转到支付成功页面
                // alert('要跳转到支付完')
                vm.$router.push({ name: 'payToComplete', params: { flag: 1 } });
              } else {
                vm.$router.push('/payToComplete');
              }
            }, 1500);
          } else {
            Toast('调起微信支付接口失败')
          }
        }
      );
    },
    //跳转到优惠券选择页面
    goCounp() {
      localStorage.setItem('H5_isChoosed', true);
      localStorage.setItem('counpFlag', this.couponId);
      this.$router.push({
        name: 'ticket'
      })
    },
  },
  computed: {
    // //支付渠道
    'channel': function () {
      return parseInt(this.currentIndex + 1);
    },
    // 最终需要支付的金额
    'payAmounts': function () {
      return ((this.payFees - this.discounts) >= 0 ? (this.payFees - this.discounts) : 0).toFixed(2);
    },
    //优惠券提示信息
    'counpsTips': function () {
      return this.discounts > 0 ? ('已优惠' + this.discounts + '元') : (this.counpNum > 0 ? '有可用优惠券' : '无可用优惠券');
    }
  },
  beforeCreate() {
    this.payFees = localStorage.getItem('H5_fees');   // 支付金额
  },
  created() {
    let timeStamp = Date.parse(new Date());
    if (this.discounts === undefined) {
      this.discounts = 0;
    }
    this.$root.eventHub.$on('send-counp-info', e => {
      this.discounts = e.amount;
      this.couponId = e.couponId;
      console.log('created')
    });
    //取消优惠券
    this.$root.eventHub.$on('cancel-counp-info', () => {
      this.discounts = 0;
      this.couponId = -1;
    })
  },
  mounted() {

  },
  activated() {
    var payOrderState = localStorage.getItem('H5_order_state'); // 支付的订单状态
    // 支付是停车费还是预约费用
    if (payOrderState == 1303) {
      this.orderState = true;
    } else {
      this.orderState = false;
    }
    this.currentIndex = 0;
    // 用来做定时器的任务的
    this.orderId = localStorage.getItem('orderId');  // 订单ID
    let timeStamp = Date.parse(new Date());
    //支付参数获取
    this.payFees = parseFloat(localStorage.getItem('H5_fees'));   // 支付金额
    this.getCounpNum();
    this._initScroll();
  },
  beforeRouteLeave(to, from, next) {
    next();
  },
  beforeRouteEnter(to, from, next) {
    if (from.path == '/appoint' || from.path == '/appointment' || from.path == '/orderInfo') {
      next(vm => {
        vm.payFees = Number(localStorage.getItem('H5_fees'));
        vm.orderId = localStorage.getItem('orderId');
      })
    }
    next();
  },
  // 在离开这个组件的时候，解绑事件
  deactivated() {
    this.discounts = 0;
    this.couponId = -1;
    this.time = '';
    clearInterval(this.timeInter);
  },
}
</script>

<style lang="stylus">
@import '../../common/css/base.stylus'
@import '../../common/css/mixin.stylus'
.paymessage-info
  line-height 2.5rem
#pay-ment
  position absolute
  width 100%
  top 0
  bottom 0
  background-color #F4F4F4
  color #1a1a1a
  .content
    // margin-top 4.5rem
    .coup
      .ct-item
        // border-bottom 1px solid #e5e5e5e5e5e5
      .coup-num
        margin-top 0.05rem
        color #FF5C5A
        font-size 0.875rem
      .coup-ic
        width 0.5625rem
        height 0.9375rem
        margin-top 0.25rem
        margin-left 0.5rem
        bg-img('../../assets/img/arrow_r')
  .ct-item
    padding 0.75rem 1.2rem
    background-color #ffffff
    font-size 1.1rem
    // border-top 1px solid #e5e5e5
  .ct-info
    padding 0.5rem 1.2rem
    font-size 0.9rem
  .payWays
    margin-top 0.5rem
    // border-bottom .0625rem solid #e5e5e5
    .pay
      .info
        font-size 0.875rem
        color #666
    .choose-ic
      width 1.625rem
      height 1.125rem
      top 50%
      right 1.2rem
      transform translateY(-50%)
      bg-img('../../assets/img/parting_mine_Selected')
    .pay-item
      padding-left 3.5rem
    .pay-ic
      width 1.875rem
      height 2.25rem
      top 50%
      left 0.75rem
      transform translateY(-50%)
    .yuer
      bg-img('../../assets/img/btn_zhanghao')
    .zhifubao
      bg-img('../../assets/img/btn_alipay')
      height 1.875rem
    .weixin
      bg-img('../../assets/img/btn_weixin')
      height 1.52rem
  .comfirm
    margin-top 3rem
    font-size 1rem
    height 2.5rem
    line-height 2.5rem
    span
      display inline-block
      width 45%
      // height 3rem
      // line-height 3rem
      color #FFF
      bg-img('../../assets/img/Background')
      border-radius 1.25rem
  .pay-ment-box
    position absolute
    width 100%
    // top 4.5rem
    top 0rem
    bottom 0
    overflow hidden
</style>


