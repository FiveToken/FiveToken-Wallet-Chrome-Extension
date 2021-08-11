const zh = {
  welcome: {
    title:'欢迎使用 FiveToken',
    subTitle1:'Filecoin生态领域的连接器，多链融合，未来存储世界的入口。',
    subTitle2:'我们很高兴见到您。',
    btn1:'创建新钱包',
    btn2:'导入现有钱包'
  },
  creatWallet:{
    title:'创建新钱包',
    importWords:'导入助记词',
    back:'返回',
    accountName:'请输入账户名',
    nameTips:'小于15个字符',
    nameError:'无效的账户名',
    password:'请输入账户密码',
    passwordTips:'8位及以上字符',
    passwordError:'无效的密码',
    diffError:'密码不一样',
    correctPassword:'请输入正确的密码',
    confirmPassword:'确认密码',
    btn:'下一步'
  },
  creatWords:{
    title:'备份助记词',
    subTitle:'请按顺序抄写您的助记词',
    showWords:'点击此处显示密语',
    btn1:'验证助记词',
    btn2:'进入钱包',
    copy:'复制助记词',
    copySuccess:'复制成功',
    tips1:'！ 请把您的助记词放在一个安全的地方，与任何网络隔离。',
    tips2:'！ 不要在网络中（如电子邮件、相册、社交应用程序等）共享和存储助记词。',
  },
  checkWords:{
    title:'验证助记词',
    subTitle:'请按顺序点击下方的助记词，以完成备份验证。',
    btn:'确认',
    checkError:'助记词验证错误'
  },
  importWords:{
    title:'导入助记词',
    subTitle:'请输入您的助记词，以恢复您的钱包',
    tips:'单词使用空格分割',
    btn:'导入',
    error:'助记词错误',
    exist:'账户已存在'
  },
  importPrivatkey:{
    title:'导入钱包',
    label1:'请选择支持的网络',
    label2:'请输入您的私钥，以恢复您的钱包',
    btn:'导入',
    titleNetwork:'选择网络',
    importError:'类型不支持',
    exist:'账户已存在'
  },
  account:{
    title:'账户',
    lock:'锁定',
    mneAccount:'助记词账户',
    pkAccount:'私钥账户',
    createWallet:'创建钱包',
    import:'导入私钥',
    setting:'设置',
    titleAdd:'添加账户',
    addTips:'该地址使用同一助记词',
    addLabel:'账户名称',
    confirm:'确认',
    cancel:'取消'
  },
  wallet:{
    tab:[
      {name:'资产',type:'1'},
      {name:'活动',type:'2'}
    ],
    menu:[
      {name:'修改账户名',action:'editName'},
      {name:'区块链浏览器查看',action:'viewInBrowser'},
      {name:'备份私钥',action:'backupPrivateKey'},
      {name:'删除钱包',action:'deleteWallet'}
    ],
    statusSuccess:'完成',
    statusError:'失败',
    statusPending:'确认中',
    send:'发送',
    received:'接收',
    labelSend:'发送地址',
    labelReceived:'收款地址',
    titleEdit:'修改账户名',
    editLabel:'账户名称',
    editTips:'小于15个字符',
    cancel:'取消',
    confirm:'确认',
    deleteTitle:'删除确认',
    deleteTips:'请确保私钥已备份。删除后，若要展示该钱包，需使用私钥导入。',
    copyAddress:'复制地址',
    copySuccess:'复制成功',
    tranRecord:'交易记录',
    noTransactionRecord:'没有交易',
    waiting:'等待',
    noBrowser:'当前网络未添加区块链浏览器地址'
  },
  messageDetail:{
    title:'消息详情',
    amount:'数量',
    willgasFee:"预估最大手续费",
    gasFee:'手续费',
    from:'发送者',
    to:'接收者',
    messageId:'消息ID',
    success:'成功',
    error:'失败',
    pending:'确认中',
    noBrowser:'当前网络未添加区块链浏览器地址'
  },
  addToken:{
    addToken:'添加代币',
    contractAddress:'合约地址',
    token:'代币',
    tokenSymbol:'代币符号',
    decimalPoint:'小数点',
    error:'代币已添加'
  },
  sendFil:{
    send:'发送',
    token:'代币',
    toAddress:'接收地址',
    number:'数量',
    all:'全部',
    available:'可用',
    selectToken:'选择代币',
    selectAddress:'选择地址',
    recordLast:'最近使用',
    myAccount:'我的账户',
    addressBook:'地址簿',
    confirmTransaction:'确认交易',
    sendAmount:'发送数额',
    networkGas:'网络费率',
    maxGas:'预估最大手续费',
    totalTips:'发送数额+预估Gas费',
    total:'总额',
    gasFeeError:'低于当前BaseFee',
    gasLimitError:'低于当前Gas Limit',
    addressError:'地址格式不正确',
    insufficientBalance:'余额不足',
  },
  setting:{
    name:'设置',
    currency:'货币',
    language:'语言',
    titleCurrency:'选择货币',
    titlelanguage:'选择语言',
    currencyList:[
      {label:'USD',value:'usd'},
      {label:'CNY',value:'cny'}
    ],
    languageList:[
      {label:'English',value:'en'},
      {label:'한국어',value:'ko'},
      {label:'日本語',value:'ja'},
      {label:'中文',value:'zh'}
    ],
    menu:[
      {name:'网络',url:'./setting-networks.html'},
      {name:'地址簿',url:'./setting-address.html'},
      {name:'助记词备份',url:'./setting-backups.html'},
      {name:'关于',url:'./setting-about.html'},
   ]
  },
  settingNetworks:{
    title:'网络',
    addNetwork:'添加网络',
    networkName:'网络名称',
    addTips:' 恶意网络可谎报区块状态，请添加您信任的网络。',
    chainID:'链ID',
    symbol:'符号',
    rpc:"RPC URL",
    browser:'区块浏览器URL(选填)',
    cancel:'取消',
    save:'保存',
    addError:'不支持的网络'
  },
  settingAbout:{
    about:'关于',
    filVersion:'FiveToken 版本',
    tips:'Filecoin生态领域的连接器，多链融合，未来存储世界的入口。',
    privacy:'隐私政策',
    useRule:'使用条款'
  },
  settingBackups:{
    backupsCheck:'备份验证',
    backupsWords:'备份助记词',
    backupsPk:'备份私钥',
    pkTips:'请不要展示给其它人，拥有私钥可控制您的账户。',
    mneTips:'请不要展示给其它人，拥有助记词可控制您的账户。',
    next:'下一步',
    close:'关闭',
    inputPassword:'输入密码',
    copy:'复制到剪切板',
    copySuccess:'复制成功',
    passwordError:'密码不正确',
    yourMne:'您的助记词',
    yourPk:'您的私钥'
  },
  settingAddress:{
    addressBook:'地址簿',
    name:'便签名',
    address:'地址',
    addressError:'地址格式错误',
    edit:'编辑',
    cancel:'取消',
    confirm:'确认',
    addAddress:'添加地址',
    addressDetail:'地址详情',
    editAddress:'编辑地址',
    copySuccess:'复制成功',
    editSuccess:'编辑成功',
    add:'添加'
  },
  lock:{
    title:'欢迎使用 FiveToken',
    subTitle:'Filecoin生态领域的连接器，多链融合，未来存储世界的入口。',
    unlocking:'解锁',
    label:'密码'
  },
  connect:{
    title:'使用 FiveToken 连接',
    cancel:'取消',
    connect:'连接'
  },
}
export default zh
