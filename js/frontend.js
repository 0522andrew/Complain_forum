"use strict";

var Nebulas = require("nebulas");
var NebPay = require("nebpay");

var neb = new Nebulas.Neb();
var api = neb.api;
var nebPay = new NebPay();
var userAddress;

neb.setRequest(new Nebulas.HttpRequest("https://mainnet.nebulas.io"));
// neb.setRequest(new Nebulas.HttpRequest("https://testnet.nebulas.io"));
// neb.setRequest(new Nebulas.HttpRequest("http://localhost:8685"));      // 本地節點測試
var dappAddress = "n1uVXLJ8xfpE3WHji6pGWDw4DNy8r5HBAi6";    // 主網合約地址
// var dappAddress = 'n1ovn4GPda3qnbk8AHXtvWWpwLkscttudzz'; // 測試網合約地址

var serialNumber; //交易序列号
var intervalQuery; //periodically query tx results

var latestBlogsData;
var hotBlogsData;
var weeklyBlogData;

// nebulas call test
function test() {
    api.call({
        chainID: 1,
        from: dappAddress,
        to: dappAddress,
        value: 0,
        nonce: 1,
        gasPrice: 1000000,
        gasLimit: 2000000,
        contract: {
            // function: "test",
            // function: "addPost",
            function: "getPost",
            args: '[0]'
            // args: '["123", "n1V4ucZz1kAkffHik4WBeEu3fiFf7gcfMEd", "456"]'
        }
    }).then(function (resp) {
        // var result = resp.result;
        // console.log("im in")
        console.log(resp);
        //code
    });
}

function getBlog(option) {
    api.call({
        chainID: 1,
        from: dappAddress,
        to: dappAddress,
        value: 0,
        nonce: 1,
        gasPrice: 1000000,
        gasLimit: 2000000,
        contract: {
            function: "getPost",
            args: JSON.stringify([option])
        }
    }).then(function (resp) {
        console.log(resp);
    });
}

function getComment(option) {
    api.call({
        chainID: 1,
        from: dappAddress,
        to: dappAddress,
        value: 0,
        nonce: 1,
        gasPrice: 1000000,
        gasLimit: 2000000,
        contract: {
            function: "getMessage",
            args: JSON.stringify([option])
        }
    }).then(function (resp) {
        console.log(resp);
        let data = JSON.parse(resp.result);
        let table = $('<table/ class="table table-bordered table-sm">');
        if (data.length > 0){
            for(let i = 0;i< data.length;i++){
                let comment_row = $('<tr/>')
                let comment_col_1 = data[i].name ? $('<td/ class="message-align table-secondary">').text(data[i].name) : $('<td/ class="message-align table-secondary" style="color: orange;">').text("Anonymous");
                let comment_col_2 = $('<td/ class="bg-light">').text(data[i].content);
                comment_col_1.appendTo(comment_row);
                comment_col_2.appendTo(comment_row);
                comment_row.appendTo(table);
            }
            table.appendTo("#message-section-"+option);  
        }    
    });
}

