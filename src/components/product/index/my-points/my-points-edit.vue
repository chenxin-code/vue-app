<template>
	<EditLayout title="编辑区--我的积分">
		<Row type="flex" justify="start" class="row-padding" v-if="styleConfig.length">
			<Col span="24">
			<RadioGroup v-model="pageCurrentData.styleTempl">
				<template v-for="conf in styleConfig">
					<Radio :label="conf.label" v-if="conf.show">
						<span>{{conf.text}}</span>
					</Radio>
				</template>
			</RadioGroup>
			</Col>
		</Row>
		<template v-if="pageCurrentData.styleTempl == 1">
			<Row class="row-padding">
				<Col span="24" class="card">
				<img src="static/images/my-points/style1.jpg">
				</Col>
			</Row>
		</template>
    <BgEdit></BgEdit>
	</EditLayout>
</template>

<script>
  import BgEdit from '../base/bg-edit';
  import { mapGetters } from 'vuex';

export default {
	name: 'auxiliary-edit',
	computed: {
		...mapGetters(['pageData', 'pageCurrentData']),
	},
  components: {
    BgEdit
  },
	data() {
		return {
			myCenterStyle: 1,
			templateList: [
				{
					name: '默认',
					img: 'static/images/rubik/1-2.png',
					id: '',
				},
			],
      styleConfig: [],
		};
	},
	created(){
		this.initStyleConfig();
	},
	methods:{
		initStyleConfig(){
			let menu = this.$store.state.menu;
			let menuItem = menu.find(item => item.tag == 'MyPoints')
			this.styleConfig = menuItem.styleConfig;
		},
	},
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
.card {
	background-color: #fff;
	border: 1px dashed #ddd;
	padding: 10px;
  img {
    width 100%;
  }
}
</style>
