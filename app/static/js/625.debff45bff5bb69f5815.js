(window.webpackJsonp=window.webpackJsonp||[]).push([[625],{"88Sv":function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAAH7+Yj7AAAAAXNSR0IArs4c6QAAAZdJREFUWAntV0tuwjAQhZRFuVGv0AUn4QjtsndgXdQ7VNB9D9RlBXLfCE804/zGTlIQGkuWP/Pm+fmZJGax6CshhKWKpxNVjL4oFA+AfuV+dwtUUNHGBKK00FGheAD0gfutbRudAhIARe9UIFYIfmL8vUQR891dJBxQDZuPHADvu+lyI2CrUJ968yJIW59mTAciZrD1LyeXvxGwlDRrv/OXRWeAlc9x9Qo/QpOLDcJSIt52TTiWqCYE0QMGp9ytMUHakjfkE78p2l9LaZZ1DLX0VFOxP9kWchDOTry1CHFM0wEczh71pxkpmIlkaMKuIF2nOJn2wzKa2rMPOkqU8adJ6i9cGR/JgS3Td2PNxANYexgqH6dWSlt30our9pMYQM7p6WZgbQ+XO4Bzo/v7G2r/Hb58ibLMKIy+h7JMexsqkQY15FgqbIe5+tZawjs6x4XlWuiO3Y1jtBEc5zuqLNd/KqXDULZG/ZIK0b/+O02KjE7SDYn/KbJeF5oaZR7DQnfU7JYF6I5aXMrBJI7+Yvyck+/Y/3LgD634t2EnXUgzAAAAAElFTkSuQmCC"},LWNI:function(t,e,a){},RDjh:function(t,e,a){"use strict";var r=a("LWNI");a.n(r).a},X1ZY:function(t,e,a){"use strict";a.r(e);var r={data:function(){return{iconBack:a("88Sv"),loading:!1,finished:!1,error:!1,refreshing:!1,currentPage:0,recordList:[],totalRecord:0}},components:{},created:function(){this.onLoad(),this.$route.query.totalRecord&&(this.totalRecord=this.$route.query.totalRecord)},methods:{backEvent:function(){this.$router.go(-1)},onLoad:function(){var t=this;this.loading=!0,this.refreshing=!1,this.currentPage+=1;var e={pageIndex:this.currentPage,pageSize:10};this.$http.post("/app/json/app_member_center/findIntegralRecordList",e).then((function(e){t.currentPage<e.data.data.pages||t.currentPage==e.data.data.pages?0==e.data.status?(t.recordList=t.recordList.concat(e.data.data.records),t.loading=!1):(t.loading=!1,t.error=!0):t.finished=!0})).catch((function(e){t.$toast("请求失败，点击重新加载"),t.loading=!1,t.error=!0}))},onRefresh:function(){var t=this;this.finished=!1,this.loading=!0,this.currentPage=1;var e={pageIndex:this.currentPage,pageSize:10};this.$http.post("/app/json/app_member_center/findIntegralRecordList",e).then((function(e){0==e.data.status?(t.recordList=e.data.data.records,t.$toast("刷新成功"),t.loading=!1,t.refreshing=!1):(t.loading=!1,t.error=!0,t.refreshing=!1)})).catch((function(e){t.$toast("网络繁忙,请稍后再试~")}))}}},i=(a("RDjh"),a("KHd+")),n=Object(i.a)(r,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"record"},[a("div",{staticClass:"back_box",on:{click:t.backEvent}},[a("img",{attrs:{src:t.iconBack,alt:""}})]),t._v(" "),a("div",{staticClass:"title"},[t._v("邦豆记录")]),t._v(" "),a("div",{staticClass:"value"},[t._v(t._s(t.totalRecord))]),t._v(" "),a("div",{staticClass:"list"},[a("van-pull-refresh",{on:{refresh:t.onRefresh},model:{value:t.refreshing,callback:function(e){t.refreshing=e},expression:"refreshing"}},[a("van-list",{attrs:{finished:t.finished,"finished-text":"没有更多了",error:t.error,"error-text":"请求失败，点击重新加载","immediate-check":!1},on:{load:t.onLoad,"update:error":function(e){t.error=e}},model:{value:t.loading,callback:function(e){t.loading=e},expression:"loading"}},t._l(t.recordList,(function(e,r){return a("div",{key:r,staticClass:"record_item"},[a("div",{staticClass:"item_info"},[a("div",{staticClass:"item_title"},[t._v(t._s(e.behaviourName))]),t._v(" "),a("div",{staticClass:"item_date"},[t._v(t._s(e.createTime))])]),t._v(" "),a("div",{staticClass:"item_value"},[t._v("\n            "+t._s(1==e.changeType?"+":"-")+t._s(e.integralChange)+"\n          ")])])})),0)],1)],1)])}),[],!1,null,"58524a31",null);e.default=n.exports}}]);