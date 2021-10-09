<template>
    <div class="checkbox-group-component">
      <el-checkbox-group v-model="checkList">
        <el-checkbox
          v-for="(item,index) in checkboxList"
          :key="index"
          :label="item.label"
          :disabled="item.disabled"
        >
        </el-checkbox>
      </el-checkbox-group>
    </div>
</template>
<script>

export default {
  data () {
    return {

    }
  },
  props: {
    value: Array,
    checkboxList: Array
  },
  computed: {
    checkList: {
      get () {
        return this.value
      },
      set (newV) {
        this.$emit('changeCheckboxGroup', newV)
      }
    }
  },

  methods: {

  }
}
</script>
<style lang="less" scoped>
.checkbox-group-component{

}
</style>
