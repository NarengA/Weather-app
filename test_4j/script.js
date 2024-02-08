const wrapper = $(".wrapper"),
    inputPart = $(".input-part"),
    infoTxt = inputPart.find(".info-txt"),
    inputField = inputPart.find("input"),
    locationBtn = inputPart.find("button"),
    weatherPart = wrapper.find(".weather-part"),
    wIcon = weatherPart.find("img"),
    arrowBack = wrapper.find("header i");

let api;

inputField.on("keyup", function(e) {
    if (e.key == "Enter" && inputField.val() != "") {
        requestApi(inputField.val());
    }
});

locationBtn.on("click", function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser does not support geolocation API");
    }
});

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fa&appid=15479cfedcfd0c4f285f94d938894ff5`;
    fetchData();
}

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=fa&appid=15479cfedcfd0c4f285f94d938894ff5`;
    fetchData();
}

function onError(error) {
    infoTxt.text(error.message);
    infoTxt.addClass("error");
}

function fetchData() {
    infoTxt.text("Getting weather details...");
    infoTxt.addClass("pending");
    $.getJSON(api)
        .done(function(result) {
            weatherDetails(result);
        })
        .fail(function() {
            infoTxt.text("Something went wrong");
            infoTxt.removeClass("pending").addClass("error");
        });
}

function weatherDetails(info) {
    if (info.cod == "404") {
        infoTxt.removeClass("pending").addClass("error");
        infoTxt.text(`${inputField.val()} isn't a valid city name`);
    } else {
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { temp, feels_like, humidity } = info.main;

        if (id == 800) {
            wIcon.attr("src", "icons/clear.svg");
        } else if (id >= 200 && id <= 232) {
            wIcon.attr("src", "icons/storm.svg");
        } else if (id >= 600 && id <= 622) {
            wIcon.attr("src", "icons/snow.svg");
        } else if (id >= 701 && id <= 781) {
            wIcon.attr("src", "icons/haze.svg");
        } else if (id >= 801 && id <= 804) {
            wIcon.attr("src", "icons/cloud.svg");
        } else if ((id >= 500 && id <= 531) | (id >= 300 && id <= 321)) {
            wIcon.attr("src", "icons/rain.svg");
        }

        const countryName = getCountryNameInFarsi(country);

        weatherPart.find(".temp .numb").text(Math.floor(temp));
        weatherPart.find(".weather").text(description);
        weatherPart.find(".location span").text(`${city}, ${countryName}`);
        weatherPart.find(".temp .numb-2").text(Math.floor(feels_like));
        weatherPart.find(".humidity span").text(`${humidity}%`);
        infoTxt.removeClass("pending error").text("");
        inputField.val("");
        wrapper.addClass("active");
    }
}

function getCountryNameInFarsi(countryCode) {
    // Replace with your own logic to get the Farsi name of the country based on the country code
    // For example:
    if (countryCode === "IR") {
        return "ایران";
    } else if (countryCode === "CA") {
        return "کانادا";
    } else if (countryCode === "DE") {
        return "آلمان";
    }
    // ...

    // Returning the country code itself as a fallback
    return countryCode;
}

arrowBack.on("click", function() {
    wrapper.removeClass("active");
});