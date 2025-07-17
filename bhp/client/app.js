function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for (var i = 0; i < uiBathrooms.length; i++) {
    if (uiBathrooms[i].checked) {
      return parseInt(uiBathrooms[i].value);
    }
  }
  return -1; // Invalid
}

function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for (var i = 0; i < uiBHK.length; i++) {
    if (uiBHK[i].checked) {
      return parseInt(uiBHK[i].value);
    }
  }
  return -1; // Invalid
}

function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");

  var sqft = document.getElementById("uiSqft").value;
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations").value;
  var estPrice = document.getElementById("uiEstimatedPrice");

  fetch("/api/predict_home_price", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      total_sqft: parseFloat(sqft),
      bhk: bhk,
      bath: bathrooms,
      location: location
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Prediction:", data.estimated_price);
    estPrice.innerHTML = `<h2>${data.estimated_price} Lakh</h2>`;
  })
  .catch(error => {
    console.error("Error during prediction:", error);
    estPrice.innerHTML = "<h2>Something went wrong</h2>";
  });
}

function onPageLoad() {
  console.log("Page loaded, fetching locations...");

  fetch("/api/get_location_names")
    .then(response => response.json())
    .then(data => {
      if (data && data.locations) {
        var uiLocations = document.getElementById("uiLocations");
        uiLocations.innerHTML = "";

        data.locations.forEach(function(location) {
          var option = document.createElement("option");
          option.text = location;
          uiLocations.add(option);
        });
      }
    })
    .catch(error => {
      console.error("Error fetching locations:", error);
    });
}

window.onload = onPageLoad;
