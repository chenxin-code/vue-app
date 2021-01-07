/**
 * @description 热力数据统计事件拓展
 * @author LiuYong <tel:15045009738>
 * @datetime 2020/10/19 16:05
 */
import hotarea from './hotarea'
import * as market from "../../../../utils/market";
import actionStatistics from '../../../../utils/actionStatistics'

const hotareaExtendEvent = {
  methods:{
    /**
     * @description 获取热力级别类名
     * @param {Object} item 传入数据
     * @param {Boolean} isAdd true表示条件类名，false表示非条件类名
     * @return {String} 热力等级类名
     */
    hotareaClass: function (item, isAdd) {
      if (market.canNotGetHotareaClass() == true) {
        return '';
      }
      if (item.idCode) {
        let num = hotarea.getTimesForKey(item.idCode,true)
        if (num > 0) {
          let cal = 'hotarea_level_' + hotarea.getHotareaLevel(num)
          if (isAdd) {
            let dic = {}
            dic[cal] = true
            return dic
          } else {
            return cal
          }
        }
      }
    },
    // 热力统计事件
    actionBtnEvent: function (pgcode, idCode) {
      if (pgcode && idCode)
        actionStatistics.commonAction('140001', '', '', '', '', idCode, pgcode, pgcode, '')
    },
  }
}

export default hotareaExtendEvent;
