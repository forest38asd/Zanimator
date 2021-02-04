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

$('#button-form').click(function () {
    tryAuth()
    return false;
});



function registerClick(obj) {
  obj.classList.add('active');
  document.getElementById('head-log').classList.remove('active');
  document.getElementById('button-form').value = 'Зарегистрироваться';
  var el = document.getElementById('email');
  el.setAttribute('required', '')
  el.style.display = 'block';
  el.style.setProperty('--animate-duration', '0.5s');
  el.classList.remove('animate__zoomOut');
  el.classList.add('animate__zoomIn');
  el.style.visibility = 'visible'
  var pos = el.style.height
  if (pos == '') {pos = '0px'}
  pos = parseInt(pos, 10);
  var endPos = 40;
  var speed = 7;
  var id = setInterval(function() {
    if (pos == endPos) {
      clearInterval(id);
    } else {
      pos++;
      el.style.height = pos + 'px';
      el.style.marginBottom = pos/4 + 'px';
    }
    if (pos / 4 == 0) {el.style.marginBottom = pos/4 + 'px'}
  }, speed);

}

function loginClick(obj) {
  obj.classList.add('active');
  document.getElementById('head-reg').classList.remove('active');
  document.getElementById('button-form').value = 'Войти';
  var el = document.getElementById('email');
  el.removeAttribute('required', '')
  el.style.setProperty('--animate-duration', '0.7s');
  el.style.visibility = 'hidden';
  el.classList.remove('animate__zoomIn');
  el.classList.add('animate__zoomOut');
  el.style.visibility = 'visible';
  var pos = el.style.height
  if (pos == '') {pos = '0px'}
  pos = parseInt(pos, 10);
  var endPos = 0;
  var speed = 7;
  var id = setInterval(function() {
    if (pos == endPos) {
      el.style.visibility = 'hidden'
      clearInterval(id);
    } else {
      pos--;
      el.style.height = pos + 'px';
      el.style.marginBottom = pos/4 + 'px';
    }
  }, speed);
}

function tryAuth() {
  var token = '{{csrf_token}}';
  // Исполняем при регистрации
  if ($('#button-form').val() == 'Зарегистрироваться') {
    $.ajax({
      url: "register/",
      type: "POST",
      // mode: 'same-origin'  // Do not send CSRF token to another domain.
      data: {
        username: $('#login').val(),
        email: $('#email').val(),
        password: $('#password').val()
      },
      success: function( result ) {
        if (result['valid']) {
          window.location.replace("/");
        } else {
          alert(result['error'])
        }
      }
    });
  // Или это при авторизации
  } else {
    $.ajax({
      url: "tryAuth/",
      type: "POST",
      // mode: 'same-origin'  // Do not send CSRF token to another domain.
      data: {
        username: $('#login').val(),
        password: $('#password').val()
      },
      success: function( result ) {
        if (result['valid']) {
          window.location.replace("/");
        } else {
          alert(result['error'])
        }
      }
    });
  }
  return
}
