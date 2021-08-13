const background = chrome.extension.getBackgroundPage();

function popupToBackground(tag, data){
    background.backgroundSendMessage(tag, data)
}
function popupWindowRemove(){
    background.backgroundWindowRemove()
}

function popupGetVal(key){
    let val = background.backgroundReturnValue(key)
    return val
}

// open www
function openUrl(url){
    chrome.tabs.create({ url}, function(tab) { 
        // chrome.tabs.executeScript(tab.id, {file: 'src/contentScript2'});
    });
}



