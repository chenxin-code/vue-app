<template>
	<div class="container">
		<van-tabs
			v-model="activeTab"
			@change="changeTabs"
			:ellipsis="false"
			swipeable
			class="reset-tabs"
			color="#517BB5"
			title-active-color="#517BB5">
		  <van-tab v-for="(item, index) in tabList" :key="index" :title="item.title" :name="item.customerType">
		    <ul class="user-list" v-if="userList.length > 0">
		    	<li class="item" v-for="(item, index) in userList" :key="index">
		    		<div class="check-c" v-if="isSelecting">
		    			<van-checkbox
		    				v-model="item.isChose"
		    				shape="square"
		    				checked-color="#73D659"
		    				@click="changeSel(item)"></van-checkbox>
		    		</div>
		    		<div class="avatar-c">
		    			<img :src="item.avtUrl" alt="" class="avatar">
		    		</div>
		    		<div class="user-c" @click="toUserDetail(item)">
		    			<p class="name">{{ item.nickName }}{{ item.remark ? '/' + item.remark : '' }}</p>
		    			<p class="phone">{{ item.userPhone }}</p>
		    		</div>
		    		<van-icon name="arrow" class="icon-c"/>
		    	</li>
		    </ul>
		    <p class="no-result" v-else>暂无数据~</p>
		  </van-tab>
		</van-tabs>
		<van-button
			type="primary"
			color="#517BB5"
			:icon="!isSelecting ? 'plus' : ''"
			class="group-chat-btn"
			@click="changeListStatus">{{ isSelecting ? '取消' : '' }}</van-button>
		<div class="statistics-area" v-if="choseList.length > 0">
			<div class="chose-c">
				<ul class="chose-list">
					<li
						class="item"
						v-for="(item, index) in choseList"
						:key="index"
						@click="cancelSel(item)">
						<img :src="item.avtUrl" alt="" class="avatar">
					</li>
				</ul>	
			</div>
			<div class="confirm-btn" @click="startGroupChat">确定({{ choseList.length }})</div>
		</div>
	</div>
