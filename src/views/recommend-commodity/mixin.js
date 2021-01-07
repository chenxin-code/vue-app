import { mapGetters } from "vuex";
export default {
  data() {
    return {
      industryClusterUrl: '/app/json/user/industryCluster', // 查询行业认证列表
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  components: {},
  created() { },
  methods: { }
}
