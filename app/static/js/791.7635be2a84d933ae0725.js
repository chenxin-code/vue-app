(window.webpackJsonp=window.webpackJsonp||[]).push([[791],{"9Gu7":function(t,e,a){"use strict";a.r(e);var s=a("L2JU"),r={name:"my-card",props:["myIndex","usePorpData","propData","barHeight"],computed:(Object.assign||function(t){for(var e=1;e<arguments.length;e++){var a=arguments[e];for(var s in a)Object.prototype.hasOwnProperty.call(a,s)&&(t[s]=a[s])}return t})({},Object(s.e)(["deployType"]),{pageData:function(){return 1==this.usePorpData?this.propData:this.$store.state.pageData},moduleData:function(){return this.pageData.moduleList[this.myIndex].data}}),data:function(){return{}},methods:{toMyQrcode:function(){this.$router.push({path:"/myqrcode"})},getMyCardBgImg:function(){var t=this.$market.getMemberLevelIndex(this.$store.state.mall2.myAssets.levelNo);t>0&&(t-=1);var e=this.moduleData["cardImg_"+t];return e&&null!=e&&""!=e?e:"static/images/mycenter/my-card-bg.png"},getBgStyle:function(){var t="",e=this.moduleData.bgImgUrl;""!=e&&(t+="background: url('"+e+"') no-repeat center center / 100% 100%;");var a=this.moduleData.bgColor;return""!=a&&(t+="background-color: "+a+";"),t},getFloatUp:function(){var t="",e=this.moduleData.floatUp;e>0&&(t+="margin-top: -"+e+"%;");var a=this.moduleData.upMargin,s=this.moduleData.downMargin;a>0&&(t+="margin-top: "+a+"%;"),s>0&&(t+="margin-bottom: "+s+"%;");var r=this.moduleData.sidesMargin;return r>0&&(t+="margin-left: "+r+"%; margin-right: "+r+"%;"),t},getMyAssets:function(){var t=this,e=this.$market.apiBaseURL()+"/app/json/user/getUserWallet",a={token:this.$store.state.login.token};this.$http.post(e,a).then((function(e){var a=e.data;0==a.status&&(t.$store.state.mall2.myAssets=a.data)}),(function(t){}))},modeleReshow:function(){this.getMyAssets()}},created:function(){""!=this.$store.state.login.token&&this.getMyAssets()}},o=(a("NL9V"),a("KHd+")),n=Object(o.a)(r,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"my-card",style:t.getBgStyle()},[a("div",{staticClass:"card-div",style:t.getFloatUp()},[a("div",{staticClass:"member-div-bg"},[a("img",{attrs:{src:t.getMyCardBgImg()}})]),t._v(" "),a("div",{staticClass:"card-info"},[a("div",{staticClass:"card-num",class:{"color-black":2==t.$market.getMemberLevelIndex(t.$store.state.mall2.myAssets.levelNo)}},[t._v(t._s(t.$store.state.mall2.myAssets.userCardNo||""))]),t._v(" "),a("div",{staticClass:"qrcode",on:{click:t.toMyQrcode}},[2==t.$market.getMemberLevelIndex(t.$store.state.mall2.myAssets.levelNo)?a("img",{attrs:{src:"static/images/mycenter/qrcode1.png"}}):a("img",{attrs:{src:"static/images/mycenter/qrcode2.png"}})])])])])}),[],!1,null,"6ab36221",null);e.default=n.exports},NL9V:function(t,e,a){"use strict";var s=a("UV0i");a.n(s).a},UV0i:function(t,e,a){}}]);