# button compontent

## props
text: String, the text of button 
type: String, the type of button
active: Boolean, the status of button 

## methods
btnClick: Click the button to execute the method
```
<template>
<kyButton @btnClick="btnClick" :type="type" :active="active">{{name}}</kyButton>
</template>
import kyButton from '@/components/button'
export default {
    data(){
        return {
            name:'button',
            type:'primary',
            active:true
        }
    },
    components:{
        kyBack
    },
    methods:{
        btnClick(){

        }
    }
}
```

