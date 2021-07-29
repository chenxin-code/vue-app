export default {
  dateData(property, bol) { //property是你需要排序传入的key,bol为true时是升序，false为降序
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      if (bol) {
        // 升序
        return Date.parse(value1) - Date.parse(value2);
      } else {
        // 降序
        return Date.parse(value2) - Date.parse(value1)
      }

    }
  }
}

