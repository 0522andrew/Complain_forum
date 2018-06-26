'use strict';

class Bynorth{
    constructor(){
        LocalContractStorage.defineProperty(this,'blog_count',null)
    }
    init(){
        this.blog_count = 0;
        console.log(this.blog_count);
    }
    test(){
        this.blog_count++;
        console.log(this.blog_count);
        return this.blog_count;
    }
}
module.exports = Bynorth;