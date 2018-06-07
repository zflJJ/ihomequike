<template>
  <div id="add-car">
    <div class="content p-a">
      <div class="warn">请输入真实有效的车牌号码</div>

     <!--增加键盘输入框开始-->
        <div class="input-wrap">
          <div :class="['input-case',{caseactive:currentIndentIndex==inde}]" v-for='(item,inde) in indentLists' :key="inde" @click="changeInput($event)" :inde='inde'>{{item}}</div>
          <div :class="['input-letter',{active:currentPlateIndex>0}]" @click='showKey'>
           <span :class="['letter-item',{letteractive:currentPlateIndex==inde&&cursorFlag}]" v-for='(item,inde) in plateLists' :key="inde">{{item}}</span>
        </div>
       </div>
        <!--增加键盘输入框结束-->



      <div  class="add-btn">
        <div class="add-btn-style" @click="addPlate">确定</div>
      </div>
    </div>
    <transition :name="show?'slideUp':'slideDown'">
      <key-board @getinput='getkeyboard' @hiden='hideKey' :showflag='KeyBoardflag' v-show="show"></key-board>
    </transition>   
    <!-- <choose-plate :plateShowed="plateShowed"></choose-plate> -->
  </div>
</template>
<script>
import choosePlate from '../commonComponents/choosePlate';
import {addMyCars} from '../../server/getData';
import {Toast} from 'mint-ui';
import KeyBoard from '../commonComponents/keyboard.vue'
let reg = /([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/
export default {
  name:'addCar',
  data () {
    return {
      plateNum:'',   //填入的车牌号
      plateShowed:false,   //是否显示了车牌选择组件
      proInfo:'粤',  //省份
      iniInfo:'B',     //车牌号位
      cletoast:null,
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
  components: {
    KeyBoard
  },
  methods: {
    // 输入框获取焦点事件，并激活模拟键盘 测试提交信息
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
    async addCar(plate){
      var userId = localStorage.getItem('userId');
      let res = await addMyCars(userId,plate);
      this.clickFlag=true
      if(res.error_code === 2000){
        this.$router.push({
          path:'/licensePlate'
        });
      }else if(res.error_code === 2500){
         Toast('车牌号码已存在');
      }else{
         console.log('错误码是：'+res.error_code);
      }
    },
    //点击添加车辆提交
    addPlate(){
      let _this = this
      let indentLists = [..._this.indentLists]
      let plateLists = [..._this.plateLists]
      let strs = indentLists.join('') + plateLists.join('')
      _this.show = false
      if (_this.clickFlag) {
        _this.clickFlag = false // 控制用户的点击
        if (strs.length < 7) {
          Toast({
            message: '请输入正确的入场车牌号',
            position: 'bottom',
            duration: 1500
          })
          _this.clickFlag = true
        } else if (!reg.test(strs)) {
          Toast({
            message: '请输入正确的入场车牌号',
            position: 'bottom',
            duration: 1500
          })
          _this.clickFlag = true
        } else {
          _this.addCar(strs)
        }
      }
    }
  },
  created () {
    
  },
  activated(){
      this.plateNum = '';
      this.proInfo = '粤';
      this.iniInfo = 'B';
  }
}
</script>
<style lang="stylus">
@import '../../common/css/base.stylus'
@import '../../common/css/mixin.stylus'
#add-car
  background-color #F5F5F5
  width 100%
  position fixed
  top 0
  bottom 0
  .content
    width 100%
    top 0
    .warn
      padding 1rem 1rem
      font-size .875rem
      color #999
    .selct-plate
      background-color #ffffff
      padding 1.125rem 2rem
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
  .plate-input
    /*display inline-block*/
    height 2.5rem
    line-height 2.5rem
     /* max-width  80% */
    color #999
    border none
    outline none
    font-size .875rem
    vertical-align middle
  .add-btn
    width 100%
    height 2.7rem
    line-height 2.7rem
    color #ffffff
    font-size 1rem
    margin-top 2.5rem
    display flex
    justify-content center
    .add-btn-style
      width 13.1rem
      height 100%
      text-align center
      border-radius 2.7rem
      background url("../../assets/img/Background@3x.png") no-repeat
      background-size cover
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
</style>
