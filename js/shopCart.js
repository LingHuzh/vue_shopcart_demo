// var aesKey='1234567890123456789012335475';//秘钥
// var key = CryptoJS.enc.Utf8.parse(aesKey);//将秘钥转换成Utf8字节数组
utils = {
    setParam : function (name,value){
        //  加密
        // var encrypt = CryptoJS.AES.encrypt(JSON.stringify(value), key, {
        //      iv: CryptoJS.enc.Utf8.parse(aesKey.substr(0,16)),
        //       mode: CryptoJS.mode.CBC,
        //      padding: CryptoJS.pad.Pkcs7
        // })window.encodeURIComponent(JSON.stringify(this.list)
        var encrypt=  window.btoa(window.encodeURIComponent(JSON.stringify(value)));
        localStorage.setItem(name,encrypt.toString())
    },
    getParam : function(name){
        if(localStorage.getItem(name)){
            //解密
            // var decrypt = CryptoJS.AES.decrypt(localStorage.getItem(name), key, {
            //         iv: CryptoJS.enc.Utf8.parse(aesKey.substr(0,16)),
            //         mode: CryptoJS.mode.CBC,
            //         padding: CryptoJS.pad.Pkcs7
            // });
            var decrypt=  decodeURIComponent(window.atob(localStorage.getItem(name)))
            return JSON.parse(decrypt.toString(CryptoJS.enc.Utf8))//解密后的数据
        }else{
           
            return null
        }
    }
}
product={
    id:0,
    name:"",
    num:0,
    price:0.0,
};
orderdetail={
    username:"",
    phone:"",
    address:"",
    zipcode:"",
    totalNumber:0,
    totalAmount:0.0
}

cart = {
    //向购物车中添加商品
    addProduct:function(product){
        var ShoppingCart = utils.getParam("ShoppingCart");
        console.log(ShoppingCart)
        if(ShoppingCart==null||ShoppingCart==""){
            //第一次加入商品
            var jsonstr = {"productlist":[{"id":product.id,"name":product.name,"num":product.num,"price":product.price}],"totalNumber":product.num,"totalAmount":(product.price*product.num)};
           
           

            utils.setParam("ShoppingCart",JSON.stringify(jsonstr));
        }else{
            var jsonstr = JSON.parse(ShoppingCart);
            var productlist = jsonstr.productlist;
            var result=false;
            //查找购物车中是否有该商品
            for(var i in productlist){
                if(productlist[i].id==product.id){
                    productlist[i].num=parseInt(productlist[i].num)+parseInt(product.num);
                    result = true;
                }
            }
            if(!result){   //没有该商品就直接加进去
                productlist.push({"id":product.id,"name":product.name,"num":product.num,"price":product.price});
            }
            //重新计算总价
            jsonstr.totalNumber=parseInt(jsonstr.totalNumber)+parseInt(product.num);
            jsonstr.totalAmount=parseFloat(jsonstr.totalAmount)+(parseInt(product.num)*parseFloat(product.price));
            orderdetail.totalNumber = jsonstr.totalNumber;
            orderdetail.totalAmount = jsonstr.totalAmount;
            //保存购物车
            utils.setParam("ShoppingCart",JSON.stringify(jsonstr));
        }
    },
    // //修改给买商品数量
    // updateProductNum:function(id,num){
    //     var ShoppingCart = utils.getParam("ShoppingCart");
    //     var jsonstr = JSON.parse(ShoppingCart.substr(1,ShoppingCart.length));
    //     var productlist = jsonstr.productlist;
    //     for(var i in productlist){
    //         if(productlist[i].id==id){
    //             jsonstr.totalNumber=parseInt(jsonstr.totalNumber)+(parseInt(num)-parseInt(productlist[i].num));
    //             jsonstr.totalAmount=parseFloat(jsonstr.totalAmount)+((parseInt(num)*parseFloat(productlist[i].price))-parseInt(productlist[i].num)*parseFloat(productlist[i].price));
    //             productlist[i].num=parseInt(num);
    //             orderdetail.totalNumber = jsonstr.totalNumber;
    //             orderdetail.totalAmount = jsonstr.totalAmount;
    //             utils.setParam("ShoppingCart","'"+JSON.stringify(jsonstr));
    //             return;
    //         }
    //     }
    // },
    //获取购物车中的所有商品
    getProductList:function(){
        var ShoppingCart = utils.getParam("ShoppingCart");
        if(ShoppingCart){
            var jsonstr = JSON.parse(ShoppingCart);
            
            var productlist = jsonstr.productlist;
            
            return productlist;
        }else{
            return []
        }
    },
    // //不传id则判断购物车中是否存在商品，传id则判断购物车中是否存在某种商品
    // existProduct:function(id){
    //     var ShoppingCart = utils.getParam("ShoppingCart");
    //     var jsonstr = JSON.parse(ShoppingCart);
    //     var productlist = jsonstr.productlist;
    //     var result=false;
    //     if(id!=null){
    //         for(var i in productlist){
    //             if(productlist[i].id==id){
    //                 result = true;
    //             }
    //         }
    //     }else{
    //         if(productlist.length>0){
    //             result=true;
    //         }
    //     }
    //     return result;
    // },
    //不传id则删除购物车中所有商品，传id则删除某种商品
    clearProduct:function(id){
        var ShoppingCart = utils.getParam("ShoppingCart");
        var jsonstr = JSON.parse(ShoppingCart);
        var productlist = jsonstr.productlist;
        console.log(jsonstr)
        var list=[];
        if(id!=null){
            for(var i in productlist){
                if(productlist[i].id!=id){
                    list.push(productlist[i]);
                }
            }
        }
        jsonstr.productlist = list;
      
        utils.setParam("ShoppingCart",JSON.stringify(jsonstr));
    }
};