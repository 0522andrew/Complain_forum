// require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

"use strict";

var nebulas = require("nebulas");
var NebPay = require("nebpay");

var neb = new nebulas.Neb();
var api = new Neb().api;
var nebPay = new NebPay();

neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));

var dappAddress = 'n1eM7UXtVosJF7S6ht9q6Mrh8Wftkm4X7wy';   // 合約地址
var serialNumber;     //交易序列号

function test() {

    var from = dappAddress;
    var to = dappAddress;
    var value = "0";
    var nonce = "0";
    var gas_price = "1000000";
    var gas_limit = " 2000000";
    var callFunction = "test";
    var callArgs = "";
    var contract = {
        "function": callFunction,
        "args": callArgs
    }

    api.call(from, to, value, nonce, gas_price, gas_limit, contract).then(function(resp) {
        var result = resp.result;
        console.log(result);
        //code
    });
}
// },{"./lib/account":1,"./lib/httprequest":4,"./lib/neb":5,"./lib/transaction":7,"./lib/utils/crypto-utils":8,"./lib/utils/unit":9,"./lib/utils/utils":10}]},{},[]);