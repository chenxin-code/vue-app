/**Created by liaoyingchao on 2019-07-02.*/

<template>
  <Modal class="top-pop" v-model="show" title="新闻中心" @on-ok="sureEvent" :scrollable="true" width="800" @on-visible-change="changeProductsModal">
    <Form :model="sort" inline>
      <FormItem>
        <Input type="text" v-model="sort.skuName" placeholder="请输入新闻名称">
        </Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="_loadNewsList()">搜索</Button>
      </FormItem>
    </Form>
    <Row style="margin-top: 12px;" v-if="show">
      <Table border highlight-row ref="currentRowTable" :columns="RadioColumns" :data="newsList" @on-current-change="currentChange" height="375">
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
    name: "news-center",
    components: {},
    data() {
      return {
        newsList: [],
        selectedIdx: "-1",
        setting: '',
        show: false,
        backData: null,
        sort: {
          skuName: ''
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
            title: "categoryName",
            key: "categoryName"
          },
          {
            title: "title",
            key: "title"
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
      changeProductsModal: function (params) {
        if (params) return false;
        this.$refs.currentRowTable.clearCurrentRow();
      },
      currentChange: function (currentRow, oldCurrentRow) {
        this.backData = currentRow;
      },
      _loadShopList: function () {
        let url = '/system/jqGrid/news/list';
        let paramsData = {
          token: this.$store.state.login.token,
          rows: 20,
          page: 1,
          isEnable: 1,
          examineState: 1
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.data) {
              this.newsList = data.data;
            }
          },
          error => {
          }
        );
      }
    },
    created() {
      Bus.$on("showNewsCenter", busData => {
        this.setting = busData;
        this.callback = this.setting.fn;
        this.show = true;
      });
      this.ouCode = this.$route.query.ouCode;
      this._loadShopList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .news-center {
    width 100%
    height 100%
    overflow hidden
  }
</style>
