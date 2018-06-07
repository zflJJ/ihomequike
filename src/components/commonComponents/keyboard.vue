<template>
    <div id='keyboard' ref='keyboard'>
      <div class="keyboard-head">
        <span @click="hideKeyboard">确定</span>
      </div>
      <div class="keyboard-lists">
        <div class="keyboard-item" v-for="(item,inde) in keyboardLists" :key='inde'>
          <div :class="[{ban:item=='I'||item=='O'},{'iconfont icon-delete':item==='删'}]" @click="(item&&item!='I'&&item!='O')?getItem($event):''"  @touchstart="(item!='I'&&item!='O')?inputStart($event):''" @touchend="(item!='I'&&item!='O')?inputEnd($event):''" :itemdata='item'>
            {{item==='删'?'':item}}
            </div>
        </div>
      </div>
    </div>
</template>

<script>
let provinceData = ['粤', '京', '沪', '津', '冀', '鲁', '云', '辽', '黑', '湘', '皖', '新', '苏', '浙', '赣', '鄂', '桂', '甘', '晋', '蒙', '陕', '吉', '闽', '贵', '青', '藏', '川', '宁', '琼', '豫', '渝', null, null, null, null, null, null, null, null, '删']
/* eslint-disable*/
let numbesData = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '学', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '港', '澳', '删']
export default {
  name: 'keyboard',
  data () {
    return {
    }
  },
  computed: {
    keyboardLists (){
      return this.showflag?provinceData:numbesData
    }
  },
  props: {
    showflag:{
      type: Number,
      default: 0
    }
  },
  created () {
  },
  methods: {
    getItem (e){
      var itemdata=e.target.getAttribute('itemdata')
      this.$emit('getinput',itemdata)
    },
    inputStart(e){
      e.currentTarget.style.backgroundColor='#d01d95'
      e.currentTarget.style.color='#fff'
    },
    inputEnd (e){
      e.currentTarget.style.backgroundColor='#fff'
      e.currentTarget.style.color='#1a1a1a'
    },
    hideKeyboard (){
      this.$emit('hiden')
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '../../common/css/mixins.stylus'
#keyboard
  position absolute
  left 0
  bottom  0
  width 25rem
  background-color #cfd3db
  text-align right
  .keyboard-head
    width 100%
    background-color #ffffff
    font-size 1.13rem
    height 2.06rem
    line-height 2.06rem
    span
      display block
      float right
      padding 0 0.5rem
      color $theme-color
.keyboard-lists
  width 100%
  height 14rem
  display flex
  flex-wrap wrap
  justify-content space-around
  align-content space-around
  .keyboard-item
    width 10%
    height 2.66rem
    text-align center
    line-height 2.66rem
    font-size 1rem
    padding 0 0.2rem
    div
      height 2.66rem
      background-color  #ffffff
      border-radius .2rem
      transition background-color 0.1s
.ban
  background-color #c5c5c5!important
</style>
