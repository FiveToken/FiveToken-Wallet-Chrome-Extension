# layout compontent

# emit
layoutMounted : Callback function after layout is loaded successfully

```
<template>
<kyLayout @layoutMounted="layoutMounted">
    pages
</kyLayout>
</template>
import kyLayout from '@/components/layout'
export default {
    components:{
        kyLayout
    },
    methods:{
        layoutMounted(){

        },
    }
}
```

