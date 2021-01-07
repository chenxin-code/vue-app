<template>
  <div class="institutional-choice">
    <nav-top title="机构选择" @backEvent="$router.go(-1)">
      <div
        class="area"
        @click="selectArea"
      >{{address ? address : this.$store.state.mall2.selectAddress.cityName}}</div>
    </nav-top>
    <nav-content class="institutional-choice-details">
      <div class="institutional-choicee-content">
        <van-search placeholder="搜索" v-model="value" />
        <ul class="list">
          <li class="item" v-for="(item, index) in areaList" :key="index" @click="changeArea(item)">
            <div class="text">{{item.payUnitName}}</div>
          </li>
        </ul>
      </div>
      <!--地址选择弹框-->
      <!--      <address-choose ref="address" @setAddressEvent="setAddressEvent"></address-choose>-->

      <!-- <van-popup v-model="showArea" position="bottom" :overlay="true">
        <van-tree-select
          :items="items"
          :main-active-index="mainActiveIndex"
          :active-id="activeId"
          @navclick="onNavClick"
          @itemclick="onItemClick"
        />
      </van-popup>-->

      <div v-if="showArea" class="select-prov-city">
        <div class="provCity-select">
          <div class="left-prov">
            <div
              class="prov-item"
              :class="{'prov-item-active':provActive == item.provinceName}"
              v-for="(item, index) in provList"
              :key="index"
              @click="provItemClick(item)"
            >{{item.provinceName}}</div>
          </div>
          <div class="right-city">
            <div
              class="city-item"
              v-for="(item, index) in cityList"
              :key="index"
              @click="cityItemClick(item)"
            >{{item.cityName}}</div>
          </div>
        </div>
      </div>
      <div
        v-if="showArea"
        class="select-prov-city-mask"
        style="z-index: 2002;"
        @click="showArea = false"
      ></div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
