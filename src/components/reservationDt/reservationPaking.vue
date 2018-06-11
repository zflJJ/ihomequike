<template>
  <div id="appoint-info">
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
                <div v-if="orderData.type === 2 && orderData.parklocNumber !== null">
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
              </div>
            <div class="plate-content">
              {{orderData.address}}
            </div>
          </div>
        </div>
        <div class="plate-card">
          <!-- <template v-if="orderData.state === 1301">
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
          </template> -->

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
        <div class="order-info" v-if="orderData.payChannelReserve != 0">
          预约支付明细
        </div>
        <div class="plate-card" v-if="orderData.payChannelReserve != 0">
          <div class="p-message">
            <div class="time-info">
              <span class="name-text">支付方式</span>
              <span class="ta-info">
                <span v-if="orderData.payChannelReserve === 1">
                  支付宝：￥ {{orderData.zpayReserve}}&nbsp;
                  <span v-if="orderData.reserveCouponFee !== null">
                    优惠券：￥ {{orderData.reserveCouponFee}}
                  </span>
                </span>
                <span v-else-if="orderData.payChannelReserve === 2">
                  微信：￥ {{orderData.zpayReserve}}&nbsp;
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
                  微信：￥ {{orderData.zpayReserve}}&nbsp;
                  <span v-if="orderData.reserveCouponFee !== null">
                    优惠券：￥ {{orderData.reserveCouponFee}}
                  </span>
                </span>
              </span>
            </div>
          </div>
          <!-- <div class="p-message" v-if="orderData.reserveTradeNo != null">
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
          </div> -->
        </div>

        <!-- <template v-if="orderData.state === 1302"> -->
        <div class="order-info lastOne">
            停车订单明细
          </div>
        <div class="plate-card">
          <div class="p-message">
            <div class="time-info">
              <span class="name-text">入场时间</span>
              <span class="ta-info">{{orderData.enterTime}}</span>
            </div>
          </div>
        </div>
          <!-- <div class="p-message">
            <div class="time-info">
              <span class="name-text">离场时间</span>
              <span class="ta-info">{{orderData.parkingFee}}</span>
            </div>
          </div> -->
        <!-- </template> -->
      </div>
    </div>
    <!--1.0 支付预约费 的时候显示约车位和约车场的数据-->
    <!-- <template v-if="orderData.state === 1301"> -->
      <!-- <div class="cancel-order p-a t-c" @click="cancelOrder" v-if="orderData.type === 1 || orderData.type === 2">取消预约</div> -->
     <!--  <div class="cancel-order p-a t-c" v-if="orderData.type === 2">
        <div class="canle-style" @click="cancelOrder">取消预约</div> -->
        <!-- <div class="item2-sytle">
          <div style="width:50%;" @click="lockModel">控制车锁</div>
        </div> -->
      <!-- </div> -->
    <!-- </template> -->
    <!-- 2.0 已经停车时候的UI显示界面  这个是停车位的数据 -->
    <!-- <template v-if ="orderData.state === 1302 && orderData.type === 2" > -->

    <!-- <div class="btnbgc"  v-if="orderData.lockId">
      <div class="cancelOrder p-a t-c" @click="lockModel">控制车锁</div>
    </div> -->
    <div>
      <div v-if="orderData.lockId" class="cancel p-a t-c">
        <div class="item2-sytle" @click="lockModel">控制车锁</div>
        <div class="canle-style" @click="goPay">离场支付</div>
      </div>
      <div v-else-if="getOrderFlag" class="cancel p-a t-c">
        <div class="item2-sytle2" @click="goPay">离场支付</div>
      </div>
      <div v-else class="cancel p-a t-c">
        <div class="item2-sytle2" @click="goPay">离场支付</div>
      </div>
    </div>
    <!-- <div v-if="orderData.lockId">
      <div class="cancel p-a t-c">
        <div class="canle-style" @click="cancelOrder">取消预约</div>
        <div class="item2-sytle" @click="lockModel">控制车锁</div>
      </div>
    </div> -->
    <!-- </template> -->

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
import {Indicator,Toast} from 'mint-ui';
import {canCelMyAppoint, getOrderInfo,lockChange} from '../../server/getData';
import { MessageBox } from 'mint-ui';
import { asyncAMap } from '../../common/js/H5plugin';
export default {
  name:'appointInfo',
  data () {
    return {
      orderId:'',  //根据后台返回的订单号
      estateName:'', //车场名
      startTime:'',  //开始时间
      plateNo: '', //车牌号
      createTime:'', //预约订单创建时间
      createFmTime:'', //处理后的订单创建时间
      endTime:'',  //最晚入场时间
      address:'',  //停车场地址
      hour:'00', //倒计时小时
      minutes:'00', //倒计时分钟数
      seconds:'00', //倒计时秒数
      miliSeconds:'00', //倒计时毫秒数
      interval:'',  //定时计时器
      //导航
      orgX:'',  // 定位的坐标
      orgY:'',  // 定位的坐标
      desX:'',  // 车场的坐标
      desY:'',  // 车场的坐标
      // 新增数据
      orderData:{},
      countdown: null, // 倒计时时间戳
      islockshow: false, // 模态框是否 显示
      seconds1302: '00',  // 停车秒数
      minutes1302: '00',// 停车分数
      hours1302: '00',// 停车小时
      AMAP: null, // 高德地图的实例
      lockId:null,
      getOrderFlag:false,//离场支付的标记
      network:true,
      goPayFlag:true,//是否执行
      intervalMy:null,
      count:0,
      visibFlag: true, // 阈值
    }
  },
  components: {
  },
  /*这里没有必要再做处理，直接在上一级页面做处理即可*/
  computed: {
    // plateInfo(){
    //   let plateNo = this.plateNo;
    //   return plateNo.substr(0,2) + ' • ' + plateNo.substr(2,plateNo.length);
    // }
  },
  methods: {
    //做轮询操作,查询订单状态
    // Interval(){
    //   let _this = this;
    //   this.intervalMy = setInterval(() => {
    //     _this.getOrder();
    //   }, 10000);
    // },
    goPay(){
      this.getOrder(1);
    },
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
    getOrder(num){
      var data = {order_id:localStorage.getItem('orderId'),timestamp: new Date().getTime()}//localStorage.getItem('orderId')
      if (this.count == 0) {
        this.count = 1
      } else {
        data.isQuickReserve = 1
      }
      this.$http.post("http://develop.qhiehome.com/apiread/order/reserve/detail/query",data).then(res => {
        if(res.body.error_code === 2000){
          if(res.body.data.state == 1303){
            this.getOrderFlag = true;
            localStorage.setItem('H5_fees',res.body.data.parkingFee);  //保存的支付金额
            localStorage.setItem('orderId',res.body.data.orderId);  //保存停车订单ID
            this.orderData = res.body.data;
            this.dispoceOrderDat(res.body.data);
            localStorage.setItem('routerFlag',"reservationPaking");//保存跳转来源页,在支付完成调用
            localStorage.setItem('goBackFlag',"reservationPaking");//保存跳转来源页,在返回调用
            if(res.body.data.parkingFee == 0 && res.body.data.state != 1303){
              this.$router.push('payToComplete');
            }else if(res.body.data.parkingFee != 0 && res.body.data.state != 1303){
              this.$router.push('payMentDt');
            }
            return false;
          }else if(res.body.data.state == 1304 || res.body.data.state == 1307 || res.body.data.state == 1308 || res.body.data.state == 1309 || res.body.data.state == 1310){
            localStorage.setItem('routerFlag',"reservationPaking");//保存跳转来源页,在支付完成调用
            localStorage.setItem('goBackFlag',"reservationPaking");//保存跳转来源页,在返回调用
            this.$router.push('payToComplete');
          }else if(res.body.data.state == 1302 && this.visibFlag){
            this.intervalMy = setTimeout(() => {
                this.getOrder();
            }, 10000);
          }
          this.getOrderFlag = false;
          this.lockId = null;
          this.desX = res.body.data.lng;
          this.desY = res.body.data.lat;
          this.lockId = res.body.data.lockId;
          this.dispoceOrderDat(res.body.data);
          this.orderData = res.body.data;
          if(num == 1){
            Indicator.close();
            Toast({
              message:'请先离场再支付',
              position: 'bottom',
              duration:2000
            });
          }
          this.orderData();
      }else{
          console.log(res,'错误码是'+res.error_code);
        }
      })
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
      this.downCounts();
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
        objDatas.dstateInfo = '已支付'
      }else if(objDatas.state === 1309){
        objDatas.dstateInfo = '已取消'
      }else if(objDatas.state === 1308 || item.state === 1307 || item.state === 1310){
        objDatas.dstateInfo = '超时已取消'
      }
      // 如果是1302 状态 对停车时间进行累加操作
      if(objDatas.state === 1302){
        // Test 测试数据 stopTime = 1200000 20分钟
        var stopTime = objDatas.stopTime;
        this.addTime(stopTime);
      }
    },

    // 停车时间累加操作  这个是对数据的处理
    addTime(stopTime){
      console.log(stopTime);
      let hours1302 = parseInt(stopTime  /(60 * 60 * 1000));
      let minutes1302 = parseInt( (stopTime % (1000 * 60 * 60)) / (1000 * 60));
      let seconds1302 = parseInt((stopTime % (1000 * 60)) / 1000);
      console.log(hours1302,minutes1302,seconds1302);
      clearInterval(timer1302);
      var timer1302 = setInterval(()=>{
          seconds1302++;
          if(seconds1302 === 59){
              seconds1302 = 0;
              minutes1302++;
          }
          if(minutes1302 === 59){
              hours1302++;
              minutes1302 = 0;
          }
          seconds1302 += '';
          minutes1302 += '';
          hours1302 += '';
          if(seconds1302.length === 1){
              seconds1302 = '0' + seconds1302;
          }
          if(minutes1302.length === 1){
              minutes1302 = '0' + minutes1302;
          }
          if(hours1302.length === 1){
            hours1302 = '0' + hours1302;
          }
          this.seconds1302 = seconds1302;
          this.minutes1302 = minutes1302;
          this.hours1302 = hours1302;
          if(this.seconds1302 == '00' && this.minutes1302 == '00' && this.hours1302 == '00'){
            clearInterval(timer1302);
          }
      },1000);
    },
    //控制车锁的事件
    lockModel(){
      // 弹框提示
      this.islockshow = true;
    },
    closeModel(){
      this.islockshow = false;
    },
    closeCs(event){
      // 阻断事件冒泡
      event.cancelBubble = true
    },
    lockEvnet(item){
      if(!this.network || !window.navigator.onLine){
        Toast({
          message:'当前网络无连接',
          position: 'bottom',
          duration:2000
        });
        return false;
      }else {
        this.lockDown(item);
        if(item == 1){
          Toast({
            message:'车锁正在升起',
            position: 'bottom',
            duration:2000
          });
        }else if(item ==2){
          Toast({
            message:'车锁正在下降',
            position: 'bottom',
            duration:2000
          });
        }
      }

    },
    // 对车锁进行处理
    async lockDown(item){
      let res = await lockChange(this.lockId,item);
    },

    //入场时间倒计时
    downCounts(){
      let hour = 0;
      let minutes = 0;
      let seconds = 0;
      let miliSeconds = 0;
      console.log(this.countdown);
      hour = parseInt((this.countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) );
      minutes = parseInt((this.countdown % (1000 * 60 * 60)) / (1000 * 60));
      seconds = parseInt((this.countdown % (1000 * 60)) / 1000);
      console.log(hour,minutes,seconds);
      if(hour <= 0 && minutes <= 0 && seconds<= 0){
          return;
      }
      if(this.interval != null){
        clearInterval(this.interval);
      }
      this.interval =  setInterval(()=>{
        seconds--
        if(seconds<0){
          seconds = 59;
          minutes --;
        }
        if(seconds<0){
          minutes = 59;
          hour --;
        }
        if(hour<0){
          hour = 0;
        }
        if(hour==0 && minutes==0 && seconds==0){
          clearInterval(this.interval);
          // this.$router.push('appointment');
        }
        hour += '';
        minutes += '';
        seconds += '';
        if(minutes.length === 1){
            minutes = '0' + minutes;
        }
        if(seconds.length === 1){
            seconds = '0' + seconds;
        }
        if(hour.length === 1){
            hour = '0' + hour;
        }
        this.hour = hour;
        this.minutes = minutes;
        this.seconds = seconds;
      },1000);
    },
    visibEvent(){
      if(document.visibilityState=='hidden'){
        console.log('执行了');
        clearTimeout(this.intervalMy);
        this.visibFlag = false
      }else{
        this.visibFlag = true;
        this.seconds1302 = '00';
        this.minutes1302 = '00';
        this.hours1302 = '00';
        this.hour = "00";
        this.minutes = "00";
        this.seconds = "00";
        clearTimeout(this.intervalMy);
        this.getOrder();
      }
    },
  },
  created () {
    window.addEventListener("online", function() {
    vm.network = true;
      return true;
    }, true);
    window.addEventListener("offline", function() {
      vm.network = false;
      Toast({
        message:'当前网络无连接',
        position: 'bottom',
        duration:2000
      })
      Indicator.close();
      return false;
    }, true);

    this._initScroll();
    var lastTime = +new Date;
    let vm = this;
    document.addEventListener("visibilitychange",vm.visibEvent ,false);
    let org = JSON.parse(localStorage.getItem('H5_geoLocation'));
    this.orgX = org.lng;
    this.orgY = org.lat;
  },
  activated () {
    //从预约列表页面带获取传入的参数值
    // this.orderId = JSON.parse(localStorage.getItem('orderId'));
    this.getOrder();
  },
  deactivated(){
    clearTimeout(this.intervalMy);
    document.removeEventListener('visibilitychange',this.visibEvent,false);
  },
  // 开始加载地图
  mounted () {
    // this.loadAMap();
  },
  beforeRouteLeave(to, from, next){
    MessageBox.close(false)
    next();
  },
  watch:{
    '$route' (to, from) {
       MessageBox.close(false);
    }
  }
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
  // .btnbgc
  //   height 4rem
  //   width 100%
  //   background-color rgb(245,245,245)
  //   position absolute
  //   bottom 0rem
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
      background url("../../assets/img/Background@3x.png") no-repeat
      background-size cover
  .appoit-info-box
    position absolute
    width 100%
    top 0
    bottom 3.375rem
    // overflow hidden
  .item2-sytle
    // display flex
    display inline-block
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


