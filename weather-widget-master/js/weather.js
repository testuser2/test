var prefs = new gadgets.Prefs(), weather = null;

//No right clicks.
window.oncontextmenu = function() {
	return false;
};

//Add Analytics code.
var _gaq = _gaq || [];

_gaq.push(['_setAccount', 'UA-41395348-5']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();

function readyEvent() {
	gadgets.rpc.call('', 'rsevent_ready', null, prefs.getString("id"), false, false, false, true, false);
}


$(document).ready(function() {
	var id = prefs.getString("id"), backgroundColor = prefs.getString("background-color");

	document.body.onmousedown = function() {
		return false;
	};

	//Set background color.
	if (backgroundColor != null && backgroundColor != "") {
		document.body.style.background = backgroundColor;
	}

	if (prefs.getBool("terms")) {
		weather = new RiseVision.Weather.Controller();

		if (id) {
			gadgets.rpc.register("rsparam_set_" + id, weather.getAdditionalParams);
			gadgets.rpc.call("", "rsparam_get", null, id, "additionalParams");
		}
	}
	else {
		$(".container").hide();
		$(".error").text("You must check the Acceptance setting in order to use this Gadget.").show();
		readyEvent();
	}
});

var RiseVision = RiseVision || {};
RiseVision.Weather = {};
RiseVision.Weather.Controller = {};

RiseVision.Weather.Controller = function() {
	var rsW = prefs.getInt("rsW"), rsH = prefs.getInt("rsH"), layout = prefs.getString("layout");

	this.isLoading = true;
	this.imagesLoaded = 0;
	this.refreshInterval = 1800000;
	//30 minutes
	this.errorInterval = 60000;
	this.layout = prefs.getString("layout");
	this.hostURL = "https://s3.amazonaws.com/Widget-Weather/";
	this.url = unescape("%68%74%74%70%3a%2f%2f%77%77%77%2e%74%69%6e%62%75%77%65%61%74%68%65%72%2e%63%6f%6d%2f%77%78%5f%66%65%65%64%2f%77%78%5f%63%75%72%72%65%6e%74%5f%65%78%74%65%6e%64%65%64%5f%62%79%5f%6e%61%6d%65%2e%70%68%70%3f%70%61%73%73%63%6f%64%65%3d%72%69%73%65%64%69%73%70%6c%61%79%25%37%43%64%6b%61%63%26%6d%65%74%72%69%63%3d%66%61%6c%73%65");
	this.geoURL = unescape("%68%74%74%70%3a%2f%2f%77%77%77%2e%74%69%6e%62%75%77%65%61%74%68%65%72%2e%63%6f%6d%2f%77%78%5f%66%65%65%64%2f%77%78%5f%63%75%72%72%65%6e%74%5f%65%78%74%65%6e%64%65%64%5f%62%79%5f%6c%61%74%6c%6f%6e%2e%70%68%70%3f%70%61%73%73%63%6f%64%65%3d%72%69%73%65%64%69%73%70%6c%61%79%25%37%43%64%6b%61%63%26%6d%65%74%72%69%63%3d%66%61%6c%73%65");
}
//Callback function for Rise Vision API.
RiseVision.Weather.Controller.prototype.getAdditionalParams = function(name, value) {
	var styleNode, address;

	if (name == "additionalParams") {
		if (value) {
			styleNode = document.createElement("style");
			value = JSON.parse(value);

			weather.customDescription = value["custom-description"];

			//Load fonts.
			if (weather.layout != "three-day") {
				weather.currentTempFont = new RiseVision.Common.Font(value["current-temp-font"], value["current-temp-font-style"], value["current-temp-font-url"], "currentTempFont");
				weather.currentTempFontSize = value["current-temp-font-size"];
				weather.currentTempBold = value["current-temp-bold"];
				weather.currentTempItalic = value["current-temp-italic"];
				weather.currentTempColor = value["current-temp-color"];
			}

			if (weather.layout != "current") {
				weather.forecastTempFont = new RiseVision.Common.Font(value["forecast-temp-font"], value["forecast-temp-font-style"], value["forecast-temp-font-url"], "forecastTempFont");
				weather.forecastTempFontSize = value["forecast-temp-font-size"];
				weather.forecastTempBold = value["forecast-temp-bold"];
				weather.forecastTempItalic = value["forecast-temp-italic"];
				weather.forecastTempColor = value["forecast-temp-color"];

				weather.forecastDayFont = new RiseVision.Common.Font(value["forecast-day-font"], value["forecast-day-font-style"], value["forecast-day-font-url"], "forecastDayFont");
				weather.forecastDayFontSize = value["forecast-day-font-size"];
				weather.forecastDayBold = value["forecast-day-bold"];
				weather.forecastDayItalic = value["forecast-day-italic"];
				weather.forecastDayColor = value["forecast-day-color"];
			}

			weather.addressFont = new RiseVision.Common.Font(value["address-font"], value["address-font-style"], value["address-font-url"], "addressFont");
			weather.addressFontSize = value["address-font-size"];
			weather.addressBold = value["address-bold"];
			weather.addressItalic = value["address-italic"];
			weather.addressColor = value["address-color"];

			if (prefs.getBool("show-humidity")) {
				weather.humidityFont = new RiseVision.Common.Font(value["humidity-font"], value["humidity-font-style"], value["humidity-font-url"], "humidityFont");
				weather.humidityFontSize = value["humidity-font-size"];
				weather.humidityBold = value["humidity-bold"];
				weather.humidityItalic = value["humidity-italic"];
				weather.humidityColor = value["humidity-color"];
			}

			weather.init();
		}
	}
	else if (name == "displayAddress") {
		if (value) {
			address = JSON.parse(value);
			//Only need to use and show city and province.
			weather.weatherURL = weather.url + "&name=" + encodeURIComponent(address.city + "," + address.province) + "&dummy=" + Math.ceil(Math.random() * 100);
		}

		weather.getWeather();
	}
}
RiseVision.Weather.Controller.prototype.init = function() {
	//Apply styling.
	//Current Temperature
	if (this.layout != "three-day") {
		$(".current-temp").css("font-family", this.currentTempFont.getFontFamily()).css("font-size", this.currentTempFontSize + "px").css("color", this.currentTempColor);
		this.currentTempBold ? $(".current-temp").css("font-weight", "bold") : "";
		this.currentTempItalic ? $(".current-temp").css("font-style", "italic") : "";
	}

	//Forecast Temperature
	if (this.layout != "current") {
		$(".temp").css("font-family", this.forecastTempFont.getFontFamily()).css("font-size", this.forecastTempFontSize + "px").css("color", this.forecastTempColor);
		this.forecastTempBold ? $(".temp").css("font-weight", "bold") : "";
		this.forecastTempItalic ? $(".temp").css("font-style", "italic") : "";

		//Forecast Day Temperature
		$(".day-of-week").css("font-family", this.forecastDayFont.getFontFamily()).css("font-size", this.forecastDayFontSize + "px").css("color", this.forecastDayColor);
		this.forecastDayBold ? $(".day-of-week").css("font-weight", "bold") : "";
		this.forecastDayItalic ? $(".day-of-week").css("font-style", "italic") : "";
	}

	//Address Font
	$(".city").css("font-family", this.addressFont.getFontFamily()).css("font-size", this.addressFontSize + "px").css("color", this.addressColor);
	this.addressBold ? $(".city").css("font-weight", "bold") : "";
	this.addressItalic ? $(".city").css("font-style", "italic") : "";

	//Humidity and Wind Font
	if (prefs.getBool("show-humidity")) {
		$(".humidity-wind").css("font-family", this.humidityFont.getFontFamily()).css("font-size", this.humidityFontSize + "px").css("color", this.humidityColor);
		this.humidityBold ? $(".humidity-wind").css("font-weight", "bold") : "";
		this.humidityItalic ? $(".humidity-wind").css("font-style", "italic") : "";
	}

	this.getLocation();
}
RiseVision.Weather.Controller.prototype.getLocation = function() {
	var id = prefs.getString("id"), address = prefs.getString("address"), customAddress = prefs.getString("custom-address");

	//Use geolocation to determine the location of the display.
	if (address == "geolocation") {
		this.useGeolocation();
	}
	//Make a call to the Rise Vision API to get the address of the display.
	else if (address == "display") {
		if (id) {
			gadgets.rpc.call("", "rsparam_get", null, id, "displayAddress");
		}
	}
	//Use custom address supplied by the user.
	else if (address == "custom") {
		if (customAddress != "") {
			this.weatherURL = this.url + "&name=" + encodeURIComponent(customAddress) + "&dummy=" + Math.ceil(Math.random() * 100);
			this.getWeather();
		}
	}
}
RiseVision.Weather.Controller.prototype.useGeolocation = function() {
	var self = this;

	if (this.supportsGeolocation()) {
		//This function will recover on its own if the Internet is disconnected.
		navigator.geolocation.getCurrentPosition(function(position) {
			self.getPosition.call(self, position);
		}, function(err) {
			//Unable to find geolocation coordinates. Try again every minute.
			console.log("Unable to obtain geolocation position.");

			setTimeout(function() {
				self.getLocation();
			}, self.errorInterval);
		});
	}
}
RiseVision.Weather.Controller.prototype.supportsGeolocation = function() {
	return !!navigator.geolocation;
}
RiseVision.Weather.Controller.prototype.getPosition = function(position) {
	this.weatherURL = this.geoURL + "&lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&dummy=" + Math.ceil(Math.random() * 100);
	this.getWeather();
}
RiseVision.Weather.Controller.prototype.getWeather = function() {
	var self = this, params = {};

	//This could occur in the case where the location to use is the display's address, but the Gadget is being previewed in the Viewer.
	if (!this.weatherURL) {//Use geolocation.
		this.useGeolocation();
	}
	else {
		params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.DOM;
		gadgets.io.makeRequest(this.weatherURL, function(obj) {
			self.showWeather(obj);
		}, params);
	}
}
//Show weather for the selected layout.
RiseVision.Weather.Controller.prototype.showWeather = function(obj) {
	var self = this, forecasts = [], today = new Date().getDay() + 1, tomorrow = (today + 1) > 7 ? 1 : today + 1, nextDay = (tomorrow + 1 > 7) ? 1 : tomorrow + 1, hasAddInfo = false, hasCity = false, description = prefs.getString("description"), windSpeed = prefs.getString("wind-speed"), layout = prefs.getString("layout"), data, current, icon_name, forecast, location, place, dayOfWeek, humidity, wind, windDirection, windSpeed, atText, windSpeedText, mph, kph, low, high;

	//Unable to connect to the weather service. Try again every minute.
	if (obj.errors.length > 0) {
		console.log("Unable to connect to the weather service at " + new Date() + ". Please check your Internet connection.");

		setTimeout(function() {
			self.getLocation();
		}, self.errorInterval);

		return;
	}

	if (obj.data) {
		//No weather data found for this location.
		if (obj.data.getElementsByTagName("cw_error").length > 0) {
			this.retry();
		}
		else {
			data = obj.data;

			$(".container").show();
			$(".error").hide();

			//Translate
			i18n.init({ fallbackLng: "en" }, function(t) {
				$(".container").i18n();

				//Issue 1029 Start - Find the observation tag that has an icon_name other than 'cw_no_report_icon'
				//and use that one for current weather data.
				$.each(data.getElementsByTagName("observation"), function(index, value) {
					//Skip first observation data as it doesn't seem to be very reliable.
					if (index != 0) {
						icon_name = value.getAttribute("icon_name");

						if ((icon_name != null) && (icon_name != "cw_no_report_icon")) {
							current = this;
							return false;
						}
					}
				});

				//No observation data found that has an icon.
				if (current == null) {
					//Use observation data from second listing as it seems to be more reliable.
					if (data.getElementsByTagName("observation").length > 1) {
						current = data.getElementsByTagName("observation")[1];
					}
					//Use the first observation if there is only one.
					else {
						current = data.getElementsByTagName("observation")[0];
					}
				}
				//Issue 1029 - End

				//Current weather conditions.
				if (current && (layout != "three-day")) {
					if (current.getAttribute("icon_name")) {
						self.loadImage(current.getAttribute("icon_name"), $(".current-icon"));
						$(".current-icon").attr("title", current.getAttribute("description"));
					}
					else {
						$(".current-icon").hide();
					}

					//Temperature
					$(".current-temp").html((prefs.getString("unit") == "celsius") ? self.convertTemp(current.getAttribute("temperature")) + "&#176;C" : self.convertTemp(current.getAttribute("temperature")) + "&#176;F");
				}

				//Description
				if (description == "custom") {
					$(".city").text(self.customDescription);
					hasCity = true;
				}
				else if (description == "service") {
					location = data.getElementsByTagName("location")[0];

					if (location) {
						place = location.getAttribute("city_name");

						if (location.getAttribute("state_name")) {
							place += ", " + location.getAttribute("state_name");
						}

						$(".city").text(place);
						hasCity = true;
					}
				}

				if (current) {
					//Wind and humidity
					if (prefs.getBool("show-humidity")) {
						windDirection = i18n.t(current.getAttribute("wind_short"));
						windSpeed = prefs.getString("wind-speed");

						if (!isNaN(current.getAttribute("humidity"))) {
							$(".humidity").text(i18n.t("humidity") + " " + current.getAttribute("humidity") + "%");
						}

						if (windSpeed === "mph") {
							if (current.getAttribute("wind_short") && current.getAttribute("wind_speed")) {
								$(".wind").text(i18n.t("wind") + " " + windDirection + " " + i18n.t("at") + " " + parseInt(current.getAttribute("wind_speed")) + " " + i18n.t("mph"));
							}
						}
						else if (windSpeed === "kph") {
							if (current.getAttribute("wind_short") && current.getAttribute("wind_speed")) {
								mph = parseInt(current.getAttribute("wind_speed"));

								kph = Math.round(mph * 1.609344);
								$(".wind").text(i18n.t("wind") + " " + windDirection + " " + i18n.t("at") + " " + kph + " " + i18n.t("kph"));
							}
						}

						hasAddInfo = true;
					}
					else {
						$(".humidity-wind").hide();
					}
				}

				if (!hasAddInfo && !hasCity) {
					$(".info").hide();
				}

				forecast = data.getElementsByTagName("forecast");

				//Forecasted weather
				if (forecast) {
					if (layout != "current") {
						for ( i = 0; i < forecast.length; i++) {
							dayOfWeek = forecast[i].getAttribute("day_of_week");

							if ((dayOfWeek == today)) {
								forecasts[0] = forecast[i];
							}
							else if (dayOfWeek == tomorrow) {
								forecasts[1] = forecast[i];
							}
							else if (dayOfWeek == nextDay) {
								forecasts[2] = forecast[i];
							}
						}
					}

					$(".icon").each(function(index) {
						if (forecasts[index].getAttribute("icon_name")) {
							self.loadImage(forecasts[index].getAttribute("icon_name"), $(this));
							$(this).attr("title", forecasts[index].getAttribute("description"));
						}
						else {
							$(this).hide();
						}
					});

					$(".day-of-week").each(function(index) {
						$(this).html(i18n.t(forecasts[index].getAttribute("weekday").toLowerCase()));
					});

					$(".temp").each(function(index) {
						low = self.convertTemp(forecasts[index].getAttribute("low_temp"));
						high = self.convertTemp(forecasts[index].getAttribute("high_temp"));

						$(this).html(low + "&#176; / " + high + "&#176;");
					});
				}

				setTimeout(function() {
					self.getLocation();
				}, self.refreshInterval);
			});
}
}
else {
	this.retry();
}

if (this.isLoading) {
	this.isLoading = false;
	readyEvent();
}
}
RiseVision.Weather.Controller.prototype.retry = function() {
	var self = this;

	//Issue 1029 - Only show message if Gadget is loading. Otherwise, continue to show stale weather data.
	if (this.isLoading) {
		$(".container").hide();
		$(".error").text("Unable to retrieve weather data for that location.").show();
	}

	//Issue 985 Start
	setTimeout(function() {
		self.getLocation();
	}, this.errorInterval);
	//Issue 985 End
}
RiseVision.Weather.Controller.prototype.loadImage = function(icon, $element) {
	var self = this, img = new Image(), url = this.hostURL + "images/" + icon + ".png";

	img.onload = function() {
		$element.attr("src", url);
		self.onImageLoaded();
	}

	img.onerror = function() {
		console.log("Image " + icon + " not found on " + new Date() + " for " + $(".city").text());
		self.onImageLoaded();
	}

	img.src = url;
}
RiseVision.Weather.Controller.prototype.onImageLoaded = function(icon, $element) {
	this.imagesLoaded++;

	if (prefs.getString("layout") == "current") {
		if (this.imagesLoaded == 1) {
			$(document).trigger("dataPopulated");
		}
	}
	else if (prefs.getString("layout") == "three-day") {
		if (this.imagesLoaded == 3) {
			$(document).trigger("dataPopulated");
		}
	}
	else if (prefs.getString("layout") == "current-and-three-day") {
		if (this.imagesLoaded == 4) {
			$(document).trigger("dataPopulated");
		}
	}
	else {//Custom
		//This will fire once per image.
		$(document).trigger("dataPopulated");
	}
}
RiseVision.Weather.Controller.prototype.convertTemp = function(temp) {//Angular Filter
	//Convert to Celsius.
	if (prefs.getString("unit") == "celsius") {
		return parseInt(((temp - 32) * 5 / 9.0));
	}
	//Default temperature unit is Fahrenheit.
	else {
		return parseInt(temp);
	}
}