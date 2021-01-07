<template>
	<div class="container">
		<div class="user-info">
			<img :src="userInfo.avtUrl" alt="" class="avatar" @click="showEruda">
			<div class="info">
				<p class="name">{{ userInfo.nickName }}</p>
				<p class="phone">{{ userInfo.userPhone }}</p>
			</div>
		</div>
		<ul class="basic-info-list">
			<li class="item" @click="showMsg">
				<span class="label">性别</span>
				<span class="content">{{ dealwithSex(userInfo.sex) }}</span>
			</li>
			<li class="item">
				<span class="label">客户归属</span>
				<span class="content">{{ userInfo.empName }}</span>
			</li>
			<li class="item">
				<span class="label">油滴余额</span>
				<span class="content">{{ userInfo.oilDropAmount || 0 }}</span>
			</li>
			<!-- <li class="item">
				<span class="label">过期时间</span>
				<span class="content">{{ userInfo.oilDropInvalidDate || 0 }}</span>
			</li> -->
			<li class="item">
				<span class="label">加油频次</span>
				<span class="content">{{ userInfo.refuelFre || 0 }}次/月</span>
			</li>
			<li class="item">
				<span class="label">油品偏好</span>
				<span class="content">{{ userInfo.oilPre }}</span>
			</li>
			<li class="item">
				<span class="label">支付偏好</span>
				<span class="content">{{ userInfo.payPre }}</span>
			</li>
			<li class="item">
				<span class="label">油滴会员</span>
				<span class="content">{{ dealwithIsAcctYoudi(userInfo.isAcctYoudi) }}</span>
			</li>
			<li class="item">
				<span class="label">添加好友时间</span>
				<span class="content">{{ userInfo.createTime }}</span>
			</li>
			<li class="item">
				<span class="label">最近活跃时间</span>
				<span class="content">{{ userInfo.lastRefuelTime }}</span>
			</li>
			<li class="item">
				<span class="label">常去油站</span>
				<span class="content">{{ userInfo.commonSta }}</span>
			</li>
		</ul>
		<div class="send-msg" @click="sendMsg">发送消息</div>
	</div>
</template>
<script>
	import wxfuncEtp from '@/utils/wxfunc-etp.js'
	// import eruda from 'eruda'

	export default {
		data() {
			return {
				userInfo: {},
			}
		},
		mounted() {
			if (this.$route.query.qyUserId) {
				this.getDetailInfo(this.$route.query.qyUserId)
			} else {
				// 存储用户信息（token）
		    if (this.$route.query.token) {
		      this.$store.state.login.token = this.$route.query.token
		      wxfuncEtp.getExternalContact(qyUserId => {
		      	console.log('getExternalContact qyUserId ---> ', qyUserId)
		      	this.getDetailInfo(qyUserId)
		      })
		    } else {
		      alert('获取token错误！')
		    }
			}
		},
		methods: {
			showEruda() {
				//连续点5次第一个item  显示vconsole
        let time = (new Date()).getTime();
        if (time - this.clickTime < 1000 || this.clickTime == -1) {
          this.vConsoleTimes += 1;
          this.clickTime = time;
          if (this.vConsoleTimes == 5) {
            eruda.init()
            this.vConsoleTimes = 0;
            this.clickTime = -1;
          }
        } else {
          this.vConsoleTimes = 0;
          this.clickTime = -1;
        }
			},
			showMsg() {
				wxfuncEtp.getExternalContact(qyUserId => {
	      	console.log('getExternalContact qyUserId ---> ', qyUserId)
	      	this.getDetailInfo(qyUserId)
	      })
			},
			getDetailInfo(qyUserId) {
				this.$Loading.open()
				this.$http.post('/app/json/wechat_qy/queryCustomerDetail', {
					qyUserId
				}).then(res => {
					this.$Loading.close()
					let data = res.data
					if (data.status == 0) {
						this.userInfo = data.data || {}
					} else {
						this.$Toast(data.info)
					}
				}).catch(err => {
					this.$Loading.close()
					this.$Toast(`queryCustomerDetail err ${err}`)
				})
			},
			dealwithSex(type) {
				if (type == 1) {
					return '男'
				} else if (type == 2) {
					return '女'
				} else {
					return '未知'
				}
			},
			dealwithIsAcctYoudi(type) {
				if (type == 0) {
					return '未开通'
				} else if (type == 1) {
					return '开通'
				} else {
					return '未知'
				}
			},
			sendMsg() {
				let userIds = [this.userInfo.empQyUserId]
				let externalUserIds = [this.userInfo.qyUserId]
				wxfuncEtp.createEnterpriseChat(userIds, externalUserIds, (res) => {
					console.log('拉起成功！')
				})
			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.container {
		width 100%;
		height 100%;
		background-color #F2F2F2 !important;
		color #383E44;
		overflow-y auto;
		.user-info {
			display flex;
			background-color #fff;
			border-top .5px solid #E5E5E5;
			border-bottom .5px solid #E5E5E5;
			margin-top 10px;
			padding 15px 20px;
			align-items center;
			.avatar {
				display block;
				width 50px;
				height 50px;
				border-radius 50%;
			}
			.info {
				padding 0 10px;
				font-size 14px;
				.name {
					font-weight 500;
				}
				.phone {
					font-weight 500;
					margin-top 10px;
				}
			}
		}
		.basic-info-list {
			.item {
				background-color #fff;
				border-top .5px solid #E5E5E5;
				border-bottom .5px solid #E5E5E5;
				padding 16px 20px;
				font-size 14px;
				margin-top 10px;
				display flex;
				justify-content space-between;
				.label {
					font-weight 500;
				}
				.content {
					font-weight 500;
				}
			}
		}
		.send-msg {
			width 90%;
			height 44px;
			background-color #517BB5;
			border-radius 5px;
			font-size 14px;
			font-weight 500;
			color #fff;
			margin 20px auto 20px;
			text-align center;
			line-height 44px;
		}
	}
</style>
