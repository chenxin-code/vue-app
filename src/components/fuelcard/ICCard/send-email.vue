<template>
    <div>
        <nav-top title="IC卡对账单" @backEvent="$router.go(-1)"> </nav-top>
        <nav-content class="sendEmail">
            <div class="ic-content">
                <div class="details">
                    <img src="../images/pdf.png" alt="" width="80" height="80">
                    <p class="name">{{pdfFileInfo.fileName}}.pdf</p>
                    <p class="fileSize">文件大小: {{sysFileSizeName(pdfFileInfo.sysFileSize)}}</p>
                    <p class="time">查询日期: {{startDate}} - {{endDate}}</p>
                </div>
            </div>
            <div class="btns" @click="sendEmailFun"> 发送至邮箱 </div>
        </nav-content>
        <div v-if="sendEmail">
            <van-dialog v-model="sendEmail" title="邮箱地址" @confirm="confirm" show-cancel-button>
                <div class="email-dialog">
                    <input type="text" name="" id="" v-model="emailInp" class="emailInp">
                </div>
            </van-dialog>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            sendEmail: false,
            emailInp: '', // 邮箱地址
            pdfFileInfo: {},
            startDate: '',
            endDate: ''
        }
    },
    mounted() {
        this.pdfFileInfo = JSON.parse(this.$route.query.pdfFileInfo)
        this.startDate = this.$route.query.startDate
        this.endDate = this.$route.query.endDate
        console.log(this.$route.query.pdfFileInfo)
    },
    methods: {
        sendEmailFun() {
            this.sendEmail = true
        },
        confirm() {
            if (!this.emailInp) {
                this.$Toast({
                    message: '请输入邮箱',
                    duration: 2000,
                });
                return;
            }
            var re = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
            if (this.emailInp && !re.test(this.emailInp)) {
                this.$Toast({
                    message: '请输入正确的邮箱',
                    duration: 2000,
                });
                this.emailInp = ''
                return;
            }
            let params = {
                // cardno: this.cardNo,
                reciveEmail: this.emailInp,
                sysFileId: this.pdfFileInfo.sysFileId || ''
            }
            this.$request.post('/app/json/card/sendEmailWithCompStandingBook', params).then(res => {
                if (res.status == 0) {
                    this.$Toast('发送成功')
                    this.$router.go(-1)
                    this.sendEmail = false
                    // this.$router.push({
                    //     path: '/send-email',
                    //     query: {
                    //         pdfFileInfo: JSON.stringify(res.data.pdfFileInfo),
                    //         startDate: params.startDate,
                    //         endDate: params.endDate
                    //     }
                    // })
                } else {
                    this.$Toast(res.info ? res.info : '发送失败')
                }
            })

        },
        sysFileSizeName(size) {
            let num = 1024.00
            if (size < num)
                return size + "B";
            if (size < Math.pow(num, 2))
                return (size / num).toFixed(2) + "K"; //kb
            if (size < Math.pow(num, 3))
                return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
            if (size < Math.pow(num, 4))
                return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
            return (size / Math.pow(num, 4)).toFixed(2) + "T";
        }
    },
}
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
.sendEmail {
    .ic-content {
        display: flex;
        justify-content: center;

        .details {
            width: 70%;
            text-align: center;
            padding: 20px 15px;
            border-radius: 5px;
            box-shadow: 0 0 10px #e6e6e6;
            position: relative;
            top: 70px;

            p {
                padding: 5px 0;
            }

            p.fileSize, p.time {
                color: #ccc;
            }
        }
    }

    .btns {
        position: absolute;
        bottom: 10px;
        left: 10px;
        right: 10px;
        background: red;
        color: #fff;
        text-align: center;
        line-height: 35px;
        border-radius: 20px;
    }
}

.email-dialog {
    display: flex;
    justify-content: center;

    .emailInp {
        background: #e8e8e8;
        margin: 15px 0;
        line-height: 30px;
        border-radius: 15px;
        width: 85%;
        padding: 0 15px;
        text-align: center;
    }
}
</style>