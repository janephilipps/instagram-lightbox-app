window.onload = function() {

  // console.log("loaded!");

  var searchForm = document.getElementById("search");
  var hashtag = document.getElementById("hashtag");

  searchForm.addEventListener("submit", function (event) {
    // prevent page from reloading
    event.preventDefault();

    // log hashtag value
    console.log(hashtag.value);

    // execute JSONP API call with hashtag
    var $jsonp = (function () {
      var that = {};

      that.send = function (src, options) {
        var callback_name = options.callbackName || 'callback',
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

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = src;

        document.getElementsByTagName('head')[0].appendChild(script);
      }

      return that;
    })();

  $jsonp.send("https://api.instagram.com/v1/tags/" + hashtag.value + "/media/recent?client_id=24a3a1bf127447d1aae07a6a7c4ef990&callback=callbackFunction", {
      callbackName: "callbackFunction",
      onSuccess: function (data) {
        console.log('success!', data);
        var data = JSON.parse(data);
      },
      onTimeout: function () {
        console.log('timeout!');
      },
      timeout: 5
  });

    // reset form to be blank
    hashtag.value = "";
  });

};