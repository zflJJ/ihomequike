<template>
  <div id="app">
    <transition :name="transitionName">
      <keep-alive exclude = "exclude">
        <router-view class="child-view"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
export default {
  name:'app',
  data(){
    return {
      transitionName:'slide-left'
    }
  },
  methods:{
    GetUrlParam(paraName) {
      var url = window.location.href;
      var arrObj = url.split("?");
      if (arrObj.length > 1) {
          var arrPara = arrObj[1].split("&");
          var arr;
          for (var i = 0; i < arrPara.length; i++) {
              arr = arrPara[i].split("=");
              if (arr != null && arr[0] == paraName) {
                  return arr[1];
              }
          }
          return "";
      }
      else {
          return "";
      }
    }
  },
  created () {
    // 获取用户的手机信号， 以及拆分数据（初步测试没有问题）
    let openId = null;
    let url = window.location.href;
    // alert(url);
    let urlNum = url.indexOf('?');
    let urlherf = url.substr(urlNum+1);
    // alert(urlherf);
    let flag = url.indexOf('#/login');
    // alert(flag);
    if(flag !== -1){
      let openIdnum = urlherf.indexOf('openId');
      openId = urlherf.substr(openIdnum+7);
      localStorage.setItem('openId',openId);
    }else{
      flag = url.indexOf('#/home');
      let params = url.substring(urlNum+1,flag);
      // alert(params);
      let paramsArr = params.split("&");
      let Arr = [];
      for(let i=0;i<paramsArr.length;i++){
        Arr.push(paramsArr[i].split('='));
      }
    }
    
    if(this.GetUrlParam("userId")){
      localStorage.setItem('userId',this.GetUrlParam("userId"));
    }
    if(this.GetUrlParam("parklotId")){
      localStorage.setItem('myParklotId',this.GetUrlParam("parklotId"));
    }
    if(this.GetUrlParam("unionId")){
      localStorage.setItem('unionId',this.GetUrlParam("unionId"));
    }
    if(this.GetUrlParam("openId")){
      localStorage.setItem('openId',this.GetUrlParam("openId"));
    }
    if(this.GetUrlParam("orderId")){
      localStorage.setItem('orderId',this.GetUrlParam("orderId"));
    }


    //做浏览器兼容，吃力微信支付问题
    // alert(12344445);
    let u = window.navigator.userAgent;
    // alert(JSON.stringify(u));
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    console.log(isAndroid,isiOS);
    let phoneNum = '';
    if(isiOS === true){
      phoneNum = 'iPhone';
      // alert('');
      // var isSafari = u.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") < 1;
      // if(isSafari === false){
      //     alert('');
      // }
    }else{
      console.log(u);
      let uArr = u.split(";");
      let len = null;
      for(let i=0;i<uArr.length;i++){
         if (uArr[i].indexOf("Build/") > 0) {
           len = i;
           break;
         } 
      }
      phoneNum = uArr[len].substring(0, uArr[len].indexOf("Build/"));  
      // this.contains("Build/");
      //   var i = sss.contains("Build/");  
      //   console.log(sss,i);
      //   if (i > -1) {  
      //       model = sss[i].substring(0, sss[i].indexOf("Build/"));  
      // }  
    }
    console.log(phoneNum);
    // alert(phoneNum);
    localStorage.setItem('phoneNum',phoneNum);
  },
  computed: {
    exclude(){
      return this.$store.state.exclude;
    }
  },
  watch: {
    '$route' (to, from) {
      if(to.path == '/home'){
        /*给这个组件添加一个类名*/
        this.transitionName = 'slide-left';
      }else {
        this.transitionName = 'slide-right';
      }
      //缓存清除处理
      // if(to.path == '/appointInfo'){
      //
      //   this.$store.state.exclude = ['appointInfo'];
      // }
      // console.log(this.$store.state.exclude)
    }
  },
}
</script>
<style lang="stylus">
#app
  .child-view
    position absolute
    width 100%
    top 0
    bottom 0
    left 0
    transition all .7s cubic-bezier(.55,0,.1,1)
  .slide-left-enter,
  .slide-right-leave-active
    opacity 0
    transform translate(100%, 0)
  .slide-left-leave-active,
  .slide-right-enter
    opacity 0
    transform translate(-100% 0)
</style>


