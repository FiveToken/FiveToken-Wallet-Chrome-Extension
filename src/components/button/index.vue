<template>
    <div class="button-wrap">
        <div class="button"
            :class="[type === 'primary'?'primary':'default',active ? 'active':'']"
            @click="btnClick"
        >
           <slot/>
        </div>
    </div>
</template>
<script>

export default {
  data () {
    return { }
  },
  props: {
    text: String,
    type: String, // default "primary"
    active: Boolean,
    loading: Boolean
  },
  methods: {
    btnClick () {
      this.$emit('btnClick')
    }
  }
}
</script>

<style  lang="less" scoped>
.button-wrap{
    width: 100%;
    height: 34px;
    .button{
        width: 100%;
        height: 34px;
        text-align: center;
        line-height: 34px;
        color: #101010;
        font-size: 14px;
        margin: 0 auto;
        cursor: pointer;
        border-radius: 4px;
        position: relative;
        z-index: 1;
        &.default{
            background: #fff;
            border: 1px solid #AFE0E5;
            transition:all 0.4;
            &:hover{
                color: #fff;
                background: #5BC1CA;
            }
            // &::before{
            //     content: '';
            //     position: absolute;
            //     top: 0;
            //     left: 0;
            //     width: 100%;
            //     height: 100%;
            //     background: #5BC1CA;
            //     z-index: -1;
            //     opacity: 0;
            //     -webkit-transform: scale3d(0.7, 1, 1);
            //     transform: scale3d(0.1, 1, 1);
            //     transition: transform 0.4s, opacity 0.4s;
            // }
            // &:hover:before{
            //     opacity: 1;
            //     -webkit-transform: translate3d(0, 0, 0);
            //     transform: translate3d(0, 0, 0);
            // }
        }
        &.primary{
            color: #fff;
            background-color: #AFE0E5;
            border: 1px solid #AFE0E5;
            &.active{
                background: #5BC1CA;
                border: 1px solid #5BC1CA;
            }
        }
    }
}
</style>
