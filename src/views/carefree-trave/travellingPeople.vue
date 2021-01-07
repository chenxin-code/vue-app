<template>
    <div class="body">
      <nav-top @backEvent="$router.go(-1)" title="出行人"></nav-top>
      <nav-content>
        <div class="box">
          <div class="boxDiv">
<!--            <p class="chu">出行人</p>-->
            <ul>
              <li v-for="(item,index) in peopleList" :key="index">
                <p>{{item.name}}</p>
                <span>身份证号：{{item.idNumber}}</span>
                <span>手机号：{{item.mobile}}</span>
              </li>
            </ul>
          </div>
        </div>
      </nav-content>
    </div>
</template>

<script>
    export default {
        name: "travellingPeople",
      data(){
          return {
            peopleList: []
          }
      },
      mounted() {
          this.peopleList = this.$route.query.peopleList || []
      },
      methods: {

      },
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    background-color: #f6f6f6 !important;
    .box {
      font-size 14px;
      margin-top: 14px;

      .div1 {
        display flex;
        justify-content space-between

        span {
          font-size 14px;
          margin auto 0
        }

        .state {
          width 75px;
          text-align: right;
        }

        div {
          display flex;
          justify-content space-between

          img {
            width 24px;
            height 24px;
            margin auto
            margin-right 5px;
          }

          span {
            font-size 16px;
            margin auto
            line-height 22px;
          }
        }
      }

      .div2 {
        display flex;
        justify-content start

        img {
          width: 110px;
          height: 110px;
          border-radius: 6px;
          margin-right: 15px;
        }

        div {
          display flex;
          flex-direction column
          font-size 14px;

          p:nth-child(1) {
            margin-top: 30px;
            margin-bottom: 10px;
          }
        }
      }

      .boxDiv {
        display flex
        justify-content space-between

        p {
          width 70px;
          font-size 16px;
          margin auto 0
        }

        ul {
          width 100%
          li {
            background white;
            margin-bottom: 14px;
            display: flex;
            flex-direction: column;
            padding 20px;

            p {
              margin-bottom 8px
              font-size 14px;
            }

            span:nth-child(2) {
              margin-bottom 8px;
            }

            span {
              color #656464
            }
          }
        }
      }
    }

  }
  /deep/ .nav-content {
    overflow-y auto !important
  }
</style>
