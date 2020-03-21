account = document.getElementById('inputAccount');
pwd = document.getElementById('inputPassword');
msg = document.getElementById('msg');

function post() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/login' + window.location.search, true);
  xhr.responseType = 'json';
  xhr.setRequestHeader("Content-Type", "application/json");
  /*
  xhr.onreadystatechange = function () {
    if (xhr.readyState == xhr.LOADING) {
      if (xhr.status == 200) {
        /// jerry:for later use.
      }
    }
  };
  */
  xhr.onload = function () {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        //console.log(xhr.response);
        let _res = xhr.response;
        switch(_res.code){
          case 9999:
            msg.innerText = "success, redirect after 1 second.";
            setTimeout(() => {
              window.location.href = _res.redirectURL;
            }, 1000);
            break;
          case 10004:
            msg.innerText = "wrong account!";
            break;
          case 10005:
            msg.innerText = "wrong password!";
            break;
          case 10000:
            msg.innerText = "unknown";
            break;
          default:
            break;
        }
      }
    }
  };

  obj = {
    "account": account.value,
    "password": md5(pwd.value),
  };

  xhr.send(JSON.stringify(obj));
};


