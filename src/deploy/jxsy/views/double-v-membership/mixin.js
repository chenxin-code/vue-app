import { mapGetters } from "vuex";
export default {
  data() {
    return {
      isDisplay: null,
      turnNumber: {
        1: "一",
        2: "二",
        3: "三",
        4: "四",
        5: "五",
        6: "六",
        7: "七",
        8: "八",
        9: "九",
        10: "十",
        11: "十一",
        12: "十二",
        13: "十三",
        14: "十四",
        15: "十五",
        16: "十六",
        17: "十七",
        18: "十八"
      },
      getNewsListUrl: '/app/json/news/getNewsList', // 活动说明
      checkTwoVMemmberUrl: '/app/json/app_jx_hui_buy/checkTwoVMemmber', // 验证是否双v会员
      checkBindOilCardUrl: '/app/json/app_jx_hui_buy/checkBindOilCard', // 验证是否绑卡
      cancelTwoVMemberUrl: '/app/json/app_jx_hui_buy/cancelTwoVMember', // 取消双V会员
      getPhoneInfoUrl: '/app/json/app_jx_hui_buy/getPhoneInfo', // 验证是否是江西移动手机号
      addTwoVMemberUrl: '/app/json/app_jx_hui_buy/addTwoVMember', // 添加双V会员
      getVVGetCouMktListUrl: '/app/json/app_market/getVVGetCouMktList', // 获取权益列表（活动）
      getCouScanUrl: '/app/json/app_market/getCouScanUrl', // 领券
      queryGetCouActivityAwardUrl: '/app/json/app_market/queryGetCouActivityAward', // 可领券列表
      getUnusedCouponsWithColsUrl: '/app/json/coupon/getUnusedCouponsWithCols', // 已领券列表
      getUsedCouponsUrl: '/app/json/coupon/getUsedCoupons', // 已使用券列表
      getMyCouInfoUrl: '/app/json/coupon/getMyCouInfo', // 获取动态码
      useVVCouUrl: '/app/json/app_market/useVVCou', // 去使用
      queryCanAttendActivityUrl: '/app/json/app_market/queryCanAttendActivity', // 获取开通双V会员活动
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    checkTwoVMemmber(){
      this.$request.post(this.checkTwoVMemmberUrl, { phone: this.userInfo.phone }).then(res => {
        if (res.status == 0) {
          Object.assign(this.statusObj, res.data || {})
          this.isDisplay = Object.keys(res.data).length ? 2 : 1;
        } else{
          this.$Toast(res.info)
        }
      });
    },
    replacePhone(phone) {
      return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
    },
    duplicateRemoval(arr, key) {
      let hash = {}
      return arr.reduce(function (item, next) {
        hash[next[key]] ? '' : hash[next[key]] = true && item.push(next);
        return item
      }, [])
    }
  }
}
