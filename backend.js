'use strict';

class Blog{
    constructor(obj){
        this.blogId = obj.blogId;
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
        this.messageId = obj.messageId;
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

class whetherLikeOrDislike{
    constructor(obj){
        this.status=obj.status; //0(無) or 1(踩) or 2(讚)
    }
    toString(){
        return JSON.stringify(this);
    }
}

class blogContainer{
    constructor(obj){
        this.blogIds=obj.blogIds;
    }
    toString(){
        return JSON.stringify(this);        
    }
}


class Bynorth{
    constructor(){
        LocalContractStorage.defineProperty(this,'blogCount',null);
        LocalContractStorage.defineProperty(this,'hotMin',null);
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
        });
        LocalContractStorage.defineMapProperty(this,'likeOrDislike',{
            parse: function (text) {
                let obj=JSON.parse(text);
                return new whetherLikeOrDislike(obj);
            },
            stringify: function (o) {
                return o.toString();
            }
        });
        LocalContractStorage.defineMapProperty(this,'userBlog',{
            parse: function (text) {
                let obj=JSON.parse(text);
                return new blogContainer(obj);
            },
            stringify: function (o) {
                return o.toString();
            }
        });
        this.hotBlog=new Array();
    }
    init(){
        this.blogCount = 0;
        this.hotMin=0;
        this.hotBlog=new Array();
    }
    updateHot(b){
        if((b.like+b.dislike)>this.hotMin){
            this.hotBlog.push(b.blogId);
            this.hotMin=(b.like+b.dislike);
        }
        else if((b.like+b.dislike)==this.hotMin&&this.hotBlog.length<250){
            this.hotBlog.push(b.blogId);
            console.log('hi');
            console.log(b.blogId);
            console.log(this.hotBlog);            
        }
        if(this.hotBlog.length>250){
            for(let i=0;i<this.hotBlog.length;i++){
                let nb=this.blog.get(this.hotBlog[i]);
                if(nb.like+nb.dislike<this.hotMin){
                    this.hotBlog.splice(i,1);
                    return;
                }
            }
        }
        console.log(b);
        console.log(this.hotBlog);
        var that=this;
        this.hotBlog.sort(function(a,b){
            let B=that.blog.get(b);
            let A=that.blog.get(a);            
            return (A.like+A.dislike)-(B.like+B.dislike);
        });
        console.log(this.hotBlog);
        
    }
    test(){
        return this.blogCount;
    }
    addPost(content,hash,name) {
        if(content===null||content==="")
            return {'error':0};
        // if(!Blockchain.verifyAddress(hash))
        //     return {'error':1};
        let blogId = this.blogCount++;
        let time = new Date();
        let newBlog=new Blog({
            'blogId' : blogId,
            'content' : content,     //文章內容
            'time': time,         //時間
            'author': hash,       //作者地址
            'name': name,         //作者暱稱
            'messageCount': 0,  //留言數
            'like': 0,          //like數
            'dislike': 0,        //dislike數
            'delete': false
        });
        let user=this.userBlog.get(hash);
        if(!user){
            user=new blogContainer({
                'blogIds':[blogId]
            });
        }else{
            user.blogIds.push(blogId);
        }
        this.blog.put(blogId,newBlog);
        this.userBlog.put(hash,user);
        this.updateHot(newBlog);
        var r={
            'time': time,
            'blogId': blogId
        }
        console.log(r);
        return r;
    }
    addMessage(blogId,content,hash,name){
        let b = this.blog.get(blogId);
        if(b===null)
            return{'error':0};
        // if(!Blockchain.verifyAddress(hash))
        //     return {'error':1};
        if(content===null||content==="")
            return {'error':2};
        let time=new Date();
        let messageId=blogId+'-'+b.messageCount;        
        let newMessage=new Message({
            'messageId' : messageId,
            'content' : content,     //文章內容
            'time': time,         //時間
            'author': hash,       //作者地址
            'name': name,         //作者暱稱
            'like': 0,          //like數
            'dislike': 0,        //dislike數
            'delete': false
        });
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
        if(option===0){ //last
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
        else if(option===1){//hot
            return this.hotBlog;
        }
        else if(option===2){//一週精華

        }
    }

    getMessage(blogId){
        let b = this.blog.get(blogId);     
        if(b===null)
            return{'error':0};   
        let begin = 0;
        let end = b.messageCount;
        let arr=new Array();
        for(let i=begin;i<end;i++){
            let messageId=blogId+'-'+i;
            let m=this.message.get(messageId);
            if(!m.delete)
                arr.push(m);
        }
        return arr;
    }
    
    blogLikeDislike(hash,blogId,likeDislike){
        let b=this.blog.get(blogId);
        if(!b)
            return {'error':0};
        // if(!Blockchain.verifyAddress(hash))
        //     return {'error':1};
        let userStatusId=blogId+'+'+hash;
        let userStatus=this.likeOrDislike.get(userStatusId);
        if(!userStatus){
            let st;
            if (likeDislike) {
                st = 2;
            } else {
                st = 1;
            }   
            userStatus = new whetherLikeOrDislike({
                'status': st
            });
            if (likeDislike) {
                b.like += 1;
            } else {
                b.dislike += 1;  
            } 
            this.likeOrDislike.set(userStatusId,userStatus);
        }
        else{
            if(likeDislike && userStatus.status===2){
                userStatus.status=0;
                b.like-=1;
            }
            else if(!likeDislike && userStatus.status===1){
                userStatus.status=0;
                b.dislike-=1;                
            }
            else{
                if (likeDislike) {
                    if(userStatus.status!==0)
                        b.dislike -= 1;
                    b.like += 1;
                    userStatus.status = 2;
                } else {
                    if(userStatus.status!==0)
                        b.like -= 1;
                    b.dislike += 1;  
                    userStatus.status = 1;
                }
                // userStatus.status=likeDislike?2:1;
            }
            this.likeOrDislike.set(userStatusId,userStatus);
        }
        this.updateHot(b);                  
        this.blog.set(blogId,b);
        console.log(userStatus);
        return true;
    }
    messageLikeDislike(hash,messageID,likeDislike){
        let b=this.message.get(messageID);
        if(!b)
            return {'error':0};
        // if(!Blockchain.verifyAddress(hash))
        //     return {'error':1};
        let userStatusId=messageID+'+'+hash;
        let userStatus=this.likeOrDislike.get(userStatusId);
        if(!userStatus){
            let st;
            if (likeDislike) {
                st = 2;
            } else {
                st = 1;
            }   
            userStatus = new whetherLikeOrDislike({
                'status': st
            });
            if (likeDislike) {
                b.like += 1;
            } else {
                b.dislike += 1;  
            } 
            this.likeOrDislike.set(userStatusId,userStatus);
        }
        else{
            if(likeDislike && userStatus.status===2){
                userStatus.status=0;
                b.like-=1;
            }
            else if(!likeDislike && userStatus.status===1){
                userStatus.status=0;
                b.dislike-=1;                
            }
            else{
                if (likeDislike) {
                    if(userStatus.status!==0)
                        b.dislike -= 1;
                    b.like += 1;
                    userStatus.status = 2;
                } else {
                    if(userStatus.status!==0)
                        b.like -= 1;
                    b.dislike += 1;  
                    userStatus.status = 1;
                }
                // userStatus.status=likeDislike?2:1;
            }
            this.likeOrDislike.set(userStatusId,userStatus);
        }
        this.message.set(messageID,b);
        console.log(userStatus);
        return true;
    }
    get_authorBlog(hash){
        // if(!Blockchain.verifyAddress(hash))
        //     return {'error':1};
        let user=this.userBlog.get(hash);
        console.log(user);
        let arr= new Array();
        for(let i=0;i<user.blogIds.length;i++){
            let b=this.blog.get(user.blogIds[i]);
            if(!b.delete)
                arr.push(b);
        }
        return arr;
    }
    get_like(id,hash){
        let userStatusId=id+'+'+hash;
        let userStatus=this.likeOrDislike.get(userStatusId);
        return userStatus.status;
    }
}
module.exports = Bynorth;
