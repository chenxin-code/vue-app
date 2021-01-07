/**Created by liaoyingchao on 2020-03-12.*/

<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="address-edit">
        <div class="list">
          <div class="card-div">
            <div class="row line_bottom">
              <div class="label">小区/大厦/学校</div>
              <div class="value" @click="toMap">
                <div class="loaction single-line">{{location.area}}</div>
              </div>
              <i class="iconfont mall-gengduojiantou theme_font_black icon-font"></i>
            </div>
            <div class="row line_bottom">
              <div class="label">楼号-门牌号</div>
              <div class="value">
                <input placeholder="例如：B座1009" v-model="position">
              </div>
            </div>
            <div class="row line_bottom">
              <div class="label">收货人</div>
              <div class="value">
                <input placeholder="请输入收货人姓名" v-model="name">
              </div>
            </div>
            <div class="row">
              <div class="label">手机号</div>
              <div class="value">
                <!--<van-field
                  v-model="phone"
                  type="tel"
                  placeholder="请输入收货人手机号"
                  maxlength="11"
                  autosize
                  onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
                  pattern="[0-9]*"
                  @input="phone = /^\d+/.exec(phone) ? /^\d+/.exec(phone)[0] : ''"
                  @blur="phoneBlur"
                />-->
                <input placeholder="请输入收货人手机号" v-model="phone" type="tel" maxlength="11" onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))' pattern="[0-9]*" @input="phone = /^\d+/.exec(phone) ? /^\d+/.exec(phone)[0] : ''" @blur="phoneBlur">
              </div>
            </div>
          </div>
        </div>
        <div class="bottom-btn theme_bg_red" @click="addAddressEvent"><p>保存并使用</p></div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "address-edit",
    components: {},
    data() {
      return {
        location: {},
        position: '',
        name: '',
        phone: '',
        editAddress: {},

        storeOuCode: '', // 门店
      }
    },
    methods: {
      phoneBlur:function(){

      },
      toMap: function () {
        this.$router.push({
          path: '/mall2/store-delivery/address-map'
        })
      },
      addAddressEvent: function () {
        if(!this.$util.checkMobile(this.phone)){
          this.$Toast('请输入正确的手机号！')
          return;
        } else if (this.position == '') {
          this.$Toast('请输入门牌号！')
          return;
        } else if (this.name == '') {
          this.$Toast('请输入收货人姓名！')
          return;
        }

        let url = '/app/json/user_address/updateStoreDeliveryUserAddress';

        let paramsData = this.location
        paramsData.storeOuCode = this.storeOuCode
        paramsData.houseNumber = this.position
        paramsData.receiverName = this.name
        paramsData.mobile = this.phone
        if (paramsData.countryId == '') {
          paramsData.countryId = '-1'
        }
        if (paramsData.townId == '') {
          paramsData.townId = '-1'
        }
        paramsData.addressFull = this.location.address + this.position
        if (this.location.id) {
          paramsData.id = this.location.id
        }
        this.$Loading.open();
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              localStorage.setItem('Address_List_Seleted', JSON.stringify(data.data))
              this.$router.go(-2);
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      getLoaction: function () {
        this.$bridgefunc.getLocation((locationinfo) => {
          this.$mallCommon.nearAddress((address) => {
            this.location = address
          }, locationinfo);
        })
      }
    },
    mounted() {
      let location = sessionStorage.getItem('Address_Map_Seleted')
      if (location) {
        sessionStorage.removeItem('Address_Map_Seleted')
        location = JSON.parse(location)
        let locationinfo = {
          province: location.province,
          city: location.city,
          district: location.area,
          longitude: location.location.lng,
          latitude: location.location.lat,
          address: location.address + location.name,
          name: location.name
        }
        if (location.city == location.province) {
          locationinfo.city = location.area
          locationinfo.district = ''
        }
        this.$mallCommon.pureLocationAnalysis((address) => {
          this.location = address
        }, locationinfo);
      } else {
        if (this.$route.query.pageType == '1') {
          this.editAddress = JSON.parse(this.$route.query.address)
          this.location = this.editAddress
          this.position = this.editAddress.houseNumber
          this.name = this.editAddress.receiverName
          this.phone = this.editAddress.mobile
        } else {
          this.getLoaction()
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .address-edit {
    width 100%
    height 100%
    overflow hidden
    display flex;
    flex-direction column;
    .list {
      flex 1;
      .card-div {
        margin 10px;
        padding 0 10px;
        box-shadow 0 1px 8px #efefef;
        .row {
          padding 6px 0;
          display flex;
          align-items center;
          .label {
            width 120px;
            font-size 15px;
          }
          .value {
            flex 1;
            .loaction {
              height 36px;
              line-height 36px;
              width 100%;
              font-size 14px;
              font-weight 600;
            }
            input {
              width 100%;
              font-size 14px;
              height 36px;
            }
          }
          .icon-font {
            font-weight 600;
            font-size 16px;
          }
        }
      }
    }
    .bottom-btn {
      height 50px;
      display flex
      align-items center
      text-align:center;
      p{
        width 100%
        color:white;
        font-weight 600
        font-size 18px
      }
    }
  }
</style>
