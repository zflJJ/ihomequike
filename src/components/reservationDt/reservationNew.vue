<template>
  <div id="appoint" @click="hiddenJp($event)">
    <div class="content p-a" ref="apponitBox" @click="isHideen">
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
              <input class="phone" v-model="phoneNumber" type="number" placeholder="请输入手机号码" maxlength="11" @input="getPhoneList" style="marging-top:0.75rem" ref="scrollPhone">
              <!--这里需要有一个两倍图 和 3倍图  需要对类名做判断-->
              <template v-if="phoneNumber.length">
                <img srcset="../../assets/img/btn_close@2x.png 2x, ../../assets/img/btn_close@3x.png 3x" alt="" class="imgsrc" @click="clearNumber(1)">
              </template>
            </div>
            <div class="code test-input p-r">
              <span class="code-ic input-ic p-a"></span>
              <input class="code" type="number" v-model="code" placeholder="请输入验证码" @input="inputCodeEvent" maxlength="4" style="marging-top:0.9rem" ref="scrollCode">

              <!--这里需要一个2倍图 和 3 倍图-->
              <template v-if="code.length">
                <img srcset="../../assets/img/btn_close@2x.png 2x, ../../assets/img/btn_close@3x.png 3x" alt="" class="imgsrc" @click="clearNumber(2)">
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
    <div class="to-appoint t-c" ref='hiddenBtn'>
      <div class="div-flex">
        <div class="div-style ds-1">
          预约费&nbsp;
          <span style="color: #f63372">￥
            <span class="price-style">{{price}}</span>
          </span>
        </div>
        <div @click="goApoint" class="div-style ds-2">立即预约</div>
      </div>
    </div>
    <!-- 时间 -->
    <div :class="{alert: isshow}" @click="closeZinde"></div>
    <vue-pickers :show="show1" :selectData="pickData2" v-on:cancel="close" v-on:confirm="confirmFn">
    </vue-pickers>
    <!-- 车牌 -->
    <transition :name="show?'slideUp':'slideDown'">
      <key-board @getinput='getkeyboard' @hiden='hideKey' :showflag='KeyBoardflag' v-show="show"></key-board>
    </transition>
  </div>
