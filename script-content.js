(function insertScript(w) {
    inject(script)
    messageListen()
})(window);

function inject(fn) {
    const script = document.createElement('script')
    script.text = `(${fn.toString()})();`
    document.documentElement.appendChild(script)
}

function script() {
    let DAppLink = {
        version:"1.0.0",
        isConnected:function(){
            return true
        },
        /*
        * method:String 
        * params
        */
        request:function({method,params}){
            window.postMessage({method, params}, "*")
        },
        onMessage(tag,cb){
            window.addEventListener("message", function (event) {
                if(event.data && event.data.tag && tag === event.data.tag && cb){
                    let data = event.data.data
                    cb(data)
                }
            },false)
        },
        // removeMessage(){
        //     window.removeEventListener('message',null,false)
        // }
    }
    window.DAppLink = DAppLink
}
window.addEventListener("message", function (event) {
    if (event.source !== window) return
    if (event.data.method && typeof chrome.app.isInstalled !== 'undefined') {
        chrome.runtime.sendMessage({
            method:event.data.method,
            params:event.data.params
        }, function () { 
            return true
         });
    } 
},false)

function messageListen(){
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if(request.tag == 'filecoinWalletConnect'){
            window.postMessage({ tag: "filecoinWalletAddress", data: request.data }, "*");
            chrome.runtime.sendMessage({
                method:'closeWindow'
            }, function () { 
                return true
             });
        }
        sendResponse(request.data)
    });
}
