<template>
  <div class="choose-travel-content">
    <div class="travel-content">
      <div class="travel-header">
        <div class="header-content">
          <a href="javascript:;" class="link-btn link-add" @click="onAddTravel">
            <span>新增出行人</span>
          </a>
        </div>
      </div>
      <div class="travel-list">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="到底了"
          @load="onLoad"
        >
          <van-swipe-cell v-for="(item, index) in travelerList" :key="index">
            <div class="list-item" @click="onSelect(item)">
              <div class="item-check">
                <img
                  v-if="isCheckCur(item)"
                  src="@assets/images/travel/choose-active-icon.png"
                />
                <img
                  src="@assets/images/travel/choose-icon.png"
                  alt=""
                  v-else
                />
              </div>
              <div class="item-content">
                <div class="item-info">
                  <div class="item-name">
                    {{ item.name }}
                  </div>
                  <div
                    class="item-tag"
                    :class="[
                      item.travlerType == 'CHILD' ? 'item-tag-child' : ''
                    ]"
                  >
                    {{ item.travelerTypeName }}
                  </div>
                </div>
                <div class="item-certid">
                  {{ item.cerTypeName }} {{ item.cerNo }}
                </div>
              </div>
              <div class="item-edit" @click.stop="onEdit(item)">
                <img
                  class="edit-icon"
                  src="@assets/images/travel/edit-traver.png"
                  alt=""
                />
              </div>
            </div>
            <template #right>
              <van-button
                square
                text="删除"
                type="danger"
                class="delete-button"
                @click="onDel(item)"
              />
            </template>
          </van-swipe-cell>
        </van-list>
      </div>
    </div>
    <timesConfirmButton @submit-click="onConfirm" />
  </div>
</template>

