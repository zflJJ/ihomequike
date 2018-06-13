<template>
  <div id="appoint" @click="hiddenJp($event)">
    <div class="content p-a" ref="apponitBox"  @click="isHideen">
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

        <div class="info text-plate">
          <div class='plate-title'>
            <span>请输入真实有效的车牌号码</span>
          </div>
        </div>
        <!--增加键盘输入框开始-->
        <div class="input-wrap">
          <div :class="['input-case',{caseactive:currentIndentIndex==inde}]" v-for='(item,inde) in indentLists' :key="inde" @click="changeInput($event)" :inde='inde' showflg='1'>{{item}}</div>
          <div :class="['input-letter',{active:currentPlateIndex>0}]" @click='showKey' showflg='1'>
           <span :class="['letter-item',{letteractive:currentPlateIndex==inde&&cursorFlag}]" v-for='(item,inde) in plateLists' :key="inde" showflg='1'>{{item}}</span>
          </div>
       </div>
        <!--增加键盘输入框结束-->
        <div class="textInfo">请输入正确车牌，否则道闸无法放行。</div>

        <div class="info text-plate" style="padding-top:0.7rem;padding-bottom:0.7rem;font-size:0.9rem;color:#1a1a1a;">
          <div>
            <span class="textMin">验证手机号码</span>
          </div>
        </div>
        <div class="info">
          <div class="car-distance">
            <div class="phone test-input p-r">
              <span class="phone-ic input-ic p-a"></span>
              <input class="phone" v-model="phoneNumber" type="number" placeholder="请输入手机号码" maxlength="11" @input="getPhoneList" style="marging-top:0.75rem">
              <!--这里需要有一个两倍图 和 3倍图  需要对类名做判断-->
              <template v-if="isclosephone">
                <img srcset="../../assets/img/btn_close@2x.png 2x, ../../assets/img/btn_close@3x.png 3x" alt="" class="imgsrc" @click="closephone">
              </template>

              <div class="alert-phone">
                <ul>
                  <li v-for="(item,index) in phoneArr" :key="index" @click="getItem(item)">{{item}}</li>
                </ul>
              </div>
            </div>
            <div class="code test-input p-r">
              <span class="code-ic input-ic p-a"></span>
              <input class="code" type="number" v-model="code" placeholder="请输入验证码" @input="inputCodeEvent" maxlength="4" style="marging-top:0.9rem">

              <!--这里需要一个2倍图 和 3 倍图-->
              <template v-if="isclosecode">
                <img srcset="../../assets/img/btn_close@2x.png 2x, ../../assets/img/btn_close@3x.png 3x" alt="" class="imgsrc" @click="closeCode">
              </template>
              &nbsp;
              <span class="get-code-btn p-a t-c" @click="getCode">{{getCodeInfo}}</span>
            </div>
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
        <div class="tips">
          <div class="tips-text" style="font-size:0.8rem;color:#999999;">请按时离场，超时将收取额外费用。</div>
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
    <!-- 时间 -->
    <div :class="{alert: isshow}" @click="closeZinde"></div>
    <vue-pickers :show="show1"
                  :selectData="pickData2"
                  v-on:cancel="close"
                  v-on:confirm="confirmFn">
    </vue-pickers>
    <!-- 车牌 -->
    <transition :name="show?'slideUp':'slideDown'">
      <key-board @getinput='getkeyboard' @hiden='hideKey' :showflag='KeyBoardflag' v-show="show"></key-board>
    </transition>
  </div>
</template>
<script>
import { formatTimeStamp } from '../../common/js/H5plugin';
import {saveUserBind,pay} from '../../server/getData';
import {getMyCars} from '../../server/getData';
import {postParklot} from '../../server/getData';
import {sendCodes,signInUsers,getPhoneCode} from '../../server/getData';
import {Toast,Indicator} from 'mint-ui';
import { MessageBox } from 'mint-ui'; // 这个是一个消息提示框
import BScroll from 'better-scroll';
import VuePickers from "vue-pickers";
import KeyBoard from '../commonComponents/keyboard.vue'
import common from '../../common/js/common';
import { debug } from 'util';


