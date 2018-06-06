<template>
  <div id="no-data-tip">
    <!-- <div class="img-box p-a" :class="[tipClass]" v-show="!parkItems.length"> -->
    <div class="img-box p-a" :class="[tipClass]" v-show="!parkItems.length">
    </div>
  </div>
</template>
<script>
export default {
  name:'noDataTip',
  data () {
    return {
      tipsArr:['no-data','no-card','no-counp','no-park','no-park-lot']
    }
  },
  props:["tipMark","parkItems"],
  computed: {
    tipClass(){
      let index = 0;
      switch(this.tipMark){
        case '暂无数据':
          index = 0;
          break;
        case '暂无车辆':
          index = 0;
          break;
        case '暂无预约':
          index = 0;
          break;
        case '暂无银行卡':
          index = 1;
          break;
        case '暂无优惠券':
          index = 2;
          break;
      }
      return this.tipsArr[index];
    }
  }
}
</script>
<style lang="stylus">
@import '../../common/css/base.stylus'
@import '../../common/css/mixin.stylus'
#no-data-tip
  position absolute
  width 100%
  top 0
  bottom 0
  .img-box
    width 20rem
    height 11.625rem
    left 50%
    top 5rem
    transform translateX(-50%)
  .no-data
    bg-img('../../assets/img/nodata/parking_empty')
  .no-counp
    bg-img('../../assets/img/nodata/mine_coupon_empty')
</style>


