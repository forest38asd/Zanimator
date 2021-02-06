function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

var date_start = 0
var isTimerStart = false;
var dur = 0;
var timeGoal = string2unix(document.getElementById('time-goal').textContent)
var timeToday = string2unix(document.getElementById('time-today').textContent)

var percent = ~~((dur + timeToday) / timeGoal * 100)
document.getElementById('progress-text').textContent = percent + '%';
document.getElementById('progress-done').style.width = percent + '%';

// Тестово реализовал чтоб заходило в первую категорию, потом нужно будет сделать главную страницу
var el = document.getElementById('ul-cat').firstElementChild.firstElementChild
choseCategory(el)

function timerStart(el) {
  el = startTimerButton
  if (date_start == 0) {
    date_start = Date.now();
  };
  el.hidden = true;
  document.getElementById('timer-pause').hidden = false;
  isTimerStart = true;
  var startedTime = new Date();
  var elTimerText = document.getElementById('timer-text')
  // alert(elTimerText)
  var lastDur = dur;
  var progressDone = document.getElementById('progress-done')
  var timer = setInterval(function() {
    if (!isTimerStart) {
      clearInterval(timer)
    } else {
      dur = new Date() - startedTime + lastDur;
      // Пофіксити колись плавність
      percent = +((dur + timeToday) / timeGoal * 100).toFixed(1)
      document.getElementById('progress-text').textContent = percent + '%';
      document.getElementById('progress-done').style.width = percent + '%';

      // var doDoneBar = setInterval(function (){
      //   var startPos = parseFloat(document.getElementById('progress-done').style.width, 10);
      //   console.log("startPos: " + startPos + "|| percent: " + percent)
      //   if (startPos == percent) {
      //     clearInterval(doDoneBar)
      //   }
      //   else {
      //     startPos += 0.01
      //     document.getElementById('progress-done').style.width = startPos + '%';
      //   }
      // }, 50);

      // widthNow = parseInt(document.getElementById('progress-done').style.width, 10);

      // var doDoneBar = setInterval(function (){
      //   if (~~widthNow === ~~percent) {
      //     document.getElementById('progress-done').style.width = widthNow + '%';
      //     clearInterval(doDoneBar)
      //   } else {
      //     widthNow += 0.1
      //     document.getElementById('progress-done').style.width = widthNow + '%';
      //   }
      // }, 50)
      // while (~~(widthNow) !== percent) {
      //   alert(~~(widthNow))
      //   widthNow += 0.001
      //   document.getElementById('progress-done').style.width = widthNow + '%';
      // }
      // document.getElementById('progress-done').style.width = percent + '%';
      elTimerText.textContent = unix2string(dur);
    }
  }, 1000);
}


function timerPause(el) {
  el = pauseTimerButton
  el.hidden = true
  document.getElementById('timer-start').hidden = false
  isTimerStart = false
}


function timerSave() {
  // save database
  $.ajax({
    url: "addDurationToDatabase/",
    type: "POST",
    data: {
      catName: $('#page-cat-name').text(),
      date_start: date_start,
      date_end: Date.now(),
      duration: dur,
      hashtag: "test" // Добавить тут вытягивание хештега с инпута
    },
    success: function( result ) {
      if (result['valid']) {
        document.getElementById('timer-pause').hidden = true
        document.getElementById('timer-start').hidden = false
        isTimerStart = false
        var elTimeToday = document.getElementById('time-today')
        var todayInUnix = string2unix(elTimeToday.textContent)
        elTimeToday.textContent = unix2string(todayInUnix + dur)
        // add row to history
        var timeAdd = new Date()
        var day = timeAdd.getDay() > 9 ? timeAdd.getDay() : "0" + timeAdd.getDay()
        var month = (timeAdd.getMonth()+1) > 9 ? timeAdd.getMonth()+1 : "0" + (timeAdd.getMonth()+1)
        var year = timeAdd.getFullYear()
        var date = day + "." + month + "." + year
        // Если нет даты сегодняшней - создать блок
        if ($('#right-menu').children().eq(1).attr('id') != date) {
          $el = $('#to-change-plate').clone().appendTo('#right-menu').prop('id', date);
          $el.attr("hidden", false);
          $($el.children().eq(1)).empty();
          $el.children().eq(0).children().eq(0).text(date)
        }
        else {
          $el = $('#right-menu').children().eq(1)
        }
        var hour = timeAdd.getHours() > 9 ? timeAdd.getHours() : "0" + timeAdd.getHours()
        var minute = timeAdd.getMinutes() > 9 ? timeAdd.getMinutes() : "0" + timeAdd.getMinutes()
        timeAdd = hour + ":" + minute
        $elRow = $('#plate-body-row').clone().prependTo($el.children().eq(1)).prop('id', timeAdd);
        $elRow.children().eq(0).text(timeAdd)
        timeToday = dur + timeToday
        dur = ~~(dur/1000)
        if (dur < 60) {
          $elRow.children().eq(1).text(dur + " сек")
        } else if (dur < 3600) {
          $elRow.children().eq(1).text(~~(dur/60) + " мин " + dur%60 + " сек")
        }
        // reset
        dur = 0
        date_start = 0
        document.getElementById('timer-text').textContent = '0:00:00'
      } else {
        document.getElementById('timer-pause').hidden = true
        document.getElementById('timer-start').hidden = false
        isTimerStart = false
        alert(result['error'])
      }
    }
  });

}


