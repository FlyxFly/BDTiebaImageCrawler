#-*-coding:utf-8-*-
#配置开始
path = "./jinrou/" #设置图片保存文件夹
posturl="http://tieba.baidu.com/p/4311508956"  #输入帖子地址
#配置结束
import cheerio,urllib,json,re,os
from BeautifulSoup import BeautifulSoup
from pyquery import PyQuery as pq
def getHtml(url):
	for j in range(4):
		try:
			page=urllib.urlopen(url)
			html=page.read()
			return html
		except:pass


def getLastpage(url):
	for j in range(4):
		try:
			s = pq(getHtml(url))
			pager = s(".l_pager a")
			for item in pager:
				if pq(item).text() == u"尾页":
					return pq(item).attr("href").split("=")[1]
		except:pass

def getImg(url):
	s = pq(getHtml(url))
	content = s(".l_post")
	pattern = re.compile(r"((http|ftp|https|file):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)")
	for post in content:
		postdata = pq(post).attr["data-field"]
		postjson = json.loads(postdata)
		username = postjson["author"]["user_name"]
		usernamegbk = username.encode("GBK")
		content = postjson["content"]["content"]
		postfloor = postjson["content"]["post_no"]
		allimg = re.findall(pattern,content)
		print "Processing floor: "+str(postfloor)
		for img in allimg:
			fileext=img[0][-3:]
			fileindex=0
			while os.path.exists(path+username+"-"+str(fileindex)+"."+fileext):
				fileindex+=1
			filename=path+username+"-"+str(fileindex)+"."+fileext
			for k in range(3):
				try:
					urllib.urlretrieve(img[0],filename)
					break
				except:pass
			print "Downloaded: "+filename

lastpage = int(getLastpage(posturl))
for i in range(1,lastpage):
	urlwithpage=posturl+"?pn="+str(i)
	for j in range(3):
		try:
			print "Try page "+urlwithpage + ", " +str(j)
			getImg(urlwithpage)
			break
		except:pass
