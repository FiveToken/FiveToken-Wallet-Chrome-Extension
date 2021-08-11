<template>
    <div class="input-wrap">
         <el-input v-model="currentValue"  v-bind="$props" v-on="$listeners"></el-input>
    </div>
</template>
<script>

export default {
    data(){
        return{
            
        }
    },
    props:{
        value: [String, Number],
    },
    computed: {
        currentValue: {
            get() {
                return this.value
            },
            set(newV) {
                this.$emit('changeInput', newV)
            },
        },
    },
    
    methods:{
        
    }
}
</script>

<style  lang="less" scoped>

</style>