function initLatest() {
    api.call({
        chainID: 1,
        from: dappAddress,
        to: dappAddress,
        value: 0,
        nonce: 1,
        gasPrice: 1000000,
        gasLimit: 2000000,
        contract: {
            function: "getPost",
            args: JSON.stringify([0])
        }
    }).then(function (resp) {
        //console.log(resp);
        if (resp.result === "") {
            //initLatest();
        } else {
            latestBlogsData = resp.result;
            //$("#latest-section").append()
            let data = JSON.parse(resp.result);
            for (let i = 0; i < data.length; i++) {
                $("#latest-section").append('<div class="blog" id="blog-'+data[i].blogId+'">');
                if (data[i].name === ""){
                    $('<p/ class="author" style="color: orange;">').text("Anonymous").appendTo("#blog-"+data[i].blogId);
                }else{
                    $('<p/ class="author">').text(data[i].name).appendTo("#blog-"+data[i].blogId);
                }
                $('<p/ class="content">').text(data[i].content).appendTo("#blog-"+data[i].blogId);
                $("#blog-"+data[i].blogId).append('<div class="info-section"><b class="thumb-up-pre" onClick="postLikeDislike(userAddress, '+"'"+data[i].blogId+"'"+', true)">👍🏿</b><b class="like-count">'+data[i].like+'</b><b class="thumb-down-pre" onClick="postLikeDislike(userAddress, '+"'"+data[i].blogId+"'"+', false)">👎🏿</b><b class="dislike-count">'+data[i].dislike+'</b><img class="message-img message-btn" src="image/speech-bubble.png" blogId="'+data[i].blogId+'"><b class="message-count">'+data[i].messageCount+'</b></div>')
                $("#blog-"+data[i].blogId).append('<hr class="divide-line">')
                $("#blog-"+data[i].blogId).append('<div class="message-section" id="message-section-'+data[i].blogId+'"></div>')
                $("#blog-"+data[i].blogId).append('<div class="input-group mb-3 message-input"><input type="text" class="form-control message-nickname message-align" placeholder="Nickname"><input type="text" class="form-control message-content" placeholder="Message" required><div class="input-group-append"><button class="btn btn-outline-secondary" type="button" onClick="postComment('+"'"+data[i].blogId+"'"+', this.parentNode.parentNode.children[0].value, this.parentNode.parentNode.children[1].value)">send</button></div></div>')
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
        
            $(document).on("click", ".message-btn" , function(){
                if ($("#message-section-"+$(this).attr("blogId")).html() === ""){
                    getComment($(this).attr("blogId"));
                }else{
                    $("#message-section-"+$(this).attr("blogId")).html("");
                }
            })
        }
    });
}

var options = {
    callback: "https://pay.nebulas.io/api/mainnet/pay",
    qrcode: {
		showQRCode: false,      //是否显示二维码信息
		container: undefined,    //指定显示二维码的canvas容器，不指定则生成一个默认canvas
		completeTip: undefined, // 完成支付提示
		cancelTip: undefined // 取消支付提示
	}
};

// nebpay call addPost
function addPost(callArgs) {
    var to = dappAddress;
    var value = 0;
    var callFunction = "addPost";
   
    serialNumber =  nebPay.call(to, value, callFunction, callArgs, options) 

    intervalQuery = setInterval(function() {
        funcIntervalQuery();
    }, 5000); 
}

function addMessage(callArgs) {
    var to = dappAddress;
    var value = 0;
    var callFunction = "addMessage";
    serialNumber =  nebPay.call(to, value, callFunction, callArgs, options); 
    
    intervalQuery = setInterval(function() {
        funcIntervalQuery();
    }, 5000); 
}

function addLikeDislike(callArgs) {
    var count = 0
    var to = dappAddress;
    var value = 0;
    var callFunction = "blogLikeDislike";
   
    serialNumber =  nebPay.call(to, value, callFunction, callArgs, options) 

    intervalQuery = setInterval(function() {
        funcIntervalQuery();
    }, 5000); 
}

//Query the result of the transaction. queryPayInfo returns a Promise object.
function funcIntervalQuery() {   
    nebPay.queryPayInfo(serialNumber, options)   //search transaction result from server (result upload to server by app)
        .then(function (resp) {
            count++;
            console.log("tx result: " + resp)   //resp is a JSON string
            var respObject = JSON.parse(resp);
            //The transaction is successful 
            if(respObject.code === 0) {
                $.notify({
                    message:"Success post！"
                }, {
                    delay: 1000,
                    timer: 3000
                });
                clearInterval(intervalQuery);    //stop the periodically query 
            } else if (respObject.code === 1) {
                console.log("Querying, please wait.");
                // $.notify({
                //     message:"Querying, please wait."
                // }, {
                //     delay: 1000,
                //     timer: 1000
                // });
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

// 獲取用戶地址
function getUserAddress() {
    console.log("********* get account ************")
    window.postMessage({
        "target": "contentscript",
        "data": {},
        "method": "getAccount",
    }, "*");
}

// listen message from contentscript
window.addEventListener('message', function (e) {
    // e.detail contains the transferred data (can
    console.log("recived by page:" + e + ", e.data:" + JSON.stringify(e.data));
    if (!!e.data.data && !!e.data.data.account) {
        userAddress = e.data.data.account;
    }
})
getUserAddress()