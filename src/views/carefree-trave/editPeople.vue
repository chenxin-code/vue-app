<template>
    <div class="body">
      <nav-top @backEvent="$router.go(-1)" title="编辑出行人"></nav-top>
      <nav-content>
       <div class="box">
         <div><span>中文名称</span><input v-model="peopleData.name" type="text" placeholder="请输入出行人名称"></div>
         <div><span>身份证号</span><input v-model="peopleData.idNumber" type="text" placeholder="请输入出行人身份证号"></div>
         <div><span>手机号</span><input v-model="peopleData.mobile" type="text" placeholder="请输入出行人手机号"></div>
       </div>
        <div class="btn" @click="commit">完成</div>
      </nav-content>
    </div>
</template>

<script>
  import {Toast} from 'vant'
  import api from './api'
  import store from "../../vuex/store";
  import { mapGetters } from "vuex";
    export default {
        name: "editPeople",
      mixins: [api],
      data() {
        return {
          show: false,
          peopleData: {
            name:'',
            idNumber:'',
            mobile:''
          },
          curPeo: []
        }
      },
      computed: {
        peopleList() {
          return store.state.peopleList
        }
      },
      mounted() {
        this.peopleData = this.$route.query.peopleData
      },
      methods: {
        commit() {
          let that = this
          if (!that.peopleData.name) {
            Toast({
              message: '请输入出行人姓名',
              duration: 2000,
            });
            return;
          }
          if (!(/(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/.test(that.peopleData.idNumber))) {
            Toast({
              message: '请输入正确的身份证号',
              duration: 2000,
            });
            return;
          }
          if (!(/^1(3|4|5|7|8|9)\d{9}$/.test(that.peopleData.mobile))) {
            Toast({
              message: '请输入正确的手机号',
              duration: 2000,
            });
            return;
          }
          this.curPeo = this.curPeo.concat(this.peopleList)
          this.curPeo[this.peopleData.index]=this.peopleData;
          store.commit('putpeople', this.curPeo)
          that.$router.go(-1)
        }
      },
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    background-color: #f6f6f6 !important;
    .box {
      padding: 10px 20px;
      background: white;
      margin-top 20px;
      font-size 14px;
      div {
        height: 40px;
        line-height: 40px;
        span {
          width 90px;
          margin-right 10px;
          font-size 16px;
          display inline-block
        }
      }
    }
    .btn {
      background: #deb98c;
      color: white;
      height: 40px;
      line-height: 40px;
      font-size: 18px;
      width: 93%;
      ma: center;
      text-align: center;
      margin: 50px auto 0 auto;
      border-radius: 6px;
    }
  }

</style>