</template>
<script>
	import wxfuncEtp from '@/utils/wxfunc-etp.js'
	export default {
		data() {
			return {
				activeTab: 0,
				tabList: [
					{
						title: '全部用户',
						customerType: 0,
					},
					{
						title: '未注册会员',
						customerType: -1,
					},
					// {
					// 	title: '普通会员',
					// 	customerType: 1,
					// },
					{
						title: '油滴会员',
						customerType: 2,
					},
					// {
					// 	title: '金油滴会员',
					// 	customerType: 3,
					// },
					{
						title: '活跃用户',
						customerType: 4,
					},
					{
						title: '非活跃用户',
						customerType: 5,
					},
				],
				userList: [],
				// 是否选择模式
				isSelecting: false,
				// 已选择数据
				choseList: [],
			}
		},
		mounted() {
			this.activeTab = this.$route.query.customerType
			this.getCustomerList()
		},
		methods: {
			// 开启&关闭勾选功能
			changeListStatus() {
				if (this.isSelecting) {
					this.isSelecting = false
					this.choseList = []
					this.userList.forEach(item => {
						item.isChose = false
					})
				} else {
					this.isSelecting = true
				}
			},
			// 列表勾选&取消勾选
			changeSel(choseItem) {
				if (choseItem.isChose) {
					// 确认选择
					this.choseList.push(choseItem)
				} else {
					// 取消勾选
					let deleteIndex = undefined
					this.choseList.forEach((item, index) => {
						if (item.id == choseItem.id) {
							deleteIndex = index
						}
					})
					this.choseList.splice(deleteIndex, 1)
				}
			},
			// 已选列表头像点击（移除）
			cancelSel(choseItem) {
				let deleteIndex = undefined
				this.choseList.forEach((item, index) => {
					if (item.id == choseItem.id) {
						deleteIndex = index
					}
				})
				this.choseList.splice(deleteIndex, 1)

				this.userList.forEach((item, index) => {
					if (item.id == choseItem.id) {
						item.isChose = false
					}
				})
			},
			// 获取用户列表
			getCustomerList(isFirst) {
				this.$Loading.open()

				this.userList = []

				this.$http.post('/app/json/wechat_qy/queryCustomerList', {
					customerType: this.activeTab
				}).then(res => {
					this.$Loading.close()
					let data = res.data
					if (data.status == 0) {
						// data.data = [
						// 	{
						// 		nickName: '名称1',
						// 		remark: '对外备注',
						// 		avtUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600757075370&di=02c8d29f2e7923a8999427fae8ed437c&imgtype=0&src=http%3A%2F%2Fpics2.baidu.com%2Ffeed%2Fbd315c6034a85edf81702f204ba7a225dc54752a.jpeg%3Ftoken%3D40ea367f6b2ef995eaa6f5faf705a7d4',
						// 		userPhone: '18511112222',
						// 		id: 1
						// 	},
						// 	{
						// 		nickName: '名称2',
						// 		remark: '对外备注',
						// 		avtUrl: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1180991607,2645758304&fm=26&gp=0.jpg',
						// 		userPhone: '18511112222',
						// 		id: 2
						// 	},
						// 	{
						// 		nickName: '名称3',
						// 		remark: '对外备注',
						// 		avtUrl: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1180991607,2645758304&fm=26&gp=0.jpg',
						// 		userPhone: '18511112222',
						// 		id: 3
						// 	},
						// ]
						if (data.data instanceof Array && data.data.length > 0) {
							if (this.choseList instanceof Array && this.choseList.length > 0) {
								data.data.forEach(item => {
									for (let i = 0; i < this.choseList.length; i++) {
										if (this.choseList[i].qyUserId == item.qyUserId) {
											item.isChose = true
											break
										} else {
											item.isChose = false
										}
									}
								})
							} else {
								data.data.forEach(item => {
									item.isChose = false
								})
							}
							this.userList.push(...data.data)
						}
					} else {
						this.$Toast(data.info)
					}
				}).catch(err => {
					this.$Loading.close()
					this.$Toast(`queryCustomerList err ${err}`)
				})
			},
			// tab更改
			changeTabs() {
				this.getCustomerList()
			},
			// 拉起群聊
			startGroupChat() {
				let userIds = [this.choseList[0].empQyUserId]
				let externalUserIds = []
				this.choseList.forEach(item => {
					externalUserIds.push(item.qyUserId)
				})
				wxfuncEtp.createEnterpriseChat(userIds, externalUserIds, (res) => {
					console.log('拉起成功！')
				})
			},
			// 列表点击，去详情
			toUserDetail(item) {
				this.$router.push({
					path: '/performance-per-info',
					query: {
						qyUserId: item.qyUserId
					}
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
		display flex;
		flex-direction column;
		.reset-tabs {
			flex 1;
			overflow-y hidden;
			display flex;
			flex-direction column;
			/deep/ .van-tabs__content {
				margin-top 10px;
				flex 1;
				overflow-y auto;
			}
			/deep/ .van-tabs__wrap--scrollable .van-tabs__nav--complete {
				margin-right 56px;
			}
		}
		.group-chat-btn {
			position absolute;
			right 0;
			top 0;
			width 56px;
			/deep/ .van-button__text {
				font-size 11px;
			}
		}
		.user-list {
			.item {
				display flex;
				align-items center;
				background-color #fff;
				margin-bottom 10px;
				padding 10px 20px;
				.avatar-c {
					width 50px;
					height 50px;
					border-radius 50%;
					overflow hidden;
					margin 0 10px;
					img {
						display block;
						width 100%;
						height 100%;
					}
				}
				.user-c {
					flex 1;
					font-size 14px;
					.phone {
						margin-top 10px;
					}
				}
				.icon-c {
					color #C8C8CC;
					font-size 18px;
				}
			}
		}
		.no-result {
			font-size 13px;
			text-align center;
			color #999;
			padding 20px 0;
		}
		.statistics-area {
			width 100%;
			height 49px;
			border-top .5px solid #f5f5f5;
			background-color #fff;
			display flex;
			align-items center;
			padding 0 8px;
			.chose-c {
				flex 1;
				overflow-x auto;
				overflow-y hidden;
			}
			.chose-list {
				display flex;
				overflow-x auto;
				overflow-y hidden;
				width max-content;
				.item {
					width 30px;
					height 30px;
					border-radius 5px;
					overflow hidden;
					margin-right 15px;
					&:last-child {
						margin-right 0;
					}
					img {
						display block;
						width 100%;
						height 100%;
					}
				}
			}
			.confirm-btn {
				font-size 15px;
				font-weight 500;
				color #5076B8;
				width 70px;
				text-align center;
			}
		}
	}
</style>