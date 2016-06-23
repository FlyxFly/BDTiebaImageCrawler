# BDTiebaImageCrawler   百度贴吧图片爬虫，基于NodeJs
A crawler base on NodeJs to crawling get all image in replies of one post on http://tieba.baidu.com. Emoji will be downloaded too, which is not reasonable. 

可以下载一个主贴内所有回复里面的图片，放到指定目录。（包括表情，虽然很不科学。）

#Dependencies 依赖模块
Cheerio, Bluebird

#Useage 用法
1.  Install NodeJs 安装NodeJs
2.  Choose a directory as working directory to put all modules and this js file. 选择一个目录来安装模块和存放这个js文件。
2.  Open command line and enter working directory. Install dependencies modules. 打开命令行工具，进入这个目录，安装依赖模块 'npm install cheerio bluebird'
3.  Check configuration at top of js file. 打开js文件，看注释修改相应配置。
4.  Run 运行`node getimg.promisegetpage.map.js`
