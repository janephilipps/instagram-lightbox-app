window.onload = function() {

  // console.log("loaded!");

  var searchForm = document.getElementById("search");
  var hashtag = document.getElementById("hashtag");
  var template = document.getElementById("template");
  var container = document.getElementById("container");
  var images = template.childNodes;



  var showImages = function (data) {
    // console.log("Data", data);
    for (var i = 0; i < data.length; i++) {
      var imageContainer = document.createElement("div");
      imageContainer.className = "imageContainer";
      var image = document.createElement("div");
      image.className = "image";
      var p = document.createElement("p");
      var img = document.createElement("img");
      img.src = data[i].images.low_resolution.url;
      var text = document.createTextNode(data[i].caption.text);
      var hr = document.createElement("hr");
      // console.log(text);
      p.appendChild(text);
      image.appendChild(img);
      image.appendChild(p);
      imageContainer.appendChild(image);
      imageContainer.appendChild(hr);
      template.appendChild(imageContainer);

    }
  }

  var listenForClicks = function () {
    // for (var i = 0; i < images.length; i++) {
    //   images[i].addEventListener("click", function (event) {
    //     alert("This is image " + i);
    //   })
    // }

    var imageOne = images[0];

    imageOne.addEventListener("click", function (event) {
      // alert("This is image 1!");
      console.log(imageOne);
      var clone = imageOne.cloneNode(true);
      document.body.appendChild(clone);
      clone.className = clone.className + " white_content";
      container.className = "black_overlay";
      clone.setAttribute("id", "light");
      document.getElementById("light").style.display='block';
      document.getElementById("container").style.display='block';

    })
  }


  searchForm.addEventListener("submit", function (event) {
    // prevent page from reloading
    event.preventDefault();

    // log hashtag value
    // console.log(hashtag.value);

    // execute JSONP API call with hashtag
    var $jsonp = (function () {
      var that = {};

      that.send = function (src, options) {
        var callback_name = options.callbackName || "callback",
          on_success = options.onSuccess || function () {},
          on_timeout = options.onTimeout || function () {},
          timeout = options.timeout || 10; // sec

        var timeout_trigger = window.setTimeout(function () {
          window[callback_name] = function () {};
          on_timeout();
        }, timeout * 1000);

        window[callback_name] = function (data) {
          window.clearTimeout(timeout_trigger);
          on_success(data);
        }

        var script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = src;

        document.getElementsByTagName("head")[0].appendChild(script);
      }

      return that;
    })();

  $jsonp.send("https://api.instagram.com/v1/tags/" + hashtag.value + "/media/recent?client_id=24a3a1bf127447d1aae07a6a7c4ef990&callback=callbackFunction", {
      callbackName: "callbackFunction",
      onSuccess: function (json) {
        // console.log("success!", json);
        showImages(json.data);
        listenForClicks();
      },
      onTimeout: function () {
        console.log("timeout!");
      },
      timeout: 5
  });

  // reset form to be blank
  hashtag.value = "";


  });

};