<template>
  <EditLayout title="编辑区--辅助组件">
    <br/>
    <br/>
    <Row type="flex" justify="start" align="middle" class="row-padding row-bottom-line">
      <Col span="2"> 高度
      </Col>
      <Col span="21">
        <Slider :min="5" :max="30" width="300px" v-model="pageCurrentData.height"></Slider>
      </Col>
    </Row>
    <BgEdit></BgEdit>
  </EditLayout>
</template>

<script>
  import {mapGetters} from 'vuex';
  import BgEdit from '../base/bg-edit';

  export default {
    name: 'near-shop-edit',
    computed: {
      ...mapGetters(['pageData', 'pageCurrentData']),
    },
    components: {
      BgEdit
    },
  };
</script>

<style>

</style>
