import bridgefunc from "./bridgefunc";

let phoneNumbers = []

const phoneSaveCenter = {
  addPhoneNumber: function (phoneNumber) {
    bridgefunc.getItem('Phone_Save', result => {
      phoneNumbers = []
      if (!result || result == '' || result == 'null' || result == undefined) {

      } else {
        phoneNumbers = JSON.parse(decodeURIComponent(result))
      }
      phoneNumbers.unshift(phoneNumber)
      let jsonString1 = encodeURIComponent(JSON.stringify(phoneNumbers))
      bridgefunc.setItem('Phone_Save', jsonString1, () => {})
    })
  },
  // 获取日志数组，入参：callBack 回调入参数组
  getPhoneNumbers: function (callBack) {
    bridgefunc.getItem('Phone_Save', result => {
      phoneNumbers = []
      if (!result || result == '' || result == 'null' || result == undefined) {

      } else {
        phoneNumbers = JSON.parse(decodeURIComponent(result))
      }
      callBack(phoneNumbers);
    })
  },
  // 匹配手机号码
  async matchPhoneNumbers(phone) {
    phone = phone+''
    if (phoneNumbers.length == 0) {
      await bridgefunc.getItem('Phone_Save', result => {
        phoneNumbers = []
        if (!result || result == '' || result == 'null' || result == undefined) {

        } else {
          phoneNumbers = JSON.parse(decodeURIComponent(result))
        }
      })
    }
    let arr = []
    for (let i = 0; i < phoneNumbers.length; i++) {
      let str1 = phoneNumbers[i]
      if (str1.indexOf(phone) != -1) {
        arr.push(str1)
      }
    }
  }
}

export default phoneSaveCenter
