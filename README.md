# MMM-homeassistant-sensors

This is a module for [MagicMirror²](https://magicmirror.builders/). 

This module can display information from [Home Assistant](https://home-assistant.io/) using the home assistant REST API.

*Potential breaking changes!*

*The "control" sensor is moved to the "values" block of the config!*

*Read below how to configure it!*

## Screenshots

[Advanced configuration](#Here-is-the-advanced-configuration).

Using many of the features:

- Adding the "value" to the name.
- Adding time to the name column.
- Hiding the unit it from the "unit" column.
- Hiding the value in from the "value" column.
- Using "pictures" from the entity.
- Using different "pictures" for different values.
- Using different "icons" for different values from the Material Design Font.
- Replacing "values" with defined values.
- Setting a "default" icon from the Material Design Font.

![Advanced](.github/screen01-advanced.png)


## Installation

In your terminal, go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
````

Clone this repository:
````
git clone https://github.com/Snille/MMM-homeassistant-sensors.git
````

Enter the folder:
````
cd MMM-homeassistant-sensors
````

Install dependencies. 
````
npm install
````

## Update

To update the module:

````
cd ~/MagicMirror/modules/MMM-homeassistant-sensors
git pull
npm install
````

## Configuration
The configuration can be very simple, from just displaying a simple value from a senor, to parsing the sensorvalue and changing it to different pictures depending on the value. It's all up to you.

## Configuration Options
| Option               | Required | Default | Description |
| -------------------- | ------- | ------- | ----------- |
| `prettyName`         | No | `true` | Pretty print the name of each JSON key (remove camelCase and underscores).|
| `stripName`          | No | `true` | Removes all keys before the printed key. <br><br>**Example:** `a.b.c` will print `c`.|
| `title`              | No | `'Home Assistant'` | Title to display at the top of the module. <br>|
| `host`               | Yes |  `'hassio.local'` | The hostname or IP address of the Home Assistant instance. **Do not include** `http://` or `https://` — use the `https` option instead.|
| `port`               | No | `8321` | Port of Home Assistant. Use `8123` for a standard local installation, or `443` when connecting via HTTPS to a domain/reverse proxy.|
| `https`              | No | `false` | Set to `true` to connect to Home Assistant over HTTPS.|
| `rejectUnauthorized` | No | `false` | Set to `true` to require a valid (CA-signed) certificate. Leave as `false` (default) to allow self-signed certificates, which is common in local Home Assistant setups.|
| `token`              | Yes | `''` | The long lived token.|
| `fade`               | No | `100` | When updating the values, this is the time (in milliseconds) the "table" fades out and in again.|
| `updateInterval`     | No | `300000` | The time between updates (in milliseconds) (300000 = 5 minutes).|
| `id`                 | No | `false` | If you want to refresh the values on this specific instance from HA via notifications, send "REFRESHVALUESX" (X = your id). If you send just "REFRESHVALUES" all instances values will be refreshed.|
| `displaySymbol`      | No | `true` | If you don't want either "icons" nor "pictures" in your list, set it to false.|
| `displaydates`       | No | `false` | If you want to show dates for last update by default. This can be turned off or on for each sensor as well.|
| `displaytimes`       | No | `false` | If you want to show times for last update by default. This can be turned off or on for each sensor as well.|
| `notificationOnly`   | No | `false` | Don't show any sensors, just send a notification based on notificationConditions.|
| `dateformat`         | No | `'YYYY-MM-DD'` | See [moments](https://momentjs.com/docs/#/displaying/) for more date format options.|
| `timeformat`         | No | `'HH:mm:ss'` | See [moments](https://momentjs.com/docs/#/displaying/) for more time format options.|
| `rowClass`           | No | `'small'` | Changing the font size, Possible values: `'small'`, `'normal'`, `'big'` <br> Default value: `'small'` |
| `debuglogging`       | No | `false` | Enable logging into /home/pi/.pm2/logs/mm-error.log (true/false).|
| `noaddress`	       | No | `'away'` | If address field is "undefined" or "null" on the sensor, this string will be displayed instead of the address. |
| `values`             | No | `[]` | Specify specific values from the json feed to only show what you need (entity_id). <br><br> Check the options!|

## Values options
| Option                   | Type | Description |
| ------------------------ | ---- | ----------- |
| `sensor`                 | `entity_id` | Entity ID from Home Assistant. Please have a look at the states pages for the unique `entity_id` of your sensor.|
| `name`                   | `string` | You can specify a name that will be displayed instead of the one from HA.|
| `divider`                | `number` | You can specify a number (or calculation) that the value should be divided by.|
| `multiplier`             | `number` | You can specify a number (or calculation) that value should be multiplied by.|
| `round`                  | `boolean` | true or false if you want to round the value to max two decimals.|
| `displayvalue`           | `boolean` | Set to false to not display the state in the value column. |
| `useValue`               | `false`   | Set this to true to use the sensor value instead of the sensor state|
| `displayunit`            | `boolean` | Set to false to not display the unit in the unit column. |
| `defunit`                | `string` | You can specify a unit that will be displayed instead of the one from HA.|
| `attribute`              | `string` | You can specify a specific attribute from the sensor that will be displayed instead of the state (attribute can NOT contain a multidimensional array).|
| `valueSeparator`         | `string` | If your `attribute` is an array, you can specify what to separate the values with here (default is \| (pipe)).|
| `highAlertThreshold`     | `number` | You can specify a number, if the value/state of the sensor is higher then this the row will blink and turn red.|
| `lowAlertThreshold`      | `number` | You can specify a number, if the value/state of the sensor is lower then this the row will blink and turn blue.|
| `highDisplayThreshold`   | `number` | You can specify a number, if the value/state of the sensor is higher then this the sensor will be shown in the table.|
| `lowDisplayThreshold`    | `number` | You can specify a number, if the value/state of the sensor is lower then this the sensor will be shown in the table.|
| `highDisplayClass`       | `string` | You can specify a class for the high value, if the value of the sensor is higher then the highAlertThreshold this class will be used.|
| `lowDisplayClass`        | `string` | You can specify a class for the low value, if the value of the sensor is lower then the lowAlertThreshold this class will be used.|
| `displayWhenEqualTo`     | `string` | You can specify a string/number/boolian, if the value/state of the sensor is equal to what's specified the sensor will be shown in the table.|
| `icons`                  | `array` | Define specific icons for specific values/states (see example below). You can use the icon names from the: [MaterialDesignIcons](https://materialdesignicons.com/).|
| `replace`                | `array` | Define specific values/states that will be overridden by the specified values.|
| `notificationName`       | `string` | Name of the notification to send from this notification. Example: "Home" |
| `notificationConditions` | `array` | See section below for details. This is required to send a notification. |
| `control`                | `boolean` | Set to true if you want to use this sensor to trigger to show the module when the defined value is present.|
| `controlvalue`           | `string`| The value the control HA sensor must have to show the module. An on/off here is a good way to show and hide the module.|
| `display`                | `boolean`| If set to false, the sensor will not be added to the table (not shown), you may want to do this if this is the "control" sensor.|

## NotificationConditions options
| Option               | Required | Type | Description |
| -------------------- | -------- | ---- | ----------- |
| `stateVals`          | Yes | `array` | What values the notification should trigger on |
| `negState`           | No  | `boolean` | True if you want the state to be negated. As in, looking for NOT stateVals. Default `false` |
| `notificationVal`    | Yes | `Any` | The value of the notification when trigger is met |
| `notificationValNeg` | No  | `Any` | The value of the notification when trigger is not met (optional) |

### Template options
- Possibility to use %v% in the name and/or unit strings to get the "state" string from the sensor.
- Possibility to use %u% in the name strings to get the "unit" string from the sensor.
- Possibility to use %d% in the name and/or unit strings to get the "last update date" string from the sensor.
- Possibility to use %t% in the name and/or unit strings to get the "last update time" string from the sensor.
- Possibility to use %r% in the name and/or unit strings to get the "last update time" as a readable ("4 hours ago") string from the sensor.
- Possibility to use %m% in the name and/or unit strings to get the "last update time" as a moments string (instead of a the HA string) from the sensor.
- Possibility to use %a% in the name and/or unit and/or replacement value array to get a sensors "address" property. If you use google location sharing you can get the current address of a "device".

## Sensor icon options
| value                | Icon | Description |
| -------------------- | ---- | ----------- |
| `value`              | `icon-name` | You can define a specific [MaterialDesignIcons](https://materialdesignicons.com/) icon or the URL to a picture for a specific value.|
| `default`            | `icon-name` | The default icon for the sensor (if nothing else is specified).|

## Sensor value options
| Value                | New Value | Description |
| -------------------- | --------- | ----------- |
| `value`              | `your new value` | You can define a specific value the will be replaced with this value.|

### Simple configuration (HTTP)

```javascript
{
	module: 'MMM-homeassistant-sensors',
	position: 'top_left',
	config: {
		host: "192.168.1.x",  // IP address or hostname, without http:// or https://
		port: "8123",
		https: false,
		token: "YOUR OWN",
		values: [
			{
				sensor: "sensor.vind_temperature",
			},
			{
				sensor: "sensor.vind_humidity",
			},
		]
	}
},
```

### HTTPS configuration

When connecting to Home Assistant via a domain name or reverse proxy using HTTPS, use port `443` and set `https: true`. Do **not** include `https://` in the `host` value.

```javascript
{
	module: 'MMM-homeassistant-sensors',
	position: 'top_left',
	config: {
		host: "your-ha-domain.example.com",  // No https:// prefix!
		port: "443",
		https: true,
		rejectUnauthorized: true,  // true = require valid CA-signed cert (recommended for public domains)
		                           // false = allow self-signed certs (use for local/internal setups)
		token: "YOUR OWN",
		values: [
			{
				sensor: "sensor.vind_temperature",
			},
			{
				sensor: "sensor.vind_humidity",
			},
		]
	}
},
```

### Result 
![Simple](.github/screen02-simple.png)

### Picture configuration for sensors
- Picture changes depending on status (on/off).
- Values are replaced (on/off) to (in/out).
- Adding values and time to the "names" using the "templates" %v% and %t%.
- Hiding the value from the "value" column.
```
{
	module: 'MMM-homeassistant-sensors',
	position: 'top_left',
	config: {
		host: "IP TO HOME ASSISTANT",
		port: "8123",
		https: false,
		token: "YOUR OWN",
		values: [
			{
				sensor: "binary_sensor.pet_cappuccino",
				name: "Cappuccino went %v% %t%",
				displayvalue: false,
				icons: [{
						"off": "http://10.0.0.30/img/magicmirror/users/Cappuccino-Out-60x60.png",
						"on": "http://10.0.0.30/img/magicmirror/users/Cappuccino-In-60x60.png"
					}
				],
				replace: [{
						"on": "in",
						"off": "out"
					}
				]
			},
			{
				sensor: "binary_sensor.pet_kakan",
				name: "Kakan went %v% %t%",
				displayvalue: false,
				icons: [{
						"off": "http://10.0.0.30/img/magicmirror/users/Kakan-Out-60x60.png",
						"on": "http://10.0.0.30/img/magicmirror/users/Kakan-In-60x60.png"
					}
				],
				replace: [{
						"on": "in",
						"off": "out"
					}
				]
			},
		]
	}
},
```

### CSS Changes
Added the following to my `custom.css` file.
```
.ha-img {
  height: 60px;
  width: 60px;
}
```

### Result 
![Simple+css](.github/screen03-simple+css.png)

### Simple with Icons
- Icon changes depending on status (on/off).
- Values are replaced (on/off) to (Working/Idle).
```
{
	module: 'MMM-homeassistant-sensors',
	position: 'top_left',
	config: {
		host: "IP TO HOME ASSISTANT",
		port: "8123",
		https: false,
		token: "YOUR OWN",
		values: [
			{
				sensor: "binary_sensor.washing_machine",
				name: "Washing Machine",
				icons: [{
						"off": "washing-machine-off",
						"on": "washing-machine"
					}
				],
				replace: [{
						"on": "Working",
						"off": "Idle"
					}
				]
			},
			{
				sensor: "binary_sensor.dishwasher",
				name: "Dishwasher",
				icons: [{
						"off": "dishwasher-off",
						"on": "dishwasher"
					}
				],
				replace: [{
						"on": "Working",
						"off": "Idle"
					}
				]
			},
		]
	}
},
```

### Result 
![Simple+icons](.github/screen04-simple+icons.png)

### Notification Example
```
{
	module: 'MMM-homeassistant-sensors',
	position: 'top_left',
	config: {
		host: "IP TO HOME ASSISTANT",
		port: "8123",
		https: false,
		token: "YOUR OWN",
		// Only sends the notification, does not show any information
		notificationOnly: true,
		updateInterval: 15 * 1000, // 15 seconds
		values: [
			{
				sensor: "sensor.pixel_6a_wifi_connection",
				notificationName: "HOME",
				// Will send a notification titled "HOME", with value true, when the pixel phone connects to a wifi named "MyWifi" or "MyWifi5G"
				// Will send a notification titled "HOME", with value false, when the pixel phone is not connected to these wifi networks.
				notificationConditions: [
					{
						stateVals: ["MyWifi", "MyWifi5G"],
						notificationVal: true,
						notificationValNeg: false
					}
				]
			}
		]
	}
},
```

### Here is the advanced configuration

```
{
	module: 'MMM-homeassistant-sensors',
	position: 'top_left',
	config: {
		host: "IP TO HOME ASSISTANT",
		port: "8123",
		https: false,
		token: "YOUR OWN",
		title: 'Information',
		values: [
			{
				sensor: "device_tracker.360_kidswatch_xplora4",
				name: "Louise är %v%",
				displayvalue: false,
				replace: [{
						"home": "hemma",
						"not_home": "ute",
					}
				]
			},
			{
				sensor: "device_tracker.google_maps_109299643857913851232",
				name: "Camilla är %v%",
				displayvalue: false,
				replace: [{
						"home": "hemma",
						"not_home": "ute",
					}
				]
			},
			{
				sensor: "device_tracker.google_maps_105082325528346759172",
				name: "Erik är %v%",
				displayvalue: false,
				replace: [{
						"home": "hemma",
						"not_home": "ute",
					}
				]
			},
			{
				sensor: "sensor.vind_temperature",
				name: "Temp på vinden %t%",
				icons: [{
						"default": "thermometer"
					}
				]
			},
			{
				sensor: "sensor.vind_humidity",
				name: "Fukt på vinden %t%",
				icons: [{
						"default": "water-percent"
					}
				]
			},
			{
				sensor: "sensor.vardagsrum_temperature",
				name: "Temp i Vardagsrummet %t%",
				icons: [{
						"default": "thermometer"
					}
				]
			},
			{
				sensor: "sensor.vardagsrum_humidity",
				name: "Fukt i Vardagsrummet %t%",
				icons: [{
						"default": "water-percent"
					}
				]
			},
			{
				sensor: "sensor.krypgrund_temperature",
				name: "Temp i Krypgrunden %t%",
				icons: [{
						"default": "thermometer"
					}
				]
			},
			{
				sensor: "sensor.krypgrund_humidity",
				name: "Fukt i Krypgrunden %t%",
				icons: [{
						"default": "water-percent"
					}
				]
			},
			{
				sensor: "media_player.snilles_tv",
				name: "Just nu är TV:n",
				icons: [{
						"default": "television-off",
						"off": "television-off",
						"on": "television"
					}
				],
				replace: [{
						"on": "På",
						"off": "Av",
						"unknown": "Av"
					}
				]
			},
			{
				sensor: "sensor.tv_on_today",
				name: "Timmar TV:n varit på idag",
				defunit: " ",
				},
			{
				sensor: "binary_sensor.pet_cappuccino",
				name: "Cappuccino gick %v% %t%",
				displayvalue: false,
				icons: [{
						"off": "http://10.0.0.30/img/magicmirror/users/Cappuccino-Out-60x60.png",
						"on": "http://10.0.0.30/img/magicmirror/users/Cappuccino-In-60x60.png"
					}
				],
				replace: [{
						"on": "in",
						"off": "ut"
					}
				]
			},
			{
				sensor: "sensor.cappuccinos_outside_time_today",
				name: "Timmar ute idag:",
				defunit: " ",
				replace: [{
						"unknown": "0",
					}
				]
			},
			{
				sensor: "sensor.cappuccinos_trips_outside_today",
				name: "Antal gånger ute idag:",
				defunit: " ",
				replace: [{
						"unknown": "0",
					}
				]
			},
			{
				sensor: "sensor.cappuccino_outside_yesterday",
				name: "Timmar ute igår:",
				defunit: " ",
				replace: [{
						"unknown": "0",
					}
				]
			},
			{
				sensor: "sensor.cappuccinos_trips_outside_yesterday",
				name: "Antal gånger ute igår:",
				defunit: " ",
				replace: [{
						"unknown": "0",
					}
				]
			},
			{
				sensor: "binary_sensor.pet_kakan",
				name: "Kakan gick %v% %t%",
				displayvalue: false,
				icons: [{
						"off": "http://10.0.0.30/img/magicmirror/users/Kakan-Out-60x60.png",
						"on": "http://10.0.0.30/img/magicmirror/users/Kakan-In-60x60.png"
					}
				],
				replace: [{
						"on": "in",
						"off": "ut"
					}
				]
			},
			{
				sensor: "sensor.kakans_outside_time_today",
				name: "Timmar ute idag:",
				defunit: " ",
				replace: [{
						"unknown": "0",
					}
				]
			},
			{
				sensor: "sensor.kakans_trips_outside_today",
				name: "Antal gånger ute idag:",
				defunit: " ",
				replace: [{
						"unknown": "0",
					}
				]
			},
			{
				sensor: "sensor.kakan_outside_yesterday",
				name: "Timmar ute igår:",
				defunit: " ",
				replace: [{
						"unknown": "0",
					}
				]
			},
			{
				sensor: "sensor.kakans_trips_outside_yesterday",
				name: "Antal gånger ute igår:",
				defunit: " ",
				replace: [{
						"unknown": "0",
					}
				]
			},
			{
				sensor: "binary_sensor.washing_machine",
				name: "Tvättmaskinen",
				icons: [{
						"off": "washing-machine-off",
						"on": "washing-machine"
					}
				],
				replace: [{
						"on": "På",
						"off": "Av"
					}
				]
			},
			{
				sensor: "binary_sensor.drying_cabinet",
				name: "Torkskåpet",
				icons: [{
						"off": "tumble-dryer-off",
						"on": "tumble-dryer"
					}
				],
				replace: [{
						"on": "På",
						"off": "Av"
					}
				]
			},
			{
				sensor: "binary_sensor.dishwasher",
				name: "Diskmaskinen",
				icons: [{
						"off": "dishwasher-off",
						"on": "dishwasher"
					}
				],
				replace: [{
						"on": "På",
						"off": "Av"
					}
				]
			},
			{
				sensor: "binary_sensor.coffee_maker",
				icons: [{
						"on": "kettle",
						"off": "kettle-off"
					}
				],
				replace: [{
						"on": "På",
						"off": "Av"
					}
				]
			},
			{
				sensor: "binary_sensor.espresso_machine",
				icons: [{
						"off": "coffee-off",
						"on": "coffee"
					}
				],
				replace: [{
						"on": "På",
						"off": "Av"
					}
				]
			}
		]
	}
},
```

## Special Thanks
- [Michael Teeuw](https://github.com/MichMich) for creating the awesome [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror) project that made this module possible.
- [tkoeberl](https://github.com/tkoeberl) for creating the initial module that I used as guidance in creating this module.
