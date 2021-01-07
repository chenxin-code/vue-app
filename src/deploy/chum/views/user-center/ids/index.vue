/**Created by liaoyingchao on 2020-01-02.*/

<template>
  <div class="index">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="content">
        <div class="list">
          <div class="list-con">
            <div class="row line_bottom" @click="toMyIds(0)">
              <div class="label">身份证</div>
              <img class="zm-jiantou-12" src="../userimgs/jt.png" />
            </div>
            <div class="row" @click="toMyIds(1)">
              <div class="label">护照</div>
              <img class="zm-jiantou-12" src="../userimgs/jt.png" />
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "index",
  components: {},
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      myIds: [],
      configIds: []
    };
  },
  methods: {
    getIdsInfo: function() {
      let url = "/app/json/user/getUserCertificateList";
      this.$Loading.open();
      this.$http
        .post(url, {})
        .then(res => {
          this.$Loading.close();
          let data = res.data;
          let status = data.status;
          if (status == 0) {
            this.myIds = data.data;
          } else {
            this.$Loading.close();
            this.$Toast(data.info);
          }
        })
        .catch(err => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        });
    },
    getIdsConfig: function() {},
    getCardInfo: function(type) {
      let cateType = type;
      for (let i = 0; i < this.myIds.length; i++) {
        let item = this.myIds[i];
        if (item.cateType == cateType) {
          return item;
        }
      }
      return "";
    },
    toMyIds: function(type) {
      let idData = this.getCardInfo(type);
      if (idData == "") {
        if (type == 0) {
          this.$router.push({
            path: "/usercenter/idcardInfoedit",
            query: {
              type: type,
              fromtype: "addIds"
            }
          });
        } else {
          this.$router.push({
            path: "/usercenter/passportedit",
            query: {
              type: type,
              idData: ''
            }
          });
        }
      } else {
        this.$router.push({
          path: "/usercenter/iddetail",
          query: {
            type: type,
            idData: idData
          }
        });
      }
    }
  },
  created() {
    this.getIdsConfig();
    this.getIdsInfo();
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
.index {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .content {
    width: 100%;
    height: 100%;
    background-color: #f6f6f6;
    overflow: hidden;

    // display: flex;
    // flex-flow: column;
    // justify-content: space-around;
    .list {
      overflow-x: hidden;
      overflow-y: auto;
      padding: 20px 20px 0px 20px;

      .list-con {
        padding: 0 10px;
        background-color: white;
        border-radius: 5px;

        .row {
          overflow: hidden;
          display: flex;
          align-items: center;
          padding: 18px 0px;

          .label {
            font-size: 16px;
            // font-weight: 600;
            flex: 1;
          }

          .zm-jiantou-12 {
            width: 8px;
            height: 16.5px;
          }

          .icon-more {
            font-size: 14px;
            color: #101010;
          }
        }
      }
    }

    .bottomdes {
      flex: 1;
      margin-top: 30px;
      padding: 0px 20px 0px 20px;

      .idstip {
        font-size: 14px;
      }

      .tipdetail {
        margin-top: 5px;
        font-size: 14px;
        line-height: 20px;
        color: #101010;
      }

      .tiptel {
        line-height: 20px;
        font-size: 14px;

        .custom-phone {
          text-decoration: underline;
          color: blue;
        }
      }
    }
  }
}
</style>
