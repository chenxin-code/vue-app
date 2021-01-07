<template>
  <EditLayout title="编辑区--我的资产">
    <Row type="flex" justify="start" class="row-padding" v-if="styleConfig.length">
      <Col span="24">
        <RadioGroup v-model="pageCurrentData.styleTempl">
          <template v-for="conf in styleConfig">
            <Radio :label="conf.label" v-if="conf.show">
              <span>{{conf.text}}</span>
            </Radio>
          </template>
        </RadioGroup>
      </Col>
    </Row>
    <template v-if="pageCurrentData.styleTempl == 1">
      <Row class="row-padding row-bottom-line">
        <Col span="24" class="card">
          <img src="static/images/my-assets/style1.jpg">
        </Col>
      </Row>
      <Row class="row-padding row-bottom-line my-padding">
        <Checkbox v-model="pageCurrentData.isShowYJ" @on-change="selectChanged">是否显示油金</Checkbox>
      </Row>
    </template>
    <template v-if="pageCurrentData.styleTempl == 3 || pageCurrentData.styleTempl == 2">
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="3"> 上留白
        </Col>
        <Col offset="1" span="18">
          <Slider :max="10" :step="0.2" width="300px" v-model="pageCurrentData.upMargin"></Slider>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle" class="row-padding">
        <Col span="3"> 下留白
        </Col>
        <Col offset="1" span="18">
          <Slider :max="10" :step="0.2" width="300px" v-model="pageCurrentData.downMargin"></Slider>
        </Col>
      </Row>
      <Row class="row-padding my-padding">
        <Checkbox v-model="pageCurrentData.isShowYJ" @on-change="selectChanged">是否显示油金</Checkbox>
      </Row>
      <Row class="row-padding row-bottom-line my-padding">
        <Checkbox v-model="pageCurrentData.isShowJF" @on-change="selectChanged">是否显示积分</Checkbox>
      </Row>
      <Row class="row-padding row-bottom-line my-padding" style="min-height:53px;">
        <template v-if="reloadDrag">
          <Col span="3">拖拽排序</Col>
          <Col offset="1" span="18">
            <draggable :list="pageCurrentData.sortArr" @end="dragEnd">
              <div 
                class="card-str line_circle" 
                v-for="(item) in pageCurrentData.sortArr" 
                :key="item._uid"
                v-show="
                  (item.countKey=='cardNum' && pageCurrentData.isShowJYK) ||  // 加油卡
                  (item.countKey=='couponNum' && pageCurrentData.isShowDZQ) ||  // 电子券
                  (item.countKey=='surplusPoints' && pageCurrentData.isShowJF) || // 积分
                  (item.rewardType==100 && pageCurrentData.isShowYJ)  // 油金
                "
                >
                <!-- :class="{'card-active':item.countKey==actKey}" -->
                <!-- @click="setName(item,idx)" -->
                {{item.name}}
              </div>
            </draggable>
            <!-- <Input v-model="inpName" search :enter-button="'设置'+actSortData.defaultName" placeholder="设置按钮名称" style="margin-top:10px" @on-search="changeName"/> -->
          </Col>
        </template>
      </Row>
    </template>
    <BgEdit></BgEdit>
  </EditLayout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import BgEdit from "../base/bg-edit";
  import Bus from '../bus'
  import draggable from 'vuedraggable';

  export default {
    name: 'auxiliary-edit',
    components: {
      draggable,
      BgEdit,
    },
    computed: {
      ...mapGetters(['pageData', 'pageCurrentData']),
      actSortData(){
        const data = this.pageCurrentData.sortArr.find(item => item.countKey == this.actKey);
        return data || {defaultName:'xxx'};
      }
    },
    data() {
      return {
        reloadDrag:true,
        myCenterStyle: 1,
        actKey:0,
        inpName:'',
        templateList: [
          {
            name: '默认',
            img: 'static/images/rubik/1-2.png',
            id: '',
          },
        ],
        styleConfig: [],
      };
    },
    created(){
      this.initStyleConfig();
    },
    mounted() {
      if (!this.pageCurrentData.sortArr) {
        this.pageCurrentData.sortArr = [
          {
            name: '加油卡',
            defaultName: '加油卡',
            countKey: 'cardNum',
            _uid:this.getUid(),
          }, 
          {
            name: '电子券',
            defaultName: '电子券',
            countKey: 'couponNum',
            _uid:this.getUid(),
          }, 
          {
            name: '油金',
            defaultName: '油金',
            rewardType: '100',
            _uid:this.getUid(),
          },
          {
            name: '积分',
            defaultName: '积分',
            countKey: 'surplusPoints',
            _uid:this.getUid(),
          }, 
        ]
      }
      this.actKey = this.pageCurrentData.sortArr[0].countKey;
    },
    methods: {
      setName(item,idx){
        this.actKey = item.countKey;
      },
      changeName(value){
        if(!value.trim()) this.$Message.warning('按钮名称不能为空')
        this.actSortData.name = value;
        this.toBus();
      },
      toBus(){
        Bus.$emit('myAssetsRefresh')
      },
      dragEnd: function () {
        this.toBus();
        this.reloadDrag = false
        this.$nextTick(()=>{
          this.reloadDrag = true
        })
      },
      selectChanged: function () {
        this.toBus();
      },
      getUid(){
        return Math.ceil(Math.random()*100000)
      },
      initStyleConfig(){
        let menu = this.$store.state.menu;
        let menuItem = menu.find(item => item.tag == 'MyAssets')
        this.styleConfig = menuItem.styleConfig;
      },
    },
  };
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  .card {
    background-color: #fff;
    border: 1px dashed #ddd;
    padding: 10px;
    img {
      width 100%;
    }
  }
  .my-padding {
    padding-left 10px;
  }
  .card-str {
    padding 10px;
    display inline-block;
    margin 0 10px;
    cursor:pointer;
    &.card-active{
      color:#2d8cf0;
      &:before{
        border-color:#2d8cf0;
      }
    }
  }
</style>
