function searchmusic() {
    //当点击搜索，继续播放
    var style=$("#clickplay").style;
    if(style!=null){
        clickplay=style.display;
        if(clickplay=="none"){
            $("#btn").click();
        }
    }
    var songname = $("#songname").val();
    document.getElementById("songname").value = songname;
    var musicbeigin = $("#musicbeigin");
    $.getJSON("/search?songname=" + songname, function (results) {
        musicbeigin.empty(); //该方法会删除当前节点下的所有子节点，请注意当前节点不会 被删除
        console.log(results);
        $.each(results, function (index, musics) {
            if (musics['startcache'] == null) {
                /*  console.log(musics['author'] + musics['songname'] + musics['musicurl']);*/
                var panelfooter = $("<div/>", {
                    "class": "panel-footer musiclist",
                    "onclick": "broadcast(this)",
                    "id": index
                })
                var musictable = $("<table/>", {})

                var aherf = $("<a/>", {
                    "href": musics['musicurl'],
                    "id": 'music' + index
                });
                var musictr = $("<tr/>", {})

                var musictdwitdh1 = $("<td/>", {
                    "class": "tdwitdh1",
                })
                var broadcast = $("<span/>", {
                    "class": "glyphicon glyphicon-play-circle",
                });
                var songname = $("<span/>", {
                    "html": musics['songname']
                })
                var vip = $("<img/>", {
                    "src": (musics['vip'] != null ? "/static/img/vip.png" : "")
                })

                var musictdwitdh2 = $("<td/>", {
                    "class": "tdwitdh2",
                })
                var songauthor = $("<span/>", {
                    "html": musics['author']
                })

                var musictdwitdh3 = $("<td/>", {
                    "class": "tdwitdh3",
                })
                var songalbum = $("<span/>", {
                    "html": musics['album']
                })

                var musictdwitdh4 = $("<td/>", {
                    "class": "tdwitdh4",
                })
                var songtime = $("<span/>", {
                    "html": musics['songtime']
                })

                musicbeigin.append(panelfooter);
                panelfooter.append(musictable);
                musictable.append(aherf);
                musictable.append(musictr);
                musictr.append(musictdwitdh1);
                musictdwitdh1.append(broadcast);
                musictdwitdh1.append(songname);
                musictdwitdh1.append(vip);
                musictr.append(musictdwitdh2);
                musictdwitdh2.append(songauthor);
                musictr.append(musictdwitdh3);
                musictdwitdh3.append(songalbum);
                musictr.append(musictdwitdh4);
                musictdwitdh4.append(songtime);

            }
        });
    });
}

function broadcast(e) {
    //当双击（单击也会触发，但是不会执行双击事件内容）就会拿到musicid
    musicid = e.getAttribute("id");
    //如果该节点是双击就会触发音乐播放，同时选中音乐
    $("#" + musicid).dblclick(function () {
        $("#" + musicid).siblings().removeClass("active")  //获取所有兄弟节点
        $("#" + musicid).addClass("active");
        musichref = $("#music" + musicid).attr("href");
        $("#audio").attr("src", musichref);
        $("#btn").click();
        window.localStorage.setItem("id", musicid);
    });
}

//播放下一首
function clickNext() {
    var musicid = window.localStorage.getItem("id");
    var nextSibling = $("#" + musicid).next().attr("id");
    nextOrPrevious(nextSibling);
}

//播放上一首previousElementSibling
function clickPrevious() {
    var musicid = window.localStorage.getItem("id");
    var previous = $("#" + musicid).prev().attr("id");
    nextOrPrevious(previous);
}

function nextOrPrevious(nextorprevious) {
    if (nextorprevious != null) {
        $("#" + nextorprevious).siblings().removeClass("active");  //获取所有兄弟节点
        $("#" + nextorprevious).addClass("active");
        var musichref = $("#music" + nextorprevious).attr("href");
        $("#audio").attr("src", musichref);
        $("#btn").click();
        window.localStorage.setItem("id", nextorprevious);
    }
}