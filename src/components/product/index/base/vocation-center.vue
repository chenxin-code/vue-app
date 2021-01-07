/**Created by liaoyingchao on 2020-07-16.*/

<!--<template>-->
  <!--<div class="vocation-center">-->
    <!---->
  <!--</div>-->
<!--</template>-->

<template>
  <Modal class="top-pop" v-model="show" title="职业认证列表" @on-ok="sureEvent" :scrollable="true" width="800" @on-visible-change="changeVocationModal">
    <Form inline>
      <FormItem>
        <Input type="text" v-model="clusterName" placeholder="请输入名称">
        </Input>
      </FormItem>
      <!--<FormItem>-->
      <!--<Input type="text" v-model="sort.mchName" placeholder="请输入商店名称">-->
      <!--</Input>-->
      <!--</FormItem>-->
      <FormItem>
        <Button type="primary" @click="_loadVocationList()">搜索</Button>
      </FormItem>
      <!--<FormItem style="float: right;">-->
      <!--<RadioGroup v-model="deliverType" @on-change="_getProductList('1')">-->
      <!--<Radio label="1">自提</Radio>-->
      <!--<Radio label="2">配送</Radio>-->
      <!--</RadioGroup>-->
      <!--</FormItem>-->
    </Form>
    <Row style="margin-top: 12px;" v-if="show">
      <Table border highlight-row ref="currentRowTable" :columns="RadioColumns" :data="vocations" @on-current-change="currentChange" height="375">
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
    name: "shop-center",
    components: {},
    data() {
      return {
        vocations: [],
        selectedIdx: "-1",
        setting: '',
        show: false,
        backData: null,
        clusterName: '',
        callback: function () {
          console.log("no callback");
        },
        RadioColumns: [
          {
            title: "id",
            key: "id",
            width: 80
          },
          {
            title: "图片",
            key: "clusterImgUrl",
            width: 100,
            align: "center",
            render: (h, params) => {
              return h("img", {
                attrs: {
                  src: params.row.clusterImgUrl
                },
                style: {
                  width: "50px",
                  height: "50px",
                  display: "block",
                  margin: "0 auto"
                }
              });
            }
          },
          {
            title: "clusterName",
            key: "clusterName"
          },
          {
            title: "creatorName",
            key: "creatorName"
          },
          {
            title: "createTime",
            key: "createTime"
          }
        ],
        totalCount: 1,
        pageSize: "20",
        pageIndex: "1",
      }
    },
    methods: {
      sureEvent: function () {
        if (this.backData) {
          let d = deepCopy(this.backData);
          this.callback(d);
        } else {
          this.callback(null);
        }
        this.show = false;
      },
      changeVocationModal: function (params) {
        if (params) return false;
        // if (this.isMultiple == false) {
        this.$refs.currentRowTable.clearCurrentRow();
        // } else if (this.isMultiple == true) {
        //   this.$refs.selectTable.selectAll(false);
        // }
      },
      currentChange: function (currentRow, oldCurrentRow) {
        this.backData = currentRow;
      },
      _loadVocationList: function () {
        let url = '/system/json/app_page_conf/industryClusterList';
        let paramsData = {
          token: this.$store.state.login.token,
          rows: 50,
          page: 1,
          clusterName: this.clusterName
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.data) {
              this.vocations = data.data;
            }
          },
          error => {
          }
        );
      }
    },
    created() {
      Bus.$on("showVocationCenter", busData => {
        this.setting = busData;
        this.callback = this.setting.fn;
        this.show = true;
      });
      this.ouCode = this.$route.query.ouCode;
      this._loadVocationList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .shop-center {
    width 100%
    height 100%
    overflow hidden
  }
</style>
