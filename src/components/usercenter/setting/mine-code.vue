/**Created by steven on 2018/11/20.*/

<template>
  <div class="current-user">
    <nav-top :no-back="true">
      <!--<div class="right-btn" style="right: 0px; height: 44px; top: 0px; padding-right: 10px; font-size: 12px;" @click="registerEvent">注册</div>-->
    </nav-top>
    <nav-content>
     <div class="mine-code">
      <div class="current-info">
        <div class="box-shadow">
          <p class="device-text">其他设备</p>
          <ul class="other-list">
            <li class="other-item">
              <div class="device-info">
                <p class="device-name">推荐人姓名:此角</p>
              </div>
            </li>
            <li class="other-item">
              <div class="device-info">
                <p class="device-name">推荐人手机号:18284159595</p>

              </div>
            </li>
            <li class="other-item">
              <div class="device-info">
                <p class="device-name">推荐人编号:会员号</p>
              </div>
            </li>
            <li class="other-item">
              <div class="device-info">
                <p class="device-name">推荐人所属分公司:广东石油分公司</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </nav-content>
  </div>

</template>

<script>

export default {
  name: "sbgl",
  components: {
  },
  data () {
    return {

    }
  },
  methods: {

  },
  created () {


  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "../css/usercenter.styl"

  .mine-code {
    width 100%
    height 100%
    overflow hidden;
    .current-info{
      padding:0px 10px;
      .box-shadow{
        border-bottom:1px  solid #e8e8e8;
        box-shadow: 0px 1px 1px #e8e8e8;
        border-radius:5px 0px 0px 5px;
        padding:0px 0px 0px 10px;
        .device-text{
          font-size:$font-size-medium;
          color:#333;
          margin-bottom:15px;
          font-weight:600;
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
                font-size:$font-size-small-s;
                color:#333;
                margin-bottom:9px;
              }
            }
          }
        }
      }
    }
  }
</style>
