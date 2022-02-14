<template>
    <div class="no-network">
        <div class="icon">
            <i class="el-icon-warning"></i>
        </div>
        <div class="text">{{$t('noNetWork')}}</div>
    </div>
</template>
<script>
export default {
  name: 'KyNoNetwork'
}
</script>
<style lang="less" scoped>
.no-network{
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 30px;
    background: #FDE9DD;
    .icon{
        display: flex;
        .el-icon-warning{
            font-size: 14px;
            color: #F03E34;
        }
    }
    .text{
        padding-left: 10px;
        font-size: 12px;
        color: #7C7C7C;
    }
}
</style>
