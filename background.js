let connectOrigin = '';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(request.method === 'openFilecoinWallet'){
        chrome.windows.getCurrent({}, function (event) {
            connectOrigin = request.params.origin
            chrome.windows.create({
                url: 'pages/filecoinwallet-connect.html',
                width: 375,
                height: 630,
                left: event.left + request.params.width - 375,
                top: event.top,
                type: 'popup'
            }, function () { 
                
            })
        })
    }
    if(request.method === 'closeWindow'){
        backgroundWindowRemove()
    }
    sendResponse('')
});

function backgroundReturnValue(){
    return connectOrigin
}

function backgroundWindowRemove(){
    chrome.windows.getCurrent({}, function (event) {
        chrome.windows.remove(event.id)
    })
}

function backgroundSendMessage(tag, data, cb){
    chrome.tabs.query({active:true}, function(tab) {
        chrome.tabs.sendMessage(tab[0].id, {
            tag: tag,
            data: data
        }, function(res) {
            if(cb){
                cb(res);
            }
        });
    });
   
}