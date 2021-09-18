<template>
    <div class="input-component" :class="{'error-input':error}">
        <el-input
            v-model="currentValue"
            v-bind="$attrs"
            v-on="$listeners"
        >
            <i v-if="suffix" slot="suffix" class="el-icon-view" :class="{eye:!eye}" @click="toggleEyes"></i>
        </el-input>
    </div>
</template>
<script>

export default {
  data () {
    return {
      eye: false
    }
  },
  props: {
    value: [String, Number],
    error: Boolean,
    suffix: Boolean
  },
  computed: {
    currentValue: {
      get () {
        return this.value
      },
      set (newV) {
        this.$emit('changeInput', newV)
      }
    }
  },

  methods: {
    toggleEyes () {
      this.eye = !this.eye
      this.$emit('changeEye', this.eye)
    }
  }
}
</script>

<style  lang="less" scoped>
.input-component{
    &.error-input{
        /deep/.el-input{
            .el-input__inner{
                border: 1px solid #EA0F0F;
            }
        }
    }
    /deep/.el-textarea{
        .el-textarea__inner{
            background: #F5F5F5;
        }
    }
    /deep/.el-input{
        .el-input__inner{
            height: 36px;
            line-height: 36px;
            background: #F5F5F5;
        }
        .el-input__suffix{
            padding-right: 10px;
            display: flex;
            align-items: center;
            color: #6A6767;
            cursor: pointer;
            .el-icon-view{
                &.eye{
                    position: relative;
                    &::after{
                        content: '';
                        position: absolute;
                        left: 7px;
                        top:50%;
                        transform: translateY(-50%) rotate(-45deg);
                        width: 1px;
                        height: 15px;
                        background: #6A6767;
                    }
                }
            }
        }
    }
}
</style>
