let weather = {
    "apiKey": "b4e861a2f4827a2c0184955f92c31f78",
    fetchWeather : function(city){
        fetch(
            "http://api.openweathermap.org/data/2.5/weather?q="
            + city 
            +"&units=metric&appid="
            +this.apiKey
    )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    displayWeather : function(data){
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        //console.log(name, icon, description, temp, humidity, speed);
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src 
        = "https://openweathermap.org/img/wn/" + icon + ".png"
        document.querySelector(".description").innerText = description;
        document.querySelector(".temperature").innerText = temp + "°C";
        document.querySelector(".humidity").innerText = "Humidity : " + humidity + "%"
        document.querySelector(".wind").innerText = "Wind Speed " + speed + " km/h "
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')"
        document.querySelector(".weather").classList.remove("loading");
    },
    search: function() {
        this.fetchWeather(document.querySelector(".search-bar").value);
    }
} ;

let geoCode = {
    reverseGeocode : function(latitude, longitude){
        var apikey = '1e6a225d53d5428a82e53a6ab94e7ba9';

  var api_url = 'https://api.opencagedata.com/geocode/v1/json'

  var request_url = api_url
    + '?'
    + 'key=' + apikey
    + '&q=' + encodeURIComponent(latitude + ',' + longitude)
    + '&pretty=1'
    + '&no_annotations=1';

  // see full list of required and optional parameters:
  // https://opencagedata.com/api#forward

  var request = new XMLHttpRequest();
  request.open('GET', request_url, true);

  request.onload = function() {
    // see full list of possible response codes:
    // https://opencagedata.com/api#codes

    if (request.status === 200){ 
      // Success!
      var data = JSON.parse(request.responseText);
      console.log(data.results[0].components.city); // print the location
      weather.fetchWeather(data.results[0].components.city)

    } else if (request.status <= 500){ 
      // We reached our target server, but it returned an error
                           
      console.log("unable to geocode! Response code: " + request.status);
      var data = JSON.parse(request.responseText);
      console.log('error msg: ' + data.status.message);
    } else {
      console.log("server error");
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log("unable to connect to server");        
  };

  request.send();  // make the request
    },
    getLocation : function(){
        function success(data){
            geoCode.reverseGeocode(data.coords.latitude, data.coords.longitude);
        }
        if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success, console.error);
        }
        else {
            weather.fetchWeather("Delhi")
        }
    }
}

document.querySelector(".search button").addEventListener("click", function(){
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function(event){
   if(event.key == "Enter"){
       weather.search();
   }
});

geoCode.getLocation();