</template>
<script>
import { formatTimeStamp } from '../../common/js/H5plugin'
import { saveUserBind, pay,postParklot,getPhoneCode } from '../../server/getData'
import { Toast, Indicator,MessageBox } from 'mint-ui'
import BScroll from 'better-scroll'
import VuePickers from 'vue-pickers'
import KeyBoard from '../commonComponents/keyboard.vue'
import common from '../../common/js/common'
import { filterTime,disposeTime,dataChange } from '../../common/js/time'
export default {
  data() {
    return {
      plateNo: '', //车牌号
      show1: false,
      isshow: false,
      plateNum: '', //填入的车牌号
      plateShowed: false, //是否显示了车牌选择组件
      proInfo: '粤', //省份
      iniInfo: 'B', //车牌号位

      phoneNumber: '', //用户输入的手机号
      code: '', //用户输入的验证码
      randerCodes: '', //系统随机生成的六位验证码

      isGettingCodes: false, //是否正在获取验证码状态
      pointedItem: {}, //停车场接口获取信息返回 | enter
      
      /*--新的东西*/
      parkLotId: null, // 表示传递过来的车场的ID

      reserveTimeList: [],  // 可预约的时段
      feeList: [], // 预约时段的金额

      pickData2: {
        columns: 2, // 两列
        link: true, // 联级必须需要link 参数
        default: [
          // 默认显示那个字段
        ],
        // 第一列数据结构
        pData1: [],
        // 第二列数据结构
        pData2: {}
      },
      nowTime: null,
      defaultTime: '00:00', // 默认时间

      leaveTime: null,  // 要在页面显示的离开时间
      priceTime: null, // 预约时间 -  当前系统时间 = 时间戳差值
      price: 0, //价格信息

      params: {
        plateNumber: null, // 车牌号
        phone: null, //手机号
        startTime: null, // 用户选择的时间戳
        endTime: null, // 用户选择的结束时间戳
        shareStartTime: null, // 共享开始时间戳
        shareEndTime: null, // 共享结束时间戳
        totalFee: null, //预约费
        parklotId: null, // 车场ID
        ip: null, // 用户IP
        phoneModel: null, //手机型号
        unionId: null, //
        openId: null,
        timestamp: null, //时间戳
        userId: null // 用户ID
      },
      counts: 60, // 定时器倒计时
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
  computed: {
    getCodeInfo() {
      return this.isGettingCodes ? this.counts + 's' : '获取验证码'
    },
  },
  components: {
    VuePickers,
    KeyBoard
  },
  methods: {
    hiddenJp(e) {
      if (e.target.getAttribute('showflg') == '1') {
        return
      } else {
        this.show = false
      }
    },
    handleInput() {
      let _this = this
      let nowHeight = document.documentElement.clientHeight
      if (nowHeight < _this.windowHeight) {
        _this.$refs.hiddenBtn.style.display = 'none'
        _this.scrollPhone()
      } else {
        _this.$refs.hiddenBtn.style.display = 'block'
      }
    },
    scrollPhone(){
      this.leftScroll.refresh()
      let el=this.$refs.scrollCode
      this.leftScroll.scrollBy(0, -100);
    },
    getkeyboard(msg) {
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
    hideKey() {
      this.show = false
    },
    showKey() {
      this.KeyBoardflag = 0
      this.show = true
      this.isPlateFlag = true
      this.cursorFlag = true
      this.currentIndentIndex = null
    },
    inputPlate(msg) {
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
    delPlate(mag) {
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
    inputIndent(msg) {
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
    changeInput(e) {
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
    isHideen() {
      this.$root.eventHub.$emit('showK', null)
    },
    // 阻止事件的行为
    closeZinde() {
      this.isshow = false
      this.show1 = false
    },
    //添加屏幕滚动事件
    _initScroll() {
      this.$nextTick(() => {
        //左边滑动选择
        if (!this.leftScroll) {
          this.leftScroll = new BScroll(this.$refs.apponitBox, {
            probeType: 3,
            scrollY: true,
            click: true
          })
        } else {
          this.leftScroll.refresh()
        }
      })
    },
    //获取预约接口信息
    async getparklot() {
      let userId = null
      this.reserveTimeList = []
      let res = await postParklot(userId, this.parkLotId)
      if (res.error_code === 2000) {
        this.pointedItem = res.data
        // 预约费用
        this.feeList = this.pointedItem.feeList
        // 预约的时间
        this.reserveTimeList = this.pointedItem.reserveTimeList
        if (!this.reserveTimeList.length) {
          this.messInfo()
        } else {
          let timeList = filterTime(this.pointedItem.reserveTimeList,this.nowTime)
          let distimelist = disposeTime(timeList)
          let dataTimes = dataChange(distimelist,this.nowTime);
          this.$set(this.pickData2, 'pData1', dataTimes.pData1)
          this.$set(this.pickData2, 'pData2', dataTimes.pData2)
          this.$set(this.pickData2, 'default', dataTimes.default)
          this.defaultTime = dataTimes.defaultTime
          // 获取价格  和 默认离场时间
          this.getPrice(dataTimes.priceTime)
          this.getDefaultTime( dataTimes.pData1[0].time)
        }
        this._initScroll()
      } else {
        Toast({
          message: '获取预约信息失败',
          duration: 1500
        })
      }
    },
    // 提示用户，支付超时，跳转 到预约界面
    messInfo() {
      let htmls = `
                      <div class="appointmessage-info">
                        <div class="is-text">车位已经被预约满了。</div>
                      </div>`
      MessageBox({
        title: '温馨提示',
        message: htmls,
        showConfirmButton: true,
        confirmButtonText: '确认',
        showCancelButton: false
      })
        .then(action => {
          Indicator.open()
          setTimeout(() => {
            Indicator.close()
            this.getparklot()
          }, 10000)
        })
        .catch(err => {})
    },
    
    // 动态遍历 phoneList
    getPhoneList() {
      let phoneNumber = this.phoneNumber.trim()
      if (phoneNumber.length > 11) {
        this.phoneNumber = phoneNumber.substr(0, 11)
      }
    },
    // 当输入验证码的时候
    inputCodeEvent() {
      let code = this.code.trim()
      if (code.length > 4) {
        this.code = code.substr(0, 4)
      }
    },
    // 清空input 输入框
    clearNumber(num){
      if(num === 1){
        this.phoneNumber = ''
      }else{
        this.code = ''
      }
    },
    //用户获取验证码// 做的两件事 判断电话号码是否正取，然后短信60s倒计时
    getCode(e) {
      if (this.phoneNumber === '' || this.phoneNumber === null) {
        Toast('请输入正确的手机号码')
        return
      } else if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.phoneNumber.trim())) {
        Toast('请输入正确的手机号码')
        return
      } else if (this.isGettingCodes) {
        return
      }
      this.isGettingCodes = true
      // 对账户信息验证完成开始倒计时，并且请求验证码
      this.timeCount()
      this.sendRanderCodes()
    },
    //短信读秒
    timeCount() {
      if(this.timer){
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.counts--
        if (this.counts <= 0) {
          this.counts = 60;
          clearInterval(this.timer)
          this.isGettingCodes = false
        }
      }, 1000)
    },

    // 向用户账户（phoneNumber） 发送验证码
    async sendRanderCodes() {
      var res = await getPhoneCode(this.phoneNumber, 1)
      this.randerCodes = ''
      if (res.error_code === 2000) {
        this.randerCodes = res.data.code
      } else {
        Toast(res.error_message)
      }
    },
    // 添加一个浏览器页面打开的 事件
    documentEvent() {
      let vm = this
      if (document.visibilityState == 'visible') {
        let newlogin = Date.parse(new Date())
        let secode = Math.floor((newlogin - this.hiddenTime) / 1000)
        console.log(secode)
        if(this.counts - secode <= 0){
          clearInterval(this.timer)
          this.isGettingCodes = false
          this.counts = 60
        }else {
          this.counts = this.counts - secode
          this.timeCount()
        }
      } else {
        this.hiddenTime =Date.parse(new Date())
      }
    },
    // 默认的离场时间
    getDefaultTime(time) {
      // debugger
      var timetap = time
      var x = null
      let numLeaveTime = []
      // 筛出离场时间
      for (var i = 0; i < this.reserveTimeList.length; i++) {
        if (
          this.reserveTimeList[i].startTime <= timetap &&
          timetap <= this.reserveTimeList[i].endTime - 900000
        ) {
          numLeaveTime.push({
            learve: this.reserveTimeList[i],
            times: this.reserveTimeList[i].endTime - timetap
          })
        }
      }
      if (numLeaveTime.length === 1) {
        this.params.shareStartTime = numLeaveTime[0].learve.startTime
        this.params.shareEndTime = this.params.endTime = numLeaveTime[0].learve.endTime
        this.params.startTime = timetap
        var leaveTime = formatTimeStamp(numLeaveTime[0].learve.endTime)
        var leaveMonth = leaveTime.substr(5, 2)
        var leaveDay = leaveTime.substr(8, 2)
        var leaveMiunte = leaveTime.substr(14, 2)
        var leaveHours = leaveTime.substr(11, 2)
        this.leaveTime = this.leaveTime =  leaveMonth +'月' +  leaveDay + '日' + leaveHours + '时' + leaveMiunte + '分'
      } else {
        var max = numLeaveTime[0].times
        var len = numLeaveTime.length
        let obj = numLeaveTime[0]
        for (var i = 1; i < len; i++) {
          if (numLeaveTime[i].times > max) {
            max = numLeaveTime[i].times
            obj = numLeaveTime[i]
          }
        }
        var leaveTime = formatTimeStamp(obj.learve.endTime)
        var leaveMonth = leaveTime.substr(5, 2)
        var leaveDay = leaveTime.substr(8, 2)
        var leaveMiunte = leaveTime.substr(14, 2)
        var leaveHours = leaveTime.substr(11, 2)
        this.leaveTime =  leaveMonth +'月' +  leaveDay + '日' + leaveHours + '时' + leaveMiunte + '分'
        this.params.shareStartTime = obj.learve.startTime
        this.params.shareEndTime = this.params.endTime = obj.learve.endTime
        this.params.startTime = timetap
      }
    },

    // 获取价格信息
    getPrice(priceTime) {
      var x = null
      let miunte = parseInt(priceTime / 60000)
      for (var i = 0; i < this.feeList.length; i++) {
        if (miunte <= this.feeList[i].finishTime) {
          x = i
          break
        } else {
          continue
        }
      }
      if (i === this.feeList.length) {
        x = i - 1
      }
      if (this.feeList[x]) {
        this.price = (
          this.feeList[x].fee * this.pointedItem.integralPermissionsCoefficient
        ).toFixed(2)
      }
    },
    // 选择入场时间段
    openPicker() {
      this.$root.eventHub.$emit('init')
      if (this.reserveTimeList.length === 0) {
        Toast({
          message: '没有预约的时间段',
          duration: 1500
        })
        return
      } else {
        this.$root.eventHub.$emit('refer')
        this.$root.eventHub.$emit('refer')
        this.show1 = true
        this.isshow = true
      }
    },
    // 选择时间后的确定按钮
    confirmFn(e) {
      this.priceTime = e.select2.time - new Date().getTime()
      this.getPrice(this.priceTime)
      this.defaultTime =
        e.select1.text.substring(0, e.select1.text.length - 2) +
        ':' +
        e.select2.text.substring(0, e.select2.text.length - 2) +
        '前'
      this.getDefaultTime(e.select2.time)
      this.show1 = false
      this.isshow = false
    },
    close(e) {
      this.show1 = false
      this.isshow = false
    },
    async doPay(orderId) {
      let url = 'apiwrite/reserve/pay'
      let couponId = null
      let baseURL = null
      let spbillCreateIp = null
      let channel = 1
      let res = await pay(
        url,
        orderId,
        channel,
        couponId,
        baseURL,
        spbillCreateIp
      )
      if (res.error_code == 2000) {
        Toast({
          message: '预约成功',
          duration: 1500
        })
        setTimeout(() => {
          this.clickFlag = true
          this.$router.push('payToComplete')
        }, 1500)
      } else {
         this.clickFlag = true
        Toast({
          message: res.error_message,
          duration: 1500
        })
      }
    },
    //立即预约
    async goApoint() {
      if(!this.clickFlag){
        return;
      }
      this.clickFlag = false
      let indentLists = [...this.indentLists]
      let plateLists = [...this.plateLists]
      let strs = indentLists.join('') + plateLists.join('')
      this.plateNo = strs
      //吴正增加代码结束
      if (!this.plateNo || this.plateNo == '') {
        Toast({
          message: '请选择您的车牌号',
          duration: 1500
        })
        this.clickFlag = true
        return
      }
      //无车位的情况
      if (!this.timeList.length) {
        this.messInfo()
        this.getparklot()
        this.clickFlag = true
        return
      }
      let plateNoReg = /([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})|^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
      let phoneReg = /^1(3|4|5|7|8)\d{9}$/
      if (!plateNoReg.test(this.plateNo)) {
        Toast({
          message: '请输入正确的入场车牌号。',
          duration: 1500
        })
        this.clickFlag = true
      } else if (!phoneReg.test(this.phoneNumber)) {
        Toast({
          message: '请输入正确的手机号码。',
          duration: 1500
        })
        this.clickFlag = true
      } else if (!this.code || this.code != this.randerCodes) {
        Toast({
          message: '请输入正确的验证码。',
          duration: 1500
        })
        this.clickFlag = true
      } else if (this.pointedItem.reservableAmount == 0) {
        this.messInfo()
        this.getparklot()
        this.clickFlag = true
      } else {
        // "startTime":15000000,
        // "endTime":160000000,
        // "shareStartTime":120000000,
        // "shareEndTime":1600000000,

        this.params.plateNumber = this.plateNo
        this.params.phone = this.phoneNumber
        this.params.totalFee = this.price
        this.params.parklotId = this.parkLotId

        this.params.ip = localStorage.getItem('mobileId')
        this.params.phoneModel = localStorage.getItem('phoneNum')
        this.params.unionId = localStorage.getItem('unionId')
        this.params.openId = localStorage.getItem('openId')
        this.params.jpushId = 'H5'
        this.params.timestamp = +new Date()

        let res = await saveUserBind(this.params)
        if (res.error_code == 2000) {
          let orderId = res.data.orderId //订单号
          let totalFee = res.data.totalFee //预约费用
          localStorage.setItem('orderId', orderId)   // 订单号
          localStorage.setItem('userId', res.data.userId)  //userId
          localStorage.setItem('H5_fees', res.data.totalFee) //保存的支付金额
          localStorage.setItem('routerFlag', null)
          this.routerPage()
          if (res.data.orderState) {
            if (res.data.orderState == 1301) {
              let toastNum = Toast({
                message: '您还有订单未完成',
                duration: 1500
              })
              let timeOutId = setTimeout(() => {
                clearTimeout(timeOutId);
                toastNum.close();
                this.clickFlag = true
                this.$router.push('reservationInfo')
              }, 1500);
            } else if (res.data.orderState == 1302 || res.data.orderState == 1303) {
              let toastNum = Toast({
                message: '您还有订单未完成',
                duration: 1500
              })
              let timeOutId = setTimeout(() => {
                clearTimeout(timeOutId);
                toastNum.close();
                this.clickFlag = true
                this.$router.push('reservationPaking')
              }, 1500);
            } else if(res.data.orderState == 1300){
               let toastNum = Toast({
                message: '您还有订单未完成',
                duration: 1500
              })
              let timeOutId = setTimeout(() => {
                clearTimeout(timeOutId);
                toastNum.close();
                this.clickFlag = true
                this.$router.push('reservationBookingUnpaid');
              }, 1500);
            }else {
              this.clickFlag = true
              Indicator.close()
              Toast({
                message: '该车辆已存在预约订单',
                duration: 1500
              })
            }
            return
          }
          if (res.data.totalFee == 0) {
            this.doPay(res.data.orderId)
          } else {
            this.clickFlag = true
            this.$router.push('payMentDt')
          }
        } else if (res.error_code === 2905) {
          //如果金额存在 跳转到支付界面去， 不存在 或者为0 先调起预约支付接口
          this.messInfo()
          return
        } else if (res.error_code === 2904) {
          //车牌号被重复预约
          Indicator.close()
          Toast({
            message: '该车辆已存在预约订单',
            duration: 1500
          })
          this.clickFlag = true
          return
        }  else if (res.error_code == 2906) {
          Toast({
            message: '您暂无预约资格，请联系物业管理员',
            duration: 1500
          })
          this.clickFlag = true
        } else if (res.error_code === 2325) {
          Indicator.close()
          Toast({
            message: '管理员不能预约车位',
            duration: 1500
          })
          this.clickFlag = ture
        } else {
          Toast({
            message: res.error_message,
            duration: 1500
          })
          this.clickFlag = true
        }
      }
    },
    routerPage(orderState){
       this.clickFlag = true
       let title = null;
       switch(orderState){
         case 1301:
          let toastNum = Toast({message: '您还有订单未完成', duration: 1500})
          let timeOutId = setTimeout(() => {
              clearTimeout(timeOutId);
              toastNum.close();
              this.clickFlag = true
              this.$router.push('reservationInfo')
          }, 1500);
       }
    },
    // 对拿到的当前系统时间做处理
    timeToget() {
      var time = Number(new Date().getTime()) + 900000
      this.nowTime = time
    }
  },
   activated() {
     // 获取车场ID
    // this.parkLotId = localStorage.getItem('myParklotId')
    document.addEventListener('visibilitychange', this.documentEvent,false)
    this.clickFlag = true;
    window.addEventListener(
      'online',
      function() {
        Toast({
          message: '当前网络连接正常',
          position: 'bottom',
          duration: 1500
        })
        Indicator.close()
      },
      true
    )
    window.addEventListener(
      'offline',
      function() {
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
    this.timeToget()
    this.getparklot()
    this.plateNum = ''
    this.proInfo = '粤'
    this.iniInfo = 'B'
    //清除获取验证码
    this.code = ''
    this.isGettingCodes = false
    //安卓手机修改
    let _this = this
    _this.windowHeight = document.documentElement.clientHeight
    window.addEventListener('resize', _this.handleInput, false)
  },
  deactivated() {
    // 清空定时器， 后台运行的状态 后台运行的秒数 缓存的秒数时间 页面监听的事件
    clearInterval(this.timer)
    common.setStorage('H5_lslogin_time')
    document.removeEventListener('visibilitychange', this.documentEvent,false)
  },
 
  // 退出组件时， 清空缓存
  deactivated() {
    // debugger
    this.$destroy(true)
    window.removeEventListener('resize', _this.handleInput, false)
  },
  beforeRouteLeave(to, from, next) {
    // 这里将MessageBox进行关闭的操作
    this.plateNo = ''
    MessageBox.close(false)
    next()
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
    top 0
    bottom 0
    overflow hidden
    .textInfo
      color #999999
      margin-top 0.25rem
      font-size 0.8rem
      padding-left 0.9375rem
      padding-bottom 0.5rem
    .info
      padding-left 0.9375rem
      padding-right 0.9375rem
      border-bottom 0.0625rem solid #E6E6E6
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
        font-size 0.9375rem
        color #9a9a9a
        font-weight 700
        margin-right 0.5625rem
      .cars-color
        line-height 1.875rem
        font-size 0.625rem
        color #fff
        background-color #f7bc41
        padding 0.1125rem 0.2125rem
        text-align center
        border-radius 10%
    .text-plate
      line-height 1.25rem
      margin-top 0.5625rem
      padding-top 0.9275rem
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
          font-size 0.875rem
          font-weight bolder
          span
            width 0.75rem
            height 0.5rem
            left 2rem
            top 55%
            transform translateY(-44%)
            bg-img('../../assets/img/parting_car_down')
        .plate-b
          input
            display inline-block
            height 1.25rem
            line-height 1.25rem
            max-width 80%
            color #999
            border none
            outline none
            font-size 0.875rem
    .input-style
      width 2.125rem
      height 2.125rem
      padding-left 0.5rem
      color #D01D95
    .input-style2
      width 2.125rem
      height 2.125rem
      padding-left 0.6rem
      color #D01D95
    .plate-input
      height 2.5rem
      line-height 2.5rem
      color #999
      border none
      outline none
      font-size 0.875rem
      vertical-align middle
    .text-distance
      font-size 0.875rem
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
      font-size 0.9375rem
      padding-left 15px
      font-weight 700
      color #1a1a1a
    .textMin
      font-size 0.9375rem
      font-weight 500
      color #000
    .toll-rules
      margin-top 0.5625rem
      padding-top 0.9275rem
      .text-distance
        font-size 0.75rem
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
      /* .plate */
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
        font-size 0.75rem
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
      padding-left 0.9375rem
      height 100%
    .ds-2
      width 37.33333%
      height 100%
    .price-style
      font-size 1.4rem
.test-input
  border 4px solid #E6E6E6
  border 0
  border-radius 1.5rem
  height 2.8rem
  padding-left 3rem
  margin-top 0.2rem
  margin-bottom 0.2rem
.p-r
  .phone
    min-width 85%
    margin-top 0.6rem
  .imgsrc
    width 0.866667rem
    height 0.866667rem
    vertical-align middle
  .alert-phone
    background-color #fff
    z-index 10
    position absolute
    border 0.053333rem solid #e6e6e6
    box-shadow 5px 2px 6px #e6e6e6
    color #333
    li
      margin 10px 80px 10px 10px
  input
    display inline-block
    height 50%
    max-width 40%
    font-size 0.9rem
    line-height 50%
    border none
    outline none
    color #333
  input::-webkit-input-placeholder
    font-size 1rem
    padding-top 0.6rem
  .input-ic
    width 1.1rem
    height 1.2rem
    left 1.4rem
    top 50%
    transform translateY(-50%)
  .phone-ic
    bg-img('../../assets/img/login_user')
  .code-ic
    bg-img('../../assets/img/login_phone')
    width 0.8rem
    left 1.5rem
  .code-plugin
    position absolute
    display inline-block
    top 55%
    transform translateY(-50%)
    right 0.8rem
  .get-code-btn
    height 1.56rem
    line-height 1.56rem
    font-size 0.875rem
    color #D01D95
    top 50%
    transform translateY(-50%)
    min-width 30%
    right 0.5rem
.code
  input
    color #D01D95
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
  color #1a1a1a !important
.caseactive
  color #d01c95 !important
.plate-title
  font-size 0.9rem
  color #999999
</style>