export default {
  data () {
    return {
      plateNo:'',  //车牌号
      plateNoId:'', //车牌号ID
      show1: false,
      isshow: false,
      plateNum:'',   //填入的车牌号
      plateShowed:false,   //是否显示了车牌选择组件
      proInfo:'粤',  //省份
      iniInfo:'B',     //车牌号位
      cletoast:null,      //车牌的提示信息
      phoneNumber:null, //用户输入的手机号
      code:'',        //用户输入的验证码
      codeBack:false, //是否已经成功推送短信验证码
      randerCodes:'', //系统随机生成的六位验证码
      codeCounts:0, //点击获取验证码的次数统计,
      isGettingCodes:false, //是否正在获取验证码状态
      getCodeFlag:false,//短信标记用来只获取1次短信
      phoneList: null,  // 是存储在localStorage中的数据
      phoneArr:null,   // 在input框中显示的数据
      isclosecode: false,  // 验证码的关闭小叉
      isclosephone: false,  // 用户名的小叉
      iscodeplugin: false, // 表示图形验证码是否显示
      error_code: null,     //用来验证是否要启用防刷验证
      anti: 1 ,             // 更改变量的值
        /*———图形验证码插件的数据—————*/
      identifyCodes: "1234567890",
      identifyCode: "",
      pointedItem:{},   //停车场接口获取信息返回 | enter
      carPlate:null,
      startTime:'',  //选择开始时间
      endTime:'',  //选择结束时间
      fmEndTime:'', //最晚规整的结束时间
      estateId:'',   //预约场地的id
      mytime: '',    // 按照当前的系统时间做做最晚时间处理
      /*--新的东西*/
      parkLotId: null, // 表示传递过来的车场的ID
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
        pData1: [],
        // 第二列数据结构
        pData2: {},
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
      params:{
        plateNumber:null, // 车牌号
        phone:null,       //手机号
        startTime:null,   // 用户选择的时间戳
        endTime:null,     // 用户选择的结束时间戳
        shareStartTime:null, // 共享开始时间戳
        shareEndTime:null,  // 共享结束时间戳
        totalFee:null,     //预约费
        parklotId:null,    // 车场ID
        ip:null,          // 用户IP
        phoneModel:null,  //手机型号
        unionId:null,     //
        openId:null,
        timestamp:null, //时间戳
        userId: null,  // 用户ID
      },
      counts: '', // 定时器倒计时
      systemTime:null,//系统时间
      systemTimeFlag:false,
      pagechange: false, // 表示页面是否后台运行过
      getSecond: null, //表示页面在后台运行的时间
      KeyBoardflag: 0,
      show: 0,
      indentLists: ['粤', 'B'],
      plateLists: ['车', '牌', '号', '码', null, null, null],
      isPlateFlag: true,
      cursorFlag: false,
      currentPlateIndex: 0,
      maxIndex: 5,
      currentIndentIndex: null,
      clickFlag: true
    }
  },
  computed:{
    getCodeInfo(){
      return this.isGettingCodes ? this.counts:'获取验证码';
    },
    //是否跳转到安全验证页面
    savetyConfirmShowed(){
      return false;
    },
  },
  components: {
    VuePickers,
    KeyBoard,
  },
  methods: {
    hiddenJp (e){
      if(e.target.getAttribute('showflg')=='1'){
        return
      }else{
        this.show=false
      }
    },
    getkeyboard (msg) {
      let _this = this
      if (_this.isPlateFlag) {
        // 输入字母数字
        if (msg === '删') {
          _this.delPlate(msg)
        } else {
          _this.inputPlate(msg)
        }
      } else {
        // 输入地区标识
        if (msg === '删') {
          return false
        } else {
          _this.inputIndent(msg)
        }
      }
    },
    hideKey () {
      this.show = false
    },
    showKey () {
      this.KeyBoardflag = 0
      this.show = true
      this.isPlateFlag = true
      this.cursorFlag = true
      this.currentIndentIndex = null
    },
    inputPlate (msg) {
      let _this = this
      let currentPlateIndex = _this.currentPlateIndex
      _this.cursorFlag = true
      // 判断是否正在输入状态
      if (currentPlateIndex === 0) {
        _this.plateLists = [null, null, null, null, null, null, null]
      }
      let lists = [..._this.plateLists]
      if (currentPlateIndex <= _this.maxIndex) {
        lists[currentPlateIndex] = msg
        _this.plateLists = lists
        currentPlateIndex++
        _this.currentPlateIndex = currentPlateIndex
      }
    },
    delPlate (mag) {
      let _this = this
      let currentPlateIndex = _this.currentPlateIndex
      if (currentPlateIndex === 0) {
        return false
      } else {
        --currentPlateIndex
        _this.currentPlateIndex = currentPlateIndex
      }
      if (currentPlateIndex === 0) {
        _this.plateLists = ['车', '牌', '号', '码', null, null]
      } else {
        let lists = [..._this.plateLists]
        lists[currentPlateIndex] = null
        _this.plateLists = lists
      }
    },
    inputIndent (msg) {
      let _this = this
      let indentLists = [..._this.indentLists]
      let currentIndentIndex = _this.currentIndentIndex
      indentLists[currentIndentIndex] = msg
      _this.indentLists = indentLists
      if (currentIndentIndex === 1) {
        _this.isPlateFlag = true
        _this.cursorFlag = true
        _this.currentIndentIndex = null
      } else {
        _this.currentIndentIndex = 1
        _this.KeyBoardflag = 0
      }
    },
    changeInput (e) {
      let _this = this
      let inde = Number(e.target.getAttribute('inde'))
      _this.isPlateFlag = false
      _this.cursorFlag = false
      _this.show = true
      _this.currentIndentIndex = inde
      if (inde === 0) {
        _this.KeyBoardflag = 1
      } else {
        _this.KeyBoardflag = 0
      }
    },
    getItem(item) {
      this.phoneNumber = item;
      this.phoneArr = null;
    },
    isHideen(){
      this.$root.eventHub.$emit('showK',null);
    },
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
      let userId = null;
      //只有扫码进入才有parklotId
      this.parkLotId = localStorage.getItem('myParklotId');
      this.reserveTimeList = [];
      let res = await postParklot(userId,this.parkLotId);
      if(res.error_code === 2000){
        this.pointedItem = res.data;
        // this.params.plate_id = this.pointedItem.plateId;
        this.params.parklotId = this.pointedItem.parklotId;
        // this.systemTime = res.data.systemTime;
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
        // console.log(this.defaultTime);
        this.reserveTimeList = this.pointedItem.reserveTimeList;

        if(!this.reserveTimeList.length){
          // 这里有个提示框  并且确认键（跳转到首页）
          this.messInfo();
        }else{
          this.filterTime(this.pointedItem.reserveTimeList);
          // console.log(this.timeList);
          this.disposeTime(this.timeList);
          // console.log(this.timeList);
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
    // 提示用户，支付超时，跳转 到预约界面
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
    filterTime(timeList){
      for(var i=0;i<timeList.length;i++){
        // 间隔15分钟的时间都没有的话，就排除掉
        if(timeList[i].startTime >= this.nowTime){
          if(timeList[i].startTime > timeList[i].endTime-900000){
              continue;
          }else{
            this.timeList.push({startTime:timeList[i].startTime,endTime:timeList[i].endTime,id:timeList[i].id})
          }
        }else if(timeList[i].startTime < this.nowTime && timeList[i].endTime < this.nowTime){
          continue;
        }else if(timeList[i].startTime < this.nowTime && this.nowTime < timeList[i].endTime - 900000){
            this.timeList.push({startTime:timeList[i].startTime,endTime:timeList[i].endTime,id:timeList[i].id})
        }
      }
    },

    //对时间段进行去重处理
    disposeTime(timeList){
      // debugger
      for(let i=0; i<this.timeList.length; i++){
        this.timeList[i].endTime -= 900000;
      }
      let tempTimelist = [];
      let tmObjective = timeList[0];
      let isUnited = false;
      if(timeList.length<=1){
        this.timeList = [].concat(timeList);
        return;
      }
      for(let i=1;i<timeList.length;i++){
        let newItem = {};
        let item = timeList[i];
        if(tmObjective.endTime >= item.startTime && item.endTime >= tmObjective.endTime){
          newItem.startTime = tmObjective.startTime;
          newItem.endTime =  item.endTime;
          if(i>0){
            tempTimelist.pop(tempTimelist[length-1]);
          }
          tempTimelist.push(newItem);
          tmObjective.startTime = newItem.startTime;
          tmObjective.endTime = newItem.endTime;
          isUnited = true;
        } else if(tmObjective.endTime >= item.startTime && item.endTime < tmObjective.endTime){
          newItem.startTime = tmObjective.startTime;
          newItem.endTime = tmObjective.endTime;
          if(i>0){
            tempTimelist.pop(tempTimelist[length-1]);
          }
          tempTimelist.push(newItem);
          tmObjective.startTime = newItem.startTime;
          newItem.endTime = tmObjective.endTime;
          isUnited = true;
        }else {
          tempTimelist.push(item);
          tmObjective.startTime = item.startTime;
          tmObjective.endTime = item.endTime;
        }
      }
      this.timeList = [].concat(tempTimelist);
      //结束时间减去15分钟预留离场时间
    },

    //车牌
  // 输入框获取焦点事件，并激活模拟键盘 测试提交信息


    // 动态遍历 phoneList
    getPhoneList() {
      // console.log(this.phoneNumber);
      let phoneNumber = this.phoneNumber.trim();
      if (phoneNumber.length > 11) {
        this.phoneNumber = phoneNumber.substr(0, 11);
      }
      if (this.phoneNumber !== null && this.phoneNumber !== "") {
        this.isclosephone = true;
      } else {
        this.isclosephone = false;
      }
      var arr = [];
      /*动态生成一个表达式*/
      var reg = new RegExp("^" + this.phoneNumber);
      // console.log(this.phoneList);
      if (this.phoneList === null) {
        return;
      } else {
        for (var i = 0; i < this.phoneList.length; i++) {
          //如果字符串中不包含目标字符会返回-1
          // console.log(this.phoneList[i].match(reg));
          if (
            this.phoneList[i].match(reg) !== null &&
            this.phoneList[i].match(reg)[0] !== ""
          ) {
            arr.push(this.phoneList[i]);
          }
        }
        this.phoneArr = arr;
      }
    },
    // 当输入验证码的时候
    inputCodeEvent(){
      let code = this.code.trim();
      if (code.length > 4) {
        this.code = code.substr(0, 4);
      }
      if(this.code === null || this.code === ''){
          this.isclosecode = false;
      }else{
          this.isclosecode = true;
      }
    },
       // 清空验证码
    closeCode(){
      this.code = null;  // 输入框的内容为空
      this.isclosecode = false;
    },
     // 关闭账户框
    closephone(){
      this.phoneNumber = null;
      this.phoneArr = null;
      this.isclosephone = false;
    },
    //用户获取验证码// 做的两件事 判断电话号码是否正取，然后短信60s倒计时
    getCode(e){
      if(this.phoneNumber === '' || this.phoneNumber === null){
          Toast("请输入正确的手机号码");
          return;
      }else if(!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.phoneNumber.trim()))){
        Toast('请输入正确的手机号码');
        return;
      }else if(this.isGettingCodes){
        return;
      }
      if(this.getCodeFlag){
        return
      }
      // 对账户信息验证完成开始倒计时，并且请求验证码
      this.timeCount();
      this.sendRanderCodes();
    },
    //短信读秒
     timeCount(){
      let seconds = 60;
      this.getCodeFlag = true;
      document.addEventListener("visibilitychange", this.documentEvent);
      this.timer = setInterval(() => {
        this.isGettingCodes = true;
        seconds--;
        if (this.pagechange) {
          seconds = seconds - this.getSecond;
        }
        this.counts = seconds + "s";
        // debugger
        if (seconds <= 0) {
          seconds = 0;
          console.log(1234);
          console.log(this.timer);
          clearInterval(this.timer);
          this.isGettingCodes = false;
          this.getCodeFlag = false;
        }
      }, 1000);
    },

    // 向用户账户（phoneNumber） 发送验证码
    async sendRanderCodes(){
      var res = await getPhoneCode(this.phoneNumber,this.anti);
      if(res.error_code === 2004){
        this.error_code = 2004;  //
        this.iscodeplugin = true;
        this.randerCodes = '';
      }else if(res.error_code === 2000){
        this.randerCodes = res.data.code;
        this.iscodeplugin = false;
      }else{
          Toast('错误码是'+res.error_message);
      }
    },
    // 添加一个浏览器页面打开的 事件
    documentEvent() {
      let vm = this;
      if (document.visibilityState == "visible") {
        let newlogin = Date.parse(new Date());
        let H5_lslogin_time = common.getStorage("H5_lslogin_time");
        console.log(newlogin - H5_lslogin_time);
        let second = newlogin - H5_lslogin_time + "";
        let getSecond = second.substring(0, second.length - 3);
        console.log(getSecond);
        this.getSecond = getSecond;
      } else {
        console.log("关闭了");
        let second = Date.parse(new Date());
        common.setStorage("H5_lslogin_time", second);
      }
    },
    dataChange(){
      for(var i=0;i<this.timeList.length;i++){
        let item = this.timeList[i];
        // debugger
        this.array = [];
        var n = (item.endTime - item.startTime) / 900000;
        if(this.nowTime > item.endTime){
            continue; // 比结束时间都还大，直接结束本次循环
        }else if(item.startTime < this.nowTime && this.nowTime < item.endTime){
          var x = null;
          var start = item.startTime;
          var arr = [];
          var temp = [];
          this.arrayflag = true;
          for(var j=0;j<=n;j++){
            arr.push(start);
            start += 900000
          }
          for(var y=0;y<arr.length;y++){
            if(this.nowTime < arr[y]){
              x = y;
              break
            }
          }
          var arrtrue = [];
          if(x !== null){
            arrtrue = arr.slice(x);
            this.array.push(arrtrue);
          }
        }else{
          // 先转换成数组
          var arr = [];
          // var start = this.allTime[i].startTime;
          var start = this.timeList[i].startTime;
          for(var j=0;j<=n;j++){
            arr.push(start);
            start += 900000;
          };
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
      // console.log(pData2arr);
      var miuntearray = this.pData2chang(pData2arr);
      console.log(hoursarray,miuntearray);
      for(var i=0;i<hoursarray.length;i++){
        pData2[hoursarray[i].value] = miuntearray[hoursarray[i].text];
      }
      this.$set(this.pickData2,'pData1',hoursarray);
      // this.pickData2.pData2 = pData2;
      this.$set(this.pickData2,'pData2',pData2);

      this.pickData2.default.push(hoursarray[0]);
      this.pickData2.default.push(pData2[hoursarray[0].value][0]);

      // 取得默认入场时间-----这里有问题
      // if(this.systemTimeFlag){
      //   this.defaultTime = this.getMyDate(this.systemTime);
      //   this.params.startTime = this.systemTime;
      //   console.log(this.defaultTime)
      // }else {
        this.defaultTime =  hoursarray[0].text.substring(0,hoursarray[0].text.length-2) +':' +  pData2[hoursarray[0].value][0].text.substring(0,pData2[hoursarray[0].value][0].text.length-2) + "前";
      // }
      // 通过时间戳差值，获取价格信息
      console.log(new Date().getTime())
      // debugger
      this.priceTime = hoursarray[0].time - new Date().getTime();
      // debugger
      this.getPrice(this.priceTime);
      // console.log(this.priceTime);
      // console.log(this.defaultTime);
      // console.log(hoursarray[0]);
      this.getDefaultTime(hoursarray[0].time);
    },
    getMyDate(mss){
      // console.log("--------------------")
      // console.log(mss)
      // var days = parseInt(mss / (1000 * 60 * 60 * 24));
      // var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      // var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
      // var seconds = (mss % (1000 * 60)) / 1000;
      var date = new Date(mss);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      console.log(new String(hours))
      if(new String(hours).length <= 1){
        hours = "0"+ hours;
      }
      if(new String(minutes).length <= 1){
        minutes = "0"+ minutes;
      }
      return hours + ":" + minutes;
    },
    // 对分钟数
    pData2chang(arr){
      var data = [];
      for(var i = 0; i < arr.length; i++) {
        if(!data[arr[i].texts]) {
          var arrs = [];
          arrs.push(arr[i]);
          data[arr[i].texts] = arrs;
        }else {
          data[arr[i].texts].push(arr[i])
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
      // this.feeList[0].finishTime = this.feeList[0].finishTime * 60000;
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
        // this.price = this.feeList[x].fee;
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
          this.$root.eventHub.$emit('refer');          this.$root.eventHub.$emit('refer');
          this.show1 = true;
          this.isshow = true;
        }
    },
    // 选择时间后的确定按钮
    confirmFn(e){
      // debugger
      // e.cancelBubble = true;
      console.log(e);
      if(this.systemTimeFlag){
        this.priceTime = this.systemTime - new Date().getTime();
      }else {
        this.priceTime = e.select2.time - new Date().getTime();
      }
      // debugger
      this.getPrice(this.priceTime);
      this.defaultTime = e.select1.text.substring(0,e.select1.text.length-2) +':'+ e.select2.text.substring(0,e.select2.text.length-2) + "前";
      this.getDefaultTime(e.select2.time);
      this.show1 = false;
      this.isshow = false;
    },
    close(e){
      this.show1 = false;
      this.isshow = false;
      // e.cancelBubble = true
    },
    async doPay(orderId){
      let url = 'apiwrite/reserve/pay';
      let couponId = null;
      let baseURL = null;
      let spbillCreateIp = null;
      let channel = 1;
      // url, orderId, channel, couponId, wapUrl, spbillCreateIp
      let res = await pay(url, orderId, channel,couponId, baseURL,spbillCreateIp);
      if(res.error_code == 2000){
          //this.$router.push('appointInfo');
          Toast({
            message:'预约成功',
            duration:1500
          })
          setTimeout(()=>{
            localStorage.setItem("routerFlag",null);
            this.$router.push('payToComplete');
          },1500);
      }else{
        Toast({
          message:res.error_message,
          duration:1500
        })
      }
    },
    //立即预约
    async goApoint(){
      // 点击立即预约的时候要做的事情是：
      // 1. 若入场车牌号填写不合法，toast提示：请输入正确的入场车牌号。
      //   若手机号码填写不合法，toast提示：请输入正确的手机号码。
      //   若手机号码已经绑定了微信用户ID，toast提示：手机号码已被占用。（后台来做）
      //   若验证码未填或填写错误，toast提示：请输入正确的验证码。
      //   若该账户有未完成订单，toast提示：您还有订单未完成。跳转到订单详情页。(后台在做)
      //   若该车牌存在未完成的订单，toast提示：该车辆已存在预约订单。 （后台）
      //   若入场时间小于当前时间，toast提示：入场时间已过，请重新选择。 （不用管）
      //   若没有空泊位，toast提示：车位已经被约满了。  （后台的）
      //   若无误，预约费为0时， toast提示：预约成功。进入【支付成功页面】，后台将此车位状态改为被预约。预约费不为0时，进入【支付】页面。后台将此车位状态改为被预约。

      //吴正增加车牌号码开始
      let indentLists = [...this.indentLists]
      let plateLists = [...this.plateLists]
      let strs = indentLists.join('') + plateLists.join('')
      this.plateNo=strs
      //吴正增加代码结束
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
        this.getparklot();
        // Toast({
        //   message: '暂无可预约车位',
        //   duration: 1500
        // })
        return;
      }
      // 开始验证
      // let plateNoReg =  /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
      let plateNoReg =  /([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})|^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
      let phoneReg = /^1(3|4|5|7|8)\d{9}$/;
      if(!plateNoReg.test(this.plateNo)){
        Toast({
          message: '请输入正确的入场车牌号。',
          duration: 1500
        })
      }else if(!phoneReg.test(this.phoneNumber)){
        Toast({
          message: '请输入正确的手机号码。',
          duration: 1500
        })
      }else if(this.code == '' || this.code == null || this.code == undefined || this.code != this.randerCodes){
        Toast({
          message: '请输入正确的验证码。',
          duration: 1500
        })
      }else if(this.pointedItem.reservableAmount == 0){
        this.messInfo();
        this.getparklot();
        // Toast({
        //   message: '车位已经被约满了。',
        //   duration: 1500
        // })
      }else{
        // console.log(1244);
        // 开始对数据进行整理
        // 参数名	必选	类型	说明
        // plateNumber	是	string	车牌号
        this.params.plateNumber = this.plateNo;
        // console.log(this.params.plateNumber);
        // phone	是	string	手机号码
        this.params.phone = this.phoneNumber;
        // console.log(this.params.phone);
        // startTime	是	long	实际预约的开始时间
        // console.log(this.params.startTime);
        // endTime	是	long	实际预约的结束时间
        // console.log(this.params.endTime);
        // shareStartTime	是	long	车位共享开始时间
        // console.log(this.params.shareStartTime);
        // shareEndTime	是	long	车位共享结束时间
        // console.log(this.params.shareEndTime);
        // totalFee	是	double	预约费  (参数变了要改一下)
        // console.log(this.price);
        this.params.totalFee = this.price;
        // parklotId	是	int
        this.params.parklotId = this.parkLotId;
        // ip	是	string	IP地址
        // console.log(localStorage.getItem('mobileId'));
        this.params.ip = localStorage.getItem('mobileId');
        // phoneModel	是	string	手机型号(注意动态的去拿，拿得到在拿，拿不到传)
        this.params.phoneModel = localStorage.getItem('phoneNum');
        // unionId	是	string	微信unionId（动态的去拿的）
        this.params.unionId = localStorage.getItem('unionId');
        // openId	是	string	微信openId （动态的去拿的）
        this.params.openId = localStorage.getItem('openId');
        // jpushId	是	黄金芽要求
        this.params.jpushId = "H5";
        // timestamp	是	string	时间戳  时间戳
//        alert(JSON.stringify(this.params))
        this.params.timestamp = +new Date();
        let res = await saveUserBind(this.params);
        // alert(JSON.stringify(this.params));
        if(res.error_code == 2000){
          // debugger
          let orderId = res.data.orderId;   //订单号
          let totalFee = res.data.totalFee; //预约费用
          localStorage.setItem('orderId',orderId);
          localStorage.setItem('userId',res.data.userId);
          localStorage.setItem('H5_fees',res.data.totalFee);  //保存的支付金额

          if(res.data.orderState && res.data.orderState != null){

            if(res.data.orderState == 1300 || res.data.orderState == 1301 || res.data.orderState == "1300" || res.data.orderState == "1301"){
            Toast({
              message:'您还有订单未完成',
              duration:1500
            })
              this.$router.push('reservationInfo');
            }else if(res.data.orderState == 1302){
              this.$router.push('reservationPaking');
            }else {
              Indicator.close();
              Toast({
                message:'该车辆已存在预约订单',
                duration:1500
              })
            }
            return;
          }
          if(totalFee == 0){   //totalFee
            this.doPay(orderId);
          }else{
            localStorage.setItem("routerFlag",null);
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
        else if(res.error_code === 2905){
          this.messInfo();
          return;
        }else if(res.error_code === 2904){  //车牌号被重复预约
          Indicator.close();
          Toast({
            message:'该车辆已存在预约订单',
            duration:1500
          })
          return;
        }else if(res.error_code === 2900){
          Indicator.close();
          Toast({
            message:'你还有订单未完成',
            duration:1500
          })
        }else if(res.error_code == 2906){
          Toast({
            message:'您暂无预约资格，请联系物业管理员',
            duration:1500
          })
        }else if(res.error_code === 2325){
          Indicator.close();
          Toast({
            message:'管理员不能预约车位',
            duration:1500
          })
        }else{
          Toast({
            message:res.error_message,
            duration:1500
          })
        }

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
  created () {
    // debugger
    this.parkLotId = Number(JSON.parse(localStorage.getItem('myParklotId')));
    //安全验证隐藏
    this.$root.eventHub.$on('hide-savety-confirm',()=>{
      this.savetyConfirmShowed = false;
    });
  },
  deactivated() {
    // 清空定时器， 后台运行的状态 后台运行的秒数 缓存的秒数时间 页面监听的事件
    clearInterval(this.timer);
    this.pagechange = false;
    this.getSecond = null;
    common.setStorage("H5_lslogin_time");
    document.removeEventListener("visibilitychange", this.documentEvent);
  },
  activated () {
    // window.addEventListener("offline", function () {
    //   Toast({
    //     message:'当前网络无连接',
    //     duration:1500
    //   })
    // }, true);
    window.addEventListener("online", function () {
      Toast({
        message:'当前网络连接正常',
        position: 'bottom',
        duration:1500
      })
      Indicator.close();
    }, true);
    window.addEventListener("offline", function () {
      Toast({
        message:'当前网络无连接',
        position: 'bottom',
        duration:2000
      })
      Indicator.close();
      return false;
    }, true);
    this.timeToget();
    this.getparklot();
    this.plateNum = '';
    this.proInfo = '粤';
    this.iniInfo = 'B';
    //清除获取验证码
    this.code = '';
    this.isGettingCodes = false;
    if(this.timer){
       clearInterval(this.timer);
       this.isGettingCodes = false;
    };
    this.phoneList = localStorage.getItem('Phone_List');
    if(localStorage.getItem('Phone_List') !== null){
      this.phoneList = localStorage.getItem('Phone_List').split(',');
    }
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
    top 0
    bottom 3.5rem
    overflow hidden
    .textInfo
      color #999999
      margin-top 0.25rem
      font-size 0.8rem
      padding-left 0.9375rem
      padding-bottom    .5rem
    .info
      padding-left 0.9375rem
      padding-right 0.9375rem
      border-bottom 0.0625rem  solid #E6E6E6
      border-top 0.0625rem solid #E6E6E6
      background-color #FFF

      .car-bottom
        padding-bottom 0.5625rem
    .car-info
      padding-top 0.9375rem
      padding-bottom 1.375rem
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
        padding 0.1125rem  0.2125rem
        text-align center
        border-radius 10%
    .text-plate
      line-height 1.25rem
      margin-top  0.5625rem
      padding-top .9275rem
      padding-bottom 0.5625rem
      background-color #fff
      border-bottom 0
      .car-distance
        // margin-top 0.55rem
      .selct-plate
        background-color #ffffff
        // padding 1.125rem 2rem
        .plate-h
          width 5.625rem
          height 1.25rem
          line-height 1.25rem
          color #191919
          font-size .875rem
          font-weight bolder
          span
            width .75rem
            height .5rem
            left 2rem
            top 55%
            transform translateY(-44%)
            bg-img('../../assets/img/parting_car_down')
        .plate-b
          input
            display inline-block
            height 1.25rem
            line-height 1.25rem
            max-width  80%
            color #999
            border none
            outline none
            font-size .875rem
    .input-style
      width 2.125rem
      height 2.125rem
      padding-left .5rem
      color #D01D95
    .input-style2
      width 2.125rem
      height 2.125rem
      padding-left .6rem
      color #D01D95
    .plate-input
      height 2.5rem
      line-height 2.5rem
      color #999
      border none
      outline none
      font-size .875rem
      vertical-align middle
    .text-distance
      font-size 0.875rem
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
        font-size 0.9375rem
        padding-left 15px
        font-weight 700
        color #1a1a1a
    .textMin
        font-size 0.9375rem
        font-weight 500
        color #000
    .toll-rules
      margin-top  0.5625rem
      padding-top .9275rem
      .text-distance
        font-size .75rem
    .text-plate-info
      font-size 0.9375rem
      line-height 2.3125rem
      color #999
      margin-top 0.9275rem
      padding-left 0.9375rem
    .plate-number
      box-sizing border-box
      margin-top 0.5625rem
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
      // margin-top 0.5625rem
      height 3.625rem
      display flex
      justify-content space-between
      align-items center
      border-top 0
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
      color #999999
      font-size 0.9rem
      .redNumber
        color rgb(208, 29, 149)
        font-size 1.2rem
        padding-right 0.8rem
    .dis-inline
      display inline
      .black-location
        float right
        color #9a9a9a
      .plate-info
        font-size .75rem
        color #9a9a9a
        border none
        out-line none
        text-align right
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
      width 62.66666%
      background-color #fff
      color #646464
      font-size 0.75rem
      text-align left
      padding-left: 0.9375rem
      height 100%
    .ds-2
      width 37.33333%
      height 100%
    .price-style
      font-size 1.4rem
.test-input
  border:4px solid #E6E6E6
  border 0
  border-radius :1.5rem
  height:2.8rem
  padding-left:3rem
  margin-top 0.2rem
  margin-bottom 0.2rem
.p-r
  .phone
    min-width: 85%
    margin-top 0.6rem
  .imgsrc
    width: 0.866667rem
    height: 0.866667rem
    vertical-align: middle
  .alert-phone
    background-color: #fff
    z-index: 10
    position: absolute
    border: 0.053333rem solid #e6e6e6
    box-shadow: 5px 2px 6px #e6e6e6
    color: #333
    li
      margin: 10px 80px 10px 10px
  input
    display :inline-block
    height:50%
    max-width :40%
    font-size 0.9rem
    line-height :50%
    border :none
    outline :none
    color:#333
  input::-webkit-input-placeholder
    font-size: 1rem
    padding-top .6rem
  .input-ic
    width :1.1rem
    height 1.2rem
    left:1.4rem
    top:50%
    transform:translateY(-50%)
  .phone-ic
    bg-img('../../assets/img/login_user')
  .code-ic
    bg-img('../../assets/img/login_phone')
    width: .8rem;
    left: 1.5rem;
  .code-plugin
    position: absolute
    display: inline-block
    top: 55%
    transform :translateY(-50%)
    right: .8rem
  .get-code-btn
    height 1.56rem
    line-height :1.56rem
    font-size .875rem
    color :#D01D95
    top 50%
    transform :translateY(-50%)
    min-width :30%
    right:.5rem
.code
  input
    color :#D01D95
    margin-top 0.6rem
.input-wrap
  display flex
  width 25rem
  height 3.8rem
  background-color #ffffff
  padding 0.7rem 0 0.7rem 0.5rem
  .input-case
    margin-left 0.5rem
    width 2.4rem
    height 2.4rem
    border 0.0625rem solid #cccccc
    border-radius 0.2rem
    text-align center
    line-height calc(2.4rem - 2px)
    font-size 1.1rem
  .input-letter
    margin-left 0.8rem
    width 16rem
    height 2.4rem
    padding 0.6rem 0
    font-size 1rem
    color #cccccc
    .letter-item
      display block
      float left
      width 1.2rem
      height 1.2rem
      line-height 1.2rem
      text-align right
    .letteractive
      border-left 1px solid #d01c95
.active
 color  #1a1a1a!important
.caseactive
  color  #d01c95!important
.plate-title
  font-size 0.9rem
  color #999999
</style>


