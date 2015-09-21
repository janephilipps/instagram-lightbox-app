window.onload = function () {

  var searchForm = document.getElementById("search");
  var hashtag = document.getElementById("hashtag");
  var template = document.getElementById("template");
  var container = document.getElementById("container");
  var images = template.childNodes;



  // Function to create templates for images returned from API call
  var showImages = function (data) {
    // Loop through array of images
    for (var i = 0; i < data.length; i++) {
      // Create new elements on the page
      var imageContainer = document.createElement("div");
      imageContainer.className = "imageContainer";
      var image = document.createElement("div");
      image.className = "image";
      var p = document.createElement("p");
      var img = document.createElement("img");
      // Grab URL from API and assign to newly created img element
      img.src = data[i].images.low_resolution.url;
      // Grab title from API and assign to newly created text node
      var text = document.createTextNode(data[i].caption.text);
      var hr = document.createElement("hr");
      // Append all new elements to parent elements
      p.appendChild(text);
      image.appendChild(img);
      image.appendChild(p);
      imageContainer.appendChild(image);
      imageContainer.appendChild(hr);
      template.appendChild(imageContainer);

    }
  };

  // Function to show lightbox
  var showLightbox = function (index) {

    var image = images[index];
    // console.log(image);
    // Make a copy of the image that was clicked on
    var clone = image.cloneNode(true);
    // Remove hr from clone
    var hr = clone.lastChild;
    clone.removeChild(hr);
    // Add X to clone
    var closeIcon = document.createElement("div");
    closeIcon.className = "closeIcon";
    closeIcon.innerHTML = "X";
    // Append closeIcon to image clone
    clone.appendChild(closeIcon);

    if (index !== 0) {
      // Add only left arrow
      var left = document.createElement("div");
      left.className = "left";
      left.innerHTML = "<";
      // Append left arrow to image clone
      clone.appendChild(left);

      // Add left arrow event listener to move to previous lightbox image
      left.addEventListener("click", function (event) {
        // Remove current lightbox
        removeLightbox(clone);
        // Add new lightbox for previous image
        showLightbox(index - 1);
      });
    }

    if (index !== 19) {
      // Add only right arrow
      var right = document.createElement("div");
      right.className = "right";
      right.innerHTML = ">";
      // Append right arrow to image clone
      clone.appendChild(right);

      // Add right arrow event listener to move to next lightbox image
      right.addEventListener("click", function (event) {
        // Remove current lightbox
        removeLightbox(clone);
        // Add new lightbox for next image
        showLightbox(index + 1);
      });

    }

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

    // Add close icon event listener to remove lightbox image from DOM on click
    closeIcon.addEventListener("click", function (event) {
      // alert("hi!");
      removeLightbox(clone);
    });

  };

  // Function to remove lightbox
  var removeLightbox = function (clone) {
    console.log(typeof clone);
    document.body.removeChild(clone);
    container.className = "";
  }

  // Function to listen for clicks to make lightbox pop up
  var listenForClicks = function () {
    console.log(images);
    for (var i = 0; i < images.length; i++) {

      var addEventListener = function (index) {
        images[i].firstChild.addEventListener("click", function (event) {
          // alert("This is image " + index);
          showLightbox(index);
        })
      }
      addEventListener(i);
    }
  };

  searchForm.addEventListener("submit", function (event) {
    // prevent page from reloading
    event.preventDefault();

    // log hashtag value
    console.log(hashtag.value);

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