<template>
  <transition name="fade-in">
    <div id="portrait" v-show="sheetVisible">
      <transition name="fade-in">
        <div class="mask p-a" v-show="sheetVisible" @click="cancelPortrait"></div>
      </transition>
      <div class="pop-box p-a t-c" :class="{'pop-up':sheetVisible}">
        <div class="pop-actions" >
          <div class="pop-tt">
            <div class="main-tt">选择图片</div>
            <div class="vice-tt">从相册或者文件中获取</div>
          </div>
          <div class="photo-take action-item p-r">
            拍照
            <input class="img-get p-a" type="file" accept="image/jpeg,image/jpg,image/png" capture = "camera" @change="choosePic">
          </div>
          <div class="album action-item p-r">
            相册
            <input class="img-get p-a" type="file" accept="image/jpeg,image/jpg,image/png" @change="choosePic">
          </div>
        </div>
        <div class="cancel action-item" @click="cancelPortrait">取消</div>
      </div>
    </div>
  </transition>
</template>
<script>
import lrz from 'lrz';
export default {
  name:'portrait',
  data () {
    return {
      imgUrl:'', //回传图片的base64格式
      flag: this.portraitMark,
    }
  },
  props:['sheetVisible','portraitMark'],
  methods:{
    //隐藏组件
    cancelPortrait(){
      this.$root.eventHub.$emit('cancel-portrait');
    },
    //拍照选图
    takePhotos(e){
      
    },
    //选择相册
    choosePic(e){
      let files = e.target.files || e.dataTransfer.files;
      if(!files.length) return;
      this.createImage(files, e);
    },
    //图片获取与压缩上传等
    createImage(files, e){
      let vm = this;
      console.log(this.flag);
      debugger
      console.log(vm.portraitMark);
      lrz(files[0], { width: 320 }).then(res => {
        let fileObj = {
          file: files[0],
          imgURL: res.base64
        }
        if(vm.portraitMark == '个人中心'){          
          vm.$root.eventHub.$emit('upload-img',fileObj);
        }else{
          vm.$root.eventHub.$emit('deliver-img',fileObj);          
        }
      }).always(() => {
        e.target.value = null;
      });
    },
  }
}
</script>
<style lang="stylus">
#portrait
  position absolute
  width 100%
  top 0
  bottom 0
  .mask
    width 100%
    background-color rgba(0,0,0,.15)
    top 0
    bottom 0
  .pop-box
    width 90%
    left 50%
    transition transform .3s
    transform translate3d(-50%,105%,0)
    bottom 1%
    border-radius .8rem
    .pop-tt
      padding .5rem 0 1.2rem 0
      color #999
      .main-tt
        font-size .875rem
        font-weight normal
      .vice-tt
        margin-top .5rem
        font-size .75rem
    .pop-actions
      border-radius .8rem
      background-color #fff
      margin-bottom 2%
    .photo-take
      border-top .0625rem solid #F5F5F5
      border-bottom 1px solid #F5F5F5
    .cancel
      background-color #fff
      border-radius .8rem
      color red !important
    .action-item
      padding 1rem 0
      font-size 1.125rem
      color blue
      .img-get
        width 100%
        height 100%
        top 0
        left 0
        opacity 0
  .pop-up
    transform translate3d(-50%,0,0)
.fade-in-enter-active,.fade-in-leave-active
  transition opacity .3s ease-in
.fade-in-enter,.fade-in-leave-to
  opacity 0
.fade-in-enter-to,.fade-in-leave
  opacity 1
</style>



