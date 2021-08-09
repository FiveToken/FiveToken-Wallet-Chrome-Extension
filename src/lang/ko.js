const ko = {
  header:{
    myAccount:'나의 계좌',
    lock:'잠금',
    createAccount:'계좌 만들기',
    import:'계정 가져 오기',
    setting:'설정'
  },
  welcome: {
    title:'Filecoin Wallet사용을 환영합니다.',
    subTitle1:'당신과 Filecoin 그리고 중심화 재거 네트워크를 연결합니다.',
    subTitle2:'당신과 만나서 우리는 매우 기쁩니다.',
    btn:'사용 시작합니다.'
  },
  firstWallet:{
    create:"계정 가져 오기",
    question:'Filecoin Wallet을 처음 사용 하십니까?',
    arr:[
      {
        icon:'el-icon-download',
        title:'아니요,나는 이미 계좌 도움말이 하나 있습니다.',
        subTitle:'열두 단어의 도움말을 사용하여 당신이 현재 가져계신 지갑으로 계좌를 가져 오십시요.',
        btn:'지갑 가져오기',
        url:'./import-wallet.html?createType=words'
      },
      {
        icon:'el-icon-download',
        title:'아니요,나는 이미 비밀치가 하나 있습니다.',
        subTitle:'비밀 키를 사용하여 당신의 지갑 계좌를 가져오십시요.',
        btn:'지갑 가져오기',
        url:'./import-wallet.html?createType=key'
      },
      {
        icon:'el-icon-plus',
        title:'첫 번째, 바로 설정이 시작됩니다.',
        subTitle:'당신의 지갑 계좌와 새 도움말을 만듭니다.',
        btn:'지갑 만들기',
        url:'./create-wallet.html?createType=create'
      },
    ]
  },
  importWallet:{
    back:'돌아가기',
    title:'계좌 도움말로 계좌 가져옵니다.',
    keyTitle:'계좌 비밀키로 계좌 가져옵니다.',
    subTitle:'12개의 단어로 구성된 계좌 도움말을 입력하여 계좌를 복원 하십시요.',
    mnemonicWords:'계좌 도움말',
    placeholder:'클립보드에서 계좌 도움말을 붙여넣으십시요.',
    showWords:'계좌 도움말 보기',
    password:'새 비밀번호',
    passwordTips:'최소 8문자,숫자,대소문자들이 포함되여야 합니다.',
    confirmPassword:'비밀번호 확인',
    agree:'나는 이미 읽고 동의 합니다.',
    clause:'사용 조항',
    btn:'들여오기',
    accountName:'계좌 명',
    privateKey:'私钥',
    diffError:'비밀번호가 다릅니다.',
    correctPassword:'정확한 비밀번호를 입력하십시요.',
    importError:'类型不支持',
    exist:'账户已存在'
  },
  creatWallet:{
    accountName:'계좌 명',
    back:'돌아가기',
    title:'비밀번호 만들기',
    password:'새 비밀번호',
    passwordTips:'최소 8문자,숫자,대소문자들이 포함되여야 합니다.',
    diffError:'비밀번호가 다릅니다.',
    correctPassword:'정확한 비밀번호를 입력하십시요.',
    confirmPassword:'비밀번호 확인',
    agree:'나는 이미 읽고 동의 합니다.',
    clause:'사용 조항',
    btn:'만들기'

  },
  creatWords:{
    title:'계좌 도움말',
    subTitle1:'당신의 계좌 도움말은 당시이 손쉽게 개인 계좌을 백업하고 복구할 수 있도록 도와줍니다.',
    subTitle2:'경고:계좌 도움말을 다른 사람에게 알려서는 안됩니다. 누구나 이 계좌의 도움말을 소지하면 바로 당신의FIL을 재어할 수 있습니다.',
    showWords:'비밀어를 보시려면 여기를 클릭 하십시요.',
    btn1:'잠시 후 알림니다.',
    btn2:' 다음 ',
    tips:'스티커:',
    tipsInfo:'이 계좌의 도움말을 종이에 기록하여 안전한 곳에 보관하여 주십시요.만약 정보의 안전성을 높이고 싶으시면 정보를 여러 장의 종이에 기록하셔서 2~3다른 곳에 보관하여 주십시요.이 계좌 도움말 기억하십시요.',
    rememberTips:''
  },
  checkWords:{
    title:'당시의 계좌 도움말을 확인 하십시요.',
    subTitle:'각 단어를 선택하여 주셔서 정확성을 확보하여 주십시요.',
    btn:'확인',
    checkError:'도움말 순서 오류 되였습니다.'
  },
  createSuccess:{
    title:'축하합니다.',
    subTitle:'당신이 성공적으로 테스트를 통과되였습니다. 당신의 계좌 도움말을 잘 보관하는 것은 당신의 책임입니다.',
    skill:'안전 보존기법',
    skillArr:[
      '백업 데이터를 여러 곳에 저장하여 주십시요',
      '이 계좌의 도움말을 누구에게도 공유하지 마십시요.',
      '인테넷 피싱을 조심 하십시요. Filecoin Wallet는 절대로 당신에게 개인 계좌 도움말을 주동적으로 요구하지 않습니다.',
      '계좌 도움말을 다시 백업하시려면 설정 통과 > 보안 옵션으로 조작 완성하십시요.'
    ],
    warn:'Filecoin Wallet无法恢复你的账户助记词。',
    btn:' 모두 완료 되였습니다.'
  },
  wallet:{
    receive:'수금',
    send:'발송',
    tab:[
      {name:'재산',type:'1'},
      {name:'활동',type:'2'}
    ],
    title:'비밀 키 보이기',
    label:'Filecoin Wallet비밀번호를 입력하십시요.',
    exportBtn:'비밀 키 내보내기',
    lookBtn:'Filscan(Filecoin 브라우저)에서 보기',
    cancel:'취소',
    confirm:'확인',
    tips:'주의:비밀 키를 영원히 공개하지 마십시요.비밀키를 가진 사람은 누구나 당신 계좌 안의 어떤 재산도 훔칠 수 있습니다. ',
    copy:'이것은 당신의 비밀 키 입니다.(클릭하면 복제됩니다.)',
    finish:'완성 되였습니다.',
    sendFil:'FIL발송합니다.',
    detail:'상세한 상황',
    from:'부터',
    to:'까지',
    transaction:'거래',
    nonce:'Nonce',
    amount:'액수',
    networkServiceCharge:'네트워크 수수료',
    totalAmount:'총액',
    activityLog:'활동 일지',
    transCreated:'거래 생성됩니다.',
    transConfirmed:'거래 확인 되였습니다.',
    transAmount:'거래 액수',
    passwordError:'비밀번호 틀렸습니다.',
    receivedSuccess:'수신에 성공되였습니다.',
    receivedError:'수신에 실패하였습니다.',
    copySuccess:'복사 성공되였습니다.',
    viewMore:'더 많은 로딩',
    sendSuccess:'전송성공했습니다',
    sendError:'전송 실패했습니다.',
    noTransactionRecord:'거래 기록 없음',
    waiting:'대기 중입니다',
    copyAddress:'주소 복제',
    copyPrivateKey:'개인 키 복사',
    copyCid:'거래 ID 복사',
    today:'오늘',
    linkTips:'Filscan에서보기'
  },
  sendFil:{
    waiting:'대기 중입니다',
    sendFil:'FIL발송합니다',
    fast:'빠른',
    normal:"일반",
    custom:'자체 정의',
    reset:'초기화',
    edit:'편집',
    password:'비밀번호 인증',
    cancel:'취소',
    confirm:'확인',
    next:'다음 ',
    error:'비밀번호 틀렸습니다.',
    cost:'거래비',
    amount:'액수',
    balance:'잔액',
    addReveice:'수신자 추가 합니다.',
    invalidReceiverAddress:'받는 측 주소가 잘못되였습니다.',
    property:'재산',
    addToaddress:'새 주소가 감지되였습니다! 주소록에 추가하시려면 클릭하십시요.',
    customFuel:'자정의 연료',
    senior:'고급',
    minerFees:'광부비용',
    sendAmount:'액수발송',
    transFees:'거래비',
    newTotal:'신규총액',
    save:'저장',
    inMyAccount:'내 계좌끼리 계좌이체',
    lastRecord:'최근기록',
    addressBook:'주소부',
    backAll:'모든 것을 되돌립니다.',
    myAccount:'내 계좌',
    insufficientBalance:'잔액 부족'
  },
  setting:{
    menu:[
      {name:'공용',url:'./setting-currency.html'},
      {name:'주소부',url:'./setting-address.html'},
      {name:'백업',url:'./setting-backups.html'},
      {name:'대해서',url:'./setting-about.html'},
      {name:'Network',url:'./setting-networks.html'}
   ]
  },
  settingAbout:{
    about:'대해서',
    filVersion:'Filecoin Wallet버전',
    version:'1.0.0',
    tips:'Filecoin Wallet는 싱가포로에서 설계와 실현하였습니다.',
    links:'링키지 합니다.',
    privacy:'개인정보 정책',
    useRule:'사용 조항'
  },
  settingBackups:{
    backups:'백업',
    showWords:'도움말 보기',
    accountWords:'계좌 도움말',
    tips:'브라우저나 컴퓨터를 바꾸시면 이 계좌의 도움말을 사용하셔서 계좌를 방문하십시요.계좌와 도움말을 안전한 곳에 보관하십시요.',
    warning:'이 계좌 도움말을 아무에게도 보여 주시지 마십시요!',
    warningTips:'이 계좌의 도움말은 당신의 모든 계좌를 훔치는 데 사용할 수 있습니다.',
    inputPassword:'계속 진행하기 위하여 비밀번호를 입력하십시요.',
    cancel:'취소',
    next:'다음 ',
    yourWords:'당신의 계좌 도움말',
    copy:'클립보드로 복사 해주십시요',
    saveCsv:'CSV파일로 저장 되였습니다.',
    close:'닫다',
    passwordError:'비밀번호 틀렸습니다.',
    copySuccess:'복사 성공되였습니다.'
  },
  settingCurrency:{
    currencyConversion:'화폐 전환',
    currency:'통용',
    back:"돌아가기",
    currentLanguage:'현재 언어',
    deleteAccount:'계좌 삭제',
    language:'zh',
    currencyArr:[
      {label:'USD',value:'usd'}
    ],
    languageList:[
      {langName:'English',lang:'en'},
      {langName:'한국어',lang:'ko'},
      {langName:'日本語',lang:'ja'},
      {langName:'中文',lang:'zh'}
    ],
    deleteTips:'이 계좌를 삭제 할실 것입니까?',
    deleteTitle:'계좌 삭제',
    cancel:'취소',
    confirm:'확인'
  },
  settingAddress:{
    name:'명칭',
    filAddress:'Filecoin Wallet주소',
    ethereumAddress:'이태방Ethereum공개 주소',
    addressError:'주소 격식이 틀렸습니다.',
    edit:'편집',
    address:'주소',
    cancel:'취소',
    confirm:'확인',
    placeholder:"Filwallet 주소 찾기,f0/f1/f2/f3",
    addAddress:'주소 추가',
    addressDetail:'상세 주소',
    editAddress:'조소 편집',
    copySuccess:'복사 성공되였습니다.',
    editSuccess:'편집 성공되였습니다.',
    addressBook:'주소부',
    myWallet:'나의 계좌 지갑',
    autoAdd:'생성된 모든 FILwallet계좌는 자동적으로 이부분을 추가 합니다.',
    lastRecord:'최근기록',
    add:'추가'
  },
  lock:{
    welcomeBack:'돌아오신것을 환영합니다.',
    enterNetwork:'곧 중심화 재외 네트워크로 들어갑니다.',
    unlocking:'해제',
    passwordError:'비밀번호 틀렸습니다.',
    selectAccount:'계정 잠금 해제를 선택하세요',
    inputPassword:'계정 비밀번호를 입력하세요'
  },
  connect:{
    title:'Filecoinwallet을 사용하여 연결합니다.  ',
    cancel:'취소',
    connect:'연결합니다'
  }
}
export default ko
