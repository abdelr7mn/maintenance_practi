 let apiKey = "1e3e8f230b6064d27976e41163a82b77";

navigator.geolocation.getCurrentPosition(async function (position) {
   
    try {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        //longitude and  latitude are used to get city name
        var map = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${apiKey}`)
        var userdata = await map.json();
        let loc = userdata[0].name;
        //By using City name  we can get the weather details of that particular city from OpenWeatherMap API
        let url = `https://api.openweathermap.org/data/2.5/forecast?&units=metric&`;
        let respond = await fetch(url + `q=${loc}&` + `appid=${apiKey}`);
        let data = await respond.json();

        console.log(data);
        
        // display current weather info
        let cityMain = document.getElementById("city-name");
        let cityTemp = document.getElementById("metric");
        let weatherMain = document.querySelectorAll("#weather-main");
        let mainHumidity = document.getElementById("humidity");
        let mainFeel = document.getElementById("feels-like");
        let weatherImg = document.querySelector(".weather-icon");
        let weatherImgs = document.querySelector(".weather-icons");
        let tempMinWeather = document.getElementById("temp-min-today");
        let tempMaxWeather = document.getElementById("temp-max-today");
// Fares Mohammed Hosni
      // عرض اسم المدينة
console.log("City Name:", data.city.name);
cityMain.innerHTML = data.city.name;

// عرض درجة الحرارة
console.log("Temperature:", data.list[0].main.temp);
cityTemp.innerHTML = Math.floor(data.list[0].main.temp) + "°";

// عرض وصف الطقس
console.log("Weather Description (First):", data.list[0].weather[0].description);
weatherMain[0].innerHTML = data.list[0].weather[0].description;

console.log("Weather Description (Second):", data.list[0].weather[0].description);
weatherMain[1].innerHTML = data.list[0].weather[0].description;

// عرض نسبة الرطوبة
console.log("Humidity1:", data.list[0].main.humidity);
mainHumidity.innerHTML = Math.floor(data.list[0].main.humidity);

// عرض درجة الحرارة المحسوسة
console.log("Feels Like Temperature2:", data.list[0].main.feels_like);
mainFeel.innerHTML = Math.floor(data.list[0].main.feels_like);

// عرض أقل درجة حرارة
console.log("Minimum Temperature3:", data.list[0].main.temp_min);
tempMinWeather.innerHTML = Math.floor(data.list[0].main.temp_min) + "°";

// عرض أعلى درجة حرارة
console.log("Maximum Temperature4:", data.list[0].main.temp_max);
tempMaxWeather.innerHTML = Math.floor(data.list[0].main.temp_max) + "°";

let weatherCondition = data.list[0].weather[0].main.toLowerCase();
console.log("Weather Condition:", weatherCondition);

// كائن يحتوي على الصور المرتبطة بكل حالة طقس
const weatherImages = {
    rain: "img/rain.png",
    clear: "img/sun.png",
    "clear sky": "img/sun.png",
    snow: "img/snow.png",
    clouds: "img/cloud.png",
    smoke: "img/cloud.png",
    mist: "img/mist.png",
    fog: "img/mist.png",
    haze: "img/haze.png"
};

// تعيين الصورة بناءً على حالة الطقس
let imageSrc = weatherImages[weatherCondition] || "img/default.png"; // إذا لم يتم العثور على الحالة، استخدم صورة افتراضية

// تعيين الصور للصور المختلفة
weatherImg.src = imageSrc;
weatherImgs.src = imageSrc;

        // Fetch and display 5-day forecast data
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${data.city.name}&appid=${apiKey}&units=metric`;

        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                console.log("5-Day Forecast for", data.city.name);
                displayForecast(data);
            })
            .catch(error => {
                console.error("Error fetching forecast:", error);
            });

        function displayForecast(data) {
            const dailyForecasts = {};
            let forecast = document.getElementById('forecast-box');
            let forecastbox = "";

            data.list.forEach(item => {
                const date = item.dt_txt.split(' ')[0];
                let dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                let day = new Date(date).getDay();

                if (!dailyForecasts[date]) {
                    dailyForecasts[date] = {
                        day_today: dayName[day],
                        temperature: Math.floor(item.main.temp) + "°",
                        description: item.weather[0].description,
                        weatherImg: item.weather[0].main.toLowerCase()
                    };
                }
            });

            for (const date in dailyForecasts) {
                let imgSrc = "";

                switch (dailyForecasts[date].weatherImg) {
                    case "rain":
                        imgSrc = "img/rain.png";
                        break;
                    case "clear":
                    case "clear sky":
                        imgSrc = "img/sun.png";9
                        break;
                    case "snow":
                        imgSrc = "img/snow.png";
                        break;
                    case "clouds":
                    case "smoke":
                        imgSrc = "img/cloud.png";
                        break;
                    case "mist":
                        imgSrc = "img/mist.png";
                        break;
                    case "haze":
                        imgSrc = "img/haze.png";
                        break;
                    default:
                        imgSrc = "img/sun.png";
                }

                forecastbox += `
                <div class="weather-forecast-box">
                <div class="day-weather">
                <span>${dailyForecasts[date].day_today}</span>
                 </div>
                    <div class="weather-icon-forecast">
                        <img src="${imgSrc}" />
                    </div>
                    <div class="temp-weather">
                        <span>${dailyForecasts[date].temperature}</span>
                    </div>
                    <div class="weather-main-forecast">${dailyForecasts[date].description}</div>
                </div>`;
            }

            forecast.innerHTML = forecastbox;

            console.log(data);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
},
() => {
    // Handle location retrieval error
    alert("Please turn on your location and refresh the page");
  });