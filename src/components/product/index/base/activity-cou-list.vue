/**Created by liaoyingchao on 2020-08-29.*/

<template>
  <Modal class="top-pop" v-model="show" title="券列表" @on-ok="sureEvent" :scrollable="true" width="800" @on-visible-change="changeProductsModal">
    <!--<Row style="margin-top: 8px;">-->
      <!--<Col span="14">-->
        <!--<span class="row-label">活动类型</span>-->
        <!--<RadioGroup v-model="activityType" @on-change="pageTypeChanged">-->
          <!--<Radio label="8">换券活动</Radio>-->
          <!--<Radio label="6">促销活动</Radio>-->
          <!--<Radio label="500003">领券活动</Radio>-->
        <!--</RadioGroup>-->
      <!--</Col>-->
      <!--<Col span="10">-->
        <!--<p>显示个数：-->
          <!--<input class="number-input" type="text" v-model="numberInput" @blur="inputChange" @ style="width: 100px" :disabled="pageType == 'productInfinite'"/>-->
          <!--<span style="color: #999;">最小2，最大100</span>-->
        <!--</p>-->
      <!--</Col>-->
    <!--</Row>-->
    <Row style="margin-top: 12px;" v-if="show">
      <Table v-if="isMultiple == false" border highlight-row ref="currentRowTable" :columns="RadioColumns" :data="list" @on-current-change="currentChange" height="375">
      </Table>
      <!--<Table v-if="isMultiple == true" border ref="selectTable" :columns="selectColumns" :data="activities" @on-selection-change="selectionChange" height="375">-->
      <!--</Table>-->
    </Row>
  </Modal>
</template>

<script>
  import Bus from "../bus";
  import {deepCopy} from "@/utils/util";

  export default {
    name: "activity-cou-list",
    components: {},
    data() {
      return {
        activityType: '8',
        token: this.$store.state.login.token,
        ouCode: "",
        list: [],
        numberInput: 6,
        selectedIdx: "-1",
        show: false,
        setting: "",
        backData: null,
        callback: function () {
          console.log("no callback");
        },
        RadioColumns: [
          {
            title: "Name",
            key: "couTypeTitle"
          },
          {
            title: "Code",
            key: "couTypeCode"
          }
        ],
        selectColumns: [
          {
            title: "Name",
            key: "couTypeTitle"
          },
          {
            title: "Code",
            key: "couTypeCode"
          }
        ],
        totalCount: 1,
        pageSize: "20",
        pageIndex: "1",
        sort: {
          skuName: '',
          mchName: '',
          sortType: 'asc'
        },
        pageType: '',
        isMultiple: false
      };
    },
    methods: {
      pageTypeChanged: function () {
        this._loadActivityCouponList()
      },
      inputChange: function (e) {
        let value = e.target.value;
        let reg = /[^0-9]/ig;
        value = value.replace(reg, "")
        if (value < 2) {
          value = '2'
        } else if (value > 100) {
          value = '100'
        }
        this.numberInput = value;
      },
      selectEvent: function (idx) {
        this.selectedIdx = idx;
      },
      sureEvent: function () {
        if (this.backData) {
          let d = deepCopy(this.backData);
          if (this.isMultiple == false) {
            this.callback({
              name: d.couTypeTitle,
              coupon: d,
              number: this.numberInput,
            });
          } else {
            // if (d.length == 0) {
            //   this.callback(null);
            // } else if (d.length == 1) {
            //   d = d[0]
            //   this.callback({
            //     name: d.activityName,
            //     coupon: d,
            //     number: this.numberInput,
            //   });
            // } else {
            //   let name = ''
            //   for (let i = 0; i < d.length; i++) {
            //     name += d[i].activityName + ','
            //   }
            //   name = name.substr(0, name.length - 1)
            //   this.callback({
            //     name: name,
            //     coupon: d,
            //     number: this.numberInput,
            //   });
            // }
          }
        } else {
          this.callback(null);
        }
        this.show = false;
      },
      changeProductsModal: function (params) {
        if (params) return false;
        if (this.isMultiple == false) {
          this.$refs.currentRowTable.clearCurrentRow();
        } else if (this.isMultiple == true) {
          this.$refs.selectTable.selectAll(false);
        }
      },
      currentChange: function (currentRow, oldCurrentRow) {
        this.backData = currentRow;
      },
      selectionChange: function (data) {
        this.backData = data;
      },
      _loadActivityCouponList: function () {
        let url = '/system/json/dist_center/queryActivityCouAwardList';
        let paramsData = {
          activityId: this.setting.activityId,
          token: this.$store.state.login.token
        };
        this.$Spin.show();
        this.$http.post(url, paramsData).then(
          res => {
            this.$Spin.hide();
            let data = res.data;
            if (data.data) {
              this.list = data.data;
            }
          },
          error => {
            this.$Spin.hide();
          }
        );
      }
    },
    created() {
      // this.products = productCenter.getProducts();
      Bus.$on("showActivityCouList", busData => {
        this.setting = busData;
        this.isMultiple = busData.isMultiple ? busData.isMultiple : false
        this.callback = this.setting.fn;
        this.show = true;
        this._loadActivityCouponList()
      });
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';

  .top-pop {
    z-index: 1999;
  }

  .number-input {
    background-color #efefef;
    padding 8px 5px;
    border-radius 3px;
  }
</style>
