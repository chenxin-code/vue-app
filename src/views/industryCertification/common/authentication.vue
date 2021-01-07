
<template>
  <div class="box">
    <steps :activeContent="activeContent" @activeBtn="activeBtn">
      <steps-content ref="stepsContent" :activeContent="activeContent"/>
    </steps>
  </div>
</template>
<script>
import mixin from "../mixin";
import eventBus from '@/utils/eventBus.js'
export default {
  name: "authentication",
  mixins: [mixin],
  props:['getIndustryDetail'],
  data() {
    return {
      activeContent: {
        activeObj: {
          index: 0,
          type: ''
        },
        steps: []
      },
      isActiveObj: {}
    };
  },
  mounted() {
    let userClusterModel = this.getIndustryDetail.userClusterModel || {}
    for (const key in userClusterModel) {
      this.activeContent[key] = userClusterModel[key]
    }
    for (const key in this.getIndustryDetail) {
      this.activeContent[key] = this.getIndustryDetail[key]
    }
    delete this.activeContent.userClusterModel
    this.activeContent.expression = JSON.parse(this.activeContent.expression)
    this.activeContent.steps = []
    this.activeContent.expression.cardList.forEach((element,elementIndex) => {
    let value = this.stepsValue[element]
      this.activeContent.steps.push({
        lable: value,
        type: element,
        index: elementIndex
      })
    });
    if(this.activeContent.expression.idNameList.length){
      this.activeContent.steps.push({
        lable: "资格证明",
        type: "qualifications"
      })
    }
    this.activeContent.steps.push({
      lable: "提交审核",
      type: "examine"
    })
    console.log(this.activeContent,'activeContent')
    // if(usercertificate){
    //
    // }
    this.activeContent.activeObj = Object.assign(this.activeContent.activeObj,this.activeContent.steps[0])
    console.log(this.activeContent.activeObj,'activeContent')
    console.log(this.activeContent.steps,'activeContent')
    eventBus.$on('addActiveBtn', (activeObj) => {
      let nub = activeObj.index
      nub+=1
      Object.assign(this.activeContent.activeObj,this.activeContent.steps[nub])
      this.activeContent.activeObj.index = nub
    })
    eventBus.$on('isActive', (active,status,type) => {
      this.isActiveObj = JSON.parse(JSON.stringify(active))
      let arr = []
      this.activeContent.steps.forEach(res=>{
        if (res.type == 'IDcard') {
          arr.push('identityObj')
        }
        if (res.type == 'DriverCard') {
          arr.push('drive')
        }
        if (res.type == 'DrivingCard') {
          arr.push('travel')
        }
      })
      if (status) {
        if (arr.length ==1) {
          eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
        } else if (arr.length ==2) {
          if (arr[0] == 'identityObj' && arr[1] == 'drive') { // 身份 + 驾驶证
            if (this.isActiveObj['drive']) {
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
            } else {
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
            }
          } else if (arr[0] == 'identityObj' && arr[1] == 'travel') { // 身份 + 行驶证
            if (this.isActiveObj['travel']) {
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
            } else {
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
            }
          } else if (arr[0] == 'drive' && arr[1] == 'travel') { // 驾驶证 + 行驶证
            if (this.isActiveObj['travel']) {
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
            } else {
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
            }
          }
        } else if (arr.length ==3) {
          if (type == 'identityObj') {
            if (this.isActiveObj['drive'] && this.isActiveObj['travel']) {
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
            } else if (!(this.isActiveObj['drive'] && this.isActiveObj['travel'])) {
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
            } else if (this.isActiveObj['drive'] && !this.isActiveObj['travel']) {
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
            }
          } else if (type.type == 'DriverCard') {
            if (this.isActiveObj['travel']) {
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
            } else {
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
            }
          } else if (type == 'travel') {
            eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
          }

        }
      } else {
        if (arr.length ==1) {
          if (this.isActiveObj[arr[0]]){
            eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
          }
        } else if (arr.length ==2) {
          if (arr[0] == 'identityObj' && arr[1] == 'drive') { // 身份 + 驾驶证
            if (this.isActiveObj['identityObj'] && this.isActiveObj['drive']) {
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
            } else if (this.isActiveObj['identityObj']) {
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
            }
          } else if (arr[0] == 'identityObj' && arr[1] == 'travel') { // 身份 + 行驶证
            if (this.isActiveObj['identityObj'] && this.isActiveObj['travel']) {
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
            } else if (this.isActiveObj['identityObj']) {
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
            }
          } else if (arr[0] == 'drive' && arr[1] == 'travel') { // 驾驶证 + 行驶证
            if (this.isActiveObj['drive'] && this.isActiveObj['travel']) {
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
            } else if (this.isActiveObj['drive']) {
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
            }
          }
        } else if (arr.length ==3) {
          if (this.isActiveObj['identityObj']) {
            eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
            if (this.isActiveObj['drive']) {
              eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
              if (this.isActiveObj['travel']) {
                eventBus.$emit('addActiveBtn', this.activeContent.activeObj)
              }
            }
          }
        }
      }
    });
  },
  beforeDestroy(){
    eventBus.$off('addActiveBtn')
    eventBus.$off('isActive')
  },
  beforeRouteLeave(to, from, next) {
    if (this.$route.query.feedback) {
      this.$router.go(-2);
    } else {
      this.$router.go(-1);
    }
    this.$keepaliveHelper.deleteCache(this)
    // next()
  },
  methods: {
    backEvent() {
      if (this.$route.query.feedback) {
        this.$router.go(-2);
      } else {
        this.$router.go(-1);
      }
      this.$keepaliveHelper.deleteCache(this);
    },
    activeBtn(activeObj) {
      this.$refs.stepsContent.getIdentityObj(this.isActiveObj,activeObj)
    }
  },
  components: {
    steps: () => import("./steps.vue"),
    stepsContent: () => import("./stepsContent.vue")
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.box {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  /deep/ .nav-content {
    padding-top 10px
    background-color #f6f6f6
  }
}
</style>
