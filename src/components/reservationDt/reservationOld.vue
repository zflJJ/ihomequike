<template>
  <div id="appoint">
    <!-- <sub-header :headerMark="headerMark"></sub-header> -->
    <div class="content p-a" ref="apponitBox">
      <div>
        <!--1.0 车场信息-->
        <div class="info car-info">
          <div class="car-style">
            <div>
              <span class="text">{{pointedItem.parklotName}}</span>
              <span v-if="pointedItem.parklotKind === 0" class="cars-color">室内</span>
              <span v-else-if="pointedItem.parklotKind === 1" class="cars-color">室外</span>
              <span v-else-if="pointedItem.parklotKind === 2" class="cars-color">室内+室外</span>
            </div>
            <div class="dis-2">
              <span class="redNumber">{{pointedItem.reservableAmount}}</span>
            </div>
          </div>
          <div class="car-distance distatnce-dis">
            <div class="ic ic-font1"></div>
            <div class="dis-inline dis-margin">
              <span class="text-distance">{{pointedItem.address}}</span>
            </div>
            <div class="dis-inline">
              <span class="black-location">空泊位</span>
            </div>
          </div>
        </div>

        <div class="info plate-number" @click="chooseCar">
          <div class="text-3">车牌号</div>

          <div class="dis-2">
            <span class="plate-info">{{plateNo}}</span>
            &nbsp;&nbsp;
            <div class="ic ic-style"></div>
          </div>

        </div>
        <!--4.0 入场时间-->
        <div class="info einlass plate-number">
          <div class="text-3">入场时间</div>
          <div class="dis-2" @click="openPicker">
            <div>{{defaultTime}}</div>
            &nbsp;&nbsp;
            <div class="ic ic-style"></div>
          </div>
        </div>

        <!--5.0 停靠时间-->
        <div class="info stop-time">
          <div class="text-3">可停至</div>
          <div class="exprie">{{leaveTime}}</div>
        </div>
      </div>
    </div>
    <div class="to-appoint t-c">
      <div class="div-flex">
        <div class="div-style ds-1">
          预约费&nbsp;
          <span style="color: #f63372">￥
            <span class="price-style">{{price}}</span>
          </span>
        </div>
        <button @click="goApoint" class="div-style ds-2">立即预约</button>
      </div>
    </div>
    <div :class="{alert: isshow}" @click="closeZinde"></div>
    <vue-pickers :show="show1" :selectData="pickData2" v-on:cancel="close" v-on:confirm="confirmFn">
    </vue-pickers>
  </div>
