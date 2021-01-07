/**
 * Created by steven on 2018/12/27.
 */

import Vue from 'vue'
var stationTo = {
  getServiceImgUrls:function(station){
    let arr = [];
    if(station.cheerless == 1){ // 无感加油
      arr.push('static/image/station/service/cheerless.png');
    }
    if(station.recharge == 1){
      arr.push('static/image/station/service/recharge.png');
    }
    if(station.cvs == 1){
      arr.push('static/image/station/service/cvs.png');
    }
    if(station.cardService == 1){
      arr.push('static/image/station/service/carservice.png');
    }
    if(station.water == 1){
      arr.push('static/image/station/service/water.png');
    }
    if(station.cleaning == 1){
      arr.push('static/image/station/service/cleaning.png');
    }
    if(station.carWash == 1){ // 0 没有 1 精洗 2简洗
      arr.push('static/image/station/service/cleaning-careful.png');
    }
    if(station.carWash == 2){
      arr.push('static/image/station/service/cleaning-normal.png');
    }
    if(station.manualCardSell == 1){ // 是否有人工发卡网点：0 没有 1有
      arr.push('static/image/station/service/normal-send.png');
    }
    if(station.selfHelpCardSell == 1){ //是否有大自助发卡网点：0 没有 1有
      arr.push('static/image/station/service/auto-normal.png');
    }
    if(station.toilet == 1){
      arr.push('static/image/station/service/toilet.png');
    }
    if(station.maintain == 1){
      arr.push('static/image/station/service/maintain.png');
    }
    if(station.food == 1){
      arr.push('static/image/station/service/food.png');
    }
    if(station.hotWater == 1){
      arr.push('static/image/station/service/hotwater.png');
    }
    if(station.selfService == 1){
      arr.push('static/image/station/service/selfservice.png');
    }
    if(station.bacco == 1){
      arr.push('static/image/station/service/bacco.png');
    }
    if(station.drinks == 1){
      arr.push('static/image/station/service/drinks.png');
    }
    if(station.chargingPile == 1){
      arr.push('static/image/station/service/chargingPile.png');
    }
    if(station.lpg == 1){
      // LPG充装
      arr.push('static/image/station/service/LPG.png');
    }
    if(station.yehqgp == 1){
      // 液化气钢瓶销售
      arr.push('static/image/station/service/yehqgp.png');
    }
    if(station.truck == 1){
      // 液化气钢瓶销售
      arr.push('static/image/station/service/truck.png');
    }
    return arr;
  },

}

export default stationTo
