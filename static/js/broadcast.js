var audio = document.getElementById('audio');
var totalProgress = $('.totalProgress');
var currentProgress = $('.currentProgress');
var currentTime = $('.currentTime');
var totalTime = $('.totalTime');
var timer;//计时器

/*按钮单击时*/
$('.btn').on('click', function () {
    //如果音频暂停
    if (audio.paused) {
        audio.play();//播放音频
        //更改播放按钮
        $('.play').css({'display': 'none'});
        $('.pause').css({'display': 'block'});
        //计时器实时更改进度
        timer = setInterval(function () {
            if (audio.ended) {
                //如果本首音频播放结束
                //如果有下一首音乐，就播放下一首,否则就停止播放
                var musicid = window.localStorage.getItem("id");
                var nextSibling = $("#" + musicid).next().attr("id");
                if (nextSibling != null) {
                    $("#" + nextSibling).siblings().removeClass("active");  //获取所有兄弟节点
                    $("#" + nextSibling).addClass("active");
                    var musichref = $("#music" + nextSibling).attr("href");
                    $("#audio").attr("src", musichref);
                    $("#btn").click();
                    window.localStorage.setItem("id", nextSibling);
                } else {
                    $('.play').css({'display': 'block'});
                    $('.pause').css({'display': 'none'});
                }
            } else {
                //更改时间
                currentTime.text(formatTime(audio.currentTime));
                totalTime.text(formatTime(audio.duration));
                //更改进度条
                var ratio = audio.currentTime / audio.duration;
                currentProgress.css({'width': ratio * 100 + '%'});
            }
        }, 100)
    } else {
        audio.pause();
        $('.play').css({'display': 'block'});
        $('.pause').css({'display': 'none'});
    }
});


/*单击进度条更改进度*/
totalProgress.on('click', function (ev) {
    //获取百分比
    var ratio = getRatio(ev);
    currentProgress.css({'width': ratio * 100 + '%'});
    //更改音频进度
    audio.currentTime = audio.duration * ratio;
});

function getRatio(ev) {
    //总进度条的实际宽度
    var totalWidth = totalProgress[0].offsetWidth;
    //总进度条的X坐标
    var totalX = totalProgress.offset().left;
    //鼠标的X坐标
    var mouseX = ev.clientX;
    //求出百分比
    var ratio = (mouseX - totalX) / totalWidth;
    return ratio;
}

//格式化时间
function formatTime(time) {
    //取整
    time = ~~time;
    var formatTime;
    if (time < 10) {
        formatTime = '00:0' + time;
    } else if (time < 60) {
        formatTime = '00:' + time;
    } else {
        var m = ~~(time / 60);
        if (m < 10) {
            m = '0' + m;
        }
        var s = time % 60;
        if (s < 10) {
            s = '0' + s;
        }
        formatTime = m + ':' + s;
    }
    return formatTime;
}