$(document).ready(() => {

    //检查扩展是否已安装
    //如果安装了扩展，var“webExtensionWallet”将被注入到web页面中1
    if(typeof(webExtensionWallet) === "undefined") {
        //alert ("扩展钱包未安装，请先安装.")
        alert("Extension wallet is not installed, please install it first.");
    }

    $(".thumb-up-pre").hover((event) => {
        event.currentTarget.textContent = "👍";
    }, (event) => {
        event.currentTarget.textContent = "👍🏿";
    });

    $(".thumb-down-pre").hover((event) => {
        event.currentTarget.textContent = "👎";
    }, (event) => {
        event.currentTarget.textContent = "👎🏿";
    });

    postBlog = function() {
        var nickname = $("#submit-nickname").val();
        var content = $("#submit-content").val();
        var callArgs = [
            content,
            userAddrerss,
            nickname
        ]
        
        if (content === '') {
            addPost(JSON.stringify(callArgs));
        }
    }
});

