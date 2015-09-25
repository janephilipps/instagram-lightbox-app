window.onload = function () {

  // Define variables
  var searchForm = document.getElementById("search");
  var hashtag = document.getElementById("hashtag");
  var template = document.getElementById("template");
  var container = document.getElementById("container");
  var images = template.childNodes;

  // Function to convert UNIX timestamp into readable date/time
  var timeConverter = function (UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var amOrPm = "AM";
    // Convert 24hour time to 12hour time & update amOrPm
    var hour = a.getHours();
      if (hour > 12) {
        hour -= 12;
        amOrPm = "PM";
      } else if (hour === 0) {
        hour = 12;
      }
    var min = a.getMinutes();
    var time = month + ' ' + date + ', ' + year + ' ' + padZero(hour, 2) + ':' + padZero(min, 2) + ' ' + amOrPm;
    return time;
  }

  var padZero = function (n, p) {
    var pad_char = '0';
    var pad = new Array(1 + p).join(pad_char);
    return (pad + n).slice(-pad.length);
  }

  // Function to create templates for images returned from API call
  var showImages = function (data) {
    // Loop through array of images
    for (var i = 0; i < data.length; i++) {

      // Create new elements on the page
      var imageContainer = document.createElement("div");
      imageContainer.className = "imageContainer";
      var image = document.createElement("div");
      image.className = "image";

      // Create p elements to display username and likes
      var p1 = document.createElement("p");
      var p2 = document.createElement("p");
      var p3 = document.createElement("p");
      p1.innerHTML = "<b>photo by: " + "<a href='http://instagram.com/" + data[i].caption.from.username + "' target='_blank'>" + data[i].caption.from.username + "</a></b>";
      p2.innerHTML = "&hearts; " + data[i].likes.count;
      p3.innerHTML = "<b>posted:</b> <a href='" + data[i].link + "' target='_blank'>" + timeConverter(data[i].created_time) + "</a>";
      var p4 = document.createElement("p");
      var img = document.createElement("img");

      // Grab URL from API and assign to newly created img element
      img.src = data[i].images.low_resolution.url;

      // Grab title from API and assign to newly created text nodes
      var title = document.createTextNode(data[i].caption.text);
      var hr = document.createElement("hr");

      // Append all new elements to template parent element
      p4.appendChild(title);
      image.appendChild(img);
      image.appendChild(p1);
      image.appendChild(p2);
      image.appendChild(p3);
      image.appendChild(p4);
      imageContainer.appendChild(image);
      imageContainer.appendChild(hr);
      template.appendChild(imageContainer);

      // Remove hr from last image
      // console.log(template.lastChild);
      // template.lastChild.removeChild(hr);

      // Set var images
      images = template.childNodes;

    }
  };

  // Function to show lightbox
  var showLightbox = function (index) {

    var image = images[index];

    // Make a copy of the image that was clicked on
    var clone = image.cloneNode(true);

    // Remove hr from clone
    var hr = clone.lastChild;
    clone.removeChild(hr);

    // Add close icon to clone
    var closeIcon = document.createElement("div");
    closeIcon.className = "closeIcon";
    closeIcon.innerHTML = "X";

    // Append close icon to image clone
    clone.appendChild(closeIcon);

    // If image is not the first, add left arrow to toggle previous image
    if (index !== 0) {

      // Add left arrow
      var left = document.createElement("div");
      left.className = "left";
      left.innerHTML = "<";

      // Append left arrow to image clone
      clone.appendChild(left);

      // Add left arrow click listener
      left.addEventListener("click", function (event) {

        // Remove current lightbox
        removeLightbox(clone);

        // Add new lightbox for previous image
        showLightbox(index - 1);
      });

      document.onkeydown = checkKey;

    }

    // If image is not the last, add right arrow to toggle next image
    if (index !== 19) {

      // Add right arrow
      var right = document.createElement("div");
      right.className = "right";
      right.innerHTML = ">";

      // Append right arrow to image clone
      clone.appendChild(right);

      // Add right arrow click listener
      right.addEventListener("click", function (event) {

        // Remove current lightbox
        removeLightbox(clone);

        // Add new lightbox for next image
        showLightbox(index + 1);
      });

      document.onkeydown = checkKey;

    }

    // Add the cloned image as a child of the document body
    document.body.appendChild(clone);

    // Add a new class to the clone
    clone.className = clone.className + " white_content";

    // Add a new class to the container
    container.className = "overlay";

    // Set the id of the clone
    clone.setAttribute("id", "light");

    // Change styles of clone and container elements to allow for lightbox
    document.getElementById("light").style.display='block';
    document.getElementById("container").style.display='block';

    // Add close icon click listener to remove lightbox
    closeIcon.addEventListener("click", function (event) {
      removeLightbox(clone);
    });

    // document.onkeydown = checkKey;

    function checkKey(e) {

      e = e || window.event;

      if (e.keyCode == '27') {
        // console.log("esc!");
        removeLightbox(clone);

      } else if (e.keyCode == '37') {
        console.log("left!");
        // Remove current lightbox
        removeLightbox(clone);
        // Add new lightbox for previous image
        showLightbox(index - 1);

      } else if (e.keyCode == '39') {
        console.log("right!");
        // Remove current lightbox
        removeLightbox(clone);
        // Add new lightbox for next image
        showLightbox(index + 1);
      }
    }

  };

  // Function to remove lightbox
  var removeLightbox = function (clone) {

    // Remove clone
    document.body.removeChild(clone);

    // Reset container class
    container.className = "";
  }

  // Function to listen for clicks to make lightbox pop up
  var listenForClicks = function () {
    for (var i = 0; i < images.length; i++) {

      var addEventListener = function (index) {
        images[index].firstChild.firstChild.addEventListener("click", function (event) {
          showLightbox(index);
        })
      }
      addEventListener(i);
    }
  };

  searchForm.addEventListener("submit", function (event) {

    // prevent page from reloading
    event.preventDefault();

    // If there are images from a previous search, remove them
    if (images.length > 0) {

      // Delete existing images from DOM
      while (template.firstChild) {
        template.removeChild(template.firstChild);
      }
    }

    // Execute JSONP API call with hashtag
    // Inspired by this stack overflow post: http://stackoverflow.com/a/13045312/4765678
    var jsonp = function (src, options) {
      var callbackName = options.callbackName,
        onSuccess = options.onSuccess,
        onTimeout = options.onTimeout,
        timeout = options.timeout;

      // Create timeout trigger that handles API not returning data
      var timeoutTrigger = window.setTimeout(function () {
        window[callbackName] = function () {};
        onTimeout();
      }, timeout * 1000);

      // If API returns data, process data but do not run timeout trigger
      window[callbackName] = function (data) {
        window.clearTimeout(timeoutTrigger);
        onSuccess(data);
      }

      // Create script element on page to run API call
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = src;

      // Append script to head
      document.getElementsByTagName("head")[0].appendChild(script);
    };

    // Call API
    jsonp("https://api.instagram.com/v1/tags/" + hashtag.value + "/media/recent?client_id=24a3a1bf127447d1aae07a6a7c4ef990&callback=callbackFunction", {
      callbackName: "callbackFunction",

      // When API returns data, call showImages and listenForClicks
      onSuccess: function (json) {
        showImages(json.data);
        listenForClicks();
      },
      // If API doesn't return in 5 secs, log timeout
      onTimeout: function () {
        console.log("timeout!");
      },
      timeout: 5 // sec
    });

    // Reset form to be blank
    hashtag.value = "";

  });

};
