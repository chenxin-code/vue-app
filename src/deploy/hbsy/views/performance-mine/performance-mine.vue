<template>
	<div class="container">
		<van-tabs
			v-model="tabActive"
			title-active-color="#5076B8"
			color="#5076B8"
			:border="false"
			line-width="20px"
			line-heigh="3px"
			class="reset-tab"
			@change="changeTab">
		  <van-tab title="加油动态"></van-tab>
		  <van-tab title="我的绩效"></van-tab>
		  <van-tab title="我的客户"></van-tab>
		</van-tabs>
		<!-- 加油动态 -->
		<div class="refueling-dynamic" v-if="tabActive == 0">
			<div class="block">
				<ul class="month-tab">
					<li class="item" :class="{active: queryDynamicTimeType == 0}" @click="changeDynamicQueryTime(0)">{{ showDynamicMonth }}月<van-icon name="arrow-down" class="icon-arrow"/></li>
					<li class="item" :class="{active: queryDynamicTimeType == 1}" @click="changeDynamicQueryTime(1)">累计</li>
				</ul>
				<div class="amount-info">
					<!-- <p class="num">{{ $util.tranNumber(oilTotalInfo.oilLitre)[2] }}L/{{ $util.tranNumber(oilTotalInfo.orderAmount)[2] }}RMB</p> -->
					<p class="num">{{ oilTotalInfo.oilLitre || 0 }}L</p>
					<p class="name">合计加油</p>
				</div>
			</div>
			<div class="block dynamic-container">
				<div class="filter-info">
					<div class="select-filter">
						<van-tag
							plain
							type="primary"
							closeable
							size="medium"
							color="#5076b8"
							v-if="queryDynamicMonth && queryDynamicTimeType == 1"
							@close="clearQueryDynamicMonth">{{ queryDynamicMonth }}</van-tag>
					</div>
					<div class="filter-btn" @click="openFilterPopup">筛选<van-icon name="play" class="icon-filter-btn"/></div>
				</div>
				<van-list
		      v-model="isDynamicLoading"
		      :finished="dynamicFinished"
		      finished-text="没有更多了"
		      :offset="200"
		      @load="loadDynamicMore"
		      class="dynamic-list-container">
					<ul class="dynamic-list">
						<li class="item" v-for="(item, index) in dynamicList" :key="index">
							<div class="top-info">
								<div class="dynamic-item">
									<div class="label">交易单号：</div>
									<div class="content">{{ item.orderNo }}</div>
								</div>
								<div class="dynamic-item">
									<div class="label">交易类型：</div>
									<div class="content">{{ item.payModeStr }}</div>
								</div>
								<div class="dynamic-item">
									<div class="label">加油升数：</div>
									<div class="content">{{ item.oilLiter }}L</div>
								</div>
								<div class="dynamic-item">
									<div class="label">交易金额：</div>
									<div class="content">{{ item.amount }}</div>
								</div>
								<div class="dynamic-item">
									<div class="label">实际金额：</div>
									<div class="content">{{ item.realAmount }}</div>
								</div>
								<div class="dynamic-item">
									<div class="label">优惠赠送：</div>
									<div class="content spec" @click="toRebateDetails(item)">详情<van-icon name="arrow" class="icon-arrow"/></div>
								</div>
								<div class="dynamic-item">
									<div class="label">交易品类：</div>
									<div class="content">{{ item.oilName }}</div>
								</div>
								<div class="dynamic-item">
									<div class="label">交易时间：</div>
									<div class="content">{{ item.opeTime }}</div>
								</div>
								<div class="dynamic-item">
									<div class="label">交易站点：</div>
									<div class="content">{{ item.stationOuName }}</div>
								</div>
							</div>
							<div class="btm-user-info" @click="dynamicPerClick(item)">
								<div class="left-info">
									<img :src="item.avtUrl" alt="" class="avatar">
									<p class="name">{{ item.nickName }}/{{ item.userPhone }}</p>
								</div>
								<van-icon name="arrow" class="icon-arrow"/>
							</div>
						</li>
					</ul>
				</van-list>
			</div>
		</div>
		<!-- 绩效 -->
		<div class="performance" v-else-if="tabActive == 1">
			<div class="block">
				<ul class="month-tab">
					<li class="item" :class="{active: queryTimeType == 0}" @click="changeQueryTime(0)">{{ showMonth }}月<van-icon name="arrow-down" class="icon-arrow"/></li>
					<li class="item" :class="{active: queryTimeType == 1}" @click="changeQueryTime(1)">累计</li>
				</ul>
				<div class="amount-info" @click="toPerformanceDesc">
					<p class="num">{{ $util.toDecimal2(cumulatInfo.performance) }}</p>
					<p class="name">绩效金额</p>
					<van-icon name="arrow" class="icon-right-arrow"/>
				</div>
			</div>
			<div class="block leaderboard">
				<p class="title">
					<span @click="showEruda">贡献排行榜</span>
					<span class="title-sub">累计加油金额：{{ $util.toDecimal2(cumulatInfo.totalAmount) }}RMB</span>
				</p>
				<van-list
		      v-model="isLoading"
		      :finished="finished"
		      finished-text="没有更多了"
		      :offset="200"
		      @load="loadMore"
		      class="personal-list">
		      <ul class="personal-c" v-if="personalList.length !== 0">
		        <li
		          v-for="(item, index) in personalList"
		          :key="index"
		          class="item"
		          @click="perClick(item)">
		          <div class="left">
		          	<img :src="item.userWxUrl" alt="" class="avatar">
		          </div>
		          <div class="center">
		          	<p class="name-info">
		          		<span>{{ item.userWxName }}</span>/<span>{{ item.userWxRemark }}</span>
		          	</p>
		          	<p class="refuel-info">
		          		<span>{{ $util.toDecimal2(item.orderTotalAmount) }}RMB</span>
		          	</p>
		          </div>
		          <div class="right">
		          	<van-icon name="arrow"/>
		          </div>
		        </li>
		      </ul>
		    </van-list>
			</div>	
		</div>
		<!-- 客户 -->
		<div class="clientele" v-else>
			<div class="block total-info">
				<div class="total-num">
					<p class="num">{{ cumulativeCustomersInfo.allCustomerNum }}</p>
					<p class="name">累计客户</p>
				</div>
				<div class="total-integral">
					<p class="num">{{ cumulativeCustomersInfo.allActiveCustomerNum }}</p>
					<p class="name">累计活跃</p>
				</div>
			</div>
			<ul class="func-list">
				<li class="item" v-for="(item, index) in funcList" :key="index" @click="funcClick(item)">
					<p class="name">{{ item.name }}</p>
					<van-icon name="arrow" class="clientele-arrow-icon"/>
				</li>
			</ul>
		</div>

		<!-- 选择月份弹窗 -->
		<van-popup v-model="isShowDatePicker" position="bottom" :close-on-click-overlay="false">
			<div class="date-picker-btn">
				<span class="btn" @click="isShowDatePicker = false">取消</span>
				<span class="btn confirm" @click="confirmDate">确定</span>
			</div>
			<div class="oil-input" v-if="openDatePickerType == 1" @click.stop="isShowOilTypePicker = true">
				<div class="label">油品</div>
				<div class="content">{{ choseOilType.name }}</div>
				<van-icon
					name="close"
					class="icon-clear-oil-type"
					@click.stop="choseOilType.name = '全部'"
					v-if="choseOilType.name != '全部'"/>
			</div>
			<van-datetime-picker
			  v-model="currentDate"
			  type="year-month"
			  :max-date="maxDate"
			  :show-toolbar="false"
			  :formatter="formatter"/>	
		</van-popup>

		<!-- 选择日期弹窗 -->
		<van-popup v-model="isShowDayPicker" position="bottom" :close-on-click-overlay="false">
			<div class="date-picker-btn">
				<span class="btn" @click="isShowDayPicker = false">取消</span>
				<span class="btn confirm" @click="confirmDay">确定</span>
			</div>
			<div class="oil-input" @click.stop="isShowOilTypePicker = true">
				<div class="label">油品</div>
				<div class="content">{{ choseOilType.name }}</div>
				<!-- <van-icon
					name="close"
					class="icon-clear-oil-type"
					@click.stop="choseOilType.name = '全部'"
					v-if="choseOilType.name != '全部'"/> -->
			</div>
			<van-picker
				ref="dayPicker"
				:visible-item-count="5"
				:columns="dayColumns"
				@change="changeDayPicker"/>
		</van-popup>

		<!-- 选择油品弹窗 -->
		<van-popup v-model="isShowOilTypePicker" position="bottom" :close-on-click-overlay="false">
			<div class="date-picker-btn">
				<span class="btn" @click="isShowOilTypePicker = false">取消</span>
				<span class="btn confirm" @click="confirmOilType">确定</span>
			</div>
			<van-picker
				ref="oilTypePicker"
				value-key="name"
				:visible-item-count="5"
				:columns="oilTypeColumns"/>
		</van-popup>
	</div>
