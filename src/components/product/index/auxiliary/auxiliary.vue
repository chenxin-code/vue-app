<template>
  <div class="Auxiliary" :style="getMyStyle()">
    <!--<AuxiliaryEdit v-if="!usePorpData && pageData.moduleList[myIndex].editing"></AuxiliaryEdit>-->
  </div>
</template>

<script>
// import AuxiliaryEdit from './auxiliary-edit';
import { mapGetters } from 'vuex';

export default {
  name: 'auxiliary',
  components: {
		// AuxiliaryEdit,
	},
	props: ['myIndex', 'usePorpData', 'propData'],
	computed: {
    pageData: function() {
			if (this.usePorpData == true) {
				return this.propData;
			}
			return this.$store.state.pageData;
		},
    moduleData: function() {
			return this.pageData.moduleList[this.myIndex].data;
		},
	},
  methods: {
    getMyStyle: function () {
      let styleStr = this.$market.getModuleBgStyle(this.moduleData)
      let rw = this.moduleData.height / 375 * this.$store.state.clientWidth
      styleStr += 'height:'+ rw +'px;'
      return styleStr;
    }
  },
  created() {
    if (!this.moduleData.bgColor) {
      this.moduleData.bgColor = '';
    }
  }
};
</script>

<style>

</style>
