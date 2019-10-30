var slider = document.getElementById("imageRange");
var output = document.getElementById("rangeValue");
output.innerHTML = slider.value; // Display the slider value for amount of images to be shown

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
};