</template>
<script>
	import moment from 'moment'
	import { Icon } from 'vant'
	// import eruda from 'eruda'

	export default {
		components: {
			Icon,
		},
		data() {
			return {
				pageInfo: {
					page: 0,
					rows: 10,
				},
				dynamicList: [],
				tabActive: 0,
				queryTimeType: 0,
				isLoading: false,
				finished: true,
				personalList: [],
				funcList: [
					// {
					// 	name: '全部用户',
					// 	customerType: 0,
					// },
					{
						name: '未注册会员',
						customerType: -1,
					},
					// {
					// 	name: '普通会员',
					// 	customerType: 1,
					// },
					{
						name: '油滴会员',
						customerType: 2,
					},
					// {
					// 	name: '金油滴会员',
					// 	customerType: 3,
					// },
					{
						name: '活跃用户',
						customerType: 4,
					},
					{
						name: '非活跃用户',
						customerType: 5,
					},
				],
				currentDate: new Date(),
				maxDate: new Date(),
				isShowDatePicker: false,
				queryMonth: moment().format('YYYY-MM'),
				showMonth: moment().format('M'),
				cumulatInfo: {},
				cumulativeCustomersInfo: {
					allCustomerNum: 0,
					allActiveCustomerNum: 0,
				},

				clickTime: -1,
        vConsoleTimes: 0,

        showDynamicMonth: moment().format('M'),
        queryDynamicMonth: moment().format('YYYY-MM'),
        queryDynamicTimeType: 0,
        isShowDayPicker: false,
        dayColumns: [
	        {
	          values: [],
	          defaultIndex: 0,
	        },
	        {
	          values: ['至'],
	          defaultIndex: 0,
	        },
	        {
	          values: [],
	          defaultIndex: 0,
	        },
        ],
        // 0 加油动态中更改月份，1 加油动态中按照累计筛选，2 我的绩效中更改月份（更改月份不展示选择油品功能）
        openDatePickerType: 0,
        isShowOilTypePicker: false,
        oilTypeColumns: [
					{
						value: '',
						name: '全部'
					},
					{
						value: 92,
						name: '92汽油'
					},
					{
						value: 95,
						name: '95汽油'
					},
					{
						value: 98,
						name: '98汽油'
					},
					{
						value: 0,
						name: '柴油'
					},
				],
        choseOilType: {
        	name: '全部'
        },
        isDynamicLoading: false,
				dynamicFinished: false,
				oilTotalInfo: {
					orderAmount: '',
					oilLitre: '',
				},
				queryStartDay: '',
				queryEndDay: '',
			}
		},
		mounted() {
			// 存储用户信息（token）
	    if (this.$route.query.token) {
	      this.$store.state.login.token = this.$route.query.token
	      // 初始化油品 - 已写死
				// this.initOilTypeList()
				// 初始化汇总信息
				this.initOilTotal()
	    } else {
	      alert('获取token错误！')
	    }
	    // 初始化当前月份的天数
	    for (let i = 1; i <= Number(moment().endOf('month').format('D')); i++) {
	    	this.dayColumns[0].values.push(i + '日')
	    	this.dayColumns[2].values.push(i + '日')
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
			// 查询累计绩效和加油金额
			initCumulativeInfo() {
				this.$Loading.open()

				let queryUrl = '/app/json/wechat_qy/queryEmpPerformanceThisMonth'
				let params = {}
				if (this.queryTimeType == 0) {
					queryUrl = '/app/json/wechat_qy/queryEmpPerformanceThisMonth'
					params = {
						calMonth: this.queryMonth,
					}
				} else {
					queryUrl = '/app/json/wechat_qy/queryEmpPerformanceAll'
					params = {}
				}

				this.$http.post(queryUrl, params).then(res => {
					this.$Loading.close()
					let data = res.data
					if (data.status == 0) {
						this.cumulatInfo = data.data
					} else {
						this.$Toast(data.info)
					}
				}).catch(err => {
					this.$Loading.close()
					this.$Toast(`queryEmpPerformanceThisMonth err ${err}`)
				})
			},
			// 查询客户列表
			initCustomerList() {
				this.$Loading.open()

				this.personalList = []
				let queryUrl = '/app/json/wechat_qy/queryCustomerOrderListThisMonth'
				let params = {}
				if (this.queryTimeType == 0) {
					queryUrl = '/app/json/wechat_qy/queryCustomerOrderListThisMonth'
					params = {
						calMonth: this.queryMonth
					}
				} else {
					queryUrl = '/app/json/wechat_qy/queryCustomerOrderListAll'
					params = {}
				}

				this.$http.post(queryUrl, params).then(res => {
					this.$Loading.close()
					let data = res.data
					if (data.status == 0) {
						// data.data = [
						// 	{
						// 		userWxUrl: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3041551153,3522235016&fm=26&gp=0.jpg',
						// 		userWxName: '微信名称',
						// 		userWxRemark: '微信备注',
						// 		orderTotalAmount: 240,
						// 		userId: 23,
						// 		calMonth: '2020-07',
						// 		userPhone: '18511112222'
						// 	}
						// ]
						if (data.data instanceof Array && data.data.length > 0) {
							this.personalList.push(...data.data)
						}
					} else {
						this.$Toast(data.info)
					}
				}).catch(err => {
					this.$Loading.close()
					this.$Toast(`queryEmpPerformanceThisMonth err ${err}`)
				})
			},
			// 获取我的客户&累计活跃
			getCustomerNum() {
				this.$Loading.open()
				this.$http.post('/app/json/wechat_qy/queryCustomerNum', {}).then(res => {
					this.$Loading.close()
					let data = res.data
					if (data.status == 0) {
						if (data.data) {
							this.cumulativeCustomersInfo = data.data
						}
					} else {
						this.$Toast(data.info)
					}
				}).catch(err => {
					this.$Loading.close()
					this.$Toast(`queryCustomerNum err ${err}`)
				})
			},
			// tab切换
			changeTab(current) {
				if (current == 1) {
					this.initCumulativeInfo()
					this.initCustomerList()
				} else if (current == 2) {
					this.initCustomerList()
					this.getCustomerNum()
				}
				this.currentDate = new Date()
			},
			// 我的绩效更改按月或者累计
			changeQueryTime(type) {
				this.queryTimeType = type
				if (type == 0) {
					// 按月
					this.openDatePickerType = 2
					this.isShowDatePicker = true
				} else {
					// 累计
					this.currentDate = new Date()
					this.initCumulativeInfo()
					this.initCustomerList()
				}
			},
			loadMore() {},
			// 我的绩效点击
			perClick(item) {
				this.$router.push({
					path: '/performance-contribution-ranking',
					query: {
						userId: item.userId,
						userWxUrl: item.userWxUrl,
						userWxName: item.userWxName,
						orderTotalAmount: item.orderTotalAmount,
						calMonth: item.calMonth,
						userPhone: item.userPhone
					}
				})
			},
			// 加油动态中用户信息点击
			dynamicPerClick(item) {
				this.$router.push({
					path: '/performance-contribution-ranking',
					query: {
						userId: item.userId,
						userWxUrl: item.avtUrl,
						userWxName: item.nickName,
						orderTotalAmount: item.amount,
						calMonth: item.opeTime,
						userPhone: item.userPhone
					}
				})
			},
			// 格式化时间控件展示
			formatter(type, val) {
	      if (type === 'year') {
	        return `${val}年`
	      } else if (type === 'month') {
	        return `${val}月`
	      }
	      return val
	    },
	    // 年月弹窗确认选择
	    confirmDate(date) {
	    	if (this.openDatePickerType == 0) {
	    		this.showDynamicMonth = moment(this.currentDate).format('MM')
	    		this.queryDynamicMonth = moment(this.currentDate).format('YYYY-MM')
	    		// 根据选择的月份初始化当前月份的天数
	    		this.dayColumns[0].values = []
	    		this.dayColumns[2].values = []
			    for (let i = 1; i <= Number(moment(this.currentDate).endOf('month').format('D')); i++) {
			    	this.dayColumns[0].values.push(i + '日')
			    	this.dayColumns[2].values.push(i + '日')
			    }

			    this.pageInfo = {
			    	page: 0,
			    	rows: 10,
			    }
			    this.dynamicList = []
					this.isDynamicLoading = false
					this.dynamicFinished = false
					this.initOilTotal()
			    this.loadDynamicMore()
	    	} else if (this.openDatePickerType == 1) {
	    		this.queryDynamicMonth = moment(this.currentDate).format('YYYY-MM')
	    		this.pageInfo = {
			    	page: 0,
			    	rows: 10,
			    }
			    this.dynamicList = []
					this.isDynamicLoading = false
					this.dynamicFinished = false
			    this.loadDynamicMore()
	    	} else {
	    		this.showMonth = moment(this.currentDate).format('MM')
		    	this.queryMonth = moment(this.currentDate).format('YYYY-MM')
		    	this.initCumulativeInfo()
		    	this.initCustomerList()
	    	}
	    	this.isShowDatePicker = false
	    },
	    // 我的绩效-绩效金额点击
	    toPerformanceDesc() {
	    	let tempCalMonth = ''
	    	if (this.queryTimeType == 0) {
	    		tempCalMonth = this.queryMonth
	    	} else {
	    		tempCalMonth = ''
	    	}
	    	this.$router.push({
	    		path: '/performance-desc',
	    		query: {
	    			calMonth: tempCalMonth
	    		}
	    	})
	    },
	    // 客户列表点击
	    funcClick(item) {
	    	this.$router.push({
	    		path: '/performance-member-list',
	    		query: {
	    			customerType: item.customerType
	    		}
	    	})
	    },
	    // 加油动态-更改按月或者累计
	    changeDynamicQueryTime(type) {
				this.queryDynamicTimeType = type
				this.queryStartDay = ''
				this.queryEndDay = ''
				this.choseOilType = {
					name: '全部'
				}
				if (type == 0) {
					// 按月
					this.openDatePickerType = 0
					this.isShowDatePicker = true
				} else {
					// 累计
					this.queryDynamicMonth = ''
					this.pageInfo = {
			    	page: 0,
			    	rows: 10,
			    }
			    this.dynamicList = []
					this.isDynamicLoading = false
					this.dynamicFinished = false
					this.loadDynamicMore()
					this.initOilTotal()
				}
			},
			// 清除加油动态中累计的年月筛选
			clearQueryDynamicMonth() {
				this.queryDynamicMonth = ''
				this.pageInfo = {
					page: 0,
					rows: 10,
				}
				this.dynamicList = []
				this.isDynamicLoading = false
				this.dynamicFinished = false
				this.loadDynamicMore()
			},
	    // 日期弹窗确定
			confirmDay() {
				let choseValues = this.$refs.dayPicker.getValues()
				this.queryStartDay = choseValues[0].substr(0, choseValues[0].length - 1)
				this.queryEndDay = choseValues[2].substr(0, choseValues[2].length - 1)
				this.queryStartDay = this.queryStartDay.length < 2 ? '0' + this.queryStartDay : this.queryStartDay
				this.queryEndDay = this.queryEndDay.length < 2 ? '0' + this.queryEndDay : this.queryEndDay
				this.isShowDayPicker = false

				this.pageInfo = {
		    	page: 0,
		    	rows: 10,
		    }
		    this.dynamicList = []
				this.isDynamicLoading = false
				this.dynamicFinished = false
				this.loadDynamicMore()
			},
			// 筛选按钮点击
			openFilterPopup() {
				if (this.queryDynamicTimeType == 0) {
					this.isShowDayPicker = true
					this.$nextTick(() => {
						if (this.showDynamicMonth == moment().format('M')) {
							// 当前月份点击
							this.$refs.dayPicker.setColumnIndex(2, Number(moment().format('D')))
						} else {
							// 其他月份点击
							let targetDay = moment(this.queryDynamicMonth).endOf('month').format('D')
							this.$refs.dayPicker.setColumnIndex(2, Number(targetDay))
						}
					})
				} else if (this.queryDynamicTimeType == 1) {
					this.openDatePickerType = 1
					this.isShowDatePicker = true
				}
			},
			// 更改日期
			changeDayPicker(picker, select, changeIndex) {
				let startDay = ''
				let endDay = ''
				if (changeIndex == 0) {
					// 改变开始日期
					startDay = select[changeIndex]
					endDay = select[2]
				} else if (changeIndex == 2) {
					// 改变结束日期
					startDay = select[0]
					endDay = select[changeIndex]
				}
				// 判断开始日期是否大于结束日期
				if (Number(startDay.substr(0, startDay.length - 1)) > Number(endDay.substr(0, endDay.length - 1))) {
					picker.setColumnValue(changeIndex == 0 ? 2 : 0, changeIndex == 0 ? startDay : endDay)
				}
			},
			// 油品弹窗确认
			confirmOilType() {
				this.choseOilType = this.$refs.oilTypePicker.getValues()[0]
				this.isShowOilTypePicker = false
			},
			// 加载 加油动态 列表数据
			loadDynamicMore() {
				this.pageInfo.page++
				this.$Loading.open()
				let oilNo = ''
				if (this.choseOilType.name != '全部') {
					oilNo = this.choseOilType.value
				}
				let monthTime = ''
				if (this.queryStartDay && this.queryEndDay) {
					monthTime = `${moment(this.queryDynamicMonth).startOf('month').format('YYYY-MM')}-${this.queryStartDay} 00:00:00TO${moment(this.queryDynamicMonth).endOf('month').format('YYYY-MM')}-${this.queryEndDay} 23:59:59`
				} else {
					if (!this.queryDynamicMonth) {
						monthTime = ''
					} else {
						monthTime = moment(this.queryDynamicMonth).startOf('month').format('YYYY-MM-DD') + ' 00:00:00TO' + moment(this.queryDynamicMonth).endOf('month').format('YYYY-MM-DD') + ' 23:59:59'
					}
				}
				this.$http.post('/app/json/wechat_qy/queryDynamicCustomerOilOrd', {
					oilNo: oilNo,
					monthTime: monthTime,
					...this.pageInfo,
				}).then(res => {
					this.$Loading.close()
					this.isDynamicLoading = false
					let data = res.data
					if (data.status == 0) {
						if (data.data instanceof Array && data.data.length > 0) {
							let hasRepeat = false
							if (this.dynamicList.length > 0) {
								for (let i = 0; i < this.dynamicList.length; i++) {
									if (this.dynamicList[i].orderNo == data.data[0].orderNo) {
										hasRepeat = true
										break
									}
								}
							}
							if (!hasRepeat) {
								this.dynamicList.push(...data.data)
							}
							if (this.dynamicList.length >= data.totalRecords) {
								this.dynamicFinished = true
							}
						} else {
							this.dynamicFinished = true
						}
					} else {
						this.dynamicFinished = true
						this.$Toast(data.info)
					}
				}).catch(err => {
					this.$Loading.close()
					this.$Toast(`queryDynamicCustomerOilOrd err ${err}`)
				})
			},
			// 获取油品列表数据
			initOilTypeList() {
				this.$Loading.open()
				this.$http.post('/app/json/wechat_qy/getOilTypeTree', {}).then(res => {
					this.$Loading.close()
					let data = res.data
					if (data.status == 0) {
						this.oilTypeColumns = data.data || []
					} else {
						this.$Toast(data.info)
					}
				}).catch(err => {
					this.$Loading.close()
					this.$Toast(`getOilTypeTree err ${err}`)
				})
			},
			// 获取加油动态汇总数据
			initOilTotal() {
				this.$Loading.open()
				let tempCalMonth = ''
				if (this.queryDynamicTimeType == 0) {
					tempCalMonth = this.queryDynamicMonth
				} else {
					tempCalMonth = ''
				}
				this.$http.post('/app/json/wechat_qy/queryCustomerOilTotal', {
					calMonth: tempCalMonth
				}).then(res => {
					this.$Loading.close()
					let data = res.data
					if (data.status == 0) {
						this.oilTotalInfo = data.data || {}
					} else {
						this.$Toast(data.info)
					}
				}).catch(err => {
					this.$Loading.close()
					this.$Toast(`queryCustomerOilTotal err ${err}`)
				})
			},
			// 优惠赠送详情
			toRebateDetails(item) {
				this.$router.push({
					path: '/performance-rebate-details',
					query: {
						userId: item.userId,
						orderNo: item.orderNo
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
		.block {
			padding 10px 20px;
			background-color #fff;
			border-top .5px solid #E5E5E5;
			border-bottom .5px solid #E5E5E5;
			position relative;
			.title {
				padding-bottom 10px;
				font-size 14px;
				font-weight 600;
				color #5076B8;
			}
		}
		.leaderboard {
			margin-top 10px;
			flex 1;
			overflow hidden;
			display flex;
			flex-direction column;
			.title {
				display flex;
				justify-content space-between;
				align-items center;
				.title-sub {
					font-size 12px;
					color #333;
				}
			}
		}
		.reset-tab {
			padding 10px 0;
			/deep/ .van-tabs__nav {
				background-color transparent;
				.van-tab__text--ellipsis {
					font-size 14px;
					font-weight 500;
				}
			}
		}
		.performance {
			display flex;
			flex-direction column;
			flex 1;
			overflow hidden;
		}
		.month-tab {
			padding 4px 0;
			.item {
				width 60px;
				height 25px;
				background-color #F2F2F2;
				line-height 25px;
				font-size 14px;
				text-align center;
				border-radius 17px;
				&:last-child {
					margin-top 10px;
				}
				&.active {
					background-color #5076B8;
					color #fff;
				}
				.icon-arrow {
					font-weight 400;
					vertical-align middle;
				}
			}
		}
		.amount-info {
			position absolute;
			left 50%;
			top 50%;
			transform translate(-50%, -50%)
			text-align center;
			font-size 21px;
			.num {
				font-weight 700;
				word-break keep-all;
			}
			.name {
				font-size 14px;
				margin-top 10px;
				font-weight 500;
			}
			.icon-right-arrow {
				font-size 14px;
				font-weight 400;
				position absolute;
				top 50%;
				right -30px;
				transform translateY(-50%);
			}
		}
		.personal-list {
			overflow-y auto;
			overflow-x hidden;
			.personal-c {
				.item {
					padding 10px 0;
					border-top .5px solid #E5E5E5;
					display flex;
					align-items center;
					.left {
						.avatar {
							display block;
							width 50px;
							height 50px;
							overflow hidden;
							border-radius 50%;
						}	
					}
					.center {
						flex 1
						padding 0 10px;
						font-size 14px;
						.refuel-info {
							margin-top 10px;
						}
					}
					.right {
						width 13px;
						text-align center;
						color #C8C8CC;
						font-size 15px;
					}
				}
			}
		}
		.clientele {
			.total-info {
				font-size 21px;
				text-align center;
				display flex;
				justify-content center;
				.total-num {
					padding 12px 10px 12px 0;
				}
				.total-integral {
					padding 12px 0 12px 10px;
				}
				.num {
					font-weight 700;
				}
				.name {
					font-size 14px;
					font-weight 500;
					margin-top 10px;
				}
			}
			.func-list {
				.item {
					background-color #fff;
					font-size 14px;
					font-weight 500;
					height 48px;
					line-height 48px;
					display flex;
					justify-content space-between;
					align-items center;
					border-top .5px solid #E5E5E5;
					border-bottom .5px solid #E5E5E5;
					margin-top 10px;
					padding 0 20px;
				}
				.clientele-arrow-icon {
					font-size 14px;
					color #C8C8CC;
				}
			}
		}
		.refueling-dynamic {
			display flex;
			flex-direction column;
			flex 1;
			overflow hidden;
			.dynamic-container {
				flex 1;
				overflow-y hidden;
				margin-top 10px;
				display flex;
				flex-direction column;
				.filter-info {
					display flex;
					justify-content space-between;
					padding-bottom 10px;
					height 30px;
					.filter-btn {
						font-size 14px;
						font-weight 500;
						color #5076B8;
						display flex;
						align-items center;
						.icon-filter-btn {
							font-size 12px;
							margin-left 3px;
							transform rotate(90deg)
						}
					}
				}
				.dynamic-list-container {
					flex 1;
					overflow-y auto;
				}
				.dynamic-list {
					.item {
						padding-top 10px;
						border-top .5px solid #E5E5E5;
						.top-info {
							font-size 14px;
							line-height 18px;
							padding-bottom 10px;
							.dynamic-item {
								padding 4px 0;
								display flex;
								word-break keep-all;
								.label {
									width 70px;
								}
								.content {
									word-break break-all;
									&.spec {
										color #5A7EBC;
									}
									.icon-arrow {
										vertical-align middle;
										font-size 11px;
									}
								}
							}
						}
						.btm-user-info {
							padding 10px 0;
							border-top .5px dashed #E5E5E5;
							display flex;
							justify-content space-between;
							align-items center;
							.left-info {
								display flex;
								align-items center;
								.avatar {
									display inline-block;
									width 25px;
									height 25px;
									margin-right 5px;
								}
								.name {
									font-size 14px;
									color #999;
									display inline-block;
								}
							}
							.icon-arrow {
								font-size 14px;
								color #999;
							}
						}
					}
				}
			}
		}
		
		.date-picker-btn {
			display flex;
			justify-content space-between;
			padding 0 10px;
			.btn {
				font-size 14px;
				color #969799;
				padding 15px;
				&.confirm {
					color #5076B8;
				}
			}
		}
		.oil-input {
			display flex;
			align-items center;
			margin 10px 20px 20px;
			position relative;
			.label {
				font-size 14px;
			}
			.content {
				margin-left 5px;
				padding 0 10px;
				flex 1;
				height 30px;
				line-height 30px;
				background-color #F2F2F2;
				font-size 12px;
				color #999;
			}
			.icon-clear-oil-type {
				font-size 18px;
				color #999;
				position absolute;
				right 10px;
				top 50%;
				transform translateY(-50%);
			}
		}
	}
</style>
