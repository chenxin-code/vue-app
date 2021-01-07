/**Created by steven on 2018/11/20.*/

<template>
  <div class="sbgl">
    <div class="tip"><span class="tip-icon">该功能旨在保护帐户信息安全，如有异常，请至安全管理修改登录密码</span></div>
    <div class="current-device">
      <div class="box-shadow">
        <p class="device-text">当前设备</p>
        <div class="current-name">BAC-TL00</div>
      </div>
    </div>
    <div class="other-device">
      <div class="box-shadow">
        <p class="device-text">其他设备</p>
        <ul class="other-list" v-if="deviceList.length > 0">
          <li class="other-item icon-more" v-for="(item,index) in deviceList" @click="jumpUrl(item)">
            <div class="device-info">
              <p class="device-name">{{item.name}}</p>
              <p class="time">{{item.timeStr}}&nbsp &nbsp{{item.name}}</p>
            </div>
          </li>
        </ul>
        <p class="no-device" v-if="deviceList.length = 0">无设备</p>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: "sbgl",
  components: {
  },
  data () {
    return {
      deviceList:[
        {name:'iphone SE',id:'0',timeStr:'2018-09-30 13:20'},
        {name:'iphone Xr',id:'0',timeStr:'2018-09-30 13:20'},
        {name:'iphonePlus',id:'0',timeStr:'2018-09-30 13:20'},
        ],
    }
  },
  methods: {
    jumpUrl:function (item) {
      if(item.id == '0'){
        this.$router.push({
          path: ''
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

  .sbgl {
    width 100%
    height 100%
    overflow hidden;
    .tip{
      height:30px;
      width:100%;
      background:#fbf8d9;
      line-height:30px;
      padding:0px 10px;
      margin-top:10px;
      background:url("../../../../static/image/login2/tip-icon.png") 20px center no-repeat;
      background-size:10px 12px;
      .tip-icon{
        font-size:$font-size-small-s;
        line-height:30px;
        color:#e0782f;
        display:block;
        padding-left:15px;
        white-space nowrap
        overflow:hidden;
      }
    }
    .current-device{
      padding:15px 10px;
      .box-shadow{
        border-bottom:1px  solid #e8e8e8;
        box-shadow: 0px 1px 1px #e8e8e8;
        border-radius:5px 0px 0px 5px;
        padding:0px 10px;
        .device-text{
          font-size:$font-size-small;
          color:#333;
          margin-bottom:15px;
        }
        .current-name{
          font-size:10px;
          color:#f02c2e;
          padding:12px 0px;

        }
      }

    }
    .other-device{
      padding:0px 10px;
      .box-shadow{
        border-bottom:1px  solid #e8e8e8;
        box-shadow: 0px 2px 1px #e8e8e8;
        border-radius:5px 0px 0px 5px;
        padding:0px 0px 0px 10px;
        .device-text{
          font-size:$font-size-small;
          color:#333;
          margin-bottom:15px;
        }
        .other-list{
          .other-item{
            display:flex;
            justify-content:end;
            align-items:center;
            padding:15px 0px;
            .device-info{
              overflow:hidden;
              .device-name{
                font-size:$font-size-medium-s;
                color:#333;
                margin-bottom:9px;
              }
              .time{
                font-size:9px;
                color:#666;
              }
            }
          }
        }
        .no-device{
          font-size:$font-size-small;
          color:#333;
          padding:15px 0px;
        }
      }
    }
  }
</style>
