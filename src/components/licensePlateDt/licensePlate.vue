<template>
  <div id="car">
    <no-data-tips :tipMark="tipMark" :parkItems="carItems"></no-data-tips>
    <div class="content-box p-a" ref="carListsBox">
      <div class="content">
        <div class="car-lists p-r" v-for="(item,key) in carItems" :key="item.name" :class="{'bd-top':key==0,'edited':editMode}" @click="chooseItem(item)">
          {{item.number}}
          <transition name="fade-in">
            <span v-show="editMode" class="edit-ic p-a" :class="{'chosen':item.isChosen}"></span>
          </transition>
        </div>
      </div>
    </div>

    <div class="bottom-bars flex p-a">
      <div class="bar-lists fl-o t-c" v-for="(item,index) in barItems" :class="{'active':index==1}" :key="item.name" @click="switchBars(index)">
        {{item}}
      </div>
    </div>
  </div>
</template>
<script>
import subHeader from '../reservationDt/header';
import BScroll from 'better-scroll';
import { getMyCars } from '../../server/getData';
import { removeMyCars } from '../../server/getData';
import { Toast, Indicator } from 'mint-ui'
import noDataTips from '../commonComponents/noDataTip';
export default {
  name: 'car',
  data() {
    return {
      headerMark: '我的车辆',
      carItems: [],  //车牌号列表数据
      editMode: false, //是否为编辑模式
      fromName: 'myAcount',    //从哪个页面跳转过来的
      msg: '',
      hasNoCars: false, //判断车辆数是否为0
      currentIndex: 1,  //判断只有添加的样式
      tipMark: '暂无车辆', //暂无车辆标志
      pageNum: 0, // 获取数据
      userId: null, // 用户ID
    }
  },
  components: {
    subHeader,
    noDataTips
  },
  methods: {
    //添加滚动事件  测试使用vscode 工具来提交代码
    _initScroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.carListsBox, {
            probeType: 3,
            scrollY: true,
            click: true
          });
        } else {
          this.scroll.refresh();
        }
        let _self = this;
        if (this.scroll) {
          this.scroll.on(scrollY, props => {
            clearTimeout(_self.timer);
            let scorllY = props.y;
            let el = this.scroll.scroller;
            // 获取父盒子 的高度
            let elParent = el.parentElement;
            let elH = el.offsetHeight;
            let parentH = elParent.offsetHeight;
            if (scorllY < parentH - elH) {
              _self.timer = setTimeout(() => {
                _self.pageNum++;
                _self.getCars();
              }, 30);
            }
          })
        }
      })
    },
    //选中/取消选中状态
    chooseItem(item) {
      this.fromName = localStorage.getItem('fromName');
      if (!this.editMode) {
        let plateObj = {
          plateNo: item.number,
          plateNoId: item.plateId,
        };
        localStorage.setItem('H5_chosen_plate', JSON.stringify(plateObj));
        this.$router.push('reservationOld');
      } else {
        if (!this.editMode) return;
        console.log(this.$router.from)
        this.$set(item, 'isChosen', !item.isChosen);
      }
    },

    //底部tab栏目点击事件
    switchBars(index) {
      if (!this.editMode) {
        if (index == 0) { //启动车牌编辑模式
          this.editMode = true;
        } else { //添加车辆
          this.$router.push({
            path: '/licensePlateAdd'
          })
        }
      } else {
        if (index == 0) { //取消/保存
          this.editMode = false;
        } else {  //删除车辆
          this.removePlate();
        }
      }
    },
    // 删除选中车牌号
    async removePlate() {
      let carId = [];
      for (let item of this.carItems) {
        if (item.isChosen === true) {
          let id = item.plateId;
          carId.push(id);
        }
      }
      console.log(carId);
      if (carId.length === 0) {
        return;
      } else {
        let res = await removeMyCars(this.userId, carId.toString());
        if (res.error_code === 2000) {
          this.getCars();
        } else {
          Toast(res.error_message)
        }
      }
    },
    //获取车牌号列表
    async getCars() {
      Indicator.open();
      let userId = localStorage.getItem('userId');
      let res = await getMyCars(this.userId, this.pageNum);
      console.log(res);
      if (res.error_code == 2000) {
        Indicator.close();
        if (res.data.plates.length === 0) {
          this.editMode = false;
          this.carItems = [];
        } else {
          this.displayItems(res);
        }
      } else {
        Indicator.close();
        Toast({
          message: '车牌号数据请求失败',
          duration: 1000
        });
      }
    },
    //展示列表数据
    displayItems(data) {
      let listData = data.data.plates;
      if (this.pageNum === 0) {
        this.carItems = [].concat(listData);
      } else {
        this.carItems = this.carItems.concat(listData);
      }
      this._initScroll();
    },
  },
  activated() {
    this.userId = localStorage.getItem('userId')
    this.editMode = false;
    this.currentIndex = 0;
    this.pageNum = 0;
    this.getCars();
  },
  computed: {
    //底部tab栏选项
    barItems() {
      return (this.editMode ? ['保存', '删除'] : ['编辑车辆', '添加车辆']);
    },
  },
  beforeRouteEnter(to, from, next) {
    next();
  }
}
</script>
<style lang="stylus">
@import '../../common/css/base.stylus'
@import '../../common/css/mixin.stylus'
#car
  background-color #F5F5F5
  width 100%
  position absolute
  top 0
  bottom 0
  .content-box
    width 100%
    // top 3.9375rem
    top 0rem
    bottom 3.5rem
    overflow hidden
    .content
      // padding-top .8125rem
      .car-lists
        padding 1.125rem 0.9375rem
        background-color #FFF
        border-bottom 1px solid #E6E6E6
        color #1A1A1A
        transition all 0.5s
        font-size 1rem
        font-weight bolder
        .fade-in-enter-active, .fade-in-leave-active
          transition all 0.5s ease
        .fade-in-enter, .fade-in-leave-to
          opacity 0
        .edit-ic
          width 1.25rem
          height 1.25rem
          left 0.9375rem
          top 50%
          transform translateY(-50%)
          bg-img('../../assets/img/bootpage_point')
        .chosen
          bg-img('../../assets/img/parting_car_Selected')
      .edited
        padding-left 3.125rem
      .bd-top
        // border-top 1px solid #E6E6E6
  .bottom-bars
    width 100%
    height 3.5rem
    bottom 0
    .bar-lists
      line-height 3.5rem
      font-size 1rem
      background-color #FFF
      font-weight bolder
      color #D21C95
    .active
      background-color #D21C95
      color #FFF !important
</style>
