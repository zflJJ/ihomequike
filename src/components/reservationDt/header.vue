<template>
  <div id="sub-header" class="header p-a">
    <div class="top-cont t-c p-r">
          {{headerMark}}
        <div class="back p-a"></div>
        <div class="more p-a" v-show="false">更多</div>
        <div class="back-mask p-a" @click="goBack"></div>
      </div>
  </div>
</template>
<script>
import common from '../../common/js/common';
export default {
  name:'subHeader',
  data(){
    return{

    }
  },
  computed: {
    //是否显示更多按钮
    showMore(){
      return this.headerMark =='我的账户'?true: false;
    }
  },
  props:['headerMark'],
  methods: {
    goBack(){
      //添加车辆
      let parkName = localStorage.getItem('H5_parkName');
      if( this.headerMark == '预约详情'|| this.headerMark == '预约'){
      }else if( this.headerMark == '我的卡券' ){
        this.$router.push('payMentDt');
      }else if( this.headerMark == '支付完成' ){
        let goBackFlag = localStorage.getItem("goBackFlag")
        if(goBackFlag == "reservationPaking"){
          this.$router.push('reservationOld');
        }else {
          this.$router.push('reservationInfo');
        }
      }else if( this.headerMark == '添加车辆' ){
        this.$router.push('licensePlate');
      }else if( this.headerMark == '我的车辆' ){
        this.$router.push('reservationOld');
      }else if( this.headerMark == '支付订单' ){
        let goBackFlag = localStorage.getItem("goBackFlag")
        if(goBackFlag == "reservationPaking"){
          this.$router.push('reservationPaking');
        }else {
          this.$router.push('reservationBookingUnpaid');
        }
      }else{
        // console.log(1234);
        this.$router.go(-1);
      }
    },
  },
}
</script>
<style lang="stylus">
@import '../../common/css/base.stylus'
@import '../../common/css/mixin.stylus'
#sub-header
  position fixed
  z-index 10000
  color #1a1a1a
  font-size 1rem
  font-weight bold
  // bg-img('../../assets/img/Background')
  background-color #fff
  padding-top 0.5rem
  padding-bottom 0.5rem
  .top-cont
    width 100%
    height 2rem
    line-height 2rem
    .back
      top 50%
      transform translateY(-50%)
      width 1.375rem
      height 1.25rem
      left .9375rem
      // bg-img('../../assets/img/parting_back')
      bg-img('../../assets/img/btn_back')
    .more
      top 50%
      transform translateY(-50%)
      font-size 14px
      right .875rem
    .back-mask
      width 3rem
      height 100%
      top 0
      left 0
</style>



