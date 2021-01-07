<template>
    <div id="index">
        <!-- 单位卡绑定 -->
        <!-- 头部 -->
        <mt-header title="加油卡绑定">
            <mt-button icon="back" slot="left" @click="backEvent"></mt-button>
        </mt-header>
        <!-- 输入框 -->
        <div class="conter">
            <div class="unitcard-type">
                <p :class="unitcardTypeArrIndex == index ? 'active' : ''" v-for="(item,index) in unitcardTypeArr"
                    :key="index" @click="unitcardTypeClick(item, index)">{{item}}</p>
            </div>
            <div class="input">
                <mt-field label="绑卡卡号" placeholder="请输入有效加油卡卡号" type="tel" v-model="cardNo"></mt-field>
                <mt-field label="手机号码" placeholder="请输入手机号" type="tel" v-model="phone">
                </mt-field>
                <mt-field v-if="unitcardTypeArrIndex == 0" label="手机验证码" :attr="{maxlength: 6}" placeholder="请输入短信验证码"
                    type="type" v-model="phoneCode">
                    <input type="button" @click="countdown" class="fl-right" :value="obtain" :disabled="disabled"
                        :style="{background:'#fff',fontSize:'12px',color:obtain==='获取验证码'?'#f02c2c':'#ccc'}" />
                </mt-field>
                <mt-field v-if="unitcardTypeArrIndex == 0" label="身份证号码" placeholder="请输入有效身份证号码" type="tel"
                    v-model="idcard">
                </mt-field>
                <p @click="handleBindCard" class="btn">提交</p>
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
            unitcardTypeArr: ['单位主卡', '单位副卡'],
            unitcardTypeArrIndex: 0,
            phone: "",
            phoneCode: '',
            idcard: '',
            cardNo: '', //'1000113600006167789',

            obtain: '获取验证码',
            disabled: false,
            noprefix: '',
            newList: '', // 温馨提示
            cardPrompt: '',
        }
    },
    created() {
        this.showagreement()
    },
    mounted() {
        // this.getNewsList() // 内容中心接口
        this.getphone()
        this.getCardNo()
    },
    methods: {
        unitcardTypeClick(item, index) {
            this.unitcardTypeArrIndex = index
        },
        // 温馨提示
        showagreement() {
            this.$request.post('/app/json/news/getNewsList', { values: 24 }).then(res => {
                if (res.status == 0) {
                    this.cardPrompt = res.data[0] ? res.data[0].content : ''
                }
            })
        },
        backEvent: function () {
            this.$router.go(-1)
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
            var cardID = /^[0-9]{19}$/;
            if (!cardID.test(this.cardNo)) {
                Toast('请输入正确卡号');
                return;
            }

            // 验证该卡是否绑定过
            if (this.unitcardTypeArrIndex == 0) {
                this.$request.post('/app/json/enterprise_card/checkBindInfo', { phone: this.phone }).then(res => {
                    if (res.status == 0) {
                        if (res.data) {
                            this.$Toast('当前手机号已经绑定过单位主卡')
                            return
                        }
                    } else {
                        this.$Toast(res.info)
                    }
                })
            }

            let url = '/app/json/message/sendVerifyBindCardSms';

            this.$http.post(url, {
              token: _this.$store.state.login.token,
              phone: this.phone,
              cardno: this.cardNo
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
        },
        handleBindCard() {
            // 验证卡号
            var cardID = /^[0-9]{19}$/;
            if (!cardID.test(this.cardNo)) {
                Toast('请输入正确卡号');
                return;
            }
            if (this.unitcardTypeArrIndex == 0) {
                if (this.phoneCode === '') {
                    Toast('请输入正确短信验证码');
                    return;
                }
            }


            let url = '/app/json/enterprise_card/bindEnterpriseMainCard'    // 单位主卡绑定
            let params = {
                phone: this.phone,
                phoneCode: this.phoneCode,
                idNumber: this.idcard,
                cardNo: this.cardNo
            }
            if (this.unitcardTypeArrIndex == 1) {
                url = '/app/json/enterprise_card/bindEnterpriseDeputyCard'  // 单位副卡绑定
                params = {
                    phone: this.phone,
                    // phoneCode: this.phoneCode,
                    cardNo: this.cardNo
                }
            }
            this.$request.post(url, params).then(res => {
                if (res.status == 0) {
                    this.$router.replace({ path: '/addCard' })
                } else {
                    this.$Toast(res.info)
                }
            })
        },
        // 根据手机号获取加油卡卡号
        getCardNo() {
            this.$request.post('/app/json/enterprise_card/getCardNoByPhone', { phone: 18907488002 }).then(res => {
                if (res.status == 0) {

                } else {
                    this.$Toast(res.info)
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
        }
    }
}
</script>



<style scoped>
.unitcard-type {
    text-align: center;
}
.unitcard-type p {
    font-size: 16px;
    display: inline-block;
    width: 20%;
    border-bottom: 2px solid transparent;
    padding: 5px 0;
    margin-right: 10px;
}
.unitcard-type p.active {
    color: red;
    border-bottom: 2px solid red;
}
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
