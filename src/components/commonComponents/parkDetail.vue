<template>
  <div id="park-detail">
    <sub-header :headerMark="headerMark"></sub-header>
    <div class="content-box p-a" ref="parkDetailBox">
      <div>
        <div class="park-info">
          <div class="swiper-container" ref="parkDetailSwipper">
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="(item,key) in bannerList" :key="item.name">
                <img :src="item" alt="车场现场图">
              </div>
            </div>
            <div class="swiper-pagination p-a"></div>
          </div>
          <div class="park-info-show p-r">
            <div class="car-infotext">
              <span class="car-name">{{parklotName}}</span>
            </div>
            <div class="left-local p-r">
              <span class="local-text">{{parklotAddress}}</span>
            </div>
            <div class="parks-fees">
              <span class="parks f-l">
                <span class="info ">总车位数</span>
                <span class="num">{{totalAmount}}</span>
              </span>
              <span class="link">∣</span>
              <span class="fees">
                <span class="info">空泊位数</span>
                <span class="num">{{idleAmount}}</span>
              </span>
            </div>

            <div class="right-local p-a" @click="goGuide">
              <div class="locate-ic guide-ic"></div>
              <div class="locate-info t-c">{{distance}}</div>
            </div>
          </div>
        </div>
        <div class="lot-info" v-show="(lotsLists[0]) && (lotsLists.length)">
          <div class="title">车位信息</div>
          <div class="content">
            <div class="top-head flex"><div class="left fl-o t-c item-style">车位编号</div><div class="right fl-o t-c item-style">可约时段</div></div>
            <div class="lots-items flex" v-for="(item,key) in lotsLists" :key = item.name>
              <div class="left fl-o t-c item-style">{{item.parklocNumber}}</div>
              <!-- <div class="right fl-o t-c item-style">{{item.shares[0].startTime + '－' + item.shares[0].endTime}}</div> -->
              <div class="right fl-o t-c item-style">
                <div class="tm-lists" v-for="(subItem,key) in item.shares" :key = subItem.name>
                  {{subItem.startTime + '－' + subItem.endTime}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="guideBox" style="display:none;"></div>
      </div>
    </div>
  </div>
</template>
<script>
// import Vue from 'vue'
import subHeader from './subHeader';
import BScroll from 'better-scroll';
import { asyncAMap } from '../../common/js/H5plugin';
// import {Toast,Indicator} from 'mint-ui';
import Swiper  from 'swiper';
import { getMyParkDetail } from '../../server/getData';
import { formatTimeStamp } from '../../common/js/H5plugin';
import baseURL from '../../server/baseURL';

export default {
  name:'parkDetail',
  data () {
    return {
      headerMark:'车场详情',
      parkItem:{}, //车场详情数据
      parklotName:'',
      parklotAddress:'',
      totalAmount:'',
      idleAmount:'',
      distance:'',
      parklotType:'',

      parklotId: '', //停车场（位）id参数
      lotsLists: [], //共享停车位信息
      mySwiper:null,   //轮播实例化对象

      parkDetailAMap: null, //暂用的地图实例化对象
      parkGuide: null,   //驾车导航实例对象
      //测试数据
      bannerList:[
      ],
    }
  },
  components: {
    subHeader,
  },
  computed: {
  },
  created () {

  },
  activated () {
    this.parklotId = JSON.parse(localStorage.getItem('H5_park_lot_id'));
    this.getParkDetail();
  },
  mounted () {
  },
  methods:{
    //添加屏幕滚动事件
    _initScroll(){
      this.$nextTick(()=>{
        //左边滑动选择
        if(!this.parkDetailScroll){
          this.parkDetailScroll = new BScroll(this.$refs.parkDetailBox,{
            probeType:3,
            scrollY:true,
            click: true,
          });
        }else{
          this.parkDetailScroll.refresh();
        }
      })
    },
    //导航方法加载及导航实例化对象获取
    async initGuide(){
      let res = await asyncAMap();
      if(res == 'success'){
        this.parkDetailAMap  = new AMap.Map('guideBox', {
          resizeEnable: true,
          zoom:16,
        });
        let _self = this;
        this.parkDetailAMap.plugin(["AMap.Driving"], function() {
        let DrivingOption = {
          map: _self.parkDetailAMap,
          policy: AMap.DrivingPolicy.LEAST_DISTANCE, //路线规划策略
          // hideMarkers:true,  //起始点图标
          autoFitView: false,  //路线规划完毕后自动缩放地图视口
        };
        _self.parkGuide = new AMap.Driving(DrivingOption); //构造驾车导航类
        })
      }else{
        Toast({
          message:'地图导航功能加载失效',
          duration:1500
        })
      }
    },
    //加载swiper的方法
    _initSwiper() {
      let _self = this;
      if(this.mySwiper){
        this.mySwiper.destroy();
      }
      this.mySwiper = new Swiper (_self.$refs.parkDetailSwipper, {
        //自动轮播参数
        autoplay:4000,
        autoplayDisableOnInteraction: false,
        //小圆点
        pagination : '.swiper-pagination',
        // loop:true,
        slidesPerView :1,
        // loopedSlides:10,
        initialSlide:0,
        // swiper的各种回调函数也可以出现在这个对象中，参考swiper官方
        observer:true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents:true,//修改swiper的父元素时，自动初始化swiper
        //动画效果
        effect :'slide',
        // onSlideChangeEnd: function(swiper){
        // 　　　swiper.update();
        // }
      })
      // this.mySwiper.update(true);
      // this.mySwiper.reLoop();

    },
    // 获取停车场数据
    async getParkDetail(){
      let geoLocation =  JSON.parse(localStorage.getItem('H5_geoLocation'));
      let res = await getMyParkDetail(this.parklotId, geoLocation.lng, geoLocation.lat);
      if(res.error_code == 2000){
        this.parkItem = res.data;
        this.parklotName = res.data.parklotName;
        this.parklotAddress = res.data.parklotAddress;
        this.totalAmount = res.data.totalAmount;
        this.idleAmount = res.data.idleAmount;
        this.distance = res.data.distance;
        this.parklotType = res.data.parklotType;

        this.desX = res.data.parklotLng;
        this.desY = res.data.parklotLat;
        // this.handleDsitanceData();
        // 对轮播数据的处理
        this.handleBannerList();
        this.handleLotsData();
        this.initGuide();
        this._initScroll();
      }
    },
    // 距离数据处理 km m
    handleDsitanceData(){

    },
    // 轮播数据处理
    handleBannerList(res){
      let imgFiles = this.parkItem.files;
      if(!imgFiles.length){
        this.bannerList = [].concat([require('../../assets/img/home_parking_bg@3x.png')]);
      }else{
        this.bannerList = [];
        // debugger
        for(let item of imgFiles){
          let itemUrl = item.path;
          this.bannerList.push(itemUrl);
        }
        this._initSwiper();
      }
    },


    //停车位信息数据处理
    handleLotsData(){
      if(this.parkItem.parklocShareRepData){
        this.lotsLists = [].concat(this.parkItem.parklocShareRepData);
      }else{
        this.lotsLists = [].concat([]);
      }
      if(this.lotsLists[0]){
        for (let item of this.lotsLists){
          let shares = item.shares;
          if(shares[0]){
            for(let subItem of shares){
              let startTime = subItem.startTime;
              let endTime = subItem.endTime;
              let startHour = null;
              let endHour = null;
              startTime = formatTimeStamp(startTime);
              endTime = formatTimeStamp(endTime);
              // "2018-02-02 09:16:21:00"
              startHour = startTime.substr(8,2) + '日';
              endHour = endTime.substr(8,2) + '日';
              startTime =startHour + ' '+ startTime.substr(11,5);
              endTime = endHour + ' ' + endTime.substr(11,5);
              
              this.$set(subItem,'startTime',startTime);
              this.$set(subItem,'endTime',endTime);
            }
          }
        }
        console.log('处理后的时间列表')
        console.log(this.lotsLists)
      }
      //测试数据
      // this.lotsLists = [
      //     {
      //       "parklocId":1,
      //       "parklocNumber":"B1-1",
      //       "shares":[
      //           {
      //               "startTime":1522639498,
      //               "endTime":1522640698
      //           }
      //       ]
      //     },
      //     {
      //       "parklocId":2,
      //       "parklocNumber":"B1-4",
      //       "shares":[
      //           {
      //               "startTime":1522640818,
      //               "endTime":1522641178
      //           }
      //       ]
      //     },
      //   ];

    },
    //所有车场均做导航功能
    goGuide(){
      let geoLocation = JSON.parse(localStorage.getItem('H5_geoLocation'));
      let orgX = geoLocation.lng;
      let orgY = geoLocation.lat;
      this.parkGuide.searchOnAMAP({
        origin:[orgX,orgY],
        destination:[this.desX,this.desY]
      });
    }
  }
}
</script>
<style lang="stylus">
@import '../../common/css/base.stylus'
@import '../../common/css/mixin.stylus'
#park-detail
  position absolute
  width 100%
  top 0
  bottom 0
  background-color #F4F4F4
  color #333
  .content-box
    width 100%
    top 3rem
    bottom 0
    overflow hidden
    .park-info
      background-color #fff
      .swiper-container
        .swiper-slide
          img
            width 100%
            height 15rem
      .swiper-pagination
        bottom 5%
        left 50%
        transform:translateX(-50%)
        .swiper-pagination-bullet
          width .625rem
          height .625rem
          border-radius 50%
          margin 0 .2rem
          background-color rgba(0,0,0,.8)
        .swiper-pagination-bullet-active
          background-color #d01c95
      .park-info-show
        padding .875rem .9375rem
        border-bottom .0625rem solid #e6e6e6
        background-color #fff
        .car-infotext
          .car-name
            // font-size  1.1rem
            color #111111
            font-weight 700
          .car-text
            padding .125rem .25rem
            background-color #59c8f9
            font-size .625rem
            // margin-top 0.5rem
            color #fff
            text-align center
            border-radius 0.155rem
          .car-distance
            margin-left 2.2rem
            font-size .75rem
            // margin-top 0.6rem
            color #666666
        .parks-fees
          font-size .625rem
          color #666666
          margin-top .5rem
          .num
            color #333
          .link
            padding 0 .75rem
        .left-local
          margin-top: .5rem
          margin-bottom .2rem
          // padding-left 1rem
          font-size .875rem
          .local-img
            width: 0.75rem;
            height: 0.85rem;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            bg-img('../../assets/img/home_vip')
          .local-text
            font-size .875rem
            color #666666
            one-wrap(100%)
        .right-local
          width 2.0625rem
          height 2.8125rem
          top 50%
          right  .875rem
          transform translateY(-50%)
          .locate-ic
            height 2.0625rem
            bg-img('../../assets/img/icon_yue')
          .guide-ic
            bg-img('../../assets/img/icon_go')
          .locate-info
            padding-top .375rem
            font-size .75rem
            color #333
    .lot-info
      margin-top .5rem
      padding .875rem .9375rem
      font-size 1rem
      background-color #fff
      .title
        font-weight bolder
        margin-bottom 1.2rem
      .content
        .top-head
          background-color #fff3e3
          margin-bottom .2rem
        .lots-items
          background-color #f1f6f8
          margin-bottom .2rem
      .item-style
        font-size .9rem
        padding .5rem 0
</style>
