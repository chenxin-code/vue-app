(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{"43od":function(t,s,i){"use strict";var e=i("myR9");i.n(e).a},"5CqX":function(t,s,i){"use strict";i("KD6U");var e=i("WQzh"),a={name:"card-list",props:{listData:Array,cartProducts:Array,isOpen:{type:Boolean,default:!0}},components:{PriceOrder:e.a},data:function(){return{leftArray:[],rightArray:[],dataArray:[]}},computed:{showSales:function(){return 1!=this.$store.state.globalConfig.app_prolist_sales_hide},showComments:function(){return 1!=this.$store.state.globalConfig.app_prolist_comments_hide}},methods:{getNumber:function(t){if(!this.cartProducts||0==this.cartProducts.length)return 0;for(var s=0;s<this.cartProducts.length;s++){var i=this.cartProducts[s];if(i.skuId==t.skuId)return i.number}},getSkuNameStr:function(t){var s=t.skuName;return"2"==t.interfaceType?s='<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">'+(this.$store.state.globalConfig.interface_type_name_1||"京东")+"</span>"+s:"1"==t.interfaceType&&(s='<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">'+(this.$store.state.globalConfig.interface_type_name_2||"有路")+"</span>"+s),s},dataProcessing:function(t){var s=this.$mallCommon.priceFromItem(t);t.dpedData=s;var i=[];if(t.activityTypes){for(var e=0;e<t.activityTypes.length;e++){var a=t.activityTypes[e],o=t.activityTags.length>e?t.activityTags[e]:"";~i.indexOf(a)||-1!=o.indexOf("不显示")||i.push(a)}t.showActivities=i}},productEvent:function(t){this.$emit("productEvent",t)},addToCart:function(t){""!=t.stockNum&&"0"!=t.stockNum&&null!=t.stockNum?this.$emit("addToCart",t):this.$Toast("商品缺货！")},addToWishList:function(t,s){var i=this;this.$Loading.open(),this.$http.post("/app/json/wish_order/addWishOrder",{skuId:t.skuId,storeOuCode:t.storeOuCode}).then((function(t){var e=t.data;0==e.status?(s.target.classList.toggle("is-add-wish"),1==e.data?i.$Toast("已将宝贝添加至心愿单啦~"):i.$Toast("已将宝贝移除心愿单~")):i.$Toast(e.info),i.$Loading.close()})).catch((function(t){i.$Toast(t),i.$Loading.close()}))},initData:function(){var t=[],s=[];this.dataArray=[];for(var i=this.$store.state.globalConfig.product_list_type,e=0;e<this.listData.length;e++){var a=this.listData[e];this.dataProcessing(a),"1"==i?this.dataArray.push(a):e%2?t.push(a):s.push(a)}this.rightArray=t,this.leftArray=s}},watch:{listData:{handler:function(){this.initData()},deep:!0}},created:function(){this.$store.state.globalConfig.product_big_corner="1",this.initData()}},o=(i("43od"),i("KHd+")),r=Object(o.a)(a,(function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"card-list"},["1"==t.$store.state.globalConfig.product_list_type?e("div",[e("div",{staticClass:"equal-div"},t._l(t.dataArray,(function(s,a){return e("div",{staticClass:"card",class:{"no-stock":(""==s.stockNum||"0"==s.stockNum)&&"1"==t.$store.state.globalConfig.showNoStockCover},on:{click:function(i){return t.productEvent(s)}}},[e("div",{directives:[{name:"show",rawName:"v-show",value:t.isOpen||a<1,expression:"isOpen || index < 1"}],staticStyle:{height:"100%"}},[e("div",{staticClass:"card-content theme_bg_white",class:{"big-corner":"1"==t.$store.state.globalConfig.product_big_corner}},[e("div",{staticClass:"img-div"},[e("img",{directives:[{name:"lazy",rawName:"v-lazy",value:s.phMainUrl+"?x-oss-process=image/format,jpg",expression:"item.phMainUrl+'?x-oss-process=image/format,jpg'"}]}),t._v(" "),1==s.supportPreSale?e("div",{staticClass:"presale"},[t._v("预售")]):t._e()]),t._v(" "),e("div",{staticClass:"title theme_font_black double-line",domProps:{innerHTML:t._s(t.getSkuNameStr(s))}}),t._v(" "),e("div",{staticClass:"info-row"},[e("PriceOrder",{attrs:{listitem:s}})],1),t._v(" "),e("div",{staticClass:"info-row activity single-line"},[t._l(s.showActivities,(function(s,i){return i<2?e("div",{staticClass:"act-item theme_font_red theme_border_red single-line"},[t._v(t._s(s))]):t._e()})),t._v(" "),1==s.hasCou?e("div",{staticClass:"act-item theme_font_red theme_border_red single-line"},[t._v("券")]):t._e()],2),t._v(" "),e("div",{staticClass:"info-row num-info"},[t.showSales?e("span",{staticClass:"font-small theme_font_tint"},[t._v("销量："+t._s(""!=s.salesNum?s.salesNum:"0"))]):t._e(),t._v(" "),t.showComments?e("span",{staticClass:"font-small theme_font_tint"},[t._v("评价："+t._s(""!=s.commentsNum?s.commentsNum:"0"))]):t._e(),t._v(" "),2!=s.productType?e("div",{staticClass:"car-c"},[t.getNumber(s)>0?e("div",{staticClass:"number theme_bg_red"},[t._v(t._s(t.getNumber(s)))]):t._e(),t._v(" "),"wish"!==t.$route.query.entryType?e("i",{staticClass:"iconfont mall-gouwuche theme_font_red car-size",class:{theme_font_gray_i:""==s.stockNum||"0"==s.stockNum||null==s.stockNum},on:{click:function(i){return i.stopPropagation(),t.addToCart(s)}}}):e("div",[1==s.productType&&2==s.deliverType?e("div",{staticClass:"wish-icon-c",class:{"is-add-wish":s.isAddWishOrder},on:{click:function(i){return i.stopPropagation(),t.addToWishList(s,i)}}},[e("img",{staticClass:"wish-icon",attrs:{src:i("FJt8"),alt:""}}),t._v(" "),e("img",{staticClass:"wish-icon",attrs:{src:i("FCp+"),alt:""}})]):t._e()])]):t._e()])])])])})),0)]):e("div",[e("div",{staticClass:"left-div"},t._l(t.leftArray,(function(s,a){return e("div",{staticClass:"card",class:{"no-stock":(""==s.stockNum||"0"==s.stockNum)&&"1"==t.$store.state.globalConfig.showNoStockCover},on:{click:function(i){return t.productEvent(s)}}},[e("div",{directives:[{name:"show",rawName:"v-show",value:t.isOpen||a<1,expression:"isOpen || index < 1"}]},[e("div",{staticClass:"card-content theme_bg_white",class:{"big-corner":"1"==t.$store.state.globalConfig.product_big_corner}},[e("div",{staticClass:"img-div"},[e("img",{directives:[{name:"lazy",rawName:"v-lazy",value:s.phMainUrl+"?x-oss-process=image/format,jpg",expression:"item.phMainUrl+'?x-oss-process=image/format,jpg'"}]}),t._v(" "),1==s.supportPreSale?e("div",{staticClass:"presale"},[t._v("预售")]):t._e()]),t._v(" "),e("div",{staticClass:"title theme_font_black double-line",domProps:{innerHTML:t._s(t.getSkuNameStr(s))}}),t._v(" "),e("div",{staticClass:"info-row"},[e("PriceOrder",{attrs:{listitem:s}})],1),t._v(" "),""!=s.activityTypes||1==s.hasCou?e("div",{staticClass:"info-row activity single-line"},[t._l(s.showActivities,(function(s,i){return i<2?e("div",{staticClass:"act-item theme_font_red theme_border_red single-line"},[t._v(t._s(s))]):t._e()})),t._v(" "),1==s.hasCou?e("div",{staticClass:"act-item theme_font_red theme_border_red single-line"},[t._v("券")]):t._e()],2):t._e(),t._v(" "),e("div",{staticClass:"info-row num-info"},[t.showSales?e("span",{staticClass:"font-small theme_font_tint"},[t._v("销量："+t._s(""!=s.salesNum?s.salesNum:"0"))]):t._e(),t._v(" "),t.showComments?e("span",{staticClass:"font-small theme_font_tint"},[t._v("评价："+t._s(""!=s.commentsNum?s.commentsNum:"0"))]):t._e(),t._v(" "),2!=s.productType?e("div",{staticClass:"car-c"},[t.getNumber(s)>0?e("div",{staticClass:"number theme_bg_red"},[t._v(t._s(t.getNumber(s)))]):t._e(),t._v(" "),"wish"!==t.$route.query.entryType?e("i",{staticClass:"iconfont mall-gouwuche theme_font_red car-size",class:{theme_font_gray_i:""==s.stockNum||"0"==s.stockNum||null==s.stockNum},on:{click:function(i){return i.stopPropagation(),t.addToCart(s)}}}):e("div",[1==s.productType&&2==s.deliverType?e("div",{staticClass:"wish-icon-c",class:{"is-add-wish":s.isAddWishOrder},on:{click:function(i){return i.stopPropagation(),t.addToWishList(s,i)}}},[e("img",{staticClass:"wish-icon",attrs:{src:i("FJt8"),alt:""}}),t._v(" "),e("img",{staticClass:"wish-icon",attrs:{src:i("FCp+"),alt:""}})]):t._e()])]):t._e()])])])])})),0),t._v(" "),e("div",{staticClass:"right-div"},t._l(t.rightArray,(function(s,a){return e("div",{staticClass:"card",class:{"no-stock":(""==s.stockNum||"0"==s.stockNum)&&"1"==t.$store.state.globalConfig.showNoStockCover},on:{click:function(i){return t.productEvent(s)}}},[e("div",{directives:[{name:"show",rawName:"v-show",value:t.isOpen||a<1,expression:"isOpen || index < 1"}]},[e("div",{staticClass:"card-content theme_bg_white",class:{"big-corner":"1"==t.$store.state.globalConfig.product_big_corner}},[e("div",{staticClass:"img-div"},[e("img",{directives:[{name:"lazy",rawName:"v-lazy",value:s.phMainUrl+"?x-oss-process=image/format,jpg",expression:"item.phMainUrl+'?x-oss-process=image/format,jpg'"}]}),t._v(" "),1==s.supportPreSale?e("div",{staticClass:"presale"},[t._v("预售")]):t._e()]),t._v(" "),e("div",{staticClass:"title theme_font_black double-line",domProps:{innerHTML:t._s(t.getSkuNameStr(s))}}),t._v(" "),e("div",{staticClass:"info-row"},[e("PriceOrder",{attrs:{listitem:s}})],1),t._v(" "),""!=s.activityTypes||1==s.hasCou?e("div",{staticClass:"info-row activity single-line"},[t._l(s.showActivities,(function(i,a){return a<3&&""!=s.activityTypes?e("div",{staticClass:"act-item theme_font_red theme_border_red theme_bg_ml_red single-line"},[t._v(t._s(i))]):t._e()})),t._v(" "),1==s.hasCou?e("div",{staticClass:"act-item theme_font_red theme_border_red single-line"},[t._v("券")]):t._e()],2):t._e(),t._v(" "),e("div",{staticClass:"info-row num-info"},[t.showSales?e("span",{staticClass:"font-small theme_font_tint"},[t._v("销量："+t._s(""!=s.salesNum?s.salesNum:"0"))]):t._e(),t._v(" "),t.showComments?e("span",{staticClass:"font-small theme_font_tint"},[t._v("评价："+t._s(""!=s.commentsNum?s.commentsNum:"0"))]):t._e(),t._v(" "),2!=s.productType?e("div",{staticClass:"car-c"},[t.getNumber(s)>0?e("div",{staticClass:"number theme_bg_red"},[t._v(t._s(t.getNumber(s)))]):t._e(),t._v(" "),"wish"!==t.$route.query.entryType?e("i",{staticClass:"iconfont mall-gouwuche theme_font_red car-size",class:{theme_font_gray_i:""==s.stockNum||"0"==s.stockNum||null==s.stockNum},on:{click:function(i){return i.stopPropagation(),t.addToCart(s)}}}):e("div",[1==s.productType&&2==s.deliverType?e("div",{staticClass:"wish-icon-c",class:{"is-add-wish":s.isAddWishOrder},on:{click:function(i){return i.stopPropagation(),t.addToWishList(s,i)}}},[e("img",{staticClass:"wish-icon",attrs:{src:i("FJt8"),alt:""}}),t._v(" "),e("img",{staticClass:"wish-icon",attrs:{src:i("FCp+"),alt:""}})]):t._e()])]):t._e()])])])])})),0)])])}),[],!1,null,"67b9045c",null);s.a=r.exports},"6cIz":function(t,s,i){"use strict";var e=i("zU7Z");i.n(e).a},"FCp+":function(t,s){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDFFRjI2Njk1NEI0MTFFQUJDODBCQTIxMEEzN0VFQzAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDFFRjI2NkE1NEI0MTFFQUJDODBCQTIxMEEzN0VFQzAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEMUVGMjY2NzU0QjQxMUVBQkM4MEJBMjEwQTM3RUVDMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEMUVGMjY2ODU0QjQxMUVBQkM4MEJBMjEwQTM3RUVDMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjsKS2IAAANNSURBVHjaxFhZS1VRFF6eerCwCKIHH0rypRzzobJsIMQ0qWigwjQDrQjCiqLoB9RTPdW1Ih+CoocSepIQs0lKzatWRA4XQknJ9DpFhUUDu2959o2Lnr3POddzbws+7rDWWfs7e1jDjhOUSC5lKVAArAdSgCRgntR9BT4AXcALoA7odeM8ziGhWcA+oAJYy8859C+AZqASqAb+eEEoD/ABy2lm0g0cBx7pjAyNLh64AdR7QIakj3rpM97tDC0CHgCrKDrSCmwFhp0QYjLPgWUUXQkAG6aSmrpkc4GaGJAhOUaNHFNJ6DKQTbGTbDmm5ZLlyU33P2Rz6PQZYTN1RW0/m+hMGdHrWqKfiHtigKinkejSWegSwuwSzP9Yxza/+ojeIDaeKzd9qMUnYx1HrkTGfkBYYkG6EM0vhVK6A0Kk5Jjg7yppbRNiYYZQjmNy+LdkHObXWYappvuIzTbbqqPT/ExL1du1+InW7MGX31baJuZgyNyUY+mgosieTIiIHZnJLbya6GSRSsspKZkJbVHmppK93m/fYqVP5lBgWC+VlKwV3hPKzNBpJ5csTZ3N4r0npPeZyoQWK9WjY94TGhnVaZOMsOJquvj93hNqadFpEwztw7fuek/ott6nIctOa7n3kOjxM+/IsK9qbX32jQn1a52UniL6ODBzMp8GicpP21n1MaFOvaMhol2lREPByMnw4dhZguEG7Sw7DJk2bOo7NBH5CPm9ve7J9GMBChEM/V1OrBsN2aoIW9O371HQ7iB62uCcTAPedeU284WcdSh1TKhHJjYHUz9ClIvl813D45p3YJ3vOtGmYqLgsFP63C71hI79VeevjUx94gLRwSNE45+nq8fGiQ4chs15VVZXSWV4xcjF0TvX7U5aMtEdzFZWpvm77RXIHEP53hdJz5bOjaQHJewcxJaLKAhREe7mY/09knOYHxp7aht0EyiLcT3NYx5S9WXckjyJYefBiS0XmFC1QazYLpu4aEtAjjVh19vzOd0ItEeRTLscY9jpZUNQtrlVUSBTJe+Wgm5vP/i4HJUnIODREuVLnz8iuY4JSb0sc4tlNBUuifAzJdKHbViJi/BKr1BOOwfSJcB8qfvCJYQMdJy0a91e6f0VYACbBjEgb6MNQgAAAABJRU5ErkJggg=="},FJt8:function(t,s){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDFFRjI2NkQ1NEI0MTFFQUJDODBCQTIxMEEzN0VFQzAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDFFRjI2NkU1NEI0MTFFQUJDODBCQTIxMEEzN0VFQzAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEMUVGMjY2QjU0QjQxMUVBQkM4MEJBMjEwQTM3RUVDMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEMUVGMjY2QzU0QjQxMUVBQkM4MEJBMjEwQTM3RUVDMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ps+JWVoAAAPESURBVHjavJhfSNNRFMe333KLzGjaH7VitK1FW2CwLSIMLUENKpBZunyYuErfCiRffe+hetTqQRSxCcqkIhXmwByIKejcHEUucps6Z+JqUzf/1LlwB8t+f91vHvg86Dn39/vud8+995wrFHC3Y4AaUAJ5QA4gwb4Y8BNYAL4BM8Ayl4cLWcYRgBa4Dsg5jPsDeAE7MAHs8CHoAlAN5ApSs0XgLeDZq6AMoAq4JuDXPgEWYJPMKaIYlAU8AQoE/JsM5+AUEGcjCIl5CpwWpM+O4h87vlvUbkFi4HGaxSTsMHAOGAO2qQTdT9M0UZkUOAI4k5dz8moqFOy/FeJ3/yNIiFcUeYZnZYlaWlou+f3+uzs7Ow83NzfNTqfzVm1t7ankOPQ3+j/yQ9yjQCBwD41D4xlEVSe0JJa9HnhAFqlSqQ4NDg7elMlkOWT+1tbWsYaGhkn04vr6+stkMT6fb6W8vPzjzMxMlEbUG+BzQlAToNgdIZFICJfLdUepVJ6g+3k2m+1rSUmJii7G6/WG1Gp1XywWo9qtZ4FnInw2Gcg2yebmZlVFRYWGKQnkcnkOY/ZKpZlCoTAyNDS0TJPgo2jeNFQ7dmVlpYrP7DUYDCqGU0NDkE1VwhQKxXE+BbF4ngIJyqfyisXiA3wKysjIYFpt+UhQNpU3Eols8CkoHA6vM4RkE0nF1X8GK2yRT0Eej4fpeRKCztvZ2fmFT0Ht7e2Mz0OZ/RzIpApwu923Yf/IS1UMbIoLGo3mHUNYFH2hFboIo9FoTzWXotForKamxs4idIXABTmlwdkUMZlM/fF4fGsvYuBc26qrqxuYnJyMsAifJ3B3QGu9vb1LVVVV79fW1mJcxGxsbMTNZnN/d3c328UxiwS5cXdAa1ardam0tLQvGAyG2Tw5FAr9Kisrs3Z0dMxz6FDcBO6bvGxGOByOVb1eb52enqZ9CfLrdDrr8PDwKocPijQsJ5a9ne0oKCViWq32Q09Pj5PMb7FYppB/bm6O60KwJ5ewaI51uM5lNCi+BJAXfiglwkVFRWdEIhGBkr6pqcnW2NjoQv499GxdaNpESfMXBK5wecrIyMjKxMSEr7i4OA+qxYG2trbAHncGVJyFyBpFE3B1n2tqB9rEqboODy64pfsk5jvwmq4N2sYdZQHbfErBUIq8BNaZOtc47ijP4w4zHfYDeAH8ZtvbI1GjuK2WpeGy4dXuL8P1OsYInORhirpSuY4hu7C6AZzlME6QdGE1zteFFdmV3kV8pZeLS+CDifMUlzOL+NB2cb3S+yvAANeGQ9tIXEWcAAAAAElFTkSuQmCC"},lH8D:function(t,s,i){"use strict";var e={name:"recommend",components:{CardList:i("5CqX").a},data:function(){return{deliverType:this.$store.state.mall2.staticDeliverType,listData:[]}},methods:{productEvent:function(t){console.log(t);var s="/mall2/detail/"+this.$util.getDataString();2==t.productType&&(s="/mall2/ticketdetail"),this.$router.push({path:s,query:{id:t.id,skuId:t.skuId,lastPath:this.$route.path,productType:t.productType}})},addToCart:function(t){var s=this;this.$Loading.open();var i={token:this.$store.state.login.token,carts:[{skuId:t.skuId,storeOuCode:t.storeOuCode,activityId:this.activityId,selfActivityId:t.activityId,number:1}],deliveryType:t.deliverType};this.$http.post("/app/json/app_cart/addCart",i).then((function(t){s.$Loading.close();var i=t.data;0==i.status?(s.$store.state.mall2.cartNum=i.data,s.$Toast("添加购物车成功！"),s.$emit("addCartFinish")):s.$Toast(i.info)}),(function(t){s.$Loading.close(),s.$Toast("请求数据失败！")}))},_loadProList:function(){var t=this;this.listData=[],this.$Loading.open();var s={token:this.$store.state.login.token,page:0,rows:20,orderByKey:"",ascOrDesc:"",deliverType:this.deliverType,collectType:1};if(1==this.deliverType){var i=this.$store.state.mall2.zitiAddress;s.pickUpId=i.id}var e=this.$store.state.mall2.selectAddress;s.area={provinceId:e.provinceId,cityId:e.cityId,countryId:e.countryId,countyId:e.countryId,townId:e.townId},this.$http.post("/app/json/product/getAppHotProSkuSaleListModel",s).then((function(s){t.$Loading.close();var i=s.data;0==i.status?t.listData=i.data.list:t.$Toast(i.info)}),(function(s){t.$Loading.close(),t.$Toast("请求数据失败！")}))}},created:function(){this._loadProList()}},a=(i("6cIz"),i("KHd+")),o=Object(a.a)(e,(function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"recommend mall2"},[s("div",{staticClass:"title"},[this._v("热门商品")]),this._v(" "),s("div",{staticClass:"list-content"},[s("CardList",{attrs:{listData:this.listData},on:{productEvent:this.productEvent,addToCart:this.addToCart}})],1)])}),[],!1,null,"59a8869a",null);s.a=o.exports},myR9:function(t,s,i){},zU7Z:function(t,s,i){}}]);