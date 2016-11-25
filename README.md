# 百度贴吧图片下载
下载一个帖子所有回复里面的图片到指定文件夹，包括表情（稍后会增加选项）。

This script will download all image files of a Baidu Tieba post into a specific directory. Image files including emoji( Will be an option later).
#区别
Nodejs使用异步下载，速度快。但是文件按发帖人加序号命名，没有文件查重机制，如果同一个人在10楼和20楼都回复了图片，那么20楼的图片会依次覆盖10楼的图片。我还没想好解决方法。请使用Python版本。

Python版本单线程运行，但无论一个人回复多少次，都能正确地按序号递增作为文件名来保存文件了。

Please use python version. Nodejs version won't name file correctly which results later downloaded file overfile previously downloaded ones.

#用法
##Nodejs版本
###Dependencies 依赖模块
Cheerio, Bluebird
###用法
1.  安装NodeJs
2.  选择一个目录来安装模块和存放这个js文件。
2.  打开命令行工具，进入这个目录，安装依赖模块 'npm install cheerio bluebird'
3.  打开js文件，看注释修改相应配置。
4.  运行`node getimg.promisegetpage.map.js`

###Useage
1.  Install NodeJs.
2.  Choose a directory as working directory to put all modules and this js file. 。
2.  Open command line and enter working directory. Install dependencies modules'npm install cheerio bluebird'.
3.  Check configuration at top of js file.
4.  Run`node get_tieba_image.js`.

##Python版本

###Dependencies 依赖模块
PyQuery, BeautifulSoup, libxml2, lxml

###用法
1. 安装Python
2. 安装依赖模块`pip install PyQuery BeautifulSoup`.如果安装PyQuery有问题，请参考最下面PyQuery的依赖libxml2和lxml安装方法。
3. 打开py文件修改配置，并创建保存图片的文件夹。
4. 运行脚本.

###Usage
1. Install Python.
2. Install dependency module`pip install PyQuery BeautifulSoup`. In case anything goes wrong while install PyQuery, please refer to [this question](http://stackoverflow.com/questions/30493031/installing-lxml-libxml2-libxslt-on-windows-8-1) to install libxml2 and lxml.
3. Open .py file to enter post url and save directiory. And create that directory.
4. Run the script.

#安装libxml2 和 lxml (windows)
1. 首先安装wheel `C:\Python34>python -m pip install wheel`
2. 然后[到这里下载libxml安装包](http://www.lfd.uci.edu/~gohlke/pythonlibs/#lxml),并放到C:\Python34（或者你的python安装目录）文件夹里面。
3. 运行命令安装`C:\Python34>python -m pip install lxml-3.4.4-cp34-none-win32.whl`。
