var RiseVision = RiseVision || {};
RiseVision.Weather = {};
RiseVision.Weather.Settings = {};

/* Settings Start */
RiseVision.Weather.Settings = function() {
	this.settings = new RiseVision.Common.Settings();
}
//Populate settings from saved values.
RiseVision.Weather.Settings.prototype.init = function() {
	var self = this;

	//Add event handlers.
	$("input[name='layout']").change(function() {
		var val = $(this).val();

		//Forecast Temperature Font and Forecast Day font only apply for layouts that show forecasted weather.
		if (val == "current") {
			$(".forecast").hide();
		} else {
			$(".forecast").show();
		}

		//Current Temperature Font only applies for layouts that show current weather.
		if (val == "three-day") {
			$(".current").hide();
		} else {
			$(".current").show();
		}
	});

	$("#address").on("change", function(event) {
		if ($(this).val() == "custom") {
			$(".custom-address").show();
		} else {
			$(".custom-address").hide();
		}
	});

	$("#description").on("change", function(event) {
		if ($(this).val() == "custom") {
			$(".custom-description").show();
		} else {
			$(".custom-description").hide();
		}
	});

	$("#show-humidity").on("click", function(event) {
		if ($(this).is(":checked")) {
			$(".other").show();
		} else {
			$(".other").hide();
		}
	});

	$("#save").on("click", function() {
		self.getSettings();
	});

	$("#cancel, #settings-close").on("click", function() {
		gadgets.rpc.call("", "rscmd_closeSettings", null);
	});

	$("#help").on("click", function() {
		window.open("http://www.risevision.com/help/users/what-are-gadgets/premium-gadgets/rise-vision-weather/", "_blank");
	});

	$("#settings-alert").hide();

	//Request additional parameters from the Viewer.
	gadgets.rpc.call("", "rscmd_getAdditionalParams", function(result) {
		if (result) {
			var prefs = new gadgets.Prefs();

			result = JSON.parse(result);
			self.result = result;

			$("input[type='radio'][name='layout']").each(function() {
				if ($(this).val() == prefs.getString("layout")) {
					$(this).attr("checked", "checked");

					if (prefs.getString("layout") == "current") {
						$(".forecast").hide();
					} else {
						$(".forecast").show();
					}

					if (prefs.getString("layout") == "three-day") {
						$(".current").hide();
					} else {
						$(".current").show();
					}

					return false;
				}
			});

			$("#address").val(prefs.getString("address"));
			$("#custom-address").val(prefs.getString("custom-address"));
			$("#description").val(prefs.getString("description"));
			$("#show-humidity").attr("checked", prefs.getBool("show-humidity"));
			$("#unit").val(prefs.getString("unit"));
			$("#wind-speed").val(prefs.getString("wind-speed"));
			$("#background-color").val(prefs.getString("background-color"));
			$("#terms").attr("checked", prefs.getBool("terms"));

			//Additional params
			$("#layout-url").val(result["layout-url"]);
			$("#custom-description").val(result["custom-description"]);

			//Current Temperature Font
			$("#current-temp-font").fontPicker({
				"i18n-prefix" : "current-temp-font",
				"defaults" : {
					"font" : result["current-temp-font"],
					"font-url" : result["current-temp-font-url"],
					"font-size" : result["current-temp-font-size"],
					"is-bold" : result["current-temp-bold"],
					"is-italic" : result["current-temp-italic"],
					"color" : result["current-temp-color"]
				}
			});

			//Forecast Temperature Font
			$("#forecast-temp-font").fontPicker({
				"i18n-prefix" : "forecast-temp-font",
				"defaults" : {
					"font" : result["forecast-temp-font"],
					"font-url" : result["forecast-temp-font-url"],
					"font-size" : result["forecast-temp-font-size"],
					"is-bold" : result["forecast-temp-bold"],
					"is-italic" : result["forecast-temp-italic"],
					"color" : result["forecast-temp-color"]
				}
			});

			//Forecast Day Font
			$("#forecast-day-font").fontPicker({
				"i18n-prefix" : "forecast-day-font",
				"defaults" : {
					"font" : result["forecast-day-font"],
					"font-url" : result["forecast-day-font-url"],
					"font-size" : result["forecast-day-font-size"],
					"is-bold" : result["forecast-day-bold"],
					"is-italic" : result["forecast-day-italic"],
					"color" : result["forecast-day-color"]
				}
			});

			//Address Font
			$("#address-font").fontPicker({
				"i18n-prefix" : "address-font",
				"defaults" : {
					"font" : result["address-font"],
					"font-url" : result["address-font-url"],
					"font-size" : result["address-font-size"],
					"is-bold" : result["address-bold"],
					"is-italic" : result["address-italic"],
					"color" : result["address-color"]
				}
			});

			//Humidity & Wind Font
			$("#humidity-font").fontPicker({
				"i18n-prefix" : "humidity-font",
				"defaults" : {
					"font" : result["humidity-font"],
					"font-url" : result["humidity-font-url"],
					"font-size" : result["humidity-font-size"],
					"is-bold" : result["humidity-bold"],
					"is-italic" : result["humidity-italic"],
					"color" : result["humidity-color"]
				}
			});

			//Background Color
			$("#background-color").fontPicker({
				"i18n-prefix" : "background-color",
				"defaults" : {
					"color" : prefs.getString("background-color")
				}
			});
		} else {
			//Initialize font pickers.
			$("#current-temp-font").fontPicker({
				"i18n-prefix" : "current-temp-font",
				"defaults" : {
					"font" : "Verdana",
					"font-size" : "60",
					"is-bold" : true
				}
			});
			$("#forecast-temp-font").fontPicker({
				"i18n-prefix" : "forecast-temp-font",
				"defaults" : {
					"font" : "Verdana"
				}
			});
			$("#forecast-day-font").fontPicker({
				"i18n-prefix" : "forecast-day-font",
				"defaults" : {
					"font" : "Verdana",
					"is-bold" : true
				}
			});
			$("#address-font").fontPicker({
				"i18n-prefix" : "address-font",
				"defaults" : {
					"font" : "Verdana",
					"font-size" : "24",
					"is-bold" : true
				}
			});
			$("#humidity-font").fontPicker({
				"i18n-prefix" : "humidity-font",
				"defaults" : {
					"font" : "Verdana"
				}
			});
			$("#background-color").fontPicker({
				"i18n-prefix" : "background-color",
				"defaults" : {
					"color" : ""
				},
				"visibility" : {
					"font" : false,
					"font-size" : false,
					"variants" : false,
					"text" : false
				}
			});
		}

		//Manually trigger event handlers so that the visibility of fields can be set.
		$("#address").trigger("change");
		$("#description").trigger("change");
		$("#show-humidity").triggerHandler("click");

		//Translate
		i18n.init({ fallbackLng: "en" }, function(t) {
			$(".widget-wrapper").i18n().show();
			$(".form-control").selectpicker();

			//Set buttons to be sticky only after wrapper is visible.
			$(".sticky-buttons").sticky({
				container : $(".widget-wrapper"),
				topSpacing : 41,	//top margin + border of wrapper
				getWidthFrom : $(".widget-wrapper")
			});
		});
	});
}
RiseVision.Weather.Settings.prototype.getSettings = function() {
	var alerts = document.getElementById("settings-alert"), errorFound = false, additionalParams = null, prefs = null, params = "", settings = null, selectedLayout;

	$("#settings-alert").empty();

	//Perform validation.
	if ($("input[type='radio'][name='layout']:checked").val() == "custom") {
		errorFound = (weather.settings.validateRequired($("#layout-url"), alerts, "Layout URL")) ? true : errorFound;
	}

	errorFound = (weather.settings.validateRequired($("#current-temp-font .font-url"), alerts, "Current Temperature Font URL")) ? true : errorFound;
	errorFound = (weather.settings.validateRequired($("#forecast-temp-font .font-url"), alerts, "Forecast Temperature Font URL")) ? true : errorFound;
	errorFound = (weather.settings.validateRequired($("#forecast-day-font .font-url"), alerts, "Forecast Day Font URL")) ? true : errorFound;
	errorFound = (weather.settings.validateRequired($("#address-font .font-url"), alerts, "Address URL")) ? true : errorFound;
	errorFound = (weather.settings.validateRequired($("#humidity-font .font-url"), alerts, "Humidity and Wind Font URL")) ? true : errorFound;
	errorFound = (weather.settings.validateRequired($("#custom-address"), alerts, "Your Custom Address")) ? true : errorFound;
	errorFound = (weather.settings.validateRequired($("#custom-description"), alerts, "Your Custom Description")) ? true : errorFound;

	if (errorFound) {
		$("#settings-alert").show();
		$(".widget-wrapper").scrollTop(0);
	} else {
		if (!$("#terms").is(":checked")) {
			$("#settings-alert").html("Please accept the terms before saving.").show();
			$(".widget-wrapper").scrollTop(0);

			return;
		}

		//Pass the custom Widget URL First.
		selectedLayout = $("input[type='radio'][name='layout']:checked");

		if (selectedLayout.val() == "custom") {
			params = $("#layout-url").val() + "?up_layout=" + selectedLayout.val();
		} else {
			params = selectedLayout.data("url") + "?up_layout=" + selectedLayout.val();
		}

		//Construct parameters string to pass to RVA.
		params += "&up_address=" + $("#address").val() + "&up_custom-address=" + $("#custom-address").val() + "&up_description=" + $("#description").val() + "&up_unit=" + $("#unit").val() + "&up_wind-speed=" + $("#wind-speed").val() + "&up_background-color=" + $("#background-color").data("font-picker").getColor();

		if ($("#show-humidity").is(":checked")) {
			params += "&up_show-humidity=true";
		} else {
			params += "&up_show-humidity=false";
		}

		if ($("#terms").is(":checked")) {
			params += "&up_terms=true";
		} else {
			params += "&up_terms=false";
		}

		settings = {
			"params" : params,
			"additionalParams" : JSON.stringify(weather.saveAdditionalParams())
		};

		$("#settings-alert").hide();

		gadgets.rpc.call("", "rscmd_saveSettings", null, settings);
	}
}
RiseVision.Weather.Settings.prototype.saveAdditionalParams = function() {
	var additionalParams = {}, currentTempFontPicker = $("#current-temp-font").data("font-picker"), forecastTempFontPicker = $("#forecast-temp-font").data("font-picker"), forecastDayFontPicker = $("#forecast-day-font").data("font-picker"), addressFontPicker = $("#address-font").data("font-picker"), humidityFontPicker = $("#humidity-font").data("font-picker");

	additionalParams["layout-url"] = $("#layout-url").val();
	additionalParams["custom-description"] = $("#custom-description").val();

	//Current Temperature Font
	additionalParams["current-temp-font"] = currentTempFontPicker.getFont();
	additionalParams["current-temp-font-style"] = currentTempFontPicker.getFontStyle();
	additionalParams["current-temp-font-url"] = currentTempFontPicker.getFontURL();
	additionalParams["current-temp-font-size"] = currentTempFontPicker.getFontSize();
	additionalParams["current-temp-bold"] = currentTempFontPicker.getBold();
	additionalParams["current-temp-italic"] = currentTempFontPicker.getItalic();
	additionalParams["current-temp-color"] = currentTempFontPicker.getColor();

	//Forecast Temperature Font
	additionalParams["forecast-temp-font"] = forecastTempFontPicker.getFont();
	additionalParams["forecast-temp-font-style"] = forecastTempFontPicker.getFontStyle();
	additionalParams["forecast-temp-font-url"] = forecastTempFontPicker.getFontURL();
	additionalParams["forecast-temp-font-size"] = forecastTempFontPicker.getFontSize();
	additionalParams["forecast-temp-bold"] = forecastTempFontPicker.getBold();
	additionalParams["forecast-temp-italic"] = forecastTempFontPicker.getItalic();
	additionalParams["forecast-temp-color"] = forecastTempFontPicker.getColor();

	//Forecast Day Font
	additionalParams["forecast-day-font"] = forecastDayFontPicker.getFont();
	additionalParams["forecast-day-font-style"] = forecastDayFontPicker.getFontStyle();
	additionalParams["forecast-day-font-url"] = forecastDayFontPicker.getFontURL();
	additionalParams["forecast-day-font-size"] = forecastDayFontPicker.getFontSize();
	additionalParams["forecast-day-bold"] = forecastDayFontPicker.getBold();
	additionalParams["forecast-day-italic"] = forecastDayFontPicker.getItalic();
	additionalParams["forecast-day-color"] = forecastDayFontPicker.getColor();

	//Address Font
	additionalParams["address-font"] = addressFontPicker.getFont();
	additionalParams["address-font-style"] = addressFontPicker.getFontStyle();
	additionalParams["address-font-url"] = addressFontPicker.getFontURL();
	additionalParams["address-font-size"] = addressFontPicker.getFontSize();
	additionalParams["address-bold"] = addressFontPicker.getBold();
	additionalParams["address-italic"] = addressFontPicker.getItalic();
	additionalParams["address-color"] = addressFontPicker.getColor();

	//Humidity and Wind Font
	additionalParams["humidity-font"] = humidityFontPicker.getFont();
	additionalParams["humidity-font-style"] = humidityFontPicker.getFontStyle();
	additionalParams["humidity-font-url"] = humidityFontPicker.getFontURL();
	additionalParams["humidity-font-size"] = humidityFontPicker.getFontSize();
	additionalParams["humidity-bold"] = humidityFontPicker.getBold();
	additionalParams["humidity-italic"] = humidityFontPicker.getItalic();
	additionalParams["humidity-color"] = humidityFontPicker.getColor();

	return additionalParams;
}