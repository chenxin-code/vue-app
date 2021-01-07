var stylefromitem = {

  getStyleStr:function (textDic) {
    return 'fontSize:'+textDic.font + 'px;'+'color:'+textDic.textcolor+';'+ 'background:'+textDic.bgcolor+';';
  }
};
// 返回在vue模板中的调用接口
export default {
  install: function (Vue, Option) {
    Object.defineProperty(Vue.prototype, '$stylefromitem', {value:stylefromitem});
  }
}
