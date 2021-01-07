/**
 * Created by steven on 2018/4/27.
 */
import Config from './../api/config'

export function MP() {

  return new Promise(function (resolve, reject) {
    window.init = function () {
      resolve(BMap)
    }
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://api.map.baidu.com/api?v=2.0&ak=" + Config.mapak + "&callback=init";
    script.onerror = reject;
    document.head.appendChild(script);
  })

}

export function qqMapTransBMap(lng, lat) {

  let XPI = 3.14159265358979324 * 3000.0 / 180.0

  let x = lng && Number(lng)

  let y = lat && Number(lat)

  let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * XPI)

  let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * XPI)

  let lngs = z * Math.cos(theta) + 0.0065

  let lats = z * Math.sin(theta) + 0.006

  return {

    longitude: lngs,

    latitude: lats
  }
}
