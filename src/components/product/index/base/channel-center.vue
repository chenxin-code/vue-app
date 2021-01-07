/**Created by liaoyingchao on 2019-08-07.*/

<template>
  <Modal class="top-pop" v-model="show" title="频道选择" @on-ok="sureEvent" :scrollable="true" width="800" @on-visible-change="changeProductsModal">
    <Row>
      <Col span="14">
        <Row type="flex" align="middle" style="height:34px;">
          <p style="margin-top: 8px;">显示个数：
            <input class="number-input" type="text" v-model="numberInput" @blur="inputChange" style="width: 100px" :disabled="pageType == 'productInfinite'"/>
            <span style="color: #999;">最小2，最大20</span>
          </p>
        </Row>
      </Col>
      <Col span="10">
        <Row type="flex" justify="end">
          <Form ref="formInline" :model="formInline" inline>
            <FormItem prop="user" class="no-margin">
              <Input type="text" v-model="formInline.name" placeholder="">
              </Input>
            </FormItem>
            <FormItem class="no-margin">
              <Button type="primary" @click="_loadChannelList()">查询</Button>
            </FormItem>
          </Form>
        </Row>
      </Col>
    </Row>
    <Row style="margin-top: 12px;" v-if="show">
      <Table border highlight-row ref="currentRowTable" :columns="RadioColumns" :data="channelGroups" @on-current-change="currentChange" height="375">
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
    name: "channel-center",
    components: {},
    data() {
      return {
        channelGroups: [],
        selectedIdx: "-1",
        setting: '',
        show: false,
        pageType: '',
        numberInput: 6,
        backData: null,
        formInline: {
          name: ''
        },
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
            title: "Name",
            key: "name"
          }
          // {
          //   title: "StoreOuCode",
          //   key: "storeCode"
          // }
        ],
        totalCount: 1,
        pageSize: "20",
        pageIndex: "1",
      }
    },
    methods: {
      inputChange:function(e){
        let value = e.target.value ;
        let reg =/[^0-9]/ig;
        value = value.replace(reg, "")
        if (value < 2) {
          value = '2'
        } else if (value > 20) {
          value = '20'
        }
        this.numberInput = value;
      },
      sureEvent: function () {
        if (this.backData) {
          let d = deepCopy(this.backData);
          d.number = this.numberInput
          this.callback(d);
        } else {
          this.callback(null);
        }
        this.show = false;
      },
      changeProductsModal: function (params) {
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
      _loadChannelList: function () {
        let url = '/system/jqGrid/pro_mer_category/getProChannelGroupList';
        let paramsData = {
          token: this.$store.state.login.token,
          rows: 100,
          page: 1,
          name: this.formInline.name
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.data) {
              this.channelGroups = data.data;
            }
          },
          error => {
          }
        );
      }
    },
    created() {
      Bus.$on("showChannelCenter", busData => {
        let pageType = busData.pageType
        if (pageType == 'productInfinite') {
          this.pageType = pageType
          this.numberInput = 10
        } else {
          this.pageType = ''
        }
        this.setting = busData;
        this.callback = this.setting.fn;
        this.show = true;
      });
      this.ouCode = this.$route.query.ouCode;
      this._loadChannelList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .channel-center {
    width 100%
    height 100%
    overflow hidden
  }
  .number-input {
    background-color #efefef;
    padding 8px 5px;
    border-radius 3px;
  }
</style>
