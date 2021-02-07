<template>
  <div class="component-purchaseNav">
    <div class="purchaseNav-column" v-for="(item,index) in navList" :key="index" @click="enterNav(item,index)">
       <div class="key-dom" :class="index == navIndex ? 'active':''">
            <img :src="item.src" alt="">
            <span>{{item.title}} </span>
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
      navList: [
        {
          src: 'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1429175118,2649084526&fm=111&gp=0.jpg',
          title: '蔬菜'
        },
        {
          src: 'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1429175118,2649084526&fm=111&gp=0.jpg',
          title: '蔬菜'
        },
        {
          src: 'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1429175118,2649084526&fm=111&gp=0.jpg',
          title: '蔬菜'
        },
        {
          src: 'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1429175118,2649084526&fm=111&gp=0.jpg',
          title: '蔬菜'
        }
      ]
    }
  },
  methods: {
      enterNav(item,index){
          this.navIndex = index;
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
}
.purchaseNav-column{
    width:25%;
    height: 100%;
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
    border-radius:50%;
    border:1px solid #F6F6F6;
}
.key-dom span{
    color:#000000;
    margin-top:8px;
    width:var( --navWidth);
    height: var(--navHeight);
    text-align: center;
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
    font-size:14px;
}

</style>