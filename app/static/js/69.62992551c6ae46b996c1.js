(window.webpackJsonp=window.webpackJsonp||[]).push([[69],{"5wcc":function(t,e,a){"use strict";a.r(e),a("L2JU");var s=a("KHd+"),i=Object(s.a)({name:"auxiliary",components:{},props:["myIndex","usePorpData","propData"],computed:{pageData:function(){return 1==this.usePorpData?this.propData:this.$store.state.pageData},moduleData:function(){return this.pageData.moduleList[this.myIndex].data}},methods:{getMyStyle:function(){return this.$market.getModuleBgStyle(this.moduleData)+"height:"+this.moduleData.height/375*this.$store.state.clientWidth+"px;"}},created:function(){this.moduleData.bgColor||(this.moduleData.bgColor="")}},(function(){var t=this.$createElement;return(this._self._c||t)("div",{staticClass:"Auxiliary",style:this.getMyStyle()})}),[],!1,null,null,null);e.default=i.exports}}]);