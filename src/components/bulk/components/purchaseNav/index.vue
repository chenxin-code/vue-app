<template>
  <div class="component-purchaseNav">
    <div class="purchaseNav-column" v-for="(item,index) in navList" :key="index" @click="enterNav(item,index)">
       <div class="key-dom" :class="index == navIndex ? 'active':''">
            <img :src="item.categoryPicurl" alt="">
            <span>{{item.categoryName}} </span>
       </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'purchaseNav',
  data() {
    return {
      navIndex:0,
      navList: []
    }
  },
  created() {
    this.getList();
  },
  methods: {
      getList(){
        let url = `/app/json/groupbuying_sku_index_app/queryGroupbuyingCategoryList`;
        this.$http.post(url,{}).then(res => {
           this.loading = false;
           this.isLoading = false;
           if(res.data.status == 0)this.navList = res.data.data;
        }).catch(e=>{
          console.log(e);
        })
        
      },
      enterNav(item,index){
          this.navIndex = index;
          this.$emit("navToMsg",item);
      }
  },
}
</script>
<style>
:root{
    --navWidth:60px;
    --navHeight:26px;
}
.component-purchaseNav {
  width: 100%;
  height: 120px;
  background: #f6f6f6;
  display: flex;
  justify-content: space-between;
  overflow: auto;
}
.purchaseNav-column{
    width:25%;
    height: 100%;
    flex-shrink: 0;
    flex-wrap: nowrap;
}
.key-dom{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.key-dom img{
    width:60px;
    height: 60px;
    border-radius:50%;
    border:1px solid #F6F6F6;
}
.key-dom span{
    width:120%;
    color:#000000;
    margin-top:8px;
    width:var( --navWidth);
    height: var(--navHeight);
    text-align: center;
    line-height: var(--navHeight);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.key-dom.active img{
    border:1px solid #B52232;
}
.key-dom.active span{
    color:#fff;
    background:#B52232;
    width:var( --navWidth);
    height: var(--navHeight);
    line-height: var(--navHeight);
    text-align: center;
    border-radius: 13px;
    font-size:12px;
}

</style>