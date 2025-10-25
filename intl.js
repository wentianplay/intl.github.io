const LANG_TEMPLATE_LIST = [
    'zh-cn',   // 简体中文
    'zh-tw',   // 繁體中文
    'en-us',   // US English
    'ja-jp',   // 日本語
];

// 语言映射配置
const LANGUAGE_MAPPING = {
    'zh': 'zh-cn',
    'zh-cn': 'zh-cn',
    'zh-sg': 'zh-cn',
    'zh-hans': 'zh-cn',
    'zh-tw': 'zh-tw',
    'zh-hk': 'zh-tw',
    'zh-mo': 'zh-tw',
    'zh-hant': 'zh-tw',
    'en': 'en-us',
    'en-us': 'en-us',
    'en-gb': 'en-us',
    'en-au': 'en-us',
    'ja': 'ja-jp',
    'ja-jp': 'ja-jp',
};

// 语言跳转配置
const REDIRECT_PATHS = {
    'zh-cn': '/zh-cn/',
    'zh-tw': '/zh-tw/', 
    'en-us': '/en-us/',
    'ja-jp': '/ja-jp/'
};

let timeoutRef;

function initLanguageJump(disableSilentJump = true) {
    // 记录SEO访问（不跳转）
    if (isSearchEngineBot()) {
        console.log('搜索引擎访问，不执行自动跳转');
        updatePageForSEO();
        return;
    }
    
    if (disableSilentJump) {
        timeoutRef = setTimeout(function() {
            const detectedLang = chooseOptLoc();
            performTransition(detectedLang);
        }, 2000);
    }
    
    bindExtraEventUIHelper();
}

function isSearchEngineBot() {
    const userAgent = navigator.userAgent.toLowerCase();
    const bots = [
        'googlebot',
        'bingbot',
        'slurp',
        'duckduckbot',
        'baiduspider',
        'yandexbot',
        'sogou',
        'exabot',
        'facebookexternalhit',
        'twitterbot',
        'rogerbot',
        'linkedinbot',
        'embedly',
        'quora link preview',
        'showyoubot',
        'outbrain',
        'pinterest',
        'developers.google.com'
    ];
    
    return bots.some(bot => userAgent.includes(bot));
}

function updatePageForSEO() {
    // 为搜索引擎优化显示内容
    document.title = "《天彬TianBIN》世界官网 - 多语言入口页面";
    const loadingElement = document.querySelector('.loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    // 更新页面说明
    const messageElement = document.querySelector('p');
    if (messageElement && messageElement.innerHTML.includes('正在识别设备本地语言支持配置')) {
        messageElement.innerHTML = '欢迎访问《天彬TianBIN》世界官网<br>请选择您的语言版本开始浏览';
    }
}

function bindExtraEventUIHelper() {
    window.gotoLangualFallback = gotoLangualFallback;
}

function gotoLangualFallback(triggered) {
    const currentLang = chooseOptLoc(true);
    const userInput = prompt(
        "请选择语言版本（输入代码）：\n" +
        "zh-cn - 简体中文\n" +
        "zh-tw - 繁體中文\n" +
        "en-us - English\n" +
        "ja-jp - 日本語",
        currentLang
    );
    
    if (userInput) {
        clearTimeout(timeoutRef);
        const normalizedInput = userInput.trim().toLowerCase();
        
        if (LANG_TEMPLATE_LIST.includes(normalizedInput)) {
            performTransition(normalizedInput);
        } else {
            alert("不支持的语言代码，请使用: zh-cn, zh-tw, en-us, ja-jp");
        }
    }
}

function chooseOptLoc(addPromptPrefilData = false) {
    if (addPromptPrefilData) {
        return detectBrowserLanguage();
    }
    
    const detectedLang = detectBrowserLanguage();
    
    if (LANG_TEMPLATE_LIST.indexOf(detectedLang) >= 0) {
        return detectedLang;
    }
    
    return chooseFallIfNotValid();
}

function detectBrowserLanguage() {
    const browserLangs = navigator.languages || [navigator.language || 'en'];
    
    for (let lang of browserLangs) {
        lang = lang.toLowerCase().trim();
        
        // 直接匹配
        if (LANGUAGE_MAPPING[lang]) {
            return LANGUAGE_MAPPING[lang];
        }
        
        // 基础语言代码匹配
        const baseLang = lang.split('-')[0];
        if (LANGUAGE_MAPPING[baseLang]) {
            return LANGUAGE_MAPPING[baseLang];
        }
    }
    
    return 'en-us';
}

function chooseFallIfNotValid() {
    return 'en-us';
}

function performTransition(langCode) {
    const path = REDIRECT_PATHS[langCode] || '/en-us/';
    console.log(`跳转到: ${path}`);
    window.location.href = path;
}