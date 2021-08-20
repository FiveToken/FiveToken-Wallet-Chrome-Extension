<template>
    <div class="token-logo">
       
    </div>
</template>

<script>
import randomColor from 'randomcolor'
export default {
  data() {
    return { };
  },
  mounted(){ 
    let color = randomColor({
        count: 10,
        hue: 'green'
    });
    console.log(color,'color10')

  },
  methods: {
    
  },
};
</script>

<style  lang="less" scoped>

</style>