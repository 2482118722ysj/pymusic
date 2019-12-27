# -*- encoding:UTF-8 -*-

from __future__ import unicode_literals
from selenium.common.exceptions import NoSuchElementException
import web
from urllib import parse
import urllib.request
from selenium import webdriver
import requests
import json
import re


urls = (
    '/search', 'Search',
    '/', 'Music',
    '/broadcast','Broadcast',
)


size = 10  # 每页拉取歌的数目
render = web.template.render('templates')


class Broadcast:
    def GET(self):
        return open('templates/audioPlayer.html', encoding='utf-8').read()

class Music:
    def GET(self):
        return open('templates/music.html', encoding='utf-8').read()


class Search:
    def GET(self):
        musicList=[]
        songname=web.input().get('songname')
        print(songname)
        dictList = openBrowe(songname, size)
        for dict in dictList:
            repurl = get_music(dict)
            if len(repurl)!=0:
                musicList.append(repurl)
        # return render.music(musicList,songname)
        return json.dumps(musicList,ensure_ascii=False)


def openBrowe(name,size):
    dictList = []
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")  #无需打开游览器获取信息
    options.binary_location = r"F:\Google\Chrome\Application\chrome.exe"
    driver = webdriver.Chrome(chrome_options=options)
    driver.implicitly_wait(2)  # 等待3秒,智能等待
    url = f'https://y.qq.com/portal/search.html#page=1&searchid=1&remoteplace=txt.yqq.top&t=song&w={name}'
    driver.get(url)
    for i in range(1, size):
        xpathdriver= driver.find_element_by_xpath('//*[@id="song_box"]/div[2]/ul[2]')
        xpath = xpathdriver.find_element_by_xpath(f'li[{i}]/div/div[2]/span[1]/a')
        author = xpathdriver.find_element_by_xpath(f'li[{i}]/div/div[3]/a').get_attribute('title')
        album = xpathdriver.find_element_by_xpath(f'li[{i}]/div/div[4]/a').get_attribute('title')
        # //*[@id="song_box"]/div[2]/ul[2]/li[3]/div/div[2]/i[2]
        try:
           vip = xpathdriver.find_element_by_xpath(f'li[{i}]/div/div[2]/i[2]').get_attribute('title')
        except NoSuchElementException as e:
           print(e)
           vip = None
        songtime = xpathdriver.find_element_by_xpath(f'li[{i}]/div/div[5]').get_attribute("textContent")  # 当出现异常处理，如何不能用text,应该使用get_attribute("textContent")
        data = xpath.get_attribute('href')
        songname=xpath.get_attribute("title")
        dict = {'mid': data,'songname':songname,'author':author,'album':album,"songtime":songtime,"vip":vip}
        dictList.append(dict)
    return dictList


def get_music(dict):
    musicDict={}
    url = 'http://www.douqq.com/qqmusic/qqapi.php'
    rep = requests.post(url, dict).text
    rep = json.loads(rep)  # loads对rep进行加工后是str类型
    rep = rep.replace('\/\/', '//').replace('\/', '/')
    rg = re.compile('"m4a":"(.*?)",')
    rs = re.findall(rg, rep)
    if len(rs)==0:
        return rs
    else:
        repurl = rs[0]
        print(repurl,dict.get('songname'),dict.get('author'))
        musicDict['musicurl']=repurl
        musicDict['songname']=dict.get('songname')
        musicDict['author']=dict.get('author')
        musicDict['album'] = dict.get('album')
        musicDict['songtime'] = dict.get('songtime')
        musicDict['vip']= dict.get('vip')
        return musicDict


app = web.application(urls, globals())

if __name__ == '__main__':
    app.run()
