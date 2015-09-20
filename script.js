window.onload = function() {

  // console.log("loaded!");

  var searchForm = document.getElementById("search");
  var hashtag = document.getElementById("hashtag");
  var template = document.getElementById("template");
  var container = document.getElementById("container");
  var images = template.childNodes;


  // Function to create a template for each image from API
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
  };

  // Function to add create lightbox

  var addLightbox = function (index) {

    var image = images[index];
    // console.log(image);
    // Make a copy of the image that was clicked on
    var clone = image.cloneNode(true);
    // Add X to clone
    var closeIcon = document.createElement("div");
    closeIcon.className = "closeIcon";
    closeIcon.innerHTML = "X";
    // Append closeIcon to image clone
    clone.appendChild(closeIcon);
    // Add the cloned image as a child of the document body
    document.body.appendChild(clone);
    // Add a new class to the clone
    clone.className = clone.className + " white_content";
    // Add a new class to the container
    container.className = "black_overlay";
    // Set the id of the clone
    clone.setAttribute("id", "light");
    // Change styles of clone and container elements to allow for lightbox
    document.getElementById("light").style.display='block';
    document.getElementById("container").style.display='block';
  };

  // Function to listen for clicks to make lightbox pop up

  var listenForClicks = function () {

    for (var i = 0; i < images.length; i++) {

      var addEventListener = function (index) {
        images[i].addEventListener("click", function (event) {
          // alert("This is image " + index);
          addLightbox(index);
        })
      }

      addEventListener(i);
    }
  };

    // Add lightbox functionality to first image
    // var imageOne = images[0];

    // imageOne.addEventListener("click", function (event) {
    //   // alert("This is image 1!");
    //   console.log(imageOne);
    //   var clone = imageOne.cloneNode(true);
    //   document.body.appendChild(clone);
    //   clone.className = clone.className + " white_content";
    //   container.className = "black_overlay";
    //   clone.setAttribute("id", "light");
    //   document.getElementById("light").style.display='block';
    //   document.getElementById("container").style.display='block';

    // })

    // container.addEventListener("click", function (event) {
    //   if (container.className === "black_overlay") {
    //     console.log("lightbox in action!");
    //     // remove clone
    //     var clone = document.getElementById("light");
    //     // document.body.removeChild(clone)

    //     // remove black_overlay class from container
    //     // container.className = "";

    //   }
    // })

  // }


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