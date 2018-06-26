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
    }
    toString(){
        return JSON.stringify(this);
    }
}

class Bynorth{
    constructor(){
        LocalContractStorage.defineProperty(this,'blog_count',null)
        LocalContractStorage.defineMapProperty(this,'blog',{
            parse: function (text) {
                let obj=JSON.parse(text);
                return new Blog(obj);
            },
            stringify: function (o) {
                return o.toString();
            }
        })
    }
    init(){
        this.blog_count = 0;
    }
    test(){
        return this.blog_count;
    }
    addPost(content,hash,name) {
        let blogId = this.blog_count++;
        let time = new Date();
        let newBlog=new Blog({
            'content' : content,     //文章內容
            'time': time,         //時間
            'author': hash,       //作者地址
            'name': name,         //作者暱稱
            'messageCount': 0,  //留言數
            'like': 0,          //like數
            'dislike': 0        //dislike數
        })
        this.blog.put(blogId,newBlog);
        var r={
            'time': new Date(),
            'blogId': blogId
        }
        console.log(r);
        return r;
    }
    getPost(id){
        return this.blog.get(id)
    }
}
module.exports = Bynorth;