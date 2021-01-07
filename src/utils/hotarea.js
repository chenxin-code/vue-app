/**
 * @description 热力数据归类统计功能
 */
const hotarea = {
  beginMaxValue: 10,
  maxValue: 10,
  totalLevel: 5,
  itemClickTimes: {}, // 点击次数对应表
  itemClickPersons: {}, // 点击人数对应表
  menus: window.getMenus && window.getMenus(),
  dataAnalysis: function (list) {
    this.maxValue = this.beginMaxValue
    this.itemClickTimes = {}  // 初始化点击次数数据
    this.itemClickPersons
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      let mainKey = item.mainKey
      let subKey = item.subKey
      if (subKey) {
        if (mainKey.indexOf('pagenumber') > -1) {
          // 访问人数统计
          if (item.value > this.maxValue) {
            this.maxValue = item.value
          }
          this.itemClickPersons[subKey] = item.value
        } else if (mainKey.indexOf('pagemantime') > -1) {
          // 点击次数统计
          if (item.value > this.maxValue) {
            this.maxValue = item.value
          }
          this.itemClickTimes[subKey] = item.value
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
    console.log(module)
    let arr = [], total = 0, totalPerson = 0, name = ''
    // for (let i = 0; i < ; i++) {
    //
    // }
  },
}

export default hotarea
