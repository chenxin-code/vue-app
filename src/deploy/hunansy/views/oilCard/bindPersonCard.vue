<template>
    <div id="index">
        <!-- 个人卡绑定 -->
        <!-- 头部 -->
        <mt-header title="加油卡绑定">
            <mt-button icon="back" slot="left" @click="backEvent"></mt-button>
        </mt-header>
        <!-- 输入框 -->
        <div class="conter">
            <p class="ma-top"></p>
            <div class="input">
                <ul class="inputnumber">
                    <li class="cardnoTitle">加油卡号</li>
                    <li class="cardnoLi">{{noprefix}}</li>
                    <li class="cardnoInput">
                        <input type="number" placeholder="请输入卡号后11位" v-model="number" />
                    </li>
                </ul>
                <mt-field label="手机号码" placeholder="请输入手机号" disabled type="tel" v-model="Member"></mt-field>
                <mt-field label="手机验证码" :attr="{maxlength: 6}" placeholder="请输入短信验证码" type="type" v-model="validate">
                    <input type="button" @click="countdown" class="fl-right" :value="obtain" :disabled="disabled"
                        :style="{background:'#fff',fontSize:'12px',color:obtain==='获取验证码'?'#f02c2c':'#ccc'}" />
                </mt-field>
                <mt-field label="推荐人" placeholder="请输入推荐人（选填）" @input="changeRfrCodeType" v-model="referee">
                    <img src="static/image/fuelcard//btn_Sweep.png" width="25" height="25" @click="sweep" />
                </mt-field>
                <p @click="renders" class="btn">提交</p>
                <p class="bind-unit-card" @click="gobindUnitCard">单位加油卡绑定></p>
            </div>
            <div class="card-prompt" v-if="cardPrompt">
                <h3 class="title">温馨提示：</h3>
                <div class="content" v-html="cardPrompt"></div>
            </div>
        </div>
    </div>
</template>
<script>
import { Toast } from 'mint-ui';

export default {
    data() {
        return {
            number: '', //'1000113600006167789',
            phone: "",
            validate: '',
            referee: '',
            obtain: '获取验证码',
            disabled: false,
            Member: '',
            prohibit: false,
            noprefix: '',
            theScanCode: '',
            inway: '',
            lastPath: '',
            newList: '', // 温馨提示
            cardPrompt: '',
        }
    },
    mounted() {
        // this.getNewsList() // 内容中心接口
        this.getphone()
        this.recommenderHistory() //历史推荐人
    },
    created() {
        this.showagreement()
        this.inway = this.$route.query.inway ? this.$route.query.inway : ''
        this.lastPath = this.$route.query.lastPath ? this.$route.query.lastPath : ''
        // this.getphone();
        this.rfrCodeType = 1 // 推荐方式  1 填写  2 扫码

        // 填写默认推荐人(相对时间内)
        let referrerInvalidDate = this.$store.state.mall2.behalf.referrerInvalidDate
        if (referrerInvalidDate && referrerInvalidDate != undefined && referrerInvalidDate != '') {
            let referrerInvalidDateTime = (new Date(referrerInvalidDate)).getTime();
            let newTime = (new Date()).getTime();
            if (referrerInvalidDateTime >= newTime) {
                this.referee = this.$store.state.mall2.behalf.referrer
            }
        } else {
            this.referee = this.$store.state.mall2.behalf.referrer
        }
    },
    methods: { //18679056696

        gobindUnitCard() {
            this.$router.push({ path: '/bindUnitCard' })
        },

        showagreement() {
            this.$request.post('/app/json/news/getNewsList', { values: 24 }).then(res => {
                if (res.status == 0) {
                    this.cardPrompt = res.data[0] ? res.data[0].content : ''
                }
            })
        },
        backEvent: function () {
            // if(this.$route.query.mindex===1){
            //   this.$router.go(-1)
            // }else{
            //   // this.$router.push('/common')
            //   this.$router.go(-2)
            // }
            this.$router.go(-1)
        },
        jiami(bankNumber) {
            return bankNumber.substr(0, 4) + "****" + bankNumber.substr(-4);
        },
        changeRfrCodeType() {
            this.rfrCodeType = 1
        },
        sweep() {
            this.$bridgefunc.scanCode(res => {
                this.rfrCodeType = 2
                console.log(res.code);
                this.theScanCode = res.code;
                this.referee = res.code;
            })
        },
        countdown() {
            let that = this
            let _this = this;
            //倒计时
            var countdown = 60;

            function settime() {
                if (countdown == 0) {
                    that.disabled = false;
                    that.obtain = "获取验证码";
                    countdown = 60;
                    return false;
                } else {
                    that.disabled = true;
                    countdown === undefined ? 0 : countdown;
                    that.obtain = "重新发送(" + countdown + ")";
                    countdown--;
                }
                setTimeout(function () {
                    settime();
                }, 1000);
            }

            // 验证卡号
            var cardID = /^[0-9]{11}$/;
            if (!cardID.test(this.number)) {
                Toast('请输入正确卡号');
                return;
            }

            // 验证该卡是否绑定过
            this.$request.post('/app/json/card/checkCardHasBind', {
                cardno: this.noprefix + this.number
            }).then(res => {
                if (res.status == 0) {
                    this.$Loading.open();
                    let url = '/app/json/message/sendVerifyBindCardSms';

                    this.$http.post(url, {
                      token: _this.$store.state.login.token,
                      phone: this.phone,
                      cardno: this.noprefix + this.number
                    }).then(res => {
                        _this.$Loading.close();
                        console.log(res);
                        if (res.data.result === 'error') { // 如果不匹配，提示用户，禁止倒计时
                            Toast(res.data.info);
                            // Toast('网络错误，请稍候再试');
                        } else {
                            Toast('获取验证码成功');
                            settime();
                        }
                    })
                } else {
                    this.$Toast(res.info)
                }
            })
        },
        renders() {
            console.log(this.number)
            console.log(this.phone)
            console.log(this.validate)
            // 1 手动输入  2扫一扫
            if (this.referee == this.theScanCode) {
                this.rfrCodeType = 2;
            } else {
                this.rfrCodeType = 1;
            }
            // 验证卡号
            var cardID = /^[0-9]{11}$/;
            if (!cardID.test(this.number)) {
                Toast('请输入正确卡号');
                return;
            }
            if (this.validate === '') {
                Toast('请输入正确短信验证码');
                return;
            }
            console.log()
            this.$Loading.open();
            let _this = this;
            let url = '/app/json/card/bindCard';

            this.$http.post(url, {
              token: _this.$store.state.login.token,
              cardno: this.noprefix + this.number,
              smscode: this.validate,
              referrer: this.referee,
              bindway: 3,
              rfrCodeType: this.rfrCodeType
            }).then(
                res => {
                    _this.$Loading.close();
                    console.log(res);
                    if (res.data.status === -1) {
                        Toast(res.data.info);
                        return;
                    }
                    if (res.data.status === 0) {
                        // if (this.inway == 'replace') {
                        //     this.$router.replace({
                        //         path: this.lastPath
                        //     })
                        // } else {
                            this.$router.go(-1)
                        // }
                        // this.$router.push({
                        //   path: '/addCard',
                        // })
                    }
                })
        },
        // 获取加油卡前缀和会员手机号
        getphone() {
            this.$Loading.open();
            let _this = this;
            let url = '/app/json/card/getcardnopre';

            this.$http.post(url, {
              token: _this.$store.state.login.token,
            }).then(
                res => {
                    _this.$Loading.close();
                    console.log(res);
                    this.phone = res.data.data.phone;
                    this.noprefix = res.data.data.noprefix;
                    // this.Member = this.jiami(this.phone);
                    this.Member = this.phone;
                })
        },
        getNewsList() {
            // 内容中心 获取温馨提示
            this.$Loading.open();
            let _this = this;
            let url = '/app/json/news/getNewsList';

            this.$http.post(url, {
              token: _this.$store.state.login.token,
              values: 21
            }).then(
                res => {
                    _this.$Loading.close()
                    this.newList = res.data.data[0]
                    console.log(this.newList)
                })
        },
        //历史推荐人
        recommenderHistory() {
            this.$Loading.open();
            let _this = this;
            let url = '/app/json/card/getBindCardReferrer';

            this.$http.post(url, {
              token: _this.$store.state.login.token
            }).then(
                res => {
                    console.log(333, res);
                    _this.$Loading.close()
                    if (res.data.data) {
                        _this.referee = res.data.data ? res.data.data : ''
                        _this.prohibit = true
                    } else {
                        _this.prohibit = false
                    }
                })
        },
    }
}
</script>


