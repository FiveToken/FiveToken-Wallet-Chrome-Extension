<template>
    <div class="checkbox-component">
        <el-checkbox v-model="currentValue" :disabled="disabled">{{label}}</el-checkbox>
    </div>
</template>
<script>

export default {
  data () {
    return {

    }
  },
  props: {
    value: Boolean,
    disabled: Boolean,
    label: String
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
