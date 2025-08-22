
//顾名思义
function search() {
    var url = document.getElementById("search-select").value;
    var text = document.getElementById("text-box").value;   //获取搜索引擎和搜索关键字
    if (url == "") {
        window.alert("未选择搜索引擎");
    }
    else if (text == ""){
        window.alert("未输入关键字");
    }
    else {
        window.location.href = url+text; //跳转
    }
}

//按下回车键搜索
function searchKeydown() {
    if (keyCode == 13) { //判断是否为回车键
        document.getElementById("search-button").click(); //“按下”搜索按钮
    }
}

//保存设置到Cookie
function saveSettings(operation) {
    var setTheme = document.getElementById("set-theme").value; //获取选中的主题
    var setModes = document.getElementsByName("set-mode"); //获取模式列表
    for (let i = 0; i < setModes.length; i++) { //遍历列表，找到选中的模式并添加到变量
        if(setModes[i].checked) {
            var setMode = setModes[i].value
        }
    }
    Cookies.set("theme", setTheme, {expires: 3650}) //保存设置到Cookie，3650天后失效，下同
    Cookies.set("mode", setMode, {expires: 3650})
    if (operation == 0) {
        switchTheme(setTheme, setMode, "gradient");
    }else if (operation == 1) {
        toPage("back");
    }
}

//加载设置和动画
function loadSettings(pageName, isSecondaryMenu) {
    if (Cookies.get("isIE") == undefined){ //IE检测
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            window.alert("警告！\n您似乎正在使用IE浏览器访问页面，这可能导致页面运行不正常甚至不显示任何内容。\nWarning!\nYou appear to be accessing the page using Internet Explorer, which may cause the page to not work properly or even display nothing.")
            Cookies.set("isIE", "ture", {expires: 1});
        } else {
            Cookies.set("isIE", "false", {expires: 1});
        }
    }

    if (navigator.cookieEnabled) { //检查Cookie是否启用

        if (Cookies.get("theme") == undefined) { //如果没有设置Cookie就设置
            Cookies.set("theme", "default", {expires: 3650})
        }
        if (Cookies.get("mode") == undefined) {
            Cookies.set("mode", "auto", {expires: 3650})
        }

        if (Cookies.get("theme") == undefined) {
            window.alert("警告！\n您的浏览器声明它启用了Cookie，但似乎不允许来自本页面的Cookie。您将无法保存自定义设置，且部分功能无法使用。\nWarning!\nYour browser states that it has cookies enabled, but it does not appear to allow cookies from this page. You cannot save the custom Settings, and some functions are unavailable.")
        } else {
            var themeSetting = Cookies.get("theme");
            var modeSetting = Cookies.get("mode");
        }
    } else {
        var themeSetting = "default";
        var modeSetting = "auto";
        if (pageName == "index") {
            window.alert("警告！\n您的浏览器似乎不允许Cookie或不支持Cookie。您将无法保存自定义设置，且部分功能无法使用。\nWarning!\nYour browser does not appear to allow Cookies or support them. You cannot save the custom Settings, and some functions are unavailable.")
        }
    }

    if (pageName == "settings") {//如果是设置页面就加载设置
        document.getElementById("theme-" + themeSetting).selected = true;
        document.getElementById("mode-" + modeSetting).checked = true;
    }

    if (isSecondaryMenu == "ture") {  //动画部分：如果是二级页面
        $("body").animate ({               //通过jQuery创建动画
            paddingTop: "70px",           //顶部边距
            opacity: "0",                     //不显示内容
        },0,function(){                      //“0”表示动画时长
            switchTheme(themeSetting, modeSetting);
        });
        $("body").animate ({
            paddingTop: "10px",            //将顶部边距平滑更改为10px
            opacity: "1",                      //渐变显示
        },350);                                 //和上面一样，“350”表示动画时长
    } else {                                    //如果不是二级页面
        $("body").animate ({
            opacity: "0",
        },0,function(){
            switchTheme(themeSetting, modeSetting);
        });
        $("body").animate ({
            opacity: "1",
        },300);
    }
}

//导航到某页面并附带动画
function toPage(URL) {
    if (URL == "back") {
        $("body").animate ({
            paddingTop: "70px",
            opacity: "0",
        },350,function(){
            self.location = document.referrer
        });
    } else {
        $("body").animate ({
            opacity: "0",
        },300,function(){
            window.open(URL, "_self");
        });
    }
}

//加载主题和模式
function switchTheme(theme, mode, effect) {
    
    var FSTV1 = document.getElementsByTagName("link")[0]    //Function Switch Theme Variable 1
    var FSTV2 = document.getElementsByTagName("body")[0]  //...
    var FSTV3 = document.getElementsByName("color-scheme")[0]

    if (effect == "gradient") {//渐变效果
        FSTV2.style.transitionDuration = "0.6s";
    }

    //设置主题
    if (theme == "default") { //默认主题
        FSTV1.setAttribute("href","style/defaultTheme.css"); //更换link标签的href属性
    } else if (theme == "windows11") { //仿WinUI 3控件主题
        FSTV1.setAttribute("href","style/WinUI3.css");
    } else if (theme == "genshin") { //仿原神控件主题
        FSTV1.setAttribute("href","style/genshin.css");
    } else {
        window.alert("查询/更换主题时发生错误\nTheme=" + theme);
        FSTV1.setAttribute("href","style/defaultTheme.css");
    }

    //设置模式（亮或暗）
    if (mode == "light") { //亮色模式
        FSTV2.setAttribute("class",""); //更换body标签的class属性
        FSTV3.setAttribute("content","light"); //将声明改为仅支持亮色模式
    } else if (mode == "dark") { //暗色模式
        FSTV2.setAttribute("class","dark");
        FSTV3.setAttribute("content","dark"); //将声明改为仅支持暗色模式
    } else if (mode == "auto") { //根据浏览器设置自动更换
        if (matchMedia("(prefers-color-scheme: dark)").matches) { //查询到暗色模式
            FSTV2.setAttribute("class","dark");
        } else if (matchMedia("(prefers-color-scheme: light)").matches) { //查询到亮色模式
            FSTV2.setAttribute("class","");
        } else { //都没有查询到（即：浏览器不支持）就使用亮色模式
            FSTV2.setAttribute("class","");
        }
        FSTV3.setAttribute("content","light dark"); //将声明改为支持亮色和暗色模式
    } else {
        window.alert("查询/更换模式时发生错误\nMode=" + mode);
    }

    if (effect == "gradient") {//渐变效果
        setTimeout("document.getElementsByTagName('body')[0].style.transitionDuration='0s';", 600);
    }
}