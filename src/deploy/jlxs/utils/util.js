const util = {
  getUrlParamForKey(k, url) {
    let _url = decodeURIComponent(url);
    _url = _url.substr(_url.indexOf("?") + 1);
    let GETs = _url.split("&");
    let GET = [];
    for (let i = 0; i < GETs.length; i++) {
      let tmp_arr = GETs[i].split("=");
      let key = tmp_arr[0];
      GET[key] = tmp_arr[1];
    }
    return GET[k] || "";
  },
}
export default util;
