<template>
  <div id="pay-To-Complete">
    <!-- <sub-header :headerMark="headerMark"></sub-header> -->
    <div class="bgc"></div>
    <div v-if="routerFlag == 'reservationPaking' " class="comfirm" @click="btn1">再次预约</div>         
    <div v-else class="comfirm" @click="btnOrderInfoEvent">查看订单</div>   
    <img class="bgc2" src="../../assets/img/product.jpg">
    <div class="text">关注公众号，随时预约更多停车场空泊位。</div>
  </div>
</template>
<script>
  import subHeader from '../reservationDt/header';
  import BScroll from 'better-scroll';
  import {Toast,Indicator} from 'mint-ui';
  import common from '../../common/js/common.js';
  import { MessageBox } from 'mint-ui';

  export default {
    name:'payMent',
    data () {
      return {
        headerMark:'支付完成',
        routerFlag:null,
      }
    },
    components: {
      subHeader
    },
    methods: {
      btn1(){
        localStorage.setItem("routerFlag",null);
        localStorage.setItem('orderId',null);  //保存停车订单ID
        this.$router.push({
          name:'reservationOld',
        });
      },
      btn2(){
        window.location.href = "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU0MzE3OTk3NA==&scene=124#wechat_redirect"
      },
      btnOrderInfoEvent(){
        this.$router.push({
          name:'reservationinfo',
        });
      }
    },
    created(){            
    },
    activated(){
      this.routerFlag = localStorage.getItem("routerFlag");     
    },
  }
</script>

<style lang="stylus">
@import '../../common/css/base.stylus'
@import '../../common/css/mixin.stylus'
#pay-To-Complete
  background-color #F5F5F5
  width 100%
  position fixed
  top 0
  bottom 0
  .bgc
    background url("../../assets/img/empty_chenggong")  no-repeat
    background-size contain
    background-position center center
    width 33%
    height 33%
    position relative
    top 3.9375rem
    margin 0 auto 
  .comfirm
    position relative  
    top 3.9375rem
    left 50%    
    width 27.33333%
    height 6%
    border 3px solid #d21c95
    border-radius 0.3rem
    font-size 0.975rem    
    background-color #d21c95
    color #fff     
    display flex
    align-items center
    text-align center     
    margin 0 auto
    margin-left -13.77777%
    padding-left 6%
  .bgc2
    background-size contain
    background-position center center
    width 640px
    height 640px
    position absolute
    bottom 3.7275rem
    margin-left 34%
  .text 
    position absolute
    bottom 1.7275rem
    width 100%
    text-align center
    font-size 0.875rem  
    color rgb(167, 167, 167)
</style>


