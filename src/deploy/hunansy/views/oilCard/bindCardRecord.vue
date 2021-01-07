<template>
    <div class="bindingcard-record-index">
        <nav-top title="绑卡申请记录" @backEvent="$router.go(-1)"></nav-top>
        <nav-content class="bindingcard-record-content">
            <div class="tabs">
                <van-tabs v-model="activeName" @click="tabClick" sticky title-active-color="#FC1F32"
                    title-inactive-color="#343434" scroll="{scrollTop:200px,isFixed:true}">
                    <van-tab title="审核中" name="2"></van-tab>
                    <van-tab title="审核成功" name="1"></van-tab>
                    <van-tab title="审核失败" name="0"></van-tab>
                </van-tabs>
            </div>
            <div class="record-list">
                <div class="list-content">
                    <div class="record-list-item" v-for="(item,index) in recordList" :key="index">
                        <div class="record-item-img">
                            <img src="./image/icon@2x.png" alt width="50" />
                        </div>
                        <div class="record-item-message">
                            <p class="card-number">加油卡号: {{item.cardNo}}</p>
                            <p class="sub-time">提交时间: {{item.createTime}}</p>
                            <p class="error-reason" v-if="activeName == '2'">失败原因: {{item.approvalMessage}}</p>
                        </div>
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
            activeName: '0',
            status: 2,
            recordList: [
                {
                    cardNo: '12121313213213212',
                    createTime: '2019-11-1 15:55:45',
                    approvalMessage: '失败原因'
                }
            ]
        }
    },
    mounted() {
        this.getRecordList(this.status)
    },
    methods: {
        tabClick(name, title) {
            this.activeName = name
            if (title == '审核成功') {
                this.status = 1
            } else if (title == '审核失败') {
                this.status = 0
            } else {
                this.status = 2
            }
            this.getRecordList(this.status)
        },
        getRecordList(status) {
            this.$request.post('/app/json/enterprise_card/bindCardList', { approvalState: status }).then(res => {
                if (res.status == 0) {
                    this.recordList = res.data || []
                }
            })
        }
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.bindingcard-record-index {
    .bindingcard-record-content {
        // padding: 10px;
        .record-list {
            // padding-top: 10px;
            position: relative;
            flex: 1;
            -webkit-box-flex: 1;
            height: 100%;

            .list-content {
                position: absolute;
                top: 0;
                right: 0;
                left: 0;
                bottom: 40px;
                overflow-y: auto;
                padding: 10px;
            }

            .record-list-item {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding: 10px;
                box-shadow: 1px 1px 6px #f1f1f1;
                border-radius: 5px;
                margin-bottom: 15px;

                .record-item-message {
                    flex: 1;
                    color: #A7A7A7;
                    width: 90%;

                    p {
                        padding: 3px 10px;
                    }

                    .card-number {
                        font-size: 16px;
                        color: #4A4A4A;
                    }

                    .error-reason {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
        }
    }
}
</style>
