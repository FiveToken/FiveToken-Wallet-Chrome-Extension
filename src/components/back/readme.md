# back compontent
Back to the top of the page component

## props
name: String,page name
close: Boolean,Whether to show the close button

## methods
back: Click the method to return to the icon on the left
pageClose: Click the method to close the icon on the right

```
<template>
<kyBack @pageBack="back"></kyBack>
</template>
import kyBack from '@/components/back'
export default {
    data(){
        return {
            name:'wallet',
            close:true
        }
    },
    components:{
        kyBack
    },
    methods:{
        back(){

        },
        pageClose(){

        }
    }
}
```

