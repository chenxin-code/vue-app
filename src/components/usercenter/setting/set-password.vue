/**Created by steven on 2018/11/20.*/

<template>
  <div class="set-password">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <div class="center mine-box-shodow">
        <ul class="setting-list">
          <!--border-bottom-->
          <li class="setting-item public-bar border-bottom icon-more" v-for="(item,index) in settingList" @click="jumpUrl(item)">
            <span class="left-text">{{item.name}}</span>
          </li>
        </ul>
      </div>
    </nav-content>

  </div>
</template>

<script>

  export default {
    name: "setting",
    components: {

    },
    data () {
      return {
        settingList:[
          {name:'登录密码验证',id:'0'},
          {name:'短信验证',id:'1'},
        ],
      }
    },
    methods: {
      backEvent: function () {
        this.$router.go(-1);
      },
      jumpUrl:function (item) {
        if(item.id == '0'){
          this.$router.push({
            path: '/usercenter/updatepassword'
          })
        }else if(item.id == '1'){

          this.$router.push({
            path: '/usercenter/forgetpassword',
            query:{
              phone:this.$store.state.login.phone
            }
          })

        }
      },
    },
    created () {


    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "../css/usercenter.styl"

  .set-password {
    width 100%
    height 100%
    overflow hidden;
    .center{
      margin 10px
      border-radius:5px;

      .setting-list{
        .setting-item{
          padding:15px 10px;
        }
        .setting-item:last-child{
          border-bottom:none;
        }
      }
    }
  }
</style>
