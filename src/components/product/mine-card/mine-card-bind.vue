<template>
  <div class="cardbindbot">
    <ul class="user-info">
      <li class="item">
        <span class="item-left">本人姓名</span>
        <div class="item-right">
          <input class="textInput" v-if="isEdit" v-model="realName"/>
          <span class="item-info" v-else="">{{realName}}</span>
        </div>
      </li>
      <li class="item">
        <span class="item-left">证件类型</span>
        <div class="item-right">
          <span class="item-info">{{idTypeName}}</span>
        </div>
      </li>
      <li class="item">
        <span class="item-left">证件号码</span>
        <div class="item-right">
          <input class="textInput" v-if="isEdit" v-model="idNumber"/>
          <span class="item-info" v-else="">{{idNumber}}</span>
        </div>
      </li>
      <li class="item">
        <span class="item-left">加油卡号</span>
        <div class="item-right">
          <input type="text" placeholder="输入加油卡卡号" class="textInput" v-model="cardNo"/>
        </div>
      </li>
      <li class="item">
        <span class="item-left">验证码</span>
        <div class="item-right">
          <input type="number" pattern="[0-9]*" placeholder="输入验证码" class="codeInput" v-model="validCode"/>
          <input type="button" value="获取验证码" class="get-btn" @click="getValidCode()"/>
        </div>
      </li>
    </ul>
    <div class="submit">
      <button class="btn" @click="commitBind()">确定绑定</button>
    </div>
    <p class="warm-tip">温馨提示:验证码短信会发生到您的办卡预留手机上</p>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui';
  import defaultImg from "@/assets/dot.png";

  export default {
    name: 'minecardbind',
    components: {},
    data() {
      return {

        cardNo: '',//加油卡卡号
        idType: '',//证件类型
        idTypeName: '',//证件类型
        idNumber: '',//证件号码
        validCode: '',//短信验证码
        realName: '',//用户姓名
        phone: '',//手机号
        isEdit: false,
      }
    },
    methods: {
      testFunc: function () {
        console.log('testFunc')
      },
      getCookie: function () {
        return "4.3M";
      },
      getValidCode: function () {
        if (this.cardNo == '' ) {
          Toast({
            message: '请输入卡号',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
        let _this = this
        this.$Loading.open();
        let url = '/app/json/card/sendBindCardVerifySms';

        this.$http.post(url, {
          token: _this.$store.state.login.token,
          realName: _this.realName,
          idType: _this.idType,
          idNum: _this.idNumber,
          cardNo: _this.cardNo,
        }).then(
          res => {
            _this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              Toast({
                message: data.info ? data.info :'短信验证码已发送',
                position: 'bottom',
                duration: 2000,
              });
            } else {
              Toast({
                message: data.info ? data.info :'获取验证码失败',
                position: 'bottom',
                duration: 2000,
              });
            }
          },
          error => {
            _this.$Loading.close();
            Toast({
              message: '获取验证码失败',
              position: 'bottom',
              duration: 2000,
            });
          }
        );
      },
      commitBind: function () {
        if (this.cardNo == '' ) {
          Toast({
            message: '请输入卡号',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
        if (this.validCode == '') {
          Toast({
            message: '请输入验证码',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
        this.$Loading.open();
        let _this = this;
        let url = '/app/json/card/bindCard';

        this.$http.post(url, {
          token: _this.$store.state.login.token,
          realName: _this.realName,
          phone: _this.$store.state.phone,
          cardNo: _this.cardNo,
          idType: _this.idType,
          idNum: _this.idNumber,
          validCode: _this.validCode,
        }).then(
          res => {
            _this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              _this.$store.state.login.bindCardState = '1';
              _this.$bridgefunc.backIndex(-1);
              Toast({
                message: data.info ? data.info :'绑定成功',
                position: 'bottom',
                duration: 2000,
              });
            } else {
              Toast({
                message: data.info ? data.info :'绑定失败',
                position: 'bottom',
                duration: 2000,
              });
            }
          },
          error => {
            _this.$Loading.close();
            Toast({
              message: '绑定失败',
              position: 'bottom',
              duration: 2000,
            });
          }
        );
      },
      setData:function () {
        this.userInfo = this.$store.state.userInfo;
        if (this.userInfo.idType == '' || this.userInfo.idNumber == '' || this.userInfo.realName == '') {
          this.isEdit = true;
        }
        this.idType = this.$store.state.userInfo.idType;
        switch (this.idType) {
          case '1':
            this.idTypeName = '身份证';
            break;
          case '2':
            this.idTypeName = '军官证';
            break;
          case '3':
            this.idTypeName = '护照';
            break;
          case '4':
            this.idTypeName = '营业执照';
            break;
          case '5':
            this.idTypeName = '驾驶证';
            break;
          case '6':
            this.idTypeName = '组织机构代码证';
            break;
          case '7':
            this.idTypeName = '港澳通行证或台胞证';
            break;
        }
        this.idNumber = this.$store.state.userInfo.idNumber;
        this.realName = this.$store.state.userInfo.realName;
      },
      setBackIndex:function () {
        if(this.$route.query.isback == 1){
          this.$bridgefunc.backIndex(-2);
        }
      }
    },
    created() {
      this.setData();
      this.setBackIndex();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .cardbindbot {
    position absolute
    left 0
    top 0
    right 0
    bottom 0
    background-color: $color-background-lll;
    overflow: hidden;

    .user-info {
      background-color white
      overflow: hidden;
      .item {
        overflow: hidden;
        padding: 0px 3%;
        height: 40px;
        line-height: 40px;
        position: relative
        font-size: $font-size-medium;
        color: $color-text;

        &:after {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 1px;
          content: '';
          background: $color-line-gray-l;
          transform: scaleY(0.5);
          -webkit-transform: scaleY(0.5);
          z-index: 10;
        }

        .item-left {
          float: left;
        }
        .item-right {
          /*float:right;*/
          overflow: hidden;
          text-align right
          .textInput {
            display: block;
            border: none;
            background: none;
            outline: none;
            border: 0px;
            text-align: right;
            line-height: 40px;
            width 100%
          }
          .codeInput {
            background: none;
            outline: none;
            border: 0px;
            text-align: right;
          // width:80px;
            display: inline-block;
          }
          .get-btn {
            /*padding:2px 8px;*/
            border: 1px solid orange;
            border-radius: 3px;
            -webkit-border-radius: 3px;
            background: #fff;
            color: orange;
            font-size: $font-size-small;
            display: inline-block;
            margin-left: 5px;
          }
        }
      }
    }
    .submit {
      padding: 12px 3vh;
      .btn {
        width: 100%;
        background: orange;
        color: #fff;
        font-size: $font-size-medium-x;
        border-radius: 5px;
        -webkit-border-radius: 5px;
        border: none;
        padding: 9px 0px;
      }
    }
    .warm-tip {
      padding: 0px 3vh;
      color: red;
      font-size: $font-size-small;
      text-align: center;
    }
  }

</style>
