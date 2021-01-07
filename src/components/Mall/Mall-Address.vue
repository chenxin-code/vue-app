/**Created by steven on 2018/6/12.*/

<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="Mall-Address">
    <nav-top @backEvent="backEvent" >
    </nav-top>
    <div ref="content" class="address" :style="{top: (this.$store.state.barHeight+this.$market.getNavHeight())+ 'px'}">
      <ul  class="addressList">
        <li class="addressItem" v-for="item in items" @click="addressSelect(item)">
          <div class="name">
            <span class="realName">{{item.receiverName}}</span>
            <span class="tel">{{item.mobile}}</span>
            <span class="default" v-if="item.isDefault == 1">默认</span>
          </div>
          <p class="addressDetails">{{item.provinceName}}{{item.cityName}}{{item.countryName}}{{item.townName}}{{item.address}}</p>
          <div class="delete" v-on:click.stop="deleteAddress(item)"></div>
          <div class="edit" v-on:click.stop="editAddress(item)"></div>
        </li>
      </ul>
      <div class="btns" @click="addAddressEvent">
        <span class="btn btnTwo">新建收货地址</span>
      </div>
    </div>

  </div>
</template>

<script>
import {Toast } from 'mint-ui'
export default {
  name: "Mall-Address",
  components: {
    Toast,
  },
  data() {
    return {
      items: []
    };
  },
  methods: {
    addressSelect: function (item) {
      this.$store.state.orderPlace = item
      this.$bridgefunc.vuexStorage(() => {
        this.$bridgefunc.customGo(-1)
      })
    },
    addAddressEvent: function () {
      this.$bridgefunc.customPush({
        path: '/malladdaddress'
      })
    },
    editAddress: function (item) {
      this.$bridgefunc.customPush({
        path: '/malladdaddress',
        query: {
          item: JSON.stringify(item)
        }
      });
    },
    backEvent: function () {
      this.$bridgefunc.customGo(-1)
    },
    deleteAddress:function(item){
      this.$MessageBox.confirm('确认删除收货地址？', '提示',{confirmButtonText:'确定'}).then(action => {
       this.$Loading.open();
        let url = '/app/json/user_address/delete'
        let delete_address_params = {
          token: this.$store.state.login.token,
          userAddr: item,
          id: item.id
        }
         this.$http.post(url, delete_address_params).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            //如果删除的地址是 已经选择的 要把选择的去掉
            if(this.$store.state.orderPlace.id == item.id){
              this.$store.state.orderPlace = {};
              this.$bridgefunc.vuexStorage();
            }
            this.getAddressData();
            this.$Toast('地址已删除')
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('获取数据失败')
        });
      }).catch(action => {
      });
    },
    getAddressData: function () {
      this.$Loading.open()
      let url = '/app/json/user_address/list';
      let params1 = {
        token: this.$store.state.login.token,
        condition: {}
      };

      let _this = this
      this.$http.post(url, params1).then(res => {
        _this.$Loading.close()
        let data = res.data;
        console.log(data);
        if (data.status == 0) {
          _this.items = data.data
          if (_this.items.length == 0) {
            _this.$ErrPage.open({
              el:_this.$refs.content,
              errType: 'NoAddress',
              btnCallBack: function () {
                _this.addAddressEvent()
                _this.$ErrPage.close()
              }
            })
          }
        } else {
          _this.$Toast(data.info)
          _this.$ErrPage.open({
            el:_this.$refs.content,
            errType: 'NetError',
            btnCallBack: function () {
              _this.getAddressData()
              _this.$ErrPage.close()
            }
          })
        }
        // _this.$Loading.open()
      }, error => {
        _this.$Loading.close()
        console.log('获取失败', error);

        _this.$ErrPage.open({
          el:_this.$refs.content,
          errType: 'NetError',
          btnCallBack: function () {
            _this.getAddressData()
            _this.$ErrPage.close()
          }
        })
      });
    },
    activated() {

    },
    beforeRouteLeave(to, from, next) {
      // to.meta.keepAlive = false;
      if (to.path == '/malladdaddress') {
        from.meta.keepAlive = true;
        to.meta.keepAlive = false;
      }
      next();
    }
  },
  created () {
    this.getAddressData()
  },
  mounted () {
    this.$bridgefunc.registePageShow(() => {
      this.getAddressData()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import "~@/common/stylus/variable.styl"
.Mall-Address{
  position relative
  width 100%;
  height 100%;
  background-color: white;
  .address{
    position absolute
    left 0px;
    right 0px;
    bottom 0px;
  }
  .addressList{
    position absolute
    top 0px;
    left 0px;
    right 0px;
    bottom 60px;
    overflow-y scroll
    -webkit-overflow-scrolling touch;
    /*background: #fff;*/
    .addressItem{
      padding 3%;
      border-bottom:1px solid $color-line-gray-l;
      position:relative;
      .name{
        overflow:hidden;
        span{
          display: inline-block;
          /*font-weight:$font-weight-x;*/
          color:$color-text;
        }
        .realName{
          font-size: $font-size-medium-x;
        }
        .tel{
          font-size:$font-size-medium-x;
          margin-left:5px;
        }
        .default{
          font-size:$font-size-small;
          font-weight:normal;
          margin-left:5px;
          background:#fe6902;
          color:#fff;
          height:16px;
          line-height:16px;
          padding:0px 5px;
          border-radius:8px;
          -webkit-border-radius:8px;
        }
      }
      .addressDetails{
        /*width:90%;*/
        font-size:$font-size-medium-s;
        padding-top: 4px;
        padding-right 90px;
      }
      .edit{
        width:40px;
        height:40px;
        display:block;
        background:url("../../../static/image/mall/edit.png") center center no-repeat;
        background-size: 20px 20px;
        position:absolute;
        right:3%;
        top:50%;
        margin-top:-20px;
      }
      .delete{
        width:40px;
        height:40px;
        display:block;
        background:url("../../../static/image/mall/icon3.png") center center no-repeat;
        background-size: 20px 20px;
        position:absolute;
        right:50px;
        top:50%;
        margin-top:-20px;
      }
    }
    .selected{
      background:url("../../../static/image/mall/select2.png")3% center no-repeat;
      background-size:20px 20px;
      padding-left:12%
    }
  }

  .btns{
    position:fixed;
    width:80%;
    bottom:10px;
    left:10%;
    background:#fe6902;
    height:40px;
    line-height:40px;
    border:1px solid #fe6902;
    border-radius:20px;
    -webkit-border-radius:20px;
    font-size:$font-size-medium-x;
    text-align:center;
    z-index:99;
    .btn{
      height:40px;
      line-height:40px;
      border-color:#fe6902;
      color:#fff;
      background:url("../../../static/image/mall/nu_add2.png")left center no-repeat;
      background-size:15px 15px;
      padding-left:20px;
      font-weight:600;
    }
   }
}
</style>
