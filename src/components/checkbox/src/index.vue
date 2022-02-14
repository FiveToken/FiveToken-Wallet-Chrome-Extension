<template>
    <div class="checkbox-component">
        <el-checkbox v-model="currentValue" :disabled="disabled">{{label}}</el-checkbox>
    </div>
</template>
<script>

export default {
  name: 'KyCheckbox',
  props: {
    value: Boolean,
    disabled: Boolean,
    label: String
  },
  data () {
    return {

    }
  },
  computed: {
    currentValue: {
      get () {
        return this.value
      },
      set (newV) {
        this.$emit('changeCheckbox', newV)
      }
    }
  },

  methods: {

  }
}
</script>
<style lang="less" scoped>
.checkbox-component{

}
</style>
