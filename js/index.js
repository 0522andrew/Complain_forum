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

    $(".add-btn-img").click(() => {
        if(typeof(webExtensionWallet) === "undefined") {
            alert("Extension wallet is not installed, please install it first.");
        }else{
            $("#add_blog_model").modal({show : true});
        }
    })

    postBlog = function() {
        var nickname = $("#submit-nickname").val();
        var content = $("#submit-content").val();
        let callArgs = [
            content,
            userAddrerss,
            nickname
        ]
        
        if (content !== '') {
            addPost(JSON.stringify(callArgs));
        }
    }

    postMessage = function(blogID, nickname, content) {
        // console.log(blogID);
        // console.log(name);
        // console.log(content);
        let callArgs = [
            blogID,
            content,
            userAddrerss,
            nickname
        ];
        
        if (content !== '') {
            addMessage(JSON.stringify(callArgs));
        }
    
    }
        


    initLatest()
    
    // $("#generate").click(() => {
    //     $.notify({
    //         // options
    //         message: "Querying, please wait." ,
    //         target: "generate"
    //     },{
    //         // settings
    //         element: "body",
    //         position: null,
    //         offset: 20,
    //         placement: {
    //             // from: "center",
    //             align: "right"
    //         },
    //         spacing: 20,
    //         newest_on_top: true,
    //         timer: 5000,
    //         z_index: 99999,
    //         type: 'info'
    //     });
    // })   
});
