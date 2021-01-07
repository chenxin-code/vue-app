/**Created by steven on 2018/7/26.*/

<template>
  <div v-if="visible">
    <div class="recharge-alert"></div>
    <div class="alert-modal">

      <div class="alert-box">
        <div class="box-content">
          <div class="box-msg">
            {{contentmsg}}
          </div>
        </div>
        <div class="box-btns">
          <button  class="box-btn box-cancel "  :style="{'background-color':cancelbg,'color':cancelcolor,'border':cancelborder}" @click="cancelAction()">{{cancelmsg}}</button>
          <button  class="box-btn box-confirm " :disabled ='disabel' :style="{'background-color':surebg,'color':surecolor,'border':sureborder}" @click="sureAction()">{{suremsg}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "recharge-alert",

  components: {
  },
  watch:{
    surebg (val) {

      if (val == '') {
        this.surecolor = '';
        this.sureborder = '0.8px solid #e1e5eb;'
      }else {
        this.surecolor = '#fff';
        this.sureborder = '';
      }
    },
    cancelbg (val) {
      if (val == '') {
        this.cancelcolor = '';
        this.cancelborder = '0.8px solid #e1e5eb;'
      }else {
        this.cancelcolor = '#fff';
        this.cancelborder = '';
      }
    },
    disabel(val){
      if (val == '') {
        this.disabel = false;
      }else {
        this.disabel = val;
      }
    }
  },

  data () {
    return {
      disabel:false,
      visible: false,
      contentmsg:'',
      cancelmsg:'',
      suremsg:'',
      surebg:'',
      surecolor:'',
      sureborder:'0.8px solid #e1e5eb',
      cancelbg:'',
      cancelcolor:'',
      cancelborder:'0.8px solid #e1e5eb',
      sureback: null,
      cancelback:null
    }
  },
  methods: {
    cancelAction:function () {
      this.visible = false;
      if (this.cancelback){
        this.cancelback();
      }
    },
    sureAction:function () {
      this.visible = false;
      if (this.sureback){
        this.sureback();
      }
    }
  },
  created () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import "~@/common/stylus/variable.styl"
  .recharge-alert {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background: #000;
  z-index 2017

}
  .alert-modal{
    position absolute
    z-index 2018
  }
  .alert-box{
  position: fixed;
  top: 50%;
  left: 50%;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
  background-color: #fff;
  width: 85%;
  border-radius: 3px;
  font-size: 16px;
  -webkit-user-select: none;
  overflow: hidden;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transition: 0.2s;
  transition: 0.2s;
  .box-content{
    padding: 15px 20px;
    /*border-bottom: 0.8px solid #e1e5eb;*/
    position: relative;
    .box-msg{
      color: #999;
      margin: 0;
      text-align: center;
      line-height: 36px;
    }
  }

  .box-btns{
    display: flex;
    height: 50px;
    line-height: 50px;

    .box-btn {
      line-height: 25px;
      display: block;
      background-color: #fff;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      border: 0;
      margin 10px
      font-size: 16px;
      width: 50%;
      border-radius 5px
    }

  }
}

</style>
