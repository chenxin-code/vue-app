/**Created by steven on 2018/4/20.*/

<template>
  <div>
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="selectcitybottom" :ref="$route.path">
        <div class="allcity-bar" ref="allcitybar">
          <div v-if="$route.path == '/cityselector/0'" class="city-item-list">
            <div class="city-title-1">当前位置</div>
            <ul>
              <li @click.stop="selectLocal" class="city-item">{{(localtion.city && localtion.city != '') ? localtion.city : '定位中...'}}</li>
            </ul>
          </div>
          <div v-if="cityList" class="city-item-list" v-for="(list, word) in cityList">
            <div class="city-title">{{word}}</div>
            <ul>
              <li @click.stop="selectCity(city)" class="city-item" v-for="(city, index) in list">{{city.areaName}}
              </li>
            </ul>
          </div>
        </div>
        <div class="fast-sel-bar">
          <p class="fast-sel-item" :class="{fastSelActive: index === curCityListIndex}"
             v-for="(list, word, index) in cityList" :data-index="index" @touchstart="onSelectFastTouchStart"
             @touchmove.stop.prevent="onSelectFastTouchMove">
            {{word}}
          </p>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'
  import BScroll from 'better-scroll';
  import '../../../utils/pinyinUtil'

  export default {
    name: "select-city",
    components: {
      Toast
    },
    data() {
      return {
        cityList: [], // 所有城市
        listHeight: [], // 每组城市的高度
        scrollY: 0, // Y方向距离
        touch: {}, //
        cityDomList: null, // 城市do
        curCityListIndex: 0, // 当前快速选择index
        areaParentId: null,
        directCity: '',
        localtion: {},
        provinceName: ''
      };
    },
    created() {
      this.directCity = this.$route.query.directCity ? this.$route.query.directCity : '';
      this.areaParentId = this.$route.query.areacode ? this.$route.query.areacode : null;
      this.provinceName = this.$route.query.province ? decodeURIComponent(this.$route.query.province) : ''
      this.getCityList();
      this.$bridgefunc.getLocation((locationinfo) => {
        this.localtion = locationinfo
      })
    },
    mounted() {
      this.cityDomList = this.$refs.allcitybar.getElementsByClassName('city-item-list');
    },

    watch: {
      scrollY(newY) {
        const listHeight = this.listHeight;
        // 当滚动到顶部，newY>0
        if (newY > 0) {
          this.curCityListIndex = 0;
          return;
        }
        // 在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i];
          let height2 = listHeight[i + 1];
          if (-newY >= height1 && -newY < height2) {
            this.curCityListIndex = i;
            this.diff = height2 + newY;
            return;
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限;
        this.currentIndex = listHeight.length - 2;
      },

      // '$route' (to, from) {
      //   //刷新参数放到这里里面去触发就可以刷新相同界面了
      //   this.areaParentId = this.$route.query.areacode ? this.$route.query.areacode : null;
      //   this.getCityList();
      // }

    },
    methods: {
      backEvent: function () {
        this.$router.go(-1)
      },
      selectLocal: function () {
        if (this.$store.state.location.selectType == '4') {
          let locationinfo = {
            province: this.localtion.province,
            city: this.localtion.city,
            district: this.localtion.area
          }
          if (this.localtion.city == this.localtion.province) {
            locationinfo.city = this.localtion.area
            locationinfo.district = ''
          }
          this.$mallCommon.pureLocationAnalysis((address) => {
            sessionStorage.setItem('Address_City_Seleted', JSON.stringify(address))
            this.$router.go(-1)
          }, locationinfo)
          return ;
        }

        this.$mallCommon.addressAnalysis((result, address) => {
          console.log(address)
          this.$store.state.indexData.province = this.localtion.province;
          this.$store.state.indexData.city = this.localtion.city;
          if (result) {
            this.$store.state.indexData.provinceId = address.provinceId;
            this.$store.state.indexData.cityId = address.cityId;
          }
          this.$router.go(-1)
        }, this.localtion);
      },
      _updateArea: function (province, city,provinceCode,cityCode) {
        this.$Loading.open('保存中')
        let url = '/app/json/user/modifyUserInfo';
        let token = this.$store.state.login.token
        let userInfo = this.$store.state.userInfo

        let params1 = {
          realName:userInfo.realName?userInfo.realName:'',
          gender:userInfo.gender?userInfo.gender:'',
          email:userInfo.email?userInfo.email:'',
          idType:userInfo.idType?userInfo.idType:'',
          idNumber:userInfo.idNumber?userInfo.idNumber:'',
          address:userInfo.address?userInfo.address:'',
          provinceName: province,
          cityName: city,
          provinceCode:provinceCode,
          cityCode:cityCode,
          postCode:'',
          userType:'',
          token:token
        }
        console.log(params1);
        this.$http.post(url, params1).then(res => {
          this.$Loading.close();
          let data = res.data;
          console.log('地区', data)
          if (data.status == 0) {
            Toast({
              message: '修改地区成功',
              position: 'bottom',
              duration: 2000,
            });
            this.$store.state.userInfo.provinceName = province
            this.$store.state.userInfo.cityName = city
            this.$store.state.location.selectType = '0'
            if (this.directCity == '1') {
              this.$router.go(-1)
            } else {
              this.$router.go(-2)
            }
          } else {
            Toast({
              message: data.info ? data.info :'修改地区失败',
              position: 'bottom',
              duration: 2000,
            });
          }
        }, error => {
          this.$Loading.close();
          console.log('修改地区失败', error)
          Toast({
            message: '修改地区失败',
            position: 'bottom',
            duration: 2000,
          });
        })
      },
      selectCity: function (city) {
        //存在是最后以及   不存在往下选区
        if (this.areaParentId) {
          let province = this.provinceName;
          if (this.$store.state.location.selectType == '3') {
            this._updateArea(province, city.areaName,this.areaParentId,city.areaCode)
            return
          } else if (this.$store.state.location.selectType == '1') {
            this.$store.state.location.login.province = province
            this.$store.state.location.login.city = city.areaName
            this.$store.state.location.selectType = '0'
            if (this.directCity == '1') {
              this.$router.go(-1)
            } else {
              if (this.$store.state.globalConfig.onlyProvince_area == '1') {
                this.$router.go(-1)
              } else {
                this.$router.go(-2)
              }
            }
            return
          } else if (this.$store.state.location.selectType == '2') {
            this.$store.state.indexData.province = province
            this.$store.state.indexData.city = city.areaName
            this.$store.state.indexData.cityId = city.areaCode
            this.$store.state.location.selectType = '0'
            this.$bridgefunc.vuexStorage(()=>{
              if (this.directCity == '1') {
                this.$router.go(-1)
              } else {
                if (this.$store.state.globalConfig.onlyProvince_area == '1') {
                  this.$router.go(-1)
                } else {
                  this.$router.go(-2)
                }
              }
            })
            return
          } else if (this.$store.state.location.selectType == '4') {

            let location = {
              cityName: city.areaName,
              cityId: city.areaCode,
              provinceId: this.areaParentId,
              provinceName: province,
            }
            sessionStorage.setItem('Address_City_Seleted', JSON.stringify(location))
            if (this.$store.state.globalConfig.onlyProvince_area == '1') {
              this.$router.go(-1)
            } else {
              this.$router.go(-2)
            }
          }
        } else {
          this.$router.push({
            path: '/cityselector/'+city.areaCode,
            isnativetop:1,
            query: {
              areacode:city.areaCode,
              province:encodeURIComponent(city.areaName)
            }

          })
        }
      },
      getShortName: function (longname) {
        let shortname = longname;
        if (shortname.indexOf("省") != -1 || shortname.indexOf("市") != -1) {
          shortname = shortname.substring(0, shortname.length - 1);
        }
        return shortname;
      },
      getCityList: function () {

        this.$Loading.open();
        let url = '/app/json/home/getAreaList';
        let params1 = {}
        if (this.areaParentId) {
          params1.areaParentId = this.areaParentId;
        }
        this.$http.post(url, params1).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (this.$store.state.globalConfig.onlyProvince_area == '1' && !this.areaParentId) {
            let list = data.data
            for (let i = 0; i < list.length; i++) {
              let itm = list[i]
              if (this.getShortName(itm.areaName) == this.getShortName(this.$store.state.globalConfig.province)) {
                this.areaParentId = itm.areaCode
                this.directCity = itm.areaName;
                this.provinceName = itm.areaName;
                this.getCityList()
                return ;
              }
            }
            return
          }
          let tempCityData = this.formCityData(data.data);
          this.cityList = tempCityData;
          let that = this;
          this.$nextTick(function () {
            that._initScroll();
            that.calculateHeight();
          })
        }, error => {
          this.$Loading.close();
          console.log('获取首页', error)
        })
      },
      formCityData: function (data) {
        let pinyinData = data.map(dic => ({
          areaName: dic.areaName,
          firstLetter: this.getFirstLetter(dic.areaName),
          areaCode: dic.areaCode,  // 可以自选择不同的生成拼音方案和风格。
        }));
        let sortedData = pinyinData.sort((a, b) => {
          return a.firstLetter.localeCompare(b.firstLetter);
        }).map(dic => ({
          areaName: dic.areaName,
          firstLetter: dic.firstLetter.toLocaleUpperCase(),
          areaCode: dic.areaCode,  // 可以自选择不同的生成拼音方案和风格。
        }));

        let tempCityData = {};
        for (let i = 0; i < sortedData.length; i++) {
          let cityDic = sortedData[i]
          let key = cityDic.firstLetter
          let arr = tempCityData[key];
          if (!arr) {
            arr = [];
          }
          arr.push(cityDic);
          tempCityData[key] = arr;
        }
        return tempCityData;
      },
      getFirstLetter:function(areaName){
        if(areaName.indexOf("重庆") != -1){
          return 'C'
        } else if (areaName.indexOf("长春") != -1) {
          return 'C'
        }else {
          return pinyinUtil.getFirstLetter(areaName.substr(0, 1), false)[0]
        }

      },

    /**
       * [初始化scroll]
       * @param  {[type]}         [无入参]
       * @return {[type]}         [无返回值]
       */
      _initScroll: function () {
        let ref = this.$route.path;
        this.cityListScroll = new BScroll(this.$refs[ref], {
          click: true,
          probeType: 3
        });
        this.cityListScroll.on('scroll', (pos) => {
          this.scrollY = pos.y;
        });
      },
      /**
       * [计算每个城市区块的高度]
       * @param  {[type]}         [无入参]
       * @return {[type]}         [无返回值]
       */
      calculateHeight: function () {
        this.$nextTick(() => {
          let cityList = this.$refs.allcitybar.getElementsByClassName('city-item-list');
          let height = 0;
          this.listHeight.push(height);
          for (let i = 0; i < cityList.length; i++) {
            let item = cityList[i];
            height += item.clientHeight;
            this.listHeight.push(height);
          }
        });
      },
      /**
       * [跳转到快速检索对应首字母的位置]
       */
      onSelectFastTouchStart: function (e) {
        let anchorIndex = e.target.getAttribute('data-index');
        let firstTouch = e.touches[0];
        this.touch.y1 = firstTouch.pageY;
        this.touch.anchorIndex = anchorIndex;
        let el = this.cityDomList[anchorIndex];
        this.scrollY = -this.listHeight[anchorIndex];
        this.cityListScroll.scrollToElement(el);
      },
      /**
       * [滑动到快速检索对应首字母的位置]
       */
      onSelectFastTouchMove: function (e) {
        let firstTouch = e.touches[0];
        this.touch.y2 = firstTouch.pageY;
        let itemHeight = 0.4 * parseInt(20); // 高度为0.4rem，换算为实际高度
        let delta = (this.touch.y2 - this.touch.y1) / itemHeight | 0;
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
        let el = this.cityDomList[anchorIndex];
        this.scrollY = -this.listHeight[anchorIndex];
        this.cityListScroll.scrollToElement(el);
      },

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';

  $cell-height = 40px

  .selectcitybottom {
    position absolute
    top 0px
    bottom 0px
    left 0px
    right 0px
    overflow hidden

    .allcity-bar {
      width: 100%;
      font-size $font-size-medium-x
      background-color: #FFFFFF;
      .city-item-list {
        .city-title {
          padding-left: 10px;
          height: $cell-height;
          line-height: $cell-height;
          color: #666666;
          background-color: #EEEEEE;
        }
        .city-title-1 {
          padding-left: 10px;
          height: $cell-height;
          line-height: $cell-height;
          color: #333;
          font-size $font-size-medium
          background-color: #EEEEEE;
        }
      }
    }
    .fast-sel-bar {
      position: fixed;
      top: 80px;
      right: 0;
      width: 40px;
      text-align: center;
      .fast-sel-item {
        height: 20px;
        line-height: 20px;
        color: #999999;
      }
      .fastSelActive {
        color: #F28300;
      }
    }
    ul {
      padding: 0 10px;
      font-size: $font-size-medium-x;
      background-color: #FFFFFF;
      .city-item {
        padding-left: 10px;
        height: $cell-height;
        line-height: $cell-height;
        border-bottom: 1px solid #EEEEEE;
      }
    }

  }
</style>
