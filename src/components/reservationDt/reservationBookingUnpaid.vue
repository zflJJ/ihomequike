<template>
  <div id="appoint-info">
    <div class="appoit-info-box" ref="appoitInfoBox">
      <div sytle="position: relative;">
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
      </div>
    </div>
      <div class="cancel p-a t-c">
        <div class="cancel-order p-a t-c" @click="cancelOrder" v-if="orderData.type === 1 || orderData.type === 2">取消预约</div>
        <div class="item2-sytle" @click="payGo">立即支付</div>
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
import { setInterval } from 'timers';
export default {
  name:'appointInfo',
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
      totalFee : null, //预约费
      parklotId:null,//停车场ID
      createTime:null,//订单创建时间
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
      let res = await getOrderInfo(orderId);
      console.log(res);
      if(res.error_code === 2000){
        this.lockId = null;
        this.desX = res.data.lng;
        this.desY = res.data.lat;
        this.lockId = res.data.lockId;
        this.parklotId = res.data.parklotId;
        this.dispoceOrderDat(res.data);
        this.createTime = res.data.createTime;
        this.orderData = res.data;
        localStorage.setItem("H5_fees",res.data.reserveFee);
        window.localStorage.setItem("myParklotId",res.data.parklotId);
      }else{
        console.log(res,'错误码是'+res.error_message);
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
        payFee = objDatas.reserveFee - objDatas.reserveCouponFee;
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
      this.lockDown(item);
    },
    // 对车锁进行处理
    async lockDown(item){
      // Test 测试数 （改成动态的数据）
      this.lockId = 2;
      let res = await lockChange(this.lockId,item);
      console.log(res);
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
          this.$router.push('appointment');
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

    // 取消预约按钮
    cancelOrder(){  // 这个时间 是动态的
      let freeCancellationTime = this.orderData.freeCancellationTime;
      let htmls = `
              <div class="ordermessage-info">
                <div class="is-text">
                  是否取消预约？
                </div>
              </div>`;
      MessageBox.confirm('', {
          title: '提示',
          message: htmls,
          confirmButtonText:'取消预约',
          cancelButtonText: '保留预约',
          closeOnClickModal: false,
        }).then(action => {
          this.cancelAppoint();
        }).catch(err => {
          if (err == 'cancel') {
          }
        });
    },

    //取消预约请求(成功的话，表示还没有入场；不成功的话，表示已经入场，那么跳转到预约列表，重新得到订单);
    async cancelAppoint(){
        let res =  await canCelMyAppoint(this.orderId);
        if(res.error_code === 2000){
          this.$router.push('reservationOld');
        }else{
          Toast('页面超时。。。。');
          // this.$router.push('appointment');
          this.getOrder();
        }
    },

    //立即支付
    payGo(){
      let newTime = +new Date();
      if(newTime - this.createTime >= 300000){
          let htmls = `
              <div class="ordermessage-info">
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
      }
      let orderId = window.localStorage.getItem("orderId");
      this.$router.push({
        name:'payMentDt',
        params:{
          fees:localStorage.getItem("H5_fees"),
          orderId: orderId
        }
      });
    },
  },
  created () {
    this._initScroll();
    var lastTime = +new Date;
    let vm = this;
    document.addEventListener("visibilitychange", function(){
      if(document.visibilityState=='visible'){
        vm.seconds1302 = '00';
        vm.minutes1302 = '00';
        vm.hours1302 = '00';
        vm.hour = "00";
        vm.minutes = "00";
        vm.seconds = "00";
        vm.getOrder();
      }
    });
    let org = JSON.parse(localStorage.getItem('H5_geoLocation'));
    this.orgX = org.lng;
    this.orgY = org.lat;
  },
  activated () {
    //从预约列表页面带获取传入的参数值

    this.orderId = JSON.parse(localStorage.getItem('orderId'));
    this.getOrder();
  },
  // 开始加载地图
  mounted () {
    // this.loadAMap();
  },
  beforeRouteLeave(to, from, next){
    // if(from.path=='/appointInfo'){
    //   clearInterval(this.interval);
    // }
    // 将MessageBOx 关闭掉
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
  .appoit-info-box
    position absolute
    width 100%
    top 3.9375rem
    bottom 3.5rem
  .cancel-order
    /*display inline-block*/
    background-color #FFF
    color #d01d95
    width 50%
    float left
    height 100%
  .item2-sytle
    display inline-block
    color #fff
    float right
    width 50%
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


