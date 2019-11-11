// Declare global variables and bind them to html elements by ID
var slider = document.getElementById("imageRange");
var output = document.getElementById("rangeValue");
output.innerHTML = slider.value; // Display the slider value for amount of images to be shown

slider.oninput = function() {
  // Update the current slider value (each time you drag the slider handle)
  output.innerHTML = this.value;
};

let lightboxPhotos = []; //Create 2 arrays to help display imgages + image title in lightbox
let lightboxTitles = [];

// Find the lightbox overlay
var wrapper = document.getElementById("lightboxWrapper");

// Find navigation controls
var dismiss = document.getElementById("lightboxDismiss");
var prev = document.getElementById("lightboxPrev");
var next = document.getElementById("lightboxNext");

async function getPhotos() {
  // Fetch function with async to get data via API
  const apiKey = "0e6f1413c3b36764051548d54b6d5cff"; // Declare variables that build the URL sent to API
  let method = "flickr.photos.search";
  let search = document.getElementById("search").value; // Decides what text String to send to API
  const baseURL = "https://api.flickr.com/services/rest";
  let imgAmount = slider.value; // Decides number of images shown, based on slider value
  let url = `${baseURL}?api_key=${apiKey}&method=${method}&text=${search}&per_page=${imgAmount}&format=json&nojsoncallback=1&safe_search=1&sort=relevance`;
  let response = await fetch(url); // Fetch API data with the URL built above
  let data = await response.json(); // Access the JSON response so it can be reached with JS
  showPhotos(data); // Call the function to show images and use the API data received
}

function createNode(element) {
  // Function used to create the type of element you pass in the parameters
  return document.createElement(element);
}

function append(parent, el) {
  // Function used to append the second parameter(element) to the first one
  return parent.appendChild(el);
}

function showPhotos(data) {
  // http://farm{id}.static.flickr.com/{server-id}/{id}_{secret}_[mstb].jpg
  // http://www.flickr.com/photos/{user-id}/{photo-id}
  console.log(data.photos.photo.length);
  lightboxPhotos = []; // Clear previous lightbox arrays for new search
  lightboxTitles = [];
  let imgContainer = document.getElementById("imgContainer"); // Declare variable and bind it to imgcontainer
  imgContainer.innerHTML = ""; // Clear previous searches
  let photos = data["photos"].photo; // Create variable that takes over data received from API
  let index;
  for (index = 0; index < photos.length; index++) {
    // For loops that loops the same length as array sent back from API
    let img = createNode("img"); // Create element of type img
    // Build img src url with the information sent back from API
    let t_url = `http://farm${photos[index].farm}.static.flickr.com/${photos[index].server}/${photos[index].id}_${photos[index].secret}_m.jpg`;
    img.setAttribute("src", t_url); // Set attributes of the img element created
    img.setAttribute("alt", photos[index].title);
    img.setAttribute("class", "thumbnail"); // Add class element so I can reach it later
    img.setAttribute("data-index", index); // Set data-index attribute so we can go next or previous in lightbox
    append(imgContainer, img); // Nest the image inside the container
    img.addEventListener("click", function() {
      // Set eventlistener to each img
      // Call the lightbox function with the data-index of the img that is clicked
      lightbox(this.getAttribute("data-index"));
    });
    loadLightbox(photos, index); // load lightbox with data retrieved from API
  }
}

//API KEY: 0e6f1413c3b36764051548d54b6d5cff
//SECRET: eaafccd22a4f5a6a

// Function to push photos & photo titles into arrays
function loadLightbox(data, index) {
  let flickrURL = `<img src="http://farm${data[index].farm}.static.flickr.com/${data[index].server}/${data[index].id}_${data[index].secret}.jpg" alt="${data[index].title}" data-id"${index}"/>`;
  let flickrTitle = data[index].title;
  lightboxPhotos.push(flickrURL); //Add images to the lightbox Array
  lightboxTitles.push(flickrTitle); // Add image title to the title array
}

// Function that activates the modal window, takes image as parameter
function lightbox(image) {
  var theImage = lightboxPhotos[image];
  var theTitle = lightboxTitles[image];

  wrapper.setAttribute("class", "active"); // Makes lightboxwrapper active
  // append previous and next data to the controls
  prev.setAttribute("data-prev", parseInt(image) - 1); // Navigate through img data-index with data-id I set earlier
  next.setAttribute("data-next", parseInt(image) + 1); // Using the current image +- 1 for next/prev
  document.getElementById("lightboxImageContainer").innerHTML = theImage; // Updates current lightbox img shown
  document.getElementById("lightboxImageTitle").innerHTML = theTitle;
  console.log(parseInt(image)); // Shows the current image data-id
  if (parseInt(image) === lightboxPhotos.length - 1) {
    // If statements that removes "next" at last image
    next.style.display = "none";
  } else if (parseInt(image) === 0) {
    // Else if statement that removes "prev" at first image
    prev.style.display = "none";
  } else {
    next.style.display = "block";
    prev.style.display = "block";
  }
  wrapper.addEventListener("click", e => {
    // Add eventlistener so that if you click away from the image, lightbox closes (By changing class to inactive)
    if (e.target !== e.currentTarget) {
      return;
    }
    wrapper.setAttribute("class", "inactive");
  });
}

// Lightbox navigation controls
dismiss.onclick = function() {
  // Sets lightbox to inactive when the dismiss is clicked
  wrapper.setAttribute("class", "inactive");
};

// Onclick event used to go to previous image in lightbox
prev.onclick = function() {
  var prevImg = this.getAttribute("data-prev");
  if (prevImg >= 0) {
    lightbox(prevImg);
  }
};

// Onclick event used to go to next image in lightbox
next.onclick = function() {
  var nextImg = this.getAttribute("data-next");
  console.log(lightboxPhotos.length);
  lightbox(nextImg);
};
