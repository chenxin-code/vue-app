<template>
    <div>
        <nav-top title="历史记录" @backEvent="$router.go(-1)"> </nav-top>
        <nav-content class="history-record">
            <div class="record-content">
                <div class="item" v-for="(item, index) in recordList" :key="index">
                    <div class="left">
                        <img src="../images/pdf.png" alt="" width="50" height="50">
                    </div>
                    <div class="right">
                        <div class="record-info">
                            <p class="name">{{item.fileName}}.pdf</p>
                            <p class="fileSize">文件大小: {{sysFileSizeName(item.fileSize)}}</p>
                            <p class="time">查询日期: {{item.startDate}} - {{item.endDate}}</p>
                        </div>
                        <div class="send-btns" @click="sendEmailHandle(item)">发送至邮箱</div>
                    </div>
                </div>
            </div>
        </nav-content>
    </div>
</template>
<script>
export default {
    data() {
        return {
            recordList: []
        }
    },
    mounted() {
        this.$request.post('/app/json/card/getCardStandingBookRecList').then(res => {
            if (res.status == 0) {
                this.recordList = res.data
            } else {
                this.$Toast(res.info)
            }
        })
    },
    methods: {
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
        },
        sendEmailHandle(item) {
            let params = {
                fileName: item.fileName,
                sysFileSize: item.fileSize,
                sysFileId: item.sysFileId || 0
            }
            this.$router.push({
                path: '/send-email',
                query: {
                    pdfFileInfo: JSON.stringify(params),
                    startDate: item.startDate,
                    endDate: item.endDate
                }
            })
        }
    },
}
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
.history-record {
    padding: 10px;
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    .item {
        padding: 10px;
        box-shadow: 0 0 5px #ccc;
        display: flex;
        justify-content: flex-start;
        margin-bottom: 15px;
        border-radius: 5px;

        .left {
            display: flex;
            align-items: center;
            width: 50px;
            margin-right: 10px;
        }

        .right {
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: space-between;

            .record-info {
                width: 70%;

                p {
                    padding: 5px 0;
                }

                p.fileSize, p.time {
                    color: #ccc;
                }
            }

            .send-btns {
                font-size: 12px;
                background: red;
                color: #fff;
                padding: 5px 10px;
                border-radius: 15px;
            }
        }
    }
}
</style>