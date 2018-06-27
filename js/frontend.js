// require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

"use strict";

var Nebulas = require("nebulas");
var NebPay = require("nebpay");

var neb = new Nebulas.Neb();
var api = neb.api;
var nebPay = new NebPay();
var userAddrerss;

neb.setRequest(new Nebulas.HttpRequest("https://testnet.nebulas.io"));

var dappAddress = 'n1eM7UXtVosJF7S6ht9q6Mrh8Wftkm4X7wy';   // 合約地址
var serialNumber;     //交易序列号

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
            args: '["0"]'
            // args: '["123", "n1V4ucZz1kAkffHik4WBeEu3fiFf7gcfMEd", "456"]'
        }
    }).then(function(resp) {
        // var result = resp.result;
        // console.log("im in")
        console.log(resp);
        //code
    });
}

// nebpay call addPost
function addPost(callArgs) {
    var to = dappAddress;
    var value = 0;
    var callFunction = "addPost";
    serialNumber = nebPay.call(to, value, callFunction, callArgs);

    nebPay.queryPayInfo(serialNumber)   //search transaction result from server (result upload to server by app)
            .then()
            .catch(function (err) {
                console.log(err);
            });
}

// 獲取用戶地址
function getUserAddress() {
    console.log("********* get account ************")
    window.postMessage({
        "target": "contentscript",
        "data":{
        },
        "method": "getAccount",
    }, "*");
}

// listen message from contentscript
window.addEventListener('message', function(e) {
    // e.detail contains the transferred data (can
    console.log("recived by page:" + e + ", e.data:" + JSON.stringify(e.data));
    if (!!e.data.data && !!e.data.data.account) {
        userAddrerss = e.data.data.account;
    }
})
getUserAddress()