document.body.onkeyup = function(e){
    if(e.keyCode == 32){
      if (!isTimerStart) {
        timerStart(document.getElementById('timer-start'))
      } else {
        timerPause(document.getElementById('timer-pause'))
      }
    }
    if(e.keyCode == 13){
      timerSave()
    }
}

document.addEventListener('visibilitychange', function() {
   // if (document.visibilityState == 'hidden') {
   //   timerPause(document.getElementById('timer-pause'))
   // }
});


// Changer Category
function choseCategory(el) {
  if (dur) {
    if(!confirm("You don`t saved timer, clear and continue?")){
        return;
    }
  }
  $('#page-cat-name').text(el.innerHTML)
  // $('div[name="page-cat"]').visibility = 'visible';
  // listOfCats = $('span[name="list-of-cat"]')
  $('li.list-one-category').removeClass('active');
  $.ajax({
    url: "getCategoryData/",
    type: "POST",
    data: {
      catName: $('#page-cat-name').text()
    },
    success: function( result ) {
      if (result['valid']) {
        timeGoal = result['timeGoal']
        timeToday = result['timeToday']
        document.getElementById('time-goal').textContent = unix2string(timeGoal)
        document.getElementById('time-today').textContent = unix2string(timeToday)
        // Заливаем данные в прогресс-бар
        percent = +((dur + timeToday) / timeGoal * 100).toFixed(1)
        document.getElementById('progress-text').textContent = percent + '%';
        document.getElementById('progress-done').style.width = percent + '%';
        // Если с телефона - меняем инпут хештега выше, согласно с дизайном
        if (window.matchMedia('(max-width: 768px)').matches) {
          $('.hashtag').insertAfter($('.page-progress-bar'));
          $('.page-chart').prependTo($('#right-menu'));
          if ($("img.active")[0]){
            toggleCatMenu($('.cat-slide-menu'))
          }
          $('li').removeClass('show-cat-menu')
        }
        // Заливаем данные в историю записей справа на странице, разделяя по дням
        // $('.plate').prop('id', date);
        // var date = '02.02.2021'
        // var $element = $('#02.02.2021');
        var $firstForCopy = $('#to-change-plate').clone()
        $('#right-menu').empty();
        $firstForCopy.appendTo('#right-menu')
        var lastDate = ''
        var $el = $('#to-change-plate')
        result['records_list'].reverse().forEach(i => {
          if (i[0] != lastDate) {
            lastDate = i[0]
            $el = $('#to-change-plate').clone().appendTo('#right-menu').prop('id', i[0]);
            $el.attr("hidden", false);
            $($el.children().eq(1)).empty();
          }
          // change head date
          $el.children().eq(0).children().eq(0).text(i[0])
          // add row
          $elRow = $('#plate-body-row').clone().appendTo($el.children().eq(1)).prop('id', i[1]);
          $elRow.children().eq(0).text(i[1])
          if (i[2] < 60) {
            $elRow.children().eq(1).text(i[2] + " сек")
          } else if (i[2] < 3600) {
            $elRow.children().eq(1).text(~~(i[2]/60) + " мин " + i[2]%60 + " сек")
          }
        });

      } else {
        alert(result['error'])
      }
    }
  });
  $(el).parent().addClass('active')

}

function toggleCatMenu(el) {
  $(el).toggleClass('active')
  $('li.list-one-category').toggleClass('show-cat-menu')
  $('.left-menu').toggleClass('show-cat-menu')
  $('li.active').removeClass('show-cat-menu')
}


function unix2string(unixTime) {
  s = ~~(unixTime/1000)
  m = ~~(s/60)
  h = ~~(m/60)
  s = s % 60
  m = m % 60
  h = h % 60
  if (s < 10){s = '0' + s}
  if (m < 10){m = '0' + m}
  return h + ':' + m + ':' + s
}

function string2unix(stringTime) {
  h = Number(stringTime.substring(0,1))
  m = Number(stringTime.substring(2,4)) + h * 60
  s = Number(stringTime.substring(5)) + m * 60
  unixTime = s * 1000
  return unixTime
}


