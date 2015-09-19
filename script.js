window.onload = function() {

  // console.log("loaded!");

  var form = document.getElementById("search");
  var hashtag = document.getElementById("hashtag");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log(hashtag.value);
    hashtag.value = "";
  });

  var $jsonp = (function () {
    var that = {};

    that.send = function(src, options) {
      var callback_name = options.callbackName || 'callback',
        on_success = options.onSuccess || function(){},
        on_timeout = options.onTimeout || function(){},
        timeout = options.timeout || 10; // sec

      var timeout_trigger = window.setTimeout(function(){
        window[callback_name] = function(){};
        on_timeout();
      }, timeout * 1000);

      window[callback_name] = function(data){
        window.clearTimeout(timeout_trigger);
        on_success(data);
      }

      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = src;

      document.getElementsByTagName('head')[0].appendChild(script);
    }

    return that;
  })();

  $jsonp.send("https://api.instagram.com/v1/tags/baking/media/recent?client_id=24a3a1bf127447d1aae07a6a7c4ef990&callback=foobar", {
      callbackName: "foobar",
      onSuccess: function (json) {
        console.log('success!', json);
      },
      onTimeout: function () {
        console.log('timeout!');
      },
      timeout: 5
  });

  // var xhr = new XMLHttpRequest();
  //   xhr.open("GET", "https://api.instagram.com/v1/tags/baking/media/recent?client_id=24a3a1bf127447d1aae07a6a7c4ef990&callback=callbackFunction", true);
  //   xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  //   xhr.onload = function () {
  //     if (xhr.status === 200) {
  //       console.log("STATUS 200!");
  //       console.log(xhr.responseText);
  //       var instagramInfo = JSON.parse(xhr.responseText);
  //     } else {
  //       console.log("STATUS WTF");
  //     }
  //   };

  //   xhr.send();

  // Some other code I tried
  // var xhr;
  // function createXMLHttpRequest () {

  //   if (window.AtiveXObject) {
  //     xhr = new ActiveXObject("Microsoft.XMLHTTP");
  //   } else {
  //     xhr = new XMLHttpRequest();
  //   }

  //   var url = "https://api.instagram.com/v1/tags/baking/media/recent?client_id=24a3a1bf127447d1aae07a6a7c4ef990";

  // }

  // function openRequest () {

  //   createXMLHttpRequest();

  //   xhr.onreadystatechange = getdata;

  //   xhr.open("GET", url, true);
  //   xhr.setRequestHeader("Content-Type",'application/x-www-form-urlencoded');
  //   xhr.send(data);
  // }

  // function getData () {
  //   if (xhr.readyState === 4){
  //     if(xhr.status === 200){
  //       var txt = xhr.responseText;
  //       alert(txt);
  //     }
  //   }
  // }

};