<script>
import traveler from "@/api/request/apiAddress/traveler";
import { travlerTypeList, cerTypeList } from "./hooks";
export default {
  name: "chooseTravel",
  components: {},
  data() {
    return {
      //上拉加载交易单
      finished: false,
      loading: false,
      travlerTypeList: travlerTypeList(),
      cerTypeList: cerTypeList(),
      //查询出行人表单
      travelForm: {
        pageNum: 1,
        pageSize: 10,
        userId: ""
      },
      //配置form确认
      travelConfirmForm: {
        adultNum: 0,
        childrenNum: 0,
        travelerDtoList: [
          // {
          //   cerNo: "string",
          //   cerType: "string",
          //   cerTypeName: "string",
          //   id: 0,
          //   isDefault: 0,
          //   name: "string",
          //   phone: "string",
          //   travelerTypeName: "string",
          //   travlerType: "string",
          //   userId: 0
          // }
        ]
      },
      travelerSelectList: [],
      travelerList: [],
      travelerData: {
        current: 0,
        hitCount: true,
        pages: 0,
        records: [
          // {
          //   cerNo: "10002022",
          //   cerType: "ID",
          //   cerTypeName: "身份证",
          //   id: 0,
          //   isDefault: 0,
          //   name: "张三",
          //   phone: "136****9877",
          //   travelerTypeName: "成人",
          //   userId: 0,
          //   travlerType: "ADULT"
          // },
          // {
          //   cerNo: "10002022",
          //   cerType: "ID",
          //   cerTypeName: "身份证",
          //   id: 0,
          //   isDefault: 0,
          //   name: "李四",
          //   phone: "136****9877",
          //   travelerTypeName: "儿童",
          //   userId: 0,
          //   travlerType: "CHILD"
          // }
        ],
        searchCount: true,
        size: 0,
        total: 0
      }
    };
  },
  created() {},
  mounted() {
    const travelerDataStore = this.travelerDataStore;
    this.travelerSelectList = [...travelerDataStore.travelerDtoList];
  },
  computed: {
    //获取vuex的修改出行人信息
    travelerDataStore() {
      return this.$store.state.traveler.travelPerson;
    },
    //获取
    editTravelPerson() {
      return this.$store.state.traveler.editTravelPerson;
    }
  },
  methods: {
    //交易单异步更新数据
    onLoad() {
      // 异步更新数据
      this.getList();
    },
    //获取初始化数据
    getInit() {
      this.travelForm.pageNum = 1;
      this.getList();
    },
    //删除出行人
    async onDel(item) {
      this.$confirm({
        // title: "提示",
        message: "是否删除出行人",
        beforeClose: (res, done) => {
          console.log("beforeClose--->", res);
          if (res == "confirm") {
            const params = {
              id: item.id,
              userId: item.userId
            };
            traveler.delTraveler(params).then(res => {
              if (res.code == 200) {
                this.onSelect(item);
                this.getInit();
              }
              if (res.message) {
                this.$toast(res.message);
              }
              done();
            });
          } else {
            done();
          }
        }
      });
    },
    //是否选中当前的出行人
    isCheckCur(item) {
      const findIndex = this.travelerSelectList.findIndex(its => {
        return its.cerNo == item.cerNo && its.name == item.name;
      });
      return findIndex !== -1;
    },
    //点击选择出行人
    onSelect(item) {
      console.log("onSelect--->", item);
      const findIndex = this.travelerSelectList.findIndex(its => {
        return its.cerNo == item.cerNo && its.name == item.name;
      });
      if (findIndex == -1) {
        this.travelerSelectList.push(item);
      } else {
        this.travelerSelectList.splice(findIndex, 1);
      }
    },
    //新增出行人
    onAddTravel() {
      this.$router.push({
        path: "/travel/editTravel",
        query: {}
      });
    },
    //编辑
    onEdit(item) {
      this.$store.dispatch("traveler/setEditTravelPerson", item);
      this.$router.push({
        path: "/travel/editTravel",
        query: {
          isBuild: 1
        }
      });
    },
    //编辑
    getList() {
      const params = {
        ...this.travelForm
      };
      traveler.getTravelerList(params).then(res => {
        if (res.code == 200) {
          const data = res.data;
          const records = [...this.travelerData.records, ...data.records];
          this.travelerData = {
            ...data,
            records: records
          };
          this.travelerList = this.travelerData.records;
          //只需要展示一个
          const total = data.total;
          const length = this.travelerList.length;
          if (total > length) {
            this.loading = false;
            this.finished = false;
            this.travelForm.pageNum++;
          } else {
            this.loading = true;
            this.finished = true;
          }
        } else {
          if (res.message) {
            this.$toast(res.message);
          }
        }
      });
    },
    //校验出行人信息
    vaildTravelForm() {
      const adultNum = this.travelerDataStore.adultNum;
      const childrenNum = this.travelerDataStore.childrenNum;
      const nullPhone = this.travelerSelectList.every(item => {
        return !item.phone;
      });
      const selectAudlt = this.travelerSelectList.filter(its => {
        return its.travlerType == "ADULT";
      });
      const selectChildren = this.travelerSelectList.filter(its => {
        return its.travlerType == "CHILD";
      });
      const selectAudltNum = selectAudlt.length;
      const selectChildrenNum = selectChildren.length;
      let message = "";
      return new Promise((resolve, reject) => {
        if (
          adultNum == selectAudltNum &&
          childrenNum == selectChildrenNum &&
          !nullPhone
        ) {
          resolve();
        } else {
          if (adultNum !== selectAudltNum) {
            if (adultNum > 0 && childrenNum > 0) {
              message = `请按您的出行人数添加旅客：<br> ${adultNum}成人 ${childrenNum}儿童`;
            } else {
              message = `请按您的出行人数添加旅客：<br> ${adultNum}成人`;
            }
          }
          if (childrenNum !== selectChildrenNum) {
            if (adultNum > 0 && childrenNum > 0) {
              message = `请按您的出行人数添加旅客：<br> ${adultNum}成人 ${childrenNum}儿童`;
            } else {
              message = `请按您的出行人数添加旅客：<br>  ${childrenNum}儿童`;
            }
          }
          if (adultNum == 0 && childrenNum > 0) {
            message = `出于安全考虑，<br> 18岁以下未成年人需要至少一名成年旅客陪同`;
          }
          if (nullPhone) {
            message = `请至少填写一位出行旅客的手机号码`;
          }
          if (message) {
            this.$dialog({
              message: message,
              confirmButtonText: "我知道了"
            });
          }
          reject();
        }
      });
    },
    //提交出行人列表信息
    async onConfirm() {
      await this.vaildTravelForm();
      const form = {
        ...this.travelConfirmForm,
        ...this.travelerDataStore
      };
      const params = {
        adultNum: form.adultNum,
        childrenNum: form.childrenNum,
        travelerDtoList: this.travelerSelectList
      };
      traveler.confirmGetTraveler(params).then(res => {
        if (res.code == 200) {
          // const data = res.data;
          console.log("res------->", res);
          this.$store.dispatch("traveler/setTravelPerson", params);
          this.$router.back();
        } else {
          if (res.message) {
            this.$toast(res.message);
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.choose-travel-content {
  .delete-button {
    height: 100%;
  }
  .travel-header {
    margin: 8px 6px;
    background-color: #fff;
    padding: 16px;
    .header-content {
      text-align: center;
      padding: 12px;
      background: #ffffff;
      border-radius: 12px;
      border: 1px dashed #e8374a;
      .link-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          display: block;
          font-size: 15px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #e8374a;
          line-height: 21px;
        }
        &::before {
          content: "";
          display: block;
          width: 16px;
          height: 16px;
          background-image: url("~@assets/images/travel/add-traver.png");
          background-size: 100%;
        }
      }
    }
  }
  .travel-list {
    margin: 0 6px;
    margin-bottom: 100px;
    .list-item {
      margin: 6px 0;
      padding: 20px 20px 20px 20px;
      background: #ffffff;
      box-shadow: 0px 3px 15px 0px rgba(71, 77, 96, 0.06);
      border-radius: 6px;
      display: flex;
      align-items: center;
      // justify-content: space-between;
      .item-check {
        width: 20px;
        height: 20px;
        img {
          display: block;
          width: 20px;
          height: 20px;
        }
      }
      .item-content {
        margin-left: 5px;
        flex: 1;
        .item-info {
          display: flex;
          margin-bottom: 6px;
          .item-name {
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            line-height: 20px;
          }
          .item-tag {
            display: inline-block;
            margin-left: 5px;
            font-size: 10px;
            background: #fcecee;
            border-radius: 5px;
            color: #e8374a;
            padding: 0 3px;
            height: 20px;
            line-height: 20px;
            &.item-tag-child {
              color: #2acfa6;
              background: #edfffb;
            }
          }
        }
        .item-certid {
          font-size: 12px;
          font-weight: 400;
          color: #666666;
          line-height: 17px;
        }
      }
      .item-edit {
        padding: 12px 0 12px 12px;
        img {
          display: block;
          width: 16px;
          height: 16px;
        }
      }
    }
  }
}
</style>