</template>
<script>
import { formatTimeStamp } from '../../common/js/H5plugin';
import subHeader from './header';
import { appointCarport, pay, lockChange } from '../../server/getData';
import { getMyCars } from '../../server/getData';
import { postParklot } from '../../server/getData';
import { Toast, Indicator } from 'mint-ui';
import { MessageBox } from 'mint-ui'; // 这个是一个消息提示框
import BScroll from 'better-scroll';
import VuePickers from "vue-pickers";
import { filterTime, disposeTime, dataChange } from '../../common/js/time'
export default {
  data() {
    return {
      plateNo: '',  //车牌号
      plateNoId: '', //车牌号ID
      show1: false,
      isshow: false,
      headerMark: '预约',
      pointedItem: {},   //停车场接口获取信息返回 | enter

      parklotId: null, // 表示传递过来的车场的ID
      userId: null,//表示传递过来的用户的ID
      reserveTimeList: [],
      feeList: [],

      pickData2: {
        columns: 2, // 两列
        link: true, // 联级必须需要link 参数
        default: [ // 默认显示那个字段
        ],
        // 第一列数据结构
        pData1: [
        ],
        // 第二列数据结构
        pData2: {
        },
      },

      nowTime: null,
      defaultTime: '00:00', // 默认时间

      leaveTime: null,
      priceTime: null, // 预约时间 -  当前系统时间 = 时间戳差值

      price: 0, //价格信息
      params: {
        user_id: null,  // 用户ID
        parklot_id: null, // 车场ID
        plate_id: null, // 车牌ID

        share_startTime: null, // 共享开始时间戳
        share_endTime: null,  // 共享结束时间戳
        start_time: null,    // 用户选择的时间戳
        end_time: null,      // 用户选择的结束时间戳
      },
      clickFlag: true
      // "share_startTime":123123111,
      // "share_endTime":123123111,
      // "start_time":123123111,
      // "end_time":1232131231,
    }
  },
  components: {
    subHeader,
    VuePickers,
  },
  methods: {
    // 阻止事件的行为
    closeZinde() {
      this.isshow = false;
      this.show1 = false;
    },
    //添加屏幕滚动事件
    _initScroll() {
      this.$nextTick(() => {
        //左边滑动选择
        if (!this.leftScroll) {
          this.leftScroll = new BScroll(this.$refs.apponitBox, {
            probeType: 3,
            scrollY: true,
            click: true,
          });
        } else {
          this.leftScroll.refresh();
        }
      })
    },
    //获取预约接口信息
    async getparklot() {
      this.reserveTimeList = [];
      let res = await postParklot(this.userId, this.parklotId);
      if (res.error_code === 2000) {
        this.pointedItem = res.data;
        let plateObj = JSON.parse(localStorage.getItem('H5_chosen_plate'));
        if (!plateObj) {
          this.plateNo = res.data.plateNo;
          this.params.plate_id = res.data.plateId;
        } else {
          this.plateNo = plateObj.plateNo;
          this.params.plate_id = plateObj.plateNoId;
          localStorage.removeItem('H5_chosen_plate');
        }
        // 筛选时间
        this.feeList = this.pointedItem.feeList;
        this.reserveTimeList = this.pointedItem.reserveTimeList;
        if (!this.reserveTimeList.length) {
          // 这里有个提示框  并且确认键（跳转到首页）
          this.messInfo();
        } else {
          let timeList = filterTime(this.pointedItem.reserveTimeList, this.nowTime)
          let distimelist = disposeTime(timeList)
          let dataTimes = dataChange(distimelist, this.nowTime);
          this.$set(this.pickData2, 'pData1', dataTimes.pData1)
          this.$set(this.pickData2, 'pData2', dataTimes.pData2)
          this.$set(this.pickData2, 'default', dataTimes.default)
          this.defaultTime = dataTimes.defaultTime
          // 获取价格  和 默认离场时间
          this.getPrice(dataTimes.priceTime)
          this.getDefaultTime(dataTimes.pData1[0].time)
        }
        this._initScroll();
      } else {
        Toast({
          message: '获取预约信息失败',
          duration: 1500
        })
      }
    },
    // 提示用户，支付超时，不跳转
    messInfo() {
      let htmls = `
                      <div class="appointmessage-info">
                        <div class="is-text">车位已经被预约满了。</div>
                      </div>`;
      MessageBox({
        title: '温馨提示',
        message: htmls,
        showConfirmButton: true,
        confirmButtonText: '确认',
        showCancelButton: false,
        closeOnClickModal: false,
      }).then(action => {
        Indicator.open();
        setTimeout(() => {
          Indicator.close();
          this.getparklot();
        }, 2000);
      }).catch(err => {
      })
    },
    // 默认的离场时间
    getDefaultTime(time) {
      var timetap = time;
      var x = null;
      let numLeaveTime = [];
      // 筛出离场时间
      for (var i = 0; i < this.reserveTimeList.length; i++) {
        if ((this.reserveTimeList[i].startTime <= timetap) && (timetap <= this.reserveTimeList[i].endTime - 900000)) {
          numLeaveTime.push({ learve: this.reserveTimeList[i], times: this.reserveTimeList[i].endTime - timetap });
        }
      }
      if (numLeaveTime.length === 1) {
        this.params.share_startTime = numLeaveTime[0].learve.startTime;
        this.params.share_endTime = this.params.end_time = numLeaveTime[0].learve.endTime;
        this.params.start_time = timetap;
        var leaveTime = formatTimeStamp(numLeaveTime[0].learve.endTime);
        var leaveMonth = leaveTime.substr(5, 2)
        var leaveDay = leaveTime.substr(8, 2);
        var leaveMiunte = leaveTime.substr(14, 2);
        var leaveHours = leaveTime.substr(11, 2);
        this.leaveTime = leaveMonth + '月' + leaveDay + '日' + leaveHours + '时' + leaveMiunte + '分';
      } else {
        var max = numLeaveTime[0].times;
        var len = numLeaveTime.length;
        let obj = numLeaveTime[0];
        for (var i = 1; i < len; i++) {
          if (numLeaveTime[i].times > max) {
            max = numLeaveTime[i].times;
            obj = numLeaveTime[i];
          }
        }
        var leaveTime = formatTimeStamp(obj.learve.endTime);
        var leaveMonth = leaveTime.substr(5, 2)
        var leaveDay = leaveTime.substr(8, 2)
        var leaveMiunte = leaveTime.substr(14, 2);
        var leaveHours = leaveTime.substr(11, 2);
        this.leaveTime = leaveMonth + '月' + leaveDay + '日' + leaveHours + '时' + leaveMiunte + '分';
        this.params.share_startTime = obj.learve.startTime;
        this.params.share_endTime = this.params.end_time = obj.learve.endTime;
        this.params.start_time = timetap;
      }
    },
    // 获取价格信息
    getPrice(priceTime) {
      if (this.defaultTime == '立即入场') {
        this.price = '0.00';
      } else {
        var x = null;
        let miunte = parseInt(priceTime / 60000);
        for (var i = 0; i < this.feeList.length; i++) {
          if (miunte <= this.feeList[i].finishTime) {
            x = i;
            break;
          } else {
            continue;
          }
        }
        if (i === this.feeList.length) {
          x = i - 1;
        }
        if (this.feeList[x]) {
          this.price = (this.feeList[x].fee * this.pointedItem.integralPermissionsCoefficient).toFixed(2);
        }
      }
    },
    // 选择入场时间段
    openPicker() {
      this.$root.eventHub.$emit("init");
      if (this.reserveTimeList.length === 0) {
        Toast({
          message: '没有预约的时间段',
          duration: 1500
        })
        return;
      } else {
        this.$root.eventHub.$emit('refer');
        this.show1 = true;
        this.isshow = true;
      }
    },
    // 选择时间后的确定按钮
    confirmFn(e) {
      e.cancelBubble = true;
      if (e.select1.text == '立即入场') {
        this.defaultTime = '立即入场'
        this.getDefaultTime(e.select1.time);
        this.priceTime = e.select1.time - new Date().getTime();
        this.getPrice(this.priceTime);
      } else {
        this.params.start_time = e.select2.time;
        this.priceTime = e.select2.time - new Date().getTime();
        this.defaultTime = e.select1.text.substring(0, e.select1.text.length - 2) + ':' + e.select2.text.substring(0, e.select2.text.length - 2) + "前";
        this.getDefaultTime(e.select2.time);
        this.getPrice(this.priceTime);
      }
      this.show1 = false;
      this.isshow = false;
    },
    close(e) {
      this.show1 = false;
      this.isshow = false;
      e.cancelBubble = true
    },
    async doPay(orderId) {
      let url = 'apiwrite/reserve/pay';
      let couponId = null;
      let baseURL = null;
      let spbillCreateIp = null;
      let channel = 1;
      let res = await pay(url, orderId, channel, couponId, baseURL, spbillCreateIp);
      if (res.error_code == 2000) {
        this.clickFlag = true
        Toast({
          message: '预约成功',
          duration: 1500
        })
        localStorage.setItem("routerFlag", null);
        this.$router.push('payToComplete');
      } else {
        this.clickFlag = true
        Toast({
          message: '预约失败,请您重新预约',
          duration: 1500
        })
      }
    },
    //立即预约
    async goApoint() {
      // 测试
      if (!this.clickFlag) {
        return
      }
      this.clickFlag = false
      // 测试数据
      // this.params.user_id = 30;
      if (!this.params.plate_id) {
        Toast({
          message: '请选择您的车牌号',
          duration: 1500
        })
        return;
      }
      // this.params.share_startTime = this.params.shareStartTime;
      // this.params.share_endTime = this.params.shareEndTime;
      // this.params.end_time = this.params.endTime;
      // if(!this.params.start_time || this.params.start_time  == null){
      //   this.params.start_time = this.params.startTime;
      // }
      if (this.defaultTime == '立即入场') {
        this.params.isImmediatelyEnter = 1
      }
      let res = await appointCarport(this.params);
      if (res.error_code == 2801) {
        this.clickFlag = true
        Indicator.close();
        Toast({
          message: '入场时间已过，请重新选择。',
          duration: 1500
        })
      } else if (res.error_code == 2900) {
        this.clickFlag = true
        Indicator.close();
        Toast({
          message: '您还有订单未完成。',
          duration: 1500
        })
      } else if (res.error_code == 2904) {
        this.clickFlag = true
        Indicator.close();
        Toast({
          message: '该车辆已存在预约订单。',
          duration: 1500
        })
      } else if (res.error_code == 2905) {
        this.clickFlag = true
        this.messInfo();
      } else if (res.error_code == 2906) {
        this.clickFlag = true
        Toast({
          message: '您暂无预约资格，请联系物业管理员',
          duration: 1500
        })
      } else if (res.error_code == 2000) {
        // debugger
        Indicator.close();
        let orderId = res.data.orderId;   //订单号
        let totalFee = res.data.totalFee; //预约费用
        localStorage.setItem('orderId', orderId);
        localStorage.setItem('H5_fees', totalFee);  //保存的支付金额
        localStorage.setItem('goBackFlag', "reservationOld");  //保存的支付界面返回到哪里
        if (totalFee == 0) {   //totalFee
          this.doPay(orderId);
        } else {
          localStorage.setItem("routerFlag", null);
          this.clickFlag = true
          this.$router.push({
            name: 'payMentDt',
            params: {
              fees: totalFee,
              orderId: orderId
            }
          });
        }
      }
      //如果金额存在 跳转到支付界面去， 不存在 或者为0 先调起预约支付接口
      else if (res.error_code === 2901) {
        this.messInfo();
        return;
      } else {
        Toast({
          message: res.error_message,
          duration: 1500
        })
      }
    },
    //选择车牌号
    chooseCar() {
      this.$router.push({
        name: 'licensePlate',
        params: {
          from: 'licensePlate'
        }
      })
    },
    // 对拿到的当前系统时间做处理
    timeToget() {
      // new Date 转换的时候要考虑到ios 的兼容性
      let currentTime = new Date().getTime()//获取当前日期
      let timestamp = formatTimeStamp(currentTime);
      timestamp = timestamp.replace(/\-/g, '/');
      let ymd = timestamp.split(" ")[0]
      let weeHours = new Date(ymd + " " + "00:00:00:00")
      weeHours = weeHours.getTime()
      let Difference = Math.floor((currentTime - weeHours) / 900000) + 1;
      this.nowTime = weeHours + (Difference * 900000)
      console.log(this.nowTime)
    },
  },
  activated() {
    this.clickFlag = true
    // 用户
    this.userId = this.params.user_id = JSON.parse(localStorage.getItem('userId'));
    this.parklotId = this.params.parklot_id = JSON.parse(localStorage.getItem('myParklotId'));
    this.timeToget();
    this.getparklot();
  },
  // 退出组件时， 清空缓存
  deactivated() {
    localStorage.removeItem('H5_chosen_plate')
    this.$destroy(true);
  },
}
</script>
<style lang="stylus">
@import '../../common/css/base.stylus'
@import '../../common/css/mixin.stylus'
.appointmessage-info
  line-height 2.5rem
