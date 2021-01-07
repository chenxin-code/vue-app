/**Created by liaoyingchao on 2018/11/11.*/

<template>
  <div class="update-head">
    <nav-top :no-back="true">
      <!--<div class="right-btn" style="right: 0px; height: 44px; top: 0px; padding-right: 10px; font-size: 12px;" @click="registerEvent">注册</div>-->
    </nav-top>
    <nav-content>
      <div class="update">
        <ul class="type-list">
          <li class="type-item" :class="{selected:selected == typeItem.id}" v-for="(typeItem,idx) in typeList" @click="selectFun(typeItem)">{{typeItem.name}}</li>
        </ul>
        <ul class="pic-list" v-show="selected == '0'">
          <li class="pic-item" v-for="(picItem,index) in picList">
            <img :src="picItem.picUrl"/>
          </li>
        </ul>
        <ul class="pic-list"  v-show="selected == '1'">
          <li class="pic-item" v-for="(picItem,index) in picList">
            <img :src="picItem.picUrl"/>
          </li>
        </ul>
        <ul class="pic-list"  v-show="selected == '2'">
          <li class="pic-item" v-for="(picItem,index) in picList">
            <img :src="picItem.picUrl"/>
          </li>
        </ul>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import {Toast } from 'mint-ui'
  export default {
    name: "",
    components: {
      Toast,
    },
    props:[
    ],
    data() {
      return {
        typeList:[
          {name:'卡通',id:0},
          {name:'风景',id:1},
          {name:'任务',id:2}
        ],
        picList:[
          {picUrl:'static/image/setting/test-img-1.png',id:0},
          {picUrl:'static/image/setting/test-img-1.png',id:1},
          {picUrl:'static/image/setting/test-img-1.png',id:2},
          {picUrl:'static/image/setting/test-img-1.png',id:3},
          ],
        selected:'0',
      }
    },
    methods: {
      showMarkFun:function(){
        this.showMark = true;
      },
      closeMark:function(){
        this.showMark = false;
      },
      selectFun:function (item) {
        this.selected = item.id;
      },
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .update-head{
    width:100%;
    height:100%;
    .update{
      padding:0px 10px;
      .type-list{
        width:100%;
        height:44px;
        background:#fde9ea;
        display: flex;
        justify-content: space-around;
        line-height:44px;
        border-radius:5px 5px 0px 0px;
        overflow:hidden;
        .type-item{
          flex:3;
          text-align:center;
          color:#333;
        }
        .selected{
          color:#fff;
          background:#f02c2d;
        }
      }

      .pic-list{
        padding:15px 10px;
        overflow:hidden;
        .pic-item{
          float:left;
          width:32.33%;
          border-radius:5px;
          overflow:hidden;
          margin-right:5px;
          margin-bottom:5px;
          img{
            display:block;
            width:100%;
          }
        }
        .pic-item:nth-child(3n){
          margin-right:0px;
        }
      }
    }

  }
</style>
