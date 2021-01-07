/**Created by steven on 2018/4/25.*/

<template>
  <div class="mine-msg-center-details">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <h2 class="details-title">{{msgDeatil.sketch}}</h2>
      <p class="subtitle"> {{msgDeatil.appSend}} </p>
      <div class="details-conten">
        <p> {{msgDeatil.content}} </p>
      </div>
      <p class="time"> {{msgDeatil.readTime}} </p>
    </nav-content>

  </div>
</template>

<script>
import { Toast } from 'mint-ui'

export default {
  name: "mine-elticket",
  components: {
    Toast
  },
  data () {
    return {
      msgDeatil: '',
    }
  },
  methods: {
    backEvent: function () {
      this.$router.go(-1);
    },
    selectedFunc:function (item) {
      this.selected = item.id;
    },
    _getMsgInfo: function(item) {
      this.$Loading.open();
			let url = '/app/json/message/getMsgInfo';

      let params1 = {
        token:this.$store.state.login.token ? this.$store.state.login.token :'',
        id: this.$route.query.data
      }

      let _this = this
			this.$http.post(url, params1).then(
				res => {

          _this.$Loading.close();
          let data = res.data.data;
          this.msgDeatil = data;
				},
				error => {
          _this.$Loading.close();
					console.log('获取未读消息', error);
				}
			);
    }
  },
  created () {
    this._getMsgInfo()

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  @import '~@/common/stylus/regularfont.styl'

.mine-msg-center-details {
  position absolute
  top 0px
  bottom 0px
  left 0px
  right 0px
  background-color #fff;
  overflow hidden
  .details-title{
    padding:20px 0px;
    text-align:center;
    font-size:$font-size-large-x;
    font-weight:$font-weight-m;
    color:#000;
  }
  .subtitle{
    padding-left:3%;
    font-size:$font-size-medium;
    color:#000;
  }
  .details-conten{
    padding:20px 8%;
    p{
      color:#999;
      font-size:$font-size-medium;
    }
  }
  .time{
    padding:0px 3%;
    text-align:right;
    margin-top:20px;
    color:#333;
    font-size:$font-size-medium;
  }

}
</style>