#appoint
  position absolute
  width 100%
  top 0
  bottom 0
  background-color #F4F4F4
  overflow hidden
  .alert
    position absolute
    width 100%
    height 100%
    background-color rgba(0, 0, 0, 0.5)
  .mt-calss-style
    z-index 20000 !important
  .content
    width 100%
    top 0rem
    bottom 3.5rem
    overflow hidden
    .info
      padding-left 1rem
      padding-right 1rem
      border-bottom 0.0625rem solid #E6E6E6
      background-color #FFF
    .car-info
      padding-top 1.1rem
      padding-bottom 1.4rem
      height 5.3rem
      box-sizing border-box
      .car-style
        display flex
        justify-content space-between
      .message
        font-size 0.9375rem
        color #9a9a9a
        font-weight 700
        margin-right 0.5625rem
      .cars-color
        line-height 1.875rem
        font-size 0.625rem
        color #fff
        background-color #f7bc41
        padding 0 0.1125rem
        text-align center
      .distatnce-dis
        display flex
        align-items center
    /* .car-distance
    margin-top 0.55rem */
    .text-distance
      font-size 0.9rem
      color #9a9a9a
    .ic
      display inline-block
      width 0.75rem
      height 1rem
    .ic-font1
      bg-img('../../assets/img/btn_map')
    .ic-style
      bg-img('../../assets/img/wuye_up')
    .ic-toll
      bg-img('../../assets/img/home_order_rule')
    .text
      font-size 1rem
      font-weight 700
      color #000
    .toll-rules
      margin-top 0.5625rem
      padding-top 0.9275rem
      padding-bottom 1.3125rem
      .text-distance
        font-size 0.75rem
    .plate-number
      box-sizing border-box
      margin-top 0.7rem
      display flex
      justify-content space-between
      align-items center
      height 3.5rem
      flex-wrap nowrap
      /* .plate */
    .einlass
      border-top none
      margin-top 0
    .stop-time
      margin-top 0.5rem
      height 3.625rem
      display flex
      justify-content space-between
      align-items center
    .tips
      margin-top 0.25rem
      font-size 0.75rem
      color #999
      padding-left 0.9375rem
      padding-right 0.9375rem
      padding-bottom 3.5rem
      .tips-text
        line-height 1.3125rem
    .text-3
      font-size 1rem
      font-weight 700
    .dis-2
      display flex
      align-items center
      font-size 1rem
      color #9a9a9a
      .plate-info
        font-size 1rem
        color #9a9a9a
        border none
        out-line none
        text-align right
      .redNumber
        padding-right 0.3rem
        font-size 1.4rem
        color rgb(208, 29, 149)
    .dis-inline
      display inline
      .black-location
        float right
        font-size 0.8rem
        color #9a9a9a
    .dis-margin
      padding-left 20px
      flex 1
  .to-appoint
    position fixed
    width 100%
    bottom 0
    height 3.5rem
    line-height 3.5rem
    font-size 1rem
    font-weight bolder
    background-color #d21c95
    color #FFF
    .div-flex
      display flex
      height 100%
    .ds-1
      text-align left
      padding-left 0.9375rem
      width 62.66666%
      height 100%
      background-color #fff
      color #646464
      font-size 0.75rem
    .ds-2
      background-color #d21c95
      height 100%
      width 37.33333%
      border none
      color #fff
    .price-style
      font-size 1.2rem
  .exprie
    font-size 1rem
</style>


