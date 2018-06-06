<template>
  <div id="activities">
    <sub-header :headerMark="headerMark"></sub-header>
  </div>
</template>
<script>
import BScroll from 'better-scroll';
import { Toast,Spinner,Indicator } from 'mint-ui';
// import {getMyCounpLists} from '../../server/getData';
// import { setTimeout, clearTimeout } from 'timers';
import subHeader from '../commonComponents/subHeader';
import noDataTips from '../commonComponents/noDataTip';
export default {
  name:'activities',
  data () {
    return {
      headerMark:'活动中心',
      activtyItems:[]
    }
  },
  components: {
    subHeader,
    noDataTips
  },
  methods: {

  }
}
</script>
<style lang="stylus">
#activities
  background-color #F5F5F5
  width 100%
  position absolute
  top 0
  bottom 0
</style>


