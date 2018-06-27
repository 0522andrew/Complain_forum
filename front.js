"use strict";
var NebPay = require("nebpay");
var nebulas = require("nebulas");
var api = new Neb().api;
var nebPay = new NebPay();

var dappAddress = n1eM7UXtVosJF7S6ht9q6Mrh8Wftkm4X7wy;   // 合約地址
var serialNumber;     //交易序列号

function test() {

    var from = dappAddress;
    var to = dappAddress;
    var value = "0";
    var nonce = "0";
    var gas_price = "1000000";
    var gas_limit = "2000000";
    var callFunction = "test";
    var callArgs = "";
    var contract = {
        "function": callFunction,
        "args": callArgs
    }

    api.call(from, to, value, nonce, gasPrice, gasLimit, contract).then(function(resp) {
        var result = resp.result;
        console.log(result);
        //code
    });
}