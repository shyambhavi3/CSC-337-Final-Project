function logout() {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState == XMLHttpRequest.DONE) {
      if (httpRequest.status == 200) {
  }
}
  }
httpRequest.open('GET', '/logout/', true);
  httpRequest.send();
}

function login() {
  var httpRequest = new XMLHttpRequest();
  
  let u = document.getElementById('usernameLogin').value;
  let p = document.getElementById('passwordLogin').value;

  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState == XMLHttpRequest.DONE) {
      if (httpRequest.status == 200) {
        if (httpRequest.responseText == 'SUCCESS') {
          window.location = './welcome.html';
        } else { 
          alert('FAILED TO LOGIN 1');
        }
      } else { 
        alert('FAILED TO LOGIN 2');
      }
    }
  }

  httpRequest.open('GET', '/login/' + u + '/' + encodeURIComponent(p), true);
  httpRequest.send();
}

  function createAccount() {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          window.location = './login.html';
        } else { alert('ERROR'); }
      }
    }
  
    let u = document.getElementById('usernameCreate').value;
    let p = document.getElementById('passwordCreate').value;
    let n = document.getElementById('name').value;
    let b = document.getElementById('bio').value;
    let e = document.getElementById('email').value;
    let pName = document.getElementById('pName').value;
  
    httpRequest.open('GET', '/create/' + u + '/' + encodeURIComponent(p) + '/' +
   + pName + '/' +  n + '/' + b + '/' + e + '/', true);
    httpRequest.send();
  }