import AddressChoose from '../components/address-choose'
export default {
  name: '',
  data() {
    return {
      areaList: [], // 机构列表
      value: '', // 搜索内容
      items: [], // 左侧高亮元素的index
      mainActiveIndex: 0, // 被选中元素的id
      activeId: 1,


      showArea: false, // 地址选择弹框
      list: '', // 所选地址
      address: '', // 首地址

      name: '', // 费用名称来源
      type: '', // 类型

      provList: [], // 省数据
      provActive: '',
      provId: '',
      cityList: [], // 市数据
    }
  },
  created() {
  },
  mounted() {
    this.name = this.$route.query.name
    if (this.name == 'ele') {
      this.type = '002'
    } else if (this.name == 'water') {
      this.type = '001'
    } else if (this.name == 'gas') {
      this.type = '003'
    } else if (this.name == 'phone') {
      this.type = '004'
    }
    let { provinceId, cityId, provinceName, cityName } = this.$store.state.mall2.selectAddress

    this.getProvCity('/app/json/fee_life_order/queryUtilityProvince').then(res => {
      if (res == 'ok') {
        this.provList.forEach(provItem => {
          if (provItem.provinceName == provinceName) {
            this.provId = provItem.provinceId
            this.getProvCity('/app/json/fee_life_order/queryUtilityCity', provItem.provinceId).then(res => {
              if (res == 'ok') {
                this.cityList.forEach(cityItem => {
                  if (cityItem.cityName == this.getShortName(cityName)) {
                    this.queryUtilityPayUnit(provItem.provinceId, cityItem.cityId)
                  }
                });
              }
            })
          }
        });
      }
    })

  },
  methods: {
    queryUtilityProvince() {
      // 公共事业省份查询接口
      this.$request.post('/app/json/fee_life_order/queryUtilityProvince', {
        storeOuCode: this.$store.state.globalConfig.trafficStoreOuCode
      }).then(res => {
        if (res.status === 0) {
          this.provList = JSON.parse(res.data)
          // let list = JSON.parse(res.data)
          // let dealList = []
          // list.map((value, index, arry) => {
          //   dealList.push({ 'text': value.provinceName, 'id': value.provinceId })
          // })
          // this.items = dealList
          // this.queryUtilityCity(this.items[0].id)
          // console.log(this.items)
        } else {
          this.$Toast(res.info ? res.info : '获取地区失败')
        }
      })
    },
    queryUtilityCity(provId) {
      // 公共事业城市查询接口
      this.$request.post('/app/json/fee_life_order/queryUtilityCity', {
        storeOuCode: this.$store.state.globalConfig.trafficStoreOuCode,
        provId: provId
      }).then(res => {
        if (res.status === 0) {
          this.cityList = JSON.parse(res.data)
          // let list = JSON.parse(res.data)
          // let dealList = []
          // list.map((value, index, arry) => {
          //   dealList.push({ 'text': value.cityName, 'id': value.cityId, 'provinceId': value.provinceId })
          // })
          // this.$set(this.items[this.mainActiveIndex], 'children', dealList)
          // this.activeId = this.mainActiveIndex + 1 
        } else {
          this.$Toast(res.info ? res.info : '获取地区失败')
        }
      })
    },
    queryUtilityPayUnit(provId, cityId) {
      // 公共事业缴费单位查询接口
      this.$request.post('/app/json/fee_life_order/queryUtilityPayUnit', {
        storeOuCode: this.$store.state.globalConfig.trafficStoreOuCode,
        provId: provId,
        cityId: cityId,
        type: this.type
      }).then(res => {
        if (res.status === 0) {
          this.showArea = false
          this.areaList = JSON.parse(res.data)
        } else {
          this.$Toast(res.info ? res.info : '获取地区失败')
        }
      })
    },
    changeArea(item) {
      // 到编辑账户页面
      let itemdata = Object.assign({}, item, { name: this.name, type: this.type })
      this.$router.push({ path: '/new-recharge-account', query: { name: this.name, item: JSON.stringify(itemdata) } })
    },
    selectArea() {
      this.showArea = true
      this.queryUtilityProvince()
    },
    provItemClick(item) {
      this.provActive = item.provinceName
      this.provId = item.provinceId
      this.queryUtilityCity(item.provinceId)
    },
    cityItemClick(item) {
      this.showArea = false
      this.address = item.cityName
      this.queryUtilityPayUnit(this.provId, item.cityId)
    },
    getProvCity(url, provId='', cityId = '') {
      return new Promise((resolve, reject) => {
        this.$request.post(url, {
          storeOuCode: this.$store.state.globalConfig.trafficStoreOuCode,
          provId: provId || this.provId,
          cityId: cityId,
          type: this.type
        }).then(res => {
          if (provId == '') {
            this.provList = JSON.parse(res.data)
          } else {
            this.cityList = JSON.parse(res.data)
          }
          resolve('ok')
        })
      })
    },
    getShortName: function (longname) {
      let shortname = longname;
      if (shortname.indexOf("省") != -1 || shortname.indexOf("市") != -1) {
        shortname = shortname.substring(0, shortname.length - 1);
      }
      return shortname;
    }
  },
  computed: {},
  components: {
    AddressChoose
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';
@import '../asset/recharge.styl';

.select-prov-city {
  z-index: 2003;
  position: fixed;
  max-height: 100%;
  overflow-y: auto;
  background-color: #fff;
  bottom: 0;
  left: 0;
  width: 100%;

  .provCity-select {
    height: 300px;
    position: relative;
    display: flex;

    .left-prov {
      flex: 1;
      overflow-y: auto;
      background-color: #fafafa;
      -webkit-box-flex: 1;

      .prov-item {
        position: relative;
        padding: 0 9px 0 12px;
        line-height: 43px;
        border-left: 3px solid transparent;
      }

      .prov-item-active {
        font-weight: 700;
        background-color: #fff;
        border-color: #f44;
      }
    }

    .right-city {
      -webkit-box-flex: 2;
      flex: 2;
      overflow-y: auto;
      background-color: #fff;

      .city-item {
        position: relative;
        padding-left: 15px;
        font-weight: 700;
        line-height: 43px;
      }
    }
  }
}

.select-prov-city-mask {
  z-index: 2002;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}

.institutional-choicee-content {
  padding: 11px 15px;

  .list {
    padding: 10px 0;

    .item {
      padding: 15px 0;
      border-bottom: 1px solid #ecebeb;

      .text {
        font-size: 14px;
      }
    }
  }
}

.area {
  text-align: right;
  padding-right: 10px;
  color: $color-theme-r;
  font-size: 18px;
  font-weight bold
}

/deep/ .van-search {
  padding: 2px 0;
  border-radius: 20px;

  .van-cell {
    border-radius: 20px;
    background: rgb(242, 242, 242);
  }
}
</style>
