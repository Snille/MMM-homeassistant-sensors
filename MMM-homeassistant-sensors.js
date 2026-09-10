'use strict';

Module.register("MMM-homeassistant-sensors", {
	result: {},
	defaults: {
		prettyName: true,
		stripName: true,
		title: 'Home Assistant',
		host: 'hassio.local',
		port: '8321',
		https: false,
		rejectUnauthorized: false, // Set to true if your HA uses a valid (non-self-signed) certificate
		token: '',
		apipassword: '',
		fade: 100,
		updateInterval: 300000,
		id: false,
		displaySymbol: true,
		displaydates: false,
		displaytimes: false,
		notificationOnly: false,
		notificationCondition: [],
		dateformat: 'YYYY-MM-DD', // See moments for more format options: https://momentjs.com/docs/#/displaying/
		timeformat: 'HH:mm:ss', // See moments for more format options: https://momentjs.com/docs/#/displaying/
		noaddress: 'away', // If address field is "undefined" or "null" on the sensor, this string will be displayed instead of the address.
		debuglogging: false,
		rowClass: 'small', // small, normal or big
		values: [] // All the sensors and options...
	},

	// Load the moment script (from MM).
	getScripts: function () {
		return ["moment.js"];
	},

	// Load the css script from the module.
	getStyles: function () {
		return ["modules/MMM-homeassistant-sensors/node_modules/@mdi/font/css/materialdesignicons.min.css", "MMM-homeassistant-sensors.css"];
	},

	// Refresh the data from HA if the notification "REFRESHVALUES(x)" arrives.
	notificationReceived: function (notification) {
		var self = this;
		if (self.config.id !== false ) {
			if (notification === "REFRESHVALUES" + self.config.id) {
				this.getStats();
			} 
		} else {
			if (notification === "REFRESHVALUES") {
				this.getStats();
			}
		}
	},

	start: function () {
		this.getStats();
		this.scheduleUpdate();
	},
	isEmpty: function (obj) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				return false;
			}
		}
		return true;
	},
	getDom: function () {
		var wrapper = document.createElement("ticker");
		wrapper.className = "ha-"+this.config.rowClass;
		var data = this.result;
		// For debugging
		//console.log(data);
		
		// Hide display if notificationOnly is set
		if(this.config.notificationOnly) {
			wrapper.style.display = "none";
		}
		// Hides and shows the module if the control sensor set to true are defined and the control sensor value is defined.
		else if (data && !this.isEmpty(data)) {
			// Check if you have a control-sensor set.
			var values = this.config.values;
			if (values.length > 0) {
				for (var i = 0; i < values.length; i++) {
					// Check if there a control sensor in the config.
					if (values[i].control) {
						if (data.length > 0) {
							for (var s = 0; s < data.length; s++) {
								// If we do...
								if (data[s].entity_id == values[i].sensor) {
									// Check if the state is the same as the control-state.
									if (data[s].state !==  values[i].controlvalue) {
										// Hide the module if it's not the same.
										if (!this.hidden) {
											this.hide();
										}
									} else {
										// Show the module if it's the same.
										if (this.hidden) {
											this.show();
										}
									}
								}
							}
						}
					}
				}
			}

/*
			// *****************************************************************************************
			//
			// This below is not working for me, I'm not using pages...
			// For anyone using pages, please fix so that it works both with and without MMM-Pages... :)
			// 
			// *****************************************************************************************
				// this.hide() does not work well with MMM-Pages, so use wrapper.style.display instead
				if (wrapper.style.display != "none") {
					this.visibleStyle = wrapper.style.display;
					wrapper.style.display = "none";
				}
			} else {
				console.log("here 2");
				if (wrapper.style.display == "none") {
					wrapper.style.display = this.visibleStyle;
				}
			}
				// *****************************************************************************************
*/

		}
		// Starting to build the elements.
		var statElement = document.createElement("header");
		var title = this.config.title;
		statElement.innerHTML = title;
		wrapper.appendChild(statElement);

		if (data && !this.isEmpty(data)) {
			var tableElement = document.createElement("table");

			//var values = this.config.values;
			if (values.length > 0) {
				for (var i = 0; i < values.length; i++) {

					// Check if the sensor should be displayed in the table at all.
					// This is useful to set to false if you don't want the "display-sensor" to show in the table. 
					if (values[i].display == false) {
						 continue;
					}

					// Check if there is icons in the config.
					if (values[i].icons) {
						var icons = values[i].icons[0];
					} else {
						var icons = "none";
					}

					// Check if there is values to replace in the config.
					if (values[i].replace) {
						var replace = values[i].replace[0];
					} else {
						var replace = "none";
					}

					// Check if the unit should be replaced in the config.
					if (values[i].defunit) {
						var defunit = values[i].defunit;
					} else {
						var defunit = "none";
					}

					// Check if a global Show Date is set in the config.
					if (this.config.displaydates === true) {
						var showdate = true;
					} else {
						var showdate = false;
					}

					// Check if a local entity date is set to show (overriding the default).
					if (values[i].showdate === true) {
						showdate = true;
					} 

					// Check if a local entity date is not set to show (overriding the default).
					if (values[i].showdate === false) {
						showdate = false;
					}

					// Check if a global Show Time is set in the config.
					if (this.config.displaytimes === true) {
						var showtime = true;
					} else {
						var showtime = false;
					}

					// Check if a local entity time is set to show (overriding the default).
					if (values[i].showtime === true) {
						showtime = true;
					} 

					// Check if a local entity time is not set to show (overriding the default).
					if (values[i].showtime === false) {
						showtime = false;
					}

					// Check if the valueSeparator is defined (overriding the default).
					if (typeof values[i].valueSeparator === "undefined") {
						values[i].valueSeparator = "|";
					}

					// Check if the graph parameter is set (to create a graph of the array in an attribute). 
					if (typeof values[i].graph === "undefined") {
						var graph = false;
					} else {
						var graph = true;
					}

					// Pulling all entity values.
					// The Sensor
					var sensor = values[i].sensor;
					// Name of the Sensor
					var name = this.getName(data, sensor);
					// State of the Sensor
					var stateval = this.getState(data, sensor);
					// Value of the Sensor
					var sensval = this.getValue(data, sensor);
					// Make the data array.
					var sensordata = [
						stateval,
						this.getUnit(data, sensor),
						icons,
						replace,
						values[i].name,
						defunit,
						showdate,
						showtime,
						this.getLastupd(data, sensor),
						this.getPicture(data, sensor),
						values[i].displayvalue,
						values[i].divider,
						values[i].multiplier,
						typeof values[i].round === "undefined" ? 2 : values[i].round,
						this.getAddress(data, sensor),
						values[i].displayunit,
						values[i].highAlertThreshold,
						values[i].lowAlertThreshold,
						sensval,
						values[i].useValue,
						this.getAttribute(data, sensor, values[i].attribute),
						values[i].valueSeparator,
						values[i].highDisplayThreshold,
						values[i].lowDisplayThreshold,
						values[i].displayWhenEqualTo,
						values[i].highDisplayClass,
						values[i].lowDisplayClass,
						graph,
						];
					// For debugging
					//console.log(sensordata);
					if (stateval) {
						tableElement.appendChild(this.addValue(name, sensordata));
					}

					// Send notification
					if(values[i].notificationName !== undefined) {
						var notificationValue = undefined;
						if(this.debuglogging) {
							console.log("MMM-homeassistant-sensors - stateval: " + stateval);
						}

						// Check conditions of sending notification
						if(values[i].notificationConditions.length != 0) {
							var found = false;

							values[i].notificationConditions.forEach((condition) => {

								var negState = false;

								if(condition.negState === true) {
									negState = true;
								}

								condition.stateVals.forEach((val) => {
									if(this.debuglogging) {
										console.log("MMM-homeassistant-sensors - vals: " + val);
									}
									// If sensor value matches the value we're looking for
									if(stateval == val) {
										if(this.debuglogging) {
											console.log("MMM-homeassistant-sensors - " + val + " found");
										}
										found = true;
									}
								});

								// If we found what we're looking for - or didn't find what we're NOT looking for
								if((!found && negState) ||(found && !negState)) {
									notificationValue = condition.notificationVal;
								}
								// Set negative value for notification if necessary
								else if(!found && !negState && condition.notificationValNeg !== undefined) {
									if(this.debuglogging) {
										console.log("MMM-homeassistant-sensors - vals not found");
									}
									notificationValue = condition.notificationValNeg;
								}
								else if(found && negState && condition.notificationValNeg !== undefined) {
									notificationValue = condition.notificationValNeg;
								}
							});

							// Send notification
							if(notificationValue !== undefined && notificationValue != values[i].notificationState) {
								values[i].notificationState = notificationValue;
								this.sendNotification(values[i].notificationName, notificationValue);
							}
						}
					}
				}
			} else {
				for (var key in data) {
					if (data.hasOwnProperty(key)) {
						tableElement.appendChild(this.addValue(key, data[key]));
					}
				}
			}

			wrapper.appendChild(tableElement);
		} else {
			console.log("MMM-homeassistant-sensors - Error! No data returned!");
			var error = document.createElement("span");
			error.innerHTML = "Error fetching stats.";
			wrapper.appendChild(error);
		}
		return wrapper;
	},

	// Collect the state from the entity.
	getState: function (data, value) {
		for (var i = 0; i < data.length; i++) {
			if (data[i].entity_id == value) {
				return data[i].state;
			}
		}
		return null;
	},

	// Collect the value from the entity.
	getValue: function (data, value) {
		for (var i = 0; i < data.length; i++) {
			if (data[i].entity_id == value) {
				if (typeof data[i].attributes.value !== "undefined") {
					return data[i].attributes.value;
				} else {
					return null;
				}
			}
		}
		return null;
	},

	// Collect the unit from the entity.
	getUnit: function (data, value) {
		for (var i = 0; i < data.length; i++) {
			if (data[i].entity_id == value) {
				if (typeof data[i].attributes.unit_of_measurement !== "undefined") {
					return data[i].attributes.unit_of_measurement;
				}
				return "";
			}
		}
		return "";
	},

	// Collect the address from the entity (if available).
	getAddress: function (data, value) {
		for (var i = 0; i < data.length; i++) {
			if (data[i].entity_id == value) {
				return data[i].attributes.address;
			}
		}
		return null;
	},

	// Collect the name from the entity.
	getName: function (data, value) {
		for (var i = 0; i < data.length; i++) {
			if (data[i].entity_id == value) {
				return data[i].attributes.friendly_name;
			}
		}
		return null;
	},

	// Collect the last update date and time from the entity.
	getLastupd: function (data, value) {
		for (var i = 0; i < data.length; i++) {
			if (data[i].entity_id == value) {
				return data[i].last_updated;
			}
		}
		return null;
	},

	// Collect the picture from the entity.
	getPicture: function (data, value) {
		for (var i = 0; i < data.length; i++) {
			if (data[i].entity_id == value) {
				return data[i].attributes.entity_picture;
			}
		}
		return null;
	},

	// Collect selected attribute from the entity.
	getAttribute: function (data, value, attribute) {
		for (var i = 0; i < data.length; i++) {
			if (data[i].entity_id == value) {
				return data[i].attributes[attribute];
			}
		}
		return null;
	},

	// Adding alla the sensors to the table.
	addValue: function (name, sensordata) {
	// The array looks like this.
	//sensordata = [0]State, [1]unit, [2]icons, [3]replace, [4]displayname, [5]defunit, [6]showdate, [7]showtime, [8]lastupd, [9]picture, [10]displayvalue, [11]divider, [12]multiplier, [13]round, [14]address, [15]displayunit, [16]highAlertThreshold, [17]lowAlertThreshold, [18]Value, [19]useValue, [20]attribute (may NOT be a multi dimensional array (yet)), [21]valueSeparator, [22].highDisplayThreshold, [23].lowDisplayThreshold, [24].displayWhenEqualTo, [25]highDisplayClass, [26]lowDisplayClass, [27]graph,
		var newrow,
		newText,
		newCell;
		var newValue;
		var datedata;
		var timedata;
		var unit;
		var picture;
		var address;
		var addblinkhigh = 0;
		var addblinklow = 0;
		var addsensor = 0;
		var addhighsensor = 0;
		var addlowsensor = 0;
		var addequalsensor = 0;

		// Set the value to the sensors status
		newValue = sensordata[0];
		// console.log(newValue);
		//console.log(sensordata);

		// If higher then display threshold add the sensor to the table.
		if (!isNaN(sensordata[22])) {
			if (newValue > sensordata[22]) {
				addhighsensor = 1;
			}
		}

		// If lower then display threshold add the sensor to the table.
		if (!isNaN(sensordata[23])) {
			console.log("here0");
			if (newValue < sensordata[23]) {
				addlowsensor = 1;
			}
		}
		// If equal to this string/value/boolian add the sensor to the table.
		if (typeof sensordata[24] !== 'undefined') {
			if (newValue == sensordata[24]) {
				addequalsensor = 1;
			}
		}

		// If neither lower or higher display threshold is set add the sensor to the table.
		if ((isNaN(sensordata[22])) && (isNaN(sensordata[23])) && (typeof sensordata[24] === 'undefined')){
			addsensor = 1;
		}

		// Adds a row in the table. 
		newrow = document.createElement("tr");

		// Only add the sensor if any of these are set. 
		if (addhighsensor == 1 || addlowsensor == 1 || addequalsensor == 1 || addsensor == 1) {

			// Fix the time and date.
			var thetime = new Date(sensordata[8]);
			var momentdate = moment(thetime);

			// The time formatted. 
			var timedata = moment(thetime).format(this.config.timeformat);

			// The date formatted
			var datedata = moment(thetime).format(this.config.dateformat);

			// Format the time to human readable...
			var rtime = momentdate.from(moment());

			// Adds the address if available.
			if (sensordata[14]) {
				address = sensordata[14];
			} else {
				address = this.config.noaddress;
			}

			// Unit
			if (sensordata[5] !== "none") {
				unit = sensordata[5];
				unit = unit.replace("%t%", timedata);
				unit = unit.replace("%r%", rtime);
				unit = unit.replace("%m%", momentdate);
				unit = unit.replace("%d%", datedata);
				unit = unit.replace("%a%", address);
			} else {
				unit = sensordata[1];
			}

			// Name
			if (sensordata[4]) {
				name = sensordata[4];
				name = name.replace("%t%", timedata);
				name = name.replace("%r%", rtime);
				name = name.replace("%m%", momentdate);
				name = name.replace("%d%", datedata);
				name = name.replace("%a%", address);
				name = name.replace("%u%", unit);
			} else {
				if (this.config.stripName) {
					var split = name.split(".");
					name = split[split.length - 1];
				}
				if (this.config.prettyName) {
					name = name.replace(/([A-Z])/g, function ($1) {
							return "_" + $1.toLowerCase();
						});
					name = name.split("_").join(" ");
					name = name.replace(/\w\S*/g, function (txt) {
							return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
						});
				}
			}
			// removes the date from the output table if selected.
			if (sensordata[6] === false) {
				datedata = "";
			}

			// Removes the date from the output table if selected.
			if (sensordata[7] === false) {
				timedata = "";
			}
			
			// Removes the unit if set not to be displayed.
			if (sensordata[15] === false) {
				unit = "";
			}

			// Column start point. 
			var column = -1;

			// Last Date Updated
			column++;
			newCell = newrow.insertCell(column);
			newCell.className = "ha-date";
			newText = document.createTextNode(datedata);
			newCell.appendChild(newText);

			// Last Time Updated
			column++;
			newCell = newrow.insertCell(column);
			newCell.className = "ha-time";
			newText = document.createTextNode(timedata);
			newCell.appendChild(newText);

			// icons
			column++;
			newCell = newrow.insertCell(column);
			if (this.config.displaySymbol) {
				if (typeof sensordata[2] === "object") {
					var iconsinline = "none";
					//Change icons based on HA status
					for (var key in sensordata[2]) {

						// Sets the icon defined in the config specified value will give specified icon.
						if (sensordata[0] === key) {
							if (!sensordata[2][key].includes("/")) {
								newCell.className = "ha-icon";
								iconsinline = document.createElement("i");
								iconsinline.className = "mdi mdi-" + sensordata[2][key];
								//break;
							} else {
								iconsinline = document.createElement("img");
								iconsinline.src = sensordata[2][key];
								iconsinline.className = "ha-img";
							}
						} 

						// If no icon is set by values, the default one will be used.
						if (iconsinline === "none") {
							if (!sensordata[2][key].includes("/")) {
								newCell.className = "ha-icon";
								iconsinline = document.createElement("i");
								iconsinline.className = "mdi mdi-" + sensordata[2][key];
								//break;
							} else {
								iconsinline = document.createElement("img");
								iconsinline.src = sensordata[2][key];
								iconsinline.className = "ha-img";
							}
						}
					}
					newCell.appendChild(iconsinline);
				} else {
					// Setting the Picture if defined in the entity.
					if (sensordata[9]) {
						if (!sensordata[9].includes("http")) {
							if (this.config.https) {
								var picturestart = "https://";
							} else {
								var picturestart = "http://";
							}
							picture = picturestart.concat(this.config.host, ":", this.config.port, sensordata[9]);
						} else {
							picture = sensordata[9];
						}
						var iconsinline = document.createElement("img");
						iconsinline.src = picture;
						iconsinline.className = "ha-img";
						newCell.appendChild(iconsinline);
					}
				}
			}

			// Add all array values from the attribute to one value (divided by a defined separator (default=|)).
			if (typeof sensordata[20] !== "undefined") {
				if (sensordata[20].length > 1) {
					newValue = sensordata[21];
					for (var i = 0; i < sensordata[20].length; i++) {
						newValue = newValue + sensordata[20][i] + sensordata[21];
					}
					if (sensordata[27] === true) {
						// Figure out how to make a graph using the chart.js script with an attribute array...
						console.log("Fix a graph here!");
					}
				} else {
					newValue = sensordata[20];
				}
			}

			// If higher then alert threshold add blink high class.
			if (!isNaN(sensordata[16])) {
				if (newValue > sensordata[16]) {
					addblinkhigh = 1;
				} 
			}

			// If lower then alert threshold add blink low class.
			if (!isNaN(sensordata[17])) {
				if (newValue < sensordata[17]) {
					addblinklow = 1;
				} 
			}

			// Replace the "state" with the "value" if set to true in config.
			if (sensordata[19]) {
				newValue = sensordata[18];
			}

			// Replace the "value" with something defined in config.
			if (sensordata[3] !== "none") {
				for (var key in sensordata[3]) {
					if (sensordata[0] === key) {
						newValue = sensordata[3][key];
					}
				}
			}

			// Calculate the divider
			if (sensordata[11]) {
				newValue = newValue / sensordata[11];
			}

			// Calculate the multiplier 
			if (sensordata[12]) {
				newValue = newValue * sensordata[12];
			}

			// Round numeric values to the configured number of decimal places.
			var decimalPlaces = sensordata[13];
			if (Number.isInteger(decimalPlaces) && decimalPlaces >= 0 && Number.isFinite(Number(newValue))) {
				var roundingFactor = Math.pow(10, decimalPlaces);
				newValue = Math.round(Number(newValue) * roundingFactor) / roundingFactor;
			}

			// If you want to add the value to the defined unit.
			if (sensordata[5] !== "none") {
				unit = unit.replace("%v%", newValue);
			}

			// Change the value to the address if %a% defined as a value replacement array.
			if (typeof newValue === 'string') {
				if (newValue.includes("%a%")) {
					newValue = newValue.replace("%a%", address);
				}
			}

			// If you want to add the value to the defined name.
			if (sensordata[4]) {
				name = name.replace("%v%", newValue);
			}

			// Removes the value if selected.
			if (sensordata[10] === false) {
				newValue = "";
			}

			// Name
			column++;
			newCell = newrow.insertCell(column);
			newCell.className = "ha-name";
			newText = document.createTextNode(name);
			newCell.appendChild(newText);

			// Value
			column++;
			newCell = newrow.insertCell(column);
			newCell.className = "ha-value";
			if (addblinkhigh > 0) {
				// If high class set, add the class to the sensor.
				if (typeof sensordata[25] !== 'undefined') {
					newrow.className += sensordata[25];
				} else {
					newrow.className += "blinkhigh";
				}
			}
			if (addblinklow > 0) {
				// If low class set, add the class to the sensor.
				if (typeof sensordata[26] !== 'undefined') {
					newrow.className += sensordata[26];
				} else {
					newrow.className += "blinklow";
				}
			}

			newText = document.createTextNode(newValue);
			newCell.appendChild(newText);

			// Unit
			column++;
			newCell = newrow.insertCell(column);
			newCell.className = "ha-unit";
			newText = document.createTextNode(unit);
			newCell.appendChild(newText);

			// Return the sensor row if sensor should be shown.
			return newrow;
		}

		// Return an empty row if sensor should not be shown.
		return newrow;
	},

	// Update
	scheduleUpdate: function (delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		var self = this;
		setInterval(function () {
			self.getStats();
		}, nextLoad);
	},

	// Added "this.identifier" to identify what instance of the module that sent update request.
	getStats: function () {
		this.sendSocketNotification('GET_STATS', { id: this.identifier, config: this.config });
	},

	// Added "this.identifier" to be able to receive updates from "this" instance of the module only.
	socketNotificationReceived: function (notification, payload) {
		if (notification === "STATS_RESULT" && this.identifier == payload.id) {
			this.result = payload.data;
			this.updateDom(this.config.fade);
			//console.log(payload.data);
		}
	},
});
