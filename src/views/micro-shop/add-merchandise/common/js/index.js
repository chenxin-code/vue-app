import utils from "@/utils/util";

var purchase = {
  getPriceShow: function (priceArr) {
    if (priceArr.length == 0) {
      return ''
    }
    let minP = priceArr[0].price
    let maxP = priceArr[0].price
    for (let i = 1; i < priceArr.length; i++) {
      let p = priceArr[i].price
      if (minP > p) {
        minP = p
      }
      if (maxP < p) {
        maxP = p
      }
    }
    if (minP == maxP) {
      let ndic = this.getINumDNum(minP)
      return [ndic]
    } else {
      let minndic = this.getINumDNum(minP)
      let maxndic = this.getINumDNum(maxP)
      return [minndic, maxndic]
    }
  },
  getINumDNum: function (price) {
    let p = utils.toDecimal2(price)
    let arr = p.split('.')
    let iNum = arr[0]
    let dNum = arr[1]
    return {
      iNum: iNum,
      dNum: dNum
    }
  }
}

export default purchase
