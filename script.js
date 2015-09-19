window.onload = function() {

  console.log("loaded!");

  var form = document.getElementById("search");
  console.log(form);

  form.addEventListener("submit", function () {
    alert("submitted!");
  });


};