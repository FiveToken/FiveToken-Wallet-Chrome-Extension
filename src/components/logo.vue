<template>
  <div class="logo-component">
    <img class="img" :src="logo" />
  </div>
</template>

<script>
  export default {
    name: 'logo-component',
    data(){
      return{
        logo:require('@/assets/image/logo.png')
      }
    }
  }
</script>

<style>
.logo-components {
  width: 120px;
  height:120px;
}
</style>
