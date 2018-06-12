<template>
  <div id="appoint">
    <!-- <sub-header :headerMark="headerMark"></sub-header> -->
    <div class="content p-a" ref="apponitBox">
      <div>
        <!--1.0 车场信息-->
        <div class="info car-info">
          <div class="car-style">
            <div>
              <div class="ic ic-font1"></div>
              <span class="text">{{pointedItem.parklotName}}</span>
              <span v-if="pointedItem.parklotKind === 0" class="cars-color">室内</span>
              <span v-else-if="pointedItem.parklotKind === 1" class="cars-color">室外</span>
              <span v-else-if="pointedItem.parklotKind === 2" class="cars-color">室内+室外</span>
            </div>
            <div class="dis-2">
              <span class="redNumber">{{pointedItem.reservableAmount}}</span>
            </div>
          </div>
          <div class="car-distance">
            <div class="dis-inline">
              <span class="text-distance">{{pointedItem.address}}</span>
            </div>
            <div class="dis-inline">
              <span class="black-location">空泊位</span>
            </div>
          </div>
        </div>

        <!--2.0 收费规则-->
        <!-- <div class="info toll-rules">
          <div>
            <div class="ic ic-toll" style="vertical-align: middle"></div>
            <span class="text">收费规则</span>
          </div>
          <br>
          <div class="car-distance">
            <span class="text-distance">{{pointedItem.feeIntro == '' ? '暂无信息' :pointedItem.feeIntro}}</span>
          </div>
        </div> -->
        <div class="info plate-number"  @click="chooseCar">
          <div class="text-3">车牌号</div>
          <div class="dis-2">
              <input type="text" class="plate-info" placeholder="去添加" :value="plateNo" readonly>
              <!-- <div v-if=" carPlate === undefined " class="text-2color">{{pointedItem.plateNo}}</div>
              <div v-if=" carPlate !== undefined " class="text-2color">{{carPlate}}</div>             -->
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
          <span style="color: #f63372">￥<span class="price-style">{{price}}</span></span>
        </div>
        <div @click="goApoint" class="div-style ds-2">立即预约</div>
      </div>
    </div>
    <div :class="{alert: isshow}" @click="closeZinde"></div>
    <vue-pickers :show="show1"
                  :selectData="pickData2"
                  v-on:cancel="close"
                  v-on:confirm="confirmFn">
    </vue-pickers>
  </div>
</template>
<script>
import { formatTimeStamp } from '../../common/js/H5plugin';
import subHeader from './header';
import {appointCarport,pay, lockChange} from '../../server/getData';
import {getMyCars} from '../../server/getData';
import {postParklot} from '../../server/getData';
import {Toast,Indicator} from 'mint-ui';
import { setTimeout } from 'timers';
import { MessageBox } from 'mint-ui'; // 这个是一个消息提示框
import BScroll from 'better-scroll';
import VuePickers from "vue-pickers";
export default {
  data () {
    return {
      plateNo:'',  //车牌号
      plateNoId:'', //车牌号ID
      show1: false,
      isshow: false,
      headerMark:'预约',
      pointedItem:{},   //停车场接口获取信息返回 | enter
      carPlate:null,
      startTime:'',  //选择开始时间
      endTime:'',  //选择结束时间
      fmEndTime:'', //最晚规整的结束时间
      estateId:'',   //预约场地的id
      mytime: '',    // 按照当前的系统时间做做最晚时间处理
      /*--新的东西*/
      parklotId: null, // 表示传递过来的车场的ID
      userId:null,//表示传递过来的用户的ID
      allTime:[],
      pickerVisible:null,
      reserveTimeList:[],
      feeList:[],
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
      timeList:[],  // 筛选出来的数据点集合
      arr: [],
      array:[],
      arrayflag: false,
      defaultTime: '00:00', // 默认时间
      leaveTime:null,
      priceTime: null, // 预约时间 -  当前系统时间 = 时间戳差值
      price:0, //价格信息

      parkItemObj:{},  //停车车场参数

      // params:{
      //   user_id: null, // 用户ID
      //   share_id:null,  // 共享时段ID
      //   parklot_id:null, //停车场ID
      //   plate_id:null,  // 车牌ID
      //   start_time:null, // 开始时间戳
      //   end_time:null,  // 结束时间戳
      // }
      params:{
        user_id: null,  // 用户ID
        parklot_id:null, // 车场ID
        plate_id:null, // 车牌ID
        share_startTime:null, // 共享开始时间戳
        share_endTime:null,  // 共享结束时间戳
        start_time:null,    // 用户选择的时间戳
        end_time:null,      // 用户选择的结束时间戳
      },
      systemTime:null,//系统时间
      systemTimeFlag:false,
    }
  },
  components: {
    subHeader,
    VuePickers,
  },
  methods: {
    // 阻止事件的行为
    closeZinde(){
      this.isshow = false;
      this.show1 = false;
    },
    //添加屏幕滚动事件
    _initScroll(){
      this.$nextTick(()=>{
        //左边滑动选择
        if(!this.leftScroll){
          this.leftScroll = new BScroll(this.$refs.apponitBox,{
            probeType:3,
            scrollY:true,
            click: true,
          });
        }else{
          this.leftScroll.refresh();
        }
      })
    },
    //获取预约接口信息
    async getparklot(){
      // this.userId = JSON.parse(localStorage.getItem('userId'));
      // this.parklotId = JSON.parse(localStorage.getItem('myParklotId'));
      this.userId = 30;
      this.parklotId = 16;
      this.reserveTimeList = [];
      let res = await postParklot(this.userId,this.parklotId);
      if(res.error_code === 2000){
        console.log(res);
        this.pointedItem = res.data;
        this.params.plate_id = this.pointedItem.plateId;
        this.params.parklot_id = this.pointedItem.parklotId;
        let plateObj = JSON.parse(localStorage.getItem('H5_chosen_plate'));
        if(!plateObj){
          this.plateNo = res.data.plateNo;
          this.plateNoId = res.data.plateId;
        }else{
          this.plateNo = plateObj.plateNo;
          this.plateNoId = plateObj.plateNoId;
          localStorage.removeItem('H5_chosen_plate');
        }
        //车场详情参数获取
        this.parkItemObj.id = res.data.parklotId;
        // 筛选时间
        this.feeList = this.pointedItem.feeList;
        // debugger
        console.log(this.defaultTime);
        this.reserveTimeList = this.pointedItem.reserveTimeList;
        if(!this.reserveTimeList.length){
          // 这里有个提示框  并且确认键（跳转到首页）
          this.messInfo();
        }else{
          this.filterTime(this.pointedItem.reserveTimeList);
          console.log(this.timeList);
          this.disposeTime(this.timeList);
          console.log(this.timeList);
          // 对时间段进行拆分
          this.dataChange();
        }
        this._initScroll();
      }else{
        Toast({
          message:'获取预约信息失败',
          duration:1500
        })
      }
    },
    // 提示用户，支付超时，不跳转
    messInfo(){
        let htmls = `
                      <div class="appointmessage-info">
                        <div class="is-text">车位已经被预约满了。</div>
                      </div>`;
        MessageBox({
          title: '温馨提示',
          message: htmls,
          showConfirmButton:true,
          confirmButtonText:'确认',
          showCancelButton:false,
        }).then(action=>{
          Indicator.open();
          setTimeout(() => {
            Indicator.close();
            this.getparklot();
          }, 2000);
        }).catch(err=>{

        })
      },
     // 筛出无效的时间段
    filterTime(timeList) {
      for (var i = 0; i < timeList.length; i++) {
        // 间隔15分钟的时间都没有的话，就排除掉
        if (timeList[i].startTime >= this.nowTime) {
          if (timeList[i].startTime > timeList[i].endTime - 900000) {
            continue;
          } else {
            this.timeList.push({
              startTime: timeList[i].startTime,
              endTime: timeList[i].endTime,
              id: timeList[i].id
            });
          }
        } else if (
          timeList[i].startTime < this.nowTime &&
          timeList[i].endTime < this.nowTime
        ) {
          continue;
        } else if (
          timeList[i].startTime < this.nowTime &&
          this.nowTime < timeList[i].endTime - 900000
        ) {
          this.timeList.push({
            startTime: timeList[i].startTime,
            endTime: timeList[i].endTime,
            id: timeList[i].id
          });
        }
      }
    },
    //对时间段进行去重处理
    disposeTime(timeList) {
      // debugger
      for (let i = 0; i < this.timeList.length; i++) {
        this.timeList[i].endTime -= 900000;
      }
      let tempTimelist = [];
      let tmObjective = timeList[0];
      let isUnited = false;
      if (timeList.length <= 1) {
        this.timeList = [].concat(timeList);
        return;
      }
      for (let i = 1; i < timeList.length; i++) {
        let newItem = {};
        let item = timeList[i];
        if (
          tmObjective.endTime >= item.startTime &&
          item.endTime >= tmObjective.endTime
        ) {
          newItem.startTime = tmObjective.startTime;
          newItem.endTime = item.endTime;
          if (i > 0) {
            tempTimelist.pop(tempTimelist[length - 1]);
          }
          tempTimelist.push(newItem);
          tmObjective.startTime = newItem.startTime;
          tmObjective.endTime = newItem.endTime;
          isUnited = true;
        } else if (
          tmObjective.endTime >= item.startTime &&
          item.endTime < tmObjective.endTime
        ) {
          newItem.startTime = tmObjective.startTime;
          newItem.endTime = tmObjective.endTime;
          if (i > 0) {
            tempTimelist.pop(tempTimelist[length - 1]);
          }
          tempTimelist.push(newItem);
          tmObjective.startTime = newItem.startTime;
          newItem.endTime = tmObjective.endTime;
          isUnited = true;
        } else {
          tempTimelist.push(item);
          tmObjective.startTime = item.startTime;
          tmObjective.endTime = item.endTime;
        }
      }
      this.timeList = [].concat(tempTimelist);
      //结束时间减去15分钟预留离场时间
    },

    dataChange() {
      for (var i = 0; i < this.timeList.length; i++) {
        let item = this.timeList[i];
        // debugger
        this.array = [];
        var n = (item.endTime - item.startTime) / 900000;
        if (this.nowTime > item.endTime) {
          continue; // 比结束时间都还大，直接结束本次循环
        } else if (
          item.startTime < this.nowTime &&
          this.nowTime < item.endTime
        ) {
          var x = null;
          var start = item.startTime;
          var arr = [];
          var temp = [];
          this.arrayflag = true;
          for (var j = 0; j <= n; j++) {
            arr.push(start);
            start += 900000;
          }
          for (var y = 0; y < arr.length; y++) {
            if (this.nowTime < arr[y]) {
              x = y;
              break;
            }
          }
          var arrtrue = [];
          if (x !== null) {
            arrtrue = arr.slice(x);
            this.array.push(arrtrue);
          }
        } else {
          // 先转换成数组
          var arr = [];
          // var start = this.allTime[i].startTime;
          var start = this.timeList[i].startTime;
          for (var j = 0; j <= n; j++) {
            arr.push(start);
            start += 900000;
          }
          this.array.push(arr);
        }
      }
      // console.log(this.array);
      this.convertTime();
    },


    // 赋值 和 拆分 小时数
    convertTime(){
      var pData1 =[],pData2={},pData2arr = [];
      console.log(this.array);
      for(var i=0;i<this.array.length;i++){
        var arrayone = this.array[i];
        var oldhours = null;
        let oldDay = formatTimeStamp(arrayone[0]).substr(8,2);
        for(var j=0;j<arrayone.length;j++){
          let time = formatTimeStamp(arrayone[j]);
          let miunte = time.substr(14,2);
          let hours = time.substr(11,2);
          let day = time.substr(8,2);
          if(oldDay < day){
            hours = ' 次日 '+ hours + ' 时 ';
            miunte = miunte + ' 分 ';
          }else {
            hours = hours + ' 时 '
            miunte = miunte + ' 分 ';
          }
          // debugger
          // console.log(pData1);
          if(pData1.length >= 1){
            if(pData1[pData1.length-1].texts != hours){
              pData1.push({
                text: hours,
                value: i + j + hours,
                texts:hours,
                time: arrayone[j]
              })
            }
          }else{
            pData1.push({
                text: hours,
                value: i + j + hours,
                texts:hours,
                time: arrayone[j]
            })
          }

          pData2arr.push({
            text: miunte,
            value:i+j,
            texts: hours,
            time: arrayone[j]
          })
          oldhours = time.substr(11,2);
        }
      }
      console.log(pData1);
      var hoursarray = pData1;
      var miuntearray = this.pData2chang(pData2arr);
      console.log(hoursarray,miuntearray);
      for(var i=0;i<hoursarray.length;i++){
        pData2[hoursarray[i].value] = miuntearray[hoursarray[i].text];
      }

      // this.pickData2.pData1 = hoursarray;
      // debugger
      this.$set(this.pickData2,'pData1',hoursarray);
      // this.pickData2.pData2 = pData2;
      this.$set(this.pickData2,'pData2',pData2);

      this.pickData2.default.push(hoursarray[0]);
      this.pickData2.default.push(pData2[hoursarray[0].value][0]);
        this.defaultTime = hoursarray[0].text.substring(0,hoursarray[0].text.length-2) +':' +  pData2[hoursarray[0].value][0].text.substring(0,pData2[hoursarray[0].value][0].text.length-2) + "前";
        console.log(this.defaultTime)
        this.params.start_time = this.params.startTime;
      // }
      // 通过时间戳差值，获取价格信息
      console.log(new Date().getTime())
      // debugger
      this.priceTime = hoursarray[0].time - new Date().getTime();
      // debugger
      this.getPrice(this.priceTime);
      this.getDefaultTime(hoursarray[0].time);
    },
    getMyDate(mss){
      var date = new Date(mss);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      if(new String(hours).length <= 1){
        hours = "0"+ hours;
      }
      if(new String(minutes).length <= 1){
        minutes = "0"+ minutes;
      }
      return hours + ":" + minutes;
    },
    // 对分钟数
    pData2chang(arr) {
      var data = [];
      for (var i = 0; i < arr.length; i++) {
        if (!data[arr[i].texts]) {
          var arrs = [];
          arrs.push(arr[i]);
          data[arr[i].texts] = arrs;
        } else {
          data[arr[i].texts].push(arr[i]);
        }
      }
      return data;
    },

    // 默认的离场时间
    getDefaultTime(time){
      // debugger
      var timetap = time;
      var x = null;
      let numLeaveTime = [];
      // 筛出离场时间
      for(var i=0;i<this.reserveTimeList.length;i++){
        if((this.reserveTimeList[i].startTime<=timetap) && (timetap<= this.reserveTimeList[i].endTime-900000)){
          numLeaveTime.push({learve: this.reserveTimeList[i], times: this.reserveTimeList[i].endTime - timetap});
        }
      }
      if(numLeaveTime.length === 1){
        // debugger
        this.params.shareStartTime = numLeaveTime[0].learve.startTime;
        this.params.shareEndTime = this.params.endTime =   numLeaveTime[0].learve.endTime;
        console.log(timetap)
        this.params.startTime = timetap;
        var leaveTime = formatTimeStamp(numLeaveTime[0].learve.endTime);
        var leaveMonth = leaveTime.substr(5,1) != 0 ?  leaveTime.substr(5,2) : leaveTime.substr(6,1);
        var leaveDay = leaveTime.substr(8,1) != 0 ?  leaveTime.substr(8,2) : leaveTime.substr(9,1);
        var leaveMiunte = leaveTime.substr(14,2);
        var leaveHours =  leaveTime.substr(11,2);
        this.leaveTime = leaveMonth+'月'+leaveDay+'日'+leaveHours+':'+leaveMiunte+':00';
      }else{
        var max = numLeaveTime[0].times;
        var len = numLeaveTime.length;
        let obj = numLeaveTime[0];
        for (var i = 1; i < len; i++){
          if (numLeaveTime[i].times > max) {
            max = numLeaveTime[i].times;
            obj =  numLeaveTime[i];
          }
        }
        var leaveTime = formatTimeStamp(obj.learve.endTime);
        var leaveMonth = leaveTime.substr(5,1) != 0 ?  leaveTime.substr(5,2) : leaveTime.substr(6,1);
        var leaveDay = leaveTime.substr(8,1) != 0 ?  leaveTime.substr(8,2) : leaveTime.substr(9,1);
        var leaveMiunte = leaveTime.substr(14,2);
        var leaveHours =  leaveTime.substr(11,2);
        this.leaveTime = leaveMonth+'月'+leaveDay+'日'+leaveHours+':'+leaveMiunte+':00';
        this.params.shareStartTime = obj.learve.startTime;
        this.params.shareEndTime =  this.params.endTime =  obj.learve.endTime;
        this.params.startTime = timetap;
      }
      // share_startTime:null, // 共享开始时间戳
      //   share_endTime:null,  // 共享结束时间戳
      //   start_time:null,    // 用户选择的时间戳
    },


    // 获取价格信息
    getPrice(priceTime){
      // debugger
      var x = null;
      let miunte = parseInt(priceTime / 60000);
      console.log(miunte);
      for(var i=0;i<this.feeList.length;i++){
        if(miunte <= this.feeList[i].finishTime){
          x = i;
          break;
        }else{
            continue;
        }
      }
      if(i === this.feeList.length){
          x = i-1;
      }
      if(this.feeList[x]){
        this.price = (this.feeList[x].fee*this.pointedItem.integralPermissionsCoefficient).toFixed(2);
      }
      console.log(this.price);
    },
    // 选择入场时间段
    openPicker() {
         this.$root.eventHub.$emit("init");
        if(this.reserveTimeList.length === 0){
          Toast({
            message:'没有预约的时间段',
            duration:1500
          })
          return;
        }else{
          this.$root.eventHub.$emit('refer');
          this.show1 = true;
          this.isshow = true;
        }
    },
    // 选择时间后的确定按钮
    confirmFn(e){
      // debugger
      e.cancelBubble = true;
      this.params.startTime = e.select2.time;
      this.params.start_time = e.select2.time;
      console.log(e.select2.time);
      if(this.systemTimeFlag){
        this.priceTime = this.systemTime - new Date().getTime();
      }else {
        this.priceTime = e.select2.time - new Date().getTime();
      }
      // debugger
      this.getPrice(this.priceTime);

      this.defaultTime = e.select1.text.substring(0,e.select1.text.length-2) +':'+ e.select2.text.substring(0,e.select2.text.length-2) + "前";

      console.log(e.select2.time);
      this.getDefaultTime(e.select2.time);
      this.show1 = false;
      this.isshow = false;
    },
    close(e){
      this.show1 = false;
      this.isshow = false;
      e.cancelBubble = true
    },
    async doPay(orderId){
      let url = 'apiwrite/reserve/pay';
      let couponId = null;
      let baseURL = null;
      let spbillCreateIp = null;
      let channel = 1;
      let res = await pay(url, orderId, channel,couponId, baseURL,spbillCreateIp);
      if(res.error_code == 2000){
        Toast({
          message:'预约成功',
          duration:1500
        })
        localStorage.setItem("routerFlag",null);
        this.$router.push('payToComplete');
      }else{
        Toast({
          message:'预约失败,请您重新预约',
          duration:1500
        })
      }
    },
    //立即预约
    async goApoint(){
      console.log(this.params);
      // this.params.user_id = localStorage.getItem('userId');
      this.params.user_id = 30;
      this.params.plate_id = 16;
      this.params.plate_id = this.plateNoId;
      if(!this.plateNo || (this.plateNo == '')){
        Toast({
          message:'请选择您的车牌号',
          duration:1500
        })
        return;
      }
      //无车位的情况
      if(!this.timeList.length){
        this.messInfo();
        return;
      }
      console.log(this.params);
      this.params.share_startTime = this.params.shareStartTime;
      this.params.share_endTime = this.params.shareEndTime;
      this.params.end_time = this.params.endTime;
      if(!this.params.start_time || this.params.start_time  == null){
        this.params.start_time = this.params.startTime;
      }

      let res = await appointCarport(this.params);

      if(res.error_code == 2801){
        Indicator.close();
        Toast({
          message:'入场时间已过，请重新选择。',
          duration:1500
        })
      }else if(res.error_code == 2900){
        Indicator.close();
        Toast({
          message:'您还有订单未完成。',
          duration:1500
        })
      }else if(res.error_code == 2904){
        Indicator.close();
        Toast({
          message:'该车辆已存在预约订单。',
          duration:1500
        })
      }else if(res.error_code == 2905){
        this.messInfo();
      }else if(res.error_code == 2906){
        Toast({
          message:'您暂无预约资格，请联系物业管理员',
          duration:1500
        })
      }else if(res.error_code == 2000){
        // debugger
        Indicator.close();
        let orderId = res.data.orderId;   //订单号
        let totalFee = res.data.totalFee; //预约费用
        localStorage.setItem('orderId',orderId);
        localStorage.setItem('H5_fees',totalFee);  //保存的支付金额
        localStorage.setItem('goBackFlag',"reservationOld");  //保存的支付界面返回到哪里
        if(totalFee == 0){   //totalFee
            this.doPay(orderId);
        }else{
          localStorage.setItem("routerFlag",null);
          alert(JSON.stringify(orderId));
          this.$router.push({
            name:'payMentDt',
            params:{
              fees:totalFee,
              orderId: orderId
            }
          });
        }
      }
      //如果金额存在 跳转到支付界面去， 不存在 或者为0 先调起预约支付接口
      else if(res.error_code === 2901){
        this.messInfo();
        return;
      }
      else{
        Toast({
          message:res.error_message,
          duration:1500
        })
      }
    },
    //选择车牌号
    chooseCar(){
      this.$router.push({
        name:'licensePlate',
        params:{
          from:'licensePlate'
        }
      })
    },
    // 对拿到的当前系统时间做处理
    timeToget(){
      var time = Number(new Date().getTime()) + 900000 ;
      this.nowTime = time;
    },
  },
  activated () {
    this.timeToget();
    this.getparklot();
  },
  // 退出组件时， 清空缓存
  deactivated(){
    // debugger
    this.$destroy(true);
  },
  beforeRouteLeave(to, from, next){
      // 这里将MessageBox进行关闭的操作
      this.plateNo = '';
      MessageBox.close(false);
      next();
   },
  beforeRouteEnter (to, from, next){
    next(vm=>{
      if(from.path === '/car'){
        vm.carPlate = JSON.parse(localStorage.getItem('H5_carplate'));
      }
    })
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
    background-color rgba(0,0,0,0.5)
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
      border-bottom 0.0625rem  solid #E6E6E6
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
        font-size .9375rem
        color #9a9a9a
        font-weight 700
        margin-right  0.5625rem
      .cars-color
        line-height 1.875rem
        font-size 0.625rem
        color #fff
        background-color #f7bc41
        padding 0  0.1125rem
        text-align center
    /*.car-distance
      margin-top 0.55rem*/
    .text-distance
      font-size 0.9rem
      color #9a9a9a

    .ic
      display inline-block
      width .75rem
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
      margin-top  0.5625rem
      padding-top .9275rem
      padding-bottom 1.3125rem
      .text-distance
        font-size .75rem
    .plate-number
      box-sizing border-box
      margin-top 0.7rem
      display flex
      justify-content space-between
      align-items center
      height 3.5rem
      flex-wrap nowrap
      /*.plate*/
    .einlass
      border-top none
      margin-top 0

    .stop-time
      margin-top .5rem
      height 3.625rem
      display flex
      justify-content space-between
      align-items center
    .tips
      margin-top 0.25rem
      font-size .75rem
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
        padding-right .3rem
        font-size 1.4rem
        color rgb(208, 29, 149)
    .dis-inline
      display inline
      .black-location
        float right
        font-size .8rem
        color #9a9a9a
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
      padding-left: 0.9375rem
      width 62.66666%
      height 100%
      background-color #fff
      color #646464
      font-size 0.75rem
    .ds-2
      height 100%
      width 37.33333%
    .price-style
      font-size 1.2rem
   .exprie
      font-size 1rem


</style>


