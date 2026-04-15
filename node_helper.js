var NodeHelper = require('node_helper');
var http = require('http');
var https = require('https');

module.exports = NodeHelper.create({
    start: function () {
        console.log('MMM-homeassistant-sensors helper started...');
    },

	// Fetches a single URL using Node's http/https modules.
	// Supports self-signed certificates via config.rejectUnauthorized = false.
	fetchUrl: function (url, headers, config) {
		return new Promise(function (resolve, reject) {
			var urlObj = new URL(url);
			var isHttps = urlObj.protocol === 'https:';
			var requestModule = isHttps ? https : http;
			var rejectUnauthorized = config.rejectUnauthorized !== false;

			var reqOptions = {
				hostname: urlObj.hostname,
				port: urlObj.port || (isHttps ? 443 : 80),
				path: urlObj.pathname + (urlObj.search || ''),
				method: 'GET',
				headers: headers,
				rejectUnauthorized: rejectUnauthorized
			};

			if (config.debuglogging) {
				console.log('MMM-homeassistant-sensors: Fetching', url, '(rejectUnauthorized:', rejectUnauthorized + ')');
			}

			var req = requestModule.request(reqOptions, function (res) {
				var data = '';
				res.on('data', function (chunk) { data += chunk; });
				res.on('end', function () {
					try {
						resolve(JSON.parse(data));
					} catch (e) {
						reject(new Error('JSON parse error: ' + e.message + ' — body: ' + data.substring(0, 200)));
					}
				});
			});

			req.on('error', reject);
			req.end();
		});
	},

	// Builds the request...
	getStats: function (config) {
		var self = this;
		var id = config.id;
		config = config.config;
		var headers = {
			'Content-Type': 'application/json'
		};
		// Wee need the token!
		if(config.token.length > 1) {
			if(config.debuglogging) { console.log('MMM-homeassistant-sensors: Adding token', config.token) }
			headers['Authorization'] = 'Bearer ' + config.token;
		}
		// Builds all the urls.
		const urls = config.values.map(sensor => self.buildUrl(config, sensor.sensor));
		// Fetches all the data.
		const promises = urls.map(url => self.fetchUrl(url, headers, config));
		Promise.all(promises)
			.then(data => {
				if (config.debuglogging) { console.log('MMM-homeassistant-sensors response successful. calling STATS_RESULT') }
				self.sendSocketNotification('STATS_RESULT', { id: id, data: data });
			})
			.catch(error => {
				console.error('MMM-homeassistant-sensors ERROR:', error.message || error);
			});
	},
	
	// The actual building of each url to be fetched.
	buildUrl: function(config, sensor) {
		if(config.debuglogging) { console.log('MMM-homeassistant-sensors: Configured Sensors: ', config.values); }
		// Strip any protocol prefix the user may have included in host
		var url = config.host.replace(/^https?:\/\//, '');
		if (config.port) {
			url = url + ':' + config.port;
		}
		
		// Building the url containing the sensor in "values".
		if(config.debuglogging) { console.log('MMM-homeassistant-sensors: Requested Sensors: ', sensor); }
		url = url + '/api/states/' + sensor;
		
		// If a password is used (you should not REALLY, use a long lived token instead!).
		if (config.apipassword.length > 1) {
			url = url + '&api_password=' + config.apipassword;
		}
		if (config.https) {
			url = 'https://' + url;
		} else {
			url = 'http://' + url;
		}
		if(config.debuglogging) { console.log("MMM-homeassistant-sensors: buildUrl:", url); }
		return url;
	},

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_STATS') {
            this.getStats(payload);
        }
    }
});
