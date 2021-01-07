const cartEvent = {
  prolist: [],
  savePros: function () {
    sessionStorage.setItem('prosale_cart_products', JSON.stringify(this.prolist))
  },
  getPros: function () {
    if (this.prolist.length > 0) {
      return this.prolist
    } else {
      let jStr = sessionStorage.getItem('prosale_cart_products')
      if (jStr) {
        try {
          this.prolist = JSON.parse(jStr)
        } catch (e) {
          console.error(e)
        }
      }
      return this.prolist
    }
  },
  getCartNum: function () {
    let num = 0
    let list = this.getPros()
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      num += parseInt(item.number)
    }
    return num
  },
  addCart: function (list) {
    this.getPros()
    for (let j = 0; j < list.length; j++) {
      let addItem = list[j]
      let has = false
      for (let i = 0; i < this.prolist.length; i++) {
        let item = this.prolist[i]
        if (item.skuId == addItem.skuId) {
          has = true
          item.number += addItem.number
          break ;
        }
      }
      if (has == false) {
        this.prolist.push(addItem)
      }
    }
    this.savePros()
  },
  updateCart: function (list) {
    this.getPros()
    for (let j = 0; j < list.length; j++) {
      let updateItem = list[j]
      let has = false
      for (let i = 0; i < this.prolist.length; i++) {
        let item = this.prolist[i]
        if (item.skuId == updateItem.skuId) {
          has = true
          for (let key in updateItem) {
            item[key] = updateItem[key]
          }
          break ;
        }
      }
      if (has == false) {
        this.prolist.push(updateItem)
      }
    }
    this.savePros()
    return this.prolist
  },
  deleteCart: function (list) {
    this.getPros()
    let arr = []
    for (let i = 0; i < this.prolist.length; i++) {
      let item = this.prolist[i]
      let has = false
      for (let j = 0; j < list.length; j++) {
        let deleteItem = list[j]
        if (item.skuId == deleteItem.skuId) {
          has = true
          break ;
        }
      }
      if (has == false) {
        arr.push(item)
      }
    }
    this.prolist = arr
    this.savePros()
    return this.prolist
  },
  getSettlePros: function () {
    let list = this.getPros()
    let arr = []
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      if (item.check == 1) {
        arr.push(item)
      }
    }
    return arr
  }
}

export default cartEvent
