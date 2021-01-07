import hotareaEffect from './hotarea-effect'

/**
 * @description 热力数据归类统计功能
 */
const hotarea = {
  beginMaxValue: 10,
  maxValue: 10,
  totalLevel: 5,
  pageTotal:{
    visit:0,
    clicks:0,
  },
  itemClickTimes: {}, // 点击次数对应表
  itemClickPersons: {}, // 点击人数对应表
  menus: window.getMenus && window.getMenus(),
  // 获取点击次数、浏览人数对应表
  getPageClickTimes: async function (vm,req) {
    if(req){
      // 自定义时间
      var {url, params} = req;
    }else{
      // 实时查询
      var url = '/system/json/data_stats/queryRealtimeDataStats';
      var params = {
        token:vm.$store.state.login.token,
        group: 'Access_PageHotspot',
        dateType: 1,
        extend1:vm.$route.query.pgCode,
      }
    }
    const res =await vm.$http.post(url, params);
    let data = res.data;
    if (data.status == 0) {
      let list = data.data
      this.dataAnalysis(list)
    }else{
      vm.$Message.error(data.info);
    }
    return res;
  },
  resetData: function () {
    this.pageTotal = {
      visit:0,
      clicks:0,
    };
    this.itemClickTimes = {}; // 点击次数对应表
    this.itemClickPersons = {}; // 点击人数对应表
  },
  dataAnalysis: function (list) {
    if(!list) list = [];
    this.resetData();
    this.maxValue = this.beginMaxValue
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      let mainKey = item.mainKey
      let subKey = item.subKey
      if (subKey) {
        if (mainKey.indexOf('pagenumber') > -1) {
          // 访问人数统计
          item.value > this.maxValue ? this.maxValue = item.value : null
          let beforeVisit = this.itemClickPersons[subKey];
          this.itemClickPersons[subKey] = beforeVisit ? beforeVisit + item.value : item.value;
          this.pageTotal.visit += item.value;
        } else if (mainKey.indexOf('pagemantime') > -1) {
          // 点击次数统计
          item.value > this.maxValue ? this.maxValue = item.value : null;
          let beforeClicks = this.itemClickTimes[subKey];
          this.itemClickTimes[subKey] = beforeClicks ? beforeClicks + item.value : item.value;
          this.pageTotal.clicks += item.value;
        }
      }
    }
  },
  getTimesForKey: function (key) {
    return this.itemClickTimes[key]
  },
  getPersonsForKey: function (key) {
    return this.itemClickPersons[key]
  },
  getHotareaLevel: function (num) {
    let level = Math.floor(this.totalLevel - (num / this.maxValue * this.totalLevel)) + 1
    return level
  },
  getModuleClickStatistics: function (module) {
    let arr = [], total = 0, totalPerson = 0, name = ''
    // for (let i = 0; i < ; i++) {
    //
    // }
  },
  /* 热力关联表 */
  // 生成模块热度区数据
  getModuleData: function (ctrModule){
    if(ctrModule._cache){
      return ctrModule._cache;
    }
    const hotareaList = this.getHotareaEffect(ctrModule);
    let clickTotal = 0;
    hotareaList.forEach(item=>{
      item.clicks = this.itemClickTimes[item.idCode] || 0;  // 点击次数对应表
      item.visit = this.itemClickPersons[item.idCode] || 0;  // 点击次数对应表
      clickTotal += item.clicks;
    })
    hotareaList.forEach(item=>{
      const percent = clickTotal
        ? (Number(item.clicks)/Number(clickTotal)*100)
        : 0;
      item.percent = percent.toFixed(2);
    })
    ctrModule._cache = hotareaList; // 数据缓存
    return hotareaList; // [ {name,visit,clicks,percent} ]
  },
  // 生成热力数据(仅配置idCode、imgUrl字段)
  getHotareaEffect: function (crtModule){
    const effect = hotareaEffect[crtModule.code] || {};
    const rowsList = this.getRows(crtModule,effect);
    const btnList=this.getBtnList(crtModule,effect);
    return rowsList.concat(btnList);
  },
  // 获取rows关联
  getRows(crtModule,effect){
    const rowsList = [];
    crtModule.data.rows && crtModule.data.rows.forEach((item,idx)=>{
      if(item.idCode){
        const obj = {};
        obj.idCode = item.idCode;
        let name = typeof name == 'string'
          ? effect.name
          : effect.name[crtModule.data.type];
        obj.name = (name || crtModule.code)+(idx+1);
        item.imgUrl ? obj.imgUrl = item.imgUrl : null;
        rowsList.push(obj);
      }
    })
    return rowsList;
  },
  // 获取btn关联
  getBtnList(crtModule,effect){
    const btnList = [];
    let idCode = crtModule.data.idCode;
    if(idCode){
      effect.btnEffect && effect.btnEffect.forEach(btn=>{
        const obj = {};
        obj.idCode = idCode+btn.cKey;
        obj.name = btn.name || btn.cKey;
        btn.imgUrl ? obj.imgUrl = btn.imgUrl : null;
        btnList.push(obj)
      })
    }
    return btnList;
  },
}

export default hotarea
