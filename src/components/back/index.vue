<template>
    <div class="back-component">
        <div class="back"  @click="back">
            <i class="el-icon-arrow-left"></i>
        </div>
        <div class="name" :class="{'no-close':!close}" v-if="name">{{name}}</div>
        <div class="close" v-if="close" @click="pageClose">
            <i class="el-icon-close"></i>
        </div>
    </div>
</template>
<script>

export default {
  data () {
    return { }
  },
  props: {
    name: String,
    close: Boolean
  },
  methods: {
    back () {
      this.$emit('pageBack')
    },
    pageClose () {
      this.$emit('pageClose')
    }
  }
}
</script>

<style  lang="less" scoped>
.back-component{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .back,.close{
        width: 24px;
        height: 24px;
        background-color: #F5F5F5;
        border-radius: 2px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content:center;
        flex-shrink: 0;
        i {
            font-size: 16px;
            color: #201F1F;
            font-weight: bold;
        }
    }
    .name{
        font-size: 14px;
        color: #101010;
        flex-grow: 1;
        text-align: center;
        &.no-close{
            padding-right: 24px;
        }
    }
}
</style>
