
export default {
  data (){
    return {
      queryDictsByAliasArr: []
    }
  },
  computed: {},
  components: {},
  created() {
      let Url = "/app/json/app_dict/getDictByAlias";
      let paramsData = {
        token: this.$store.state.login.token,
        alias: "selfServiceDevicePayType"
      };
      this.$request.post(Url, paramsData).then(res => {
        if (res.status == 0) {
          this.queryDictsByAliasArr = res.data || []
        } else {
          this.$Toast(res.info);
        }
      });
   },
  methods: {
    useState(item){
      let typeObj = {
        typeText: '',
        color: ''
      }
      if (item.deviceState == 0) {
        typeObj.typeText = '已禁用'
        typeObj.color = '#e02d2c'
      } else {
        if (item.useState == 0) {
          typeObj.typeText = '空闲中'
          typeObj.color = '#3c9443'
        } else if (item.useState == 1) {
          typeObj.typeText = '使用中'
          typeObj.color = '#fe9010'
        }
      }
      return typeObj
    },
    status(state) {
      let text = "";
      switch (state) {
        // case 3:
        //   text = "进行中";
        //   break;
        case 70:
          text = "审核中";
          break;
        case 12:
          text = "已退款";
          break;
        case 71:
          text = "已拒绝";
          break;
      }
      return text;
    },
    rechargeState(state) {
      let text = "";
      switch (state) {
        case 0:
          text = "启动失败";
          break;
        case 5:
          text = "等待中";
          break;
        case 10:
          text = "进行中";
          break;
        case 20:
          text = "正常结束";
          break;
        case 30:
          text = "强制结束";
          break;
      }
      return text;
    },
    getDictByAliasText(status) {
      let text = ''
      this.queryDictsByAliasArr.forEach(res=>{
        if(res.dictKey == status) {
          text = res.dictValue
          return
        }
      })
      return text
    }
  }
}