document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchend', touchEnd, false);
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;
var elStartTouch = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}


function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    elStartTouch = evt.target;
    if (evt.target == modal) {
      modal.style.display = "none";
    }
    else if (evt.target.className == durationDelete.className) {
        modal.style.display = "block";
        durationDelete = evt.target
    }
    else if (evt.target == startTimerButton) {
      timerStart(evt.target);
    }
    else if (evt.target == pauseTimerButton) {
      timerPause(evt.target);
    }
    else if (evt.target == saveTimerButton) {
      timerSave()
    }
    else if (evt.target == yesButtonDelete) {
      $.ajax({
        url: "delDurationFromBase/",
        type: "POST",
        data: {
          catName: $('#page-cat-name').text(),
          addTime: durationDelete.parentNode.id,
          addDate: durationDelete.parentNode.parentNode.parentNode.id,
          duration: durationDelete.parentNode.children[1].innerHTML,
        },
        success: function( result ) {
          if (result['valid']) {
            var parentBlock = durationDelete.parentNode.parentNode.parentNode
            durationDelete.parentNode.remove();
            if (parentBlock.children[1].children.length == 0){
              parentBlock.remove();
            }
            durationDelete = document.getElementsByClassName("duration-delete")[0]
            modal.style.display = "none";
            timeToday = result['timeToday']
            document.getElementById('time-today').textContent = unix2string(timeToday)
            percent = +((dur + timeToday) / timeGoal * 100).toFixed(1)
            document.getElementById('progress-text').textContent = percent + '%';
            document.getElementById('progress-done').style.width = percent + '%';
          } else {
            alert(result['error'])
          }
        }
      });
    }
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function touchEnd(evt) {
    elStartTouch = null;
};

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }
    // if (evt.scale !== 1) { evt.preventDefault(); }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* left swipe */;
            if (elStartTouch.className == "duration" && xDiff > 5) {
              // $('.duration-edit').show();
              elStartTouch.parentElement.children[2].hidden = false;
              elStartTouch.parentElement.children[3].hidden = false;
              anime({
                targets: [elStartTouch.parentElement.children[2], elStartTouch.parentElement.children[3]],
                translateX: [20, 0],
                scale: [0, 0.5],
                // rotate: '1turn'
              });
              // alert(elStartTouch.textContent);
            }
        } else {
            /* right swipe */
            if (elStartTouch.className == "duration") {
              // $('.duration-edit').hide();
              anime({
                targets: elStartTouch.parentElement.children[2],
                translateX: [0, 20],
                scale: [0.5, 0],
                easing: 'easeOutQuint',
                // rotate: '0turn'
              });
              anime({
                targets: elStartTouch.parentElement.children[3],
                translateX: [0, 50],
                scale: [0.5, 0],
                easing: 'easeOutQuint',
                // rotate: '0turn'
              });
              // elStartTouch.parentElement.children[2].hidden = true;
              // alert(elStartTouch.parentElement.children[2].className);
            }
        }
    } else {
        if ( yDiff > 0 ) {
            /* up swipe */
        } else {
            /* down swipe */
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
};

function deleteRecord(el) {
  $('.modal').show();
}

document.addEventListener('mousedown', checkClick, false);

function checkClick(evt) {
  if (!window.matchMedia('(max-width: 768px)').matches) {
    if (evt.target == modal) {
      modal.style.display = "none";
    }
    else if (evt.target.className == durationDelete.className) {
        modal.style.display = "block";
    }
    else if (evt.target == startTimerButton) {
      timerStart(evt.target);
    }
    else if (evt.target == pauseTimerButton) {
      timerPause(evt.target);
    }
    else if (evt.target == saveTimerButton) {
      timerSave();
    }
  }
}

var modal = document.getElementsByClassName("modal")[0];
// modal.addEventListener("click", hideModal);
var durationDelete = document.getElementsByClassName("duration-delete")[0];
// durationDelete.addEventListener("click", showModal);
var startTimerButton = document.getElementById("timer-start");
// startTimerButton.addEventListener("click", timerStart);
var pauseTimerButton = document.getElementById("timer-pause");
// pauseTimerButton.addEventListener("click", timerPause);
var saveTimerButton = document.getElementById("timer-save");
var yesButtonDelete = document.getElementById('yes-button-delete');

function showModal() {
  modal.hidden = false;
}
function hideModal() {
  modal.hidden = true;
}

// $('.duration-delete').click(showModal)
// $('.modal').on('click', hideModal)
// $('#timer-start').on('click', timerStart)
// $('#timer-pause').on('click', timerPause)

// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// }
