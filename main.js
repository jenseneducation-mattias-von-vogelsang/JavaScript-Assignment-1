var slider = document.getElementById("imageRange");
var output = document.getElementById("rangeValue");
output.innerHTML = slider.value; // Display the slider value for amount of images to be shown
//var searchInput = document.getElementById("searchInput");

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
};

//.addEventListener("click", getPhotos);
async function getPhotos() {
  const apiKey = "0e6f1413c3b36764051548d54b6d5cff";
  let method = "flickr.photos.search";
  let search = document.getElementById("search").value;
  const baseURL = "https://api.flickr.com/services/rest";
  let imgAmount = slider.value;

  let url =
    baseURL +
    "?api_key=" +
    apiKey +
    "&method=" +
    method +
    "&text=" +
    search +
    "&per_page=" +
    imgAmount +
    "&format=json&nojsoncallback=1&safe_search=1&sort=relevance";
  console.log(url);

  try {
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    showImages(data);
  } catch (err) {
    console.error(err);
  }
}

function createNode(element) {
  return document.createElement(element); // Create the type of element you pass in the parameters
}

function append(parent, el) {
  return parent.appendChild(el); // Append the second parameter(element) to the first one
}

function showImages(data) {
  // http://farm{id}.static.flickr.com/{server-id}/{id}_{secret}_[mstb].jpg
  // http://www.flickr.com/photos/{user-id}/{photo-id}
  console.log(data.photos.photo.length);
  let imgContainer = document.getElementById("imgContainer");
  imgContainer.innerHTML = "";

  for (var i = 0; i < data.photos.photo.length; i++) {
    let img = createNode("img");
    let info = createNode("p");
    //console.log(data.photos.photo[i].id);
    let t_url =
      "http://farm" +
      data.photos.photo[i].farm +
      ".static.flickr.com/" +
      data.photos.photo[i].server +
      "/" +
      data.photos.photo[i].id +
      "_" +
      data.photos.photo[i].secret +
      ".jpg";
    console.log(t_url);
    let p_url =
      "http://www.flickr.com/photos/" +
      data.photos.photo[i].owner +
      "/" +
      data.photos.photo[i].id;

    console.log(p_url);
    img.setAttribute("src", t_url);
    img.setAttribute("alt", data.photos.photo[i].title);
    append(imgContainer, img);
    console.log(p_url);
  }
}

//API KEY: 0e6f1413c3b36764051548d54b6d5cff
//SECRET: eaafccd22a4f5a6a
