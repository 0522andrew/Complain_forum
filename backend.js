'use strict';

class Blog{
    constructor(obj){
        this.content = obj.content;
        this.time = obj.time;
        this.author = obj.author;
        this.name = obj.name;
        this.messageCount = obj.messageCount || 0;
        this.like = obj.like || 0;
        this.dislike = obj.dislike || 0;
        this.delete= obj.delete || false;
    }
    toString(){
        return JSON.stringify(this);
    }
}
class Message{
    constructor(obj){
        this.content = obj.content;
        this.time = obj.time;
        this.author = obj.author;
        this.name = obj.name;
        this.like = obj.like || 0;
        this.dislike = obj.dislike || 0;
        this.delete= obj.delete || false;
    }
    toString(){
        return JSON.stringify(this);
    }
}

class Bynorth{
    constructor(){
        LocalContractStorage.defineProperty(this,'blogCount',null)
        LocalContractStorage.defineMapProperty(this,'blog',{
            parse: function (text) {
                let obj=JSON.parse(text);
                return new Blog(obj);
            },
            stringify: function (o) {
                return o.toString();
            }
        });
        LocalContractStorage.defineMapProperty(this,'message',{
            parse: function (text) {
                let obj=JSON.parse(text);
                return new Message(obj);
            },
            stringify: function (o) {
                return o.toString();
            }
        })
    }
    init(){
        this.blogCount = 0;
    }
    test(){
        return this.blogCount;
    }
    addPost(content,hash,name) {
        if(content==null||content=="")
            return {'error':0};
        // if(!Blockchain.verifyAddress(hash))
        //     return {'error':1};
        let blogId = this.blogCount++;
        let time = new Date();
        let newBlog=new Blog({
            'content' : content,     //文章內容
            'time': time,         //時間
            'author': hash,       //作者地址
            'name': name,         //作者暱稱
            'messageCount': 0,  //留言數
            'like': 0,          //like數
            'dislike': 0,        //dislike數
            'delete': false
        })
        this.blog.put(blogId,newBlog);
        var r={
            'time': time,
            'blogId': blogId
        }
        console.log(r);
        return r;
    }
    addMessage(blogId,content,hash,name){
        let b = this.blog.get(blogId);
        if(b==null)
            return{'error':0};
        // if(!Blockchain.verifyAddress(hash))
        //     return {'error':1};
        if(content==null||content=="")
            return {'error':2};
        let time=new Date();
        let newMessage=new Message({
            'content' : content,     //文章內容
            'time': time,         //時間
            'author': hash,       //作者地址
            'name': name,         //作者暱稱
            'like': 0,          //like數
            'dislike': 0,        //dislike數
            'delete': false
        });
        let messageId=blogId+'-'+b.messageCount;
        this.message.put(messageId,newMessage);
        b.messageCount++;
        this.blog.put(blogId,b);
        let r={
            'time': time,
            'messageId': messageId
        }
        console.log(r);
        return r;
    }
    getPost(option){
        if(option==0){
            let begin = this.blogCount-1;
            let end = this.blogCount-250;
            if(end<0)end=0;
            let arr=new Array();
            for(let i=begin;i>=end;i--){
                let b=this.blog.get(i);
                if(!b.delete)
                    arr.push(b);
            }
            return arr;
        }
    }
    getMessage(blogId){
        let b = this.blog.get(blogId);     
        if(b==null)
            return{'error':0};   
        let begin = 0;
        let end = b.messageCount;
        let arr=new Array();
        for(let i=begin;i<end;i++){
            let m=this.message.get(blogId+'-'+i);
            if(!m.delete)
                arr.push(m);
        }
        return arr;
    }
}
module.exports = Bynorth;