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
    let catagory = document.getElementById('serviceCategory').value;
    let price = document.getElementById('price').value;
    let photo = document.getElementById('photos').value;
    console.log(pName);
    var url ='/create/' + u + '/' + encodeURIComponent(p) + '/'
   + pName + '/' +  n + '/' + b + '/' + e + '/' + catagory + '/' +
   price + '/' + photo + '/';

   console.log(url);
    httpRequest.open('GET',url, true);
    httpRequest.send();
  }

  function searchServices(){

    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
      return false;
    }

    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status == 200) {
          var responseArray = JSON.parse(httpRequest.responseText);
          //TODO - IF LEN OF RESPONSE 0
          var resultsString=constructSearchResult(responseArray);
          console.log(resultsString);
          console.log(httpRequest.responseText)
          document.getElementById('searchResults').innerHTML=resultsString;

          }



        }
      }

    var searchKey = document.getElementById('searchServiceBar').value;


    let url = '/search/services/'+searchKey;
    httpRequest.open('GET', url);
    httpRequest.send();

  }

  function constructSearchResult(responseArray){
    var resultsString=""
    for (var i=0;i<responseArray.length;i++){
      var response = responseArray[i];
      var serviceName = response.name;
      var personName = response.personName;
      var serviceType = response.class;
      var image = response.image;
      var description = response.bio;
      var contact= response.contact;
      var price = response.price;

      resultsString+="Service: "+serviceName+"<br>";
      resultsString+="Freelancer: "+personName+"<br>";
      resultsString+="Service Category: "+serviceType+"<br>";
      resultsString+="Images: "+image+"<br>";
      resultsString+="Description: "+description+"<br>";
      resultsString+="Contact: "+contact+"<br>";
      resultsString+="Price: "+price+"<br>";
      resultsString+="<br><br><br>"


    }

    return resultsString;

  }
