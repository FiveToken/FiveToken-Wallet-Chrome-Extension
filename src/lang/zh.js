const zh = {
  header:{
    myAccount:'我的账户',
    lock:'锁定',
    createAccount:'创建账户',
    import:'导入账户',
    setting:'设置'
  },
  welcome: {
    title:'欢迎使用FiveToken',
    subTitle1:'将您与Filecoin和去中心化网络连接起来。',
    subTitle2:'我们很高兴见到您。',
    btn:'开始使用'
  },
  firstWallet:{
    question:'第一次使用FiveToken?',
    arr:[
      {icon:'el-icon-download',title:'不，我已有一个账户助记词了。',subTitle:'使用12个单词的账户助记词导入您现有的钱包账户。',btn:'导入钱包',url:'./import-wallet.html?createType=words'},
      {icon:'el-icon-download',title:'不，我已有一个私钥了。',subTitle:'使用私钥导入您现有的钱包账户。',btn:'导入钱包',url:'./import-wallet.html?createType=key'},
      {icon:'el-icon-plus',title:'第一次，立即开始设置。',subTitle:'将为你创建新的钱包账户和账户助记词',btn:'创建钱包',url:'./create-wallet.html?createType=create'},
    ]
  },
  importWallet:{
    back:'返回',
    title:'使用账户助记词导入账户',
    keyTitle:'使用账户私钥导入账户',
    subTitle:'输入12个单词组成的账户助记词恢复您的账户。',
    mnemonicWords:'账户助记词',
    placeholder:'从剪切板粘贴账户助记词',
    showWords:'显示账户助记词',
    password:'新密码（至少8个字符,包含数字、大小写字母）',
    confirmPassword:'确认密码',
    agree:'我已阅读并同意',
    diffError:'密码不一样',
    correctPassword:'请输入正确的密码',
    clause:'使用条款',
    btn:'导入',
    accountName:'账户名',
    privateKey:'私钥',
    importError:'类型不支持',
    exist:'账户已存在'
  },
  creatWallet:{
    accountName:'账户名',
    back:'返回',
    title:'创建密码',
    password:'新密码（至少8个字符,包含数字、大小写字母）',
    diffError:'密码不一样',
    correctPassword:'请输入正确的密码',
    confirmPassword:'确认密码',
    agree:'我已阅读并同意',
    clause:'使用条款',
    btn:'创建'

  },
  creatWords:{
    title:'账户助记词',
    subTitle1:'你的账户助记词可以帮助您轻松备份和恢复个人账户。',
    subTitle2:'警告：切勿向他人透露你的账户助记词。任何人一旦持有该账户助记词，即可控制您的FIL',
    showWords:'点击此处显示密语',
    btn1:'稍后提醒',
    btn2:' 下一步',
    tips:'小贴上：',
    tipsInfo:'请将该账户助记词记录在纸上，并保存在安全的地方。如果希望提升信息的安全性，请将信息记录在多张纸上，并分别保存在2-3个不太的地方。记住该账户助记词。',
    rememberTips:''
  },
  checkWords:{
    title:'请确认您的账户助记词',
    subTitle:'请选择每个单词，以确保其正确性。',
    btn:'确认',
    checkError:'助记词顺序错误'
  },
  createSuccess:{
    title:'恭喜',
    subTitle:'您成功通过测试,保管好您的账户助记词,这是您的责任',
    skill:'安全保存技巧',
    skillArr:[
      '在多处保存备份数据',
      '不要向任何人分享该账户的助记词',
      '谨防网络钓鱼,FiveToken绝不会主动要求您提供个人账户助记词',
      '如果您需要再次备份账户助记词，请通过设置 > 安全选项完成该操作。'
    ],
    warn:'FiveToken无法恢复你的账户助记词。',
    btn:' 全部完成'
  },
  wallet:{
    receive:'收款',
    send:'发送',
    tab:[
      {name:'资产',type:'1'},
      {name:'活动',type:'2'}
    ],
    title:'显示私钥',
    label:'输入你的FiveToken密码',
    exportBtn:'导出私钥',
    lookBtn:'在Filscan (Filecoin浏览器)上查看',
    cancel:'取消',
    confirm:'确认',
    tips:'注意：永远不要公开这个私钥。任何拥有您私钥的人都可以窃取您账户中的任何资产。',
    copy:'这是您的私钥（点击复制）',
    finish:'完成',
    sendFil:'发送FIL',
    detail:'详情',
    from:'从',
    to:'至',
    transaction:'交易',
    nonce:'Nonce',
    amount:'数额',
    networkServiceCharge:'网络手续费',
    totalAmount:'总额',
    activityLog:'活动日志',
    transCreated:'交易已创建',
    transConfirmed:'交易已确认',
    transAmount:'交易数额',
    passwordError:'密码不正确',
    receivedSuccess:'接收成功',
    receivedError:'接收失败',
    copySuccess:'复制成功',
    viewMore:'加载更多',
    sendSuccess:'发送成功',
    sendError:'发送失败',
    noTransactionRecord:'没有交易',
    waiting:'等待',
    copyAddress:'复制地址',
    copyPrivateKey:'复制私钥',
    copyCid:'复制交易ID',
    today:'今天',
    connected:'已连接',
    linkTips:'filscan中查看'
  },
  sendFil:{
    waiting:'等待',
    sendFil:'发送FIL',
    fast:'快速',
    normal:"普通",
    custom:'自定义',
    reset:'重置',
    edit:'编辑',
    password:'密码验证',
    sendFil:'发送FIL',
    cancel:'取消',
    confirm:'确认',
    next:'下一步',
    error:'密码不正确',
    cost:'交易费',
    amount:'数额',
    balance:'余额',
    addReveice:'添加接收方',
    invalidReceiverAddress:'接收方地址无效',
    property:'资产',
    addToaddress:'监测到新地址!点击添加至地址簿。',
    customFuel:'自定义燃料',
    senior:'高级',
    minerFees:'矿工费用',
    sendAmount:'发送数额',
    transFees:'交易费',
    newTotal:'新总额',
    save:'保存',
    inMyAccount:'在我的账户之间转账',
    lastRecord:'最近记录',
    addressBook:'地址簿',
    backAll:'返回全部',
    myAccount:'我的账户',
    insufficientBalance:'余额不足'
  },
  setting:{
    menu:[
      {name:'通用',url:'./setting-currency.html'},
      {name:'地址簿',url:'./setting-address.html'},
      {name:'备份',url:'./setting-backups.html'},
      {name:'关于',url:'./setting-about.html'},
   ]
  },
  settingAbout:{
    about:'关于',
    filVersion:'FiveToken 版本',
    version:'1.0.0',
    tips:'FiveToken在新加坡设计和实现',
    links:'链接',
    privacy:'隐私政策',
    useRule:'使用条款'
  },
  settingBackups:{
    backups:'备份',
    showWords:'显示助记词',
    accountWords:'账户助记词',
    tips:'如果您更换浏览器或计算机，则需要使用此账户助记词访问您的帐户。请将它们保存在安全秘密的地方。',
    warning:'不要对任何人展示此账户助记词！',
    warningTips:'该账户助记词可以用来窃取您的所有帐户',
    inputPassword:'输入密码以继续',
    cancel:'取消',
    next:'下一步',
    yourWords:'你的账户助记词',
    copy:'复制到剪切板',
    saveCsv:'保存为CSV文件',
    close:'关闭',
    passwordError:'密码不正确',
    copySuccess:'复制成功'
  },
  settingCurrency:{
    currencyConversion:'货币转换',
    currency:'通用',
    back:"返回",
    currentLanguage:'当前语言',
    deleteAccount:'删除账户',
    language:'zh',
    currencyArr:[
      {label:'美元',value:'usd'}
    ],
    languageList:[
      {langName:'English',lang:'en'},
      {langName:'한국어',lang:'ko'},
      {langName:'日本語',lang:'ja'},
      {langName:'中文',lang:'zh'}
    ],
    deleteTips:'确认删除此账户吗?',
    deleteTitle:'删除账户',
    cancel:'取消',
    confirm:'确认'
  },
  settingAddress:{
    name:'名称',
    filAddress:'FiveToken 地址',
    ethereumAddress:'以太坊 Ethereum 公开地址',
    addressError:'地址格式错误',
    edit:'编辑',
    address:'地址',
    cancel:'取消',
    confirm:'确认',
    placeholder:"查找FiveToken 地址，f0/f1/f2/f3",
    addAddress:'添加地址',
    addressDetail:'地址详情',
    editAddress:'编辑地址',
    copySuccess:'复制成功',
    editSuccess:'编辑成功',
    addressBook:'地址簿',
    myWallet:'我的账户钱包',
    autoAdd:'所有创建的FiveToken账户将自动添加到此部分',
    lastRecord:'最近记录',
    add:'添加'
  },
  lock:{
    welcomeBack:'欢迎回来！',
    enterNetwork:'即将进入去中心化网络',
    unlocking:'解锁',
    passwordError:'密码不正确',
    selectAccount:'请选择解锁账号',
    inputPassword:'请输入您的帐户密码'
  },
  connect:{
    title:'使用 FiveToken 连接',
    cancel:'取消',
    connect:'连接'
  }
}
export default zh
