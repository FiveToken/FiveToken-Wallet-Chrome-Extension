<template>
  <div class="ky-progress">
      <el-progress :percentage="value>0 ?100: 0" :color="color"  :format="format" :show-text="false"></el-progress>
      <el-progress :percentage="value>1 ?100: 0" :color="color" :format="format" :show-text="false"></el-progress>
      <el-progress :percentage="value>2 ?100: 0" :color="color" :format="format" :show-text="false"></el-progress>
      <el-progress :percentage="value>3 ?100: 0" :color="color" :format="format" :show-text="false"></el-progress>
  </div>
</template>
<script>
export default {
  name: 'KyProgress',
  props: {
    value: {
      type: Number,
      default () {
        return 0
      }
    },
    color: {
      type: String,
      default () {
        return '#AFE0E5'
      }
    }
  },
  methods: {
    format () {
      return ''
    }
  }
}
</script>
<style lang="less" scoped>
 .ky-progress{
   display: flex;
   margin: 12px 0;
   div {
     padding-right: 5px;
     width: 24%;
   }
 }
</style>