<style scoped>
.card-prompt {
    padding: 15px;
}

.card-prompt .title {
    font-size: 14px;
    padding-bottom: 8px;
}

.card-prompt .content {
    font-size: 12px;
    line-height: 17px;
}
/* .mint-header {
      margin-top: 0.693333rem;
  } */
#oilMoney {
    width: 100%;
    height: 100%;
    overflow: auto;
}

.mint-header {
    background: #fff;
    color: #000;
    height: 60px;
    font-size: 20px;
}

.mintui-back {
    font-size: 28px;
}

.conter {
    padding: 0 10px;
}

.input {
    box-shadow: 1px 3px 10px #fafafa;
}

.mint-field {
    border-bottom: 1px solid #dedfdf;
}

.fl-right {
    float: right;
}

.mint-cell-text {
    font-size: 14px;
    color: #666;
}

/deep/ .mint-field-core {
    font-size: 13px;
    background: white !important;
}

.warm {
    margin-top: 20px;
    color: #333;
    font-size: 14px;
}

.warm h2 {
    line-height: 30px;
    font-weight: 700;
}

.warm p {
    line-height: 26px;
    color: #666;
}

.btn {
    padding: 10px 0px;
    text-align: center;
    line-height: 20px;
    border-radius: 1rem;
    -webkit-box-shadow: 0 0.08rem 0.106667rem pink;
    box-shadow: 0 0.08rem 0.106667rem pink;
    background: rgb(240, 44, 44);
    color: #fff;
    margin-top: 25px;
}

.bind-unit-card {
    text-align: center;
    padding: 15px;
    color: #f02c2c;
}

.inputnumber {
    display: flex;
    padding: 0 0.266667rem;
    height: 43px;
    border-bottom: 1px solid #dedfdf;
}

.inputnumber li {
    line-height: 43px;
}

.inputnumber li.cardnoTitle {
    width: 2.8rem;
    font-size: 0.373333rem;
    color: #666;
}

.inputnumber li.cardnoInput {
    flex: 1;
}

.inputnumber li.cardnoInput input {
    padding-left: 10px;
    width: 100%;
    font-size: 0.346667rem;
    background: none;
}
</style>
<style>
#index .mint-header {
    margin-top: 0.693333rem;
}

#index .mint-header {
    background: #fff;
    color: #000;
    height: 60px;
    font-size: 20px;
}

#index .mintui-back {
    font-size: 28px;
}

#index .mint-cell-text {
    font-size: 14px;
    color: #666;
}

#index .mint-field-core {
    font-size: 13px;
}
</style>
