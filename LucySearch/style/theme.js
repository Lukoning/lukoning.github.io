
if (Cookies.get("theme") == "windows11") {
    if (Cookies.get("mode") == "light") {
        window.onfocus = function() {
            document.body.style.backgroundColor = "#EFF4F9";
        }
        window.onblur = function() {
            document.body.style.backgroundColor = "#F3F3F3";
        }
    }
}