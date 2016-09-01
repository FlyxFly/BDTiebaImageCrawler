var startPn=1;//Page number to start from 起始页码
var everyFetchPageCount=1;//Pages to get at one run. 每次运行处理的页面数量
var baseurl="http://tieba.baidu.com/p/4760926410";//Post url. 主贴地址
var directoryName="./img/";//Directory to put img. Must exists or download wil fail. 目录名，要先创建，否则会失败

//That's pretty much all to config. 配置部分完毕
var fetchPage={start:startPn,end:startPn+everyFetchPageCount}
var cheerio = require('cheerio');
var promise=require("bluebird");
var fs=require("fs");
var http = require('http');


http.get(baseurl, function(res) {
    var html = ""
    res.on("data", function(data) {
        html += data
    });
    res.on("end", function() {
        //主程序

        var nullUrlArray=[];
        var lastPage = getLastPage(html); //获取总页数

        var pageUrlArray = [];
        var endPage = fetchPage.end < lastPage ? fetchPage.end : lastPage;
        
        for (var k = fetchPage.start; k <= endPage; k++) {
            var currUrl = baseurl + "?pn=" + k;
            pageUrlArray.push(currUrl);

        }

        promise.map(pageUrlArray, function(thisUrl) {
            return getPageAsync(thisUrl)
        }, {
            concurrency: 1
        }).then(function(resultArr) {

            if (resultArr !== null & resultArr!==[]) {
                resultArr.forEach(function(singlePageHtml) {
                    var postsArray = getPostDataArray(singlePageHtml);
                    for (var i = 0; i < postsArray.length; i++) {
                        var currPost = postsArray[i]; //当前一个post
                        var author = currPost.author.user_name; //当前post的用户名
                        var authrPageUrl = getUserPage(author); //用户贴吧主页地址
                        var content = currPost.content.content; //当前post的内容
                        if (content !== null) {
                            var regRule = new RegExp(/((http|ftp|https|file):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig); //定义图片正则表达式
                            var imgArray = content.match(regRule);
                            var post_no = currPost.content.post_no;
                            if (imgArray !== [] & imgArray!==null) {
                                promise.map(imgArray, function(imgUrl, index) {
                                    return getImgAsync(imgUrl, author, index)
                                }, {
                                    concurrency: 1
                                }).then(function(resultArray) {
                                    resultArray.forEach(function(obj) {
                                        if (obj.content !== "") {
                                            var filename = directoryName + obj.author + "-";
                                            writeImg(filename,obj.index,obj.fileext, obj.content)
                                        } else {
                                            console.log("发现一个不存在的文件:" + obj.author + "-" + obj.index)
                                        }

                                    })
                                })
                            } else {
                                console.log("第" + post_no + "楼没有图片.")
                            }
                        }

                    }

                })
            }
        })
    })
}).on("error", function(err) {
    "初始化下载页面失败: " + err
})


function htmlDecode(str)   {   
  var s = "";   
  if (str.length == 0) return "";   
  s = str.replace(/&gt;/g, "&");   
  s = s.replace(/&lt;/g, "<");   
  s = s.replace(/&gt;/g, ">");   
  s = s.replace(/&nbsp;/g, " ");   
  s = s.replace(/&#39;/g, "\'");   
  s = s.replace(/&quot;/g, "\"");   
  s = s.replace(/<br>/g, "\n");   
  return s;   
}   

function strProcess(str){
    var pattern=/\\"/g;
    var resultstr=str.replace(pattern,"\'");
    var resultobj=JSON.parse(resultstr);
    return resultobj;
    
}


function log(c){
    console.log(c);
    setTimeout(function(){console.log(123)},60000)
}

function getPageAsync(url) {
    
    return new promise(function(resolve, reject) {
        console.log("正在处理："+url);
        http.get(url, function(res) {
            var html = "";
            res.on("data", function(data) {
                html += data;
            })
            res.on("end", function() {
                resolve(html)
            })
        }).on("error", function(e) {
            reject(e);
            console.error("下载页面数据出错：" +url+"\n"+ e)
        })
    })
}


function getImgAsync(url, author, index) {
    return new promise(function(resolve, reject) {
        var dataObj = {};
        dataObj.author = author;
        dataObj.index = index;
        dataObj.fileext = url.slice(-3);
        setTimeout(function() {
            //console.log("正在下载: " + url);
            http.get(url, function(res) {
                var html = "";
                res.setEncoding("binary");
                res.on("data", function(data) {
                    html += data
                })
                res.on("end", function() {
                    dataObj.content = html;
                    resolve(dataObj)
                })
            }).on("error", function(e) {
                resolve("");
                console.log("下载" + url + "出错： " + e)
            })
        }, 250)
    })
}

//返回一个数组，每个元素都是datafield里面的对象
function getPostDataArray(rawdata){
    
	var result=[];
	var $ = cheerio.load(rawdata);
	var posts=$(".l_post");
	posts.each(function(index,item){
		var post=strProcess($(item).attr("data-field"));
		result.push(post);
	})
	return result;
}

//返回最后一页的页码
function getLastPage(rawdata){
    var $ = cheerio.load(rawdata);
    var posts = $(".l_post");
    var pager = $(".pager_theme_5 a");
    var title=$(".core_title_txt").attr("title");
    if ($(pager[pager.length - 1]).attr("href")) {
        var lastPage = $(pager[pager.length - 1]).attr("href").split("pn=")[1];
        var currPage = $(".tP")[0];
        var currPageNum = $(currPage).text();
        lastPage = (currPageNum <= lastPage) ? lastPage : currPageNum;
    }
    return lastPage
}


function writeImg(filename, fileindex, fileext, content) {
    if(!filename || !fileindex || !fileext || !content){
        return false;
    }
    var flag = 0;
    do {
        var finalfilename = filename + fileindex + "." + fileext;
        if (fs.existsSync(finalfilename)) {
            fileindex += 1;
        } else {
            flag = 1;
            fs.writeFile(finalfilename, content, 'binary', function(err) {
                if (err) {
                    console.error("写入文件出错，原因是： " + err);
                }
                console.log("写入文件成功: " + finalfilename);
            })
        }
    }
    while (flag == 0);
}

function getUserPage(username){
	return "http://tieba.baidu.com/home/main?un="+encodeURI(username)+"&ie=utf-8";
}
