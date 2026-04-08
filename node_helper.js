var NodeHelper = require('node_helper');

module.exports = NodeHelper.create({
    start: function () {
        if(config.debuglogging) { console.log('MMM-homeassistant-sensors helper started...') };
    },

	// Builds the request...
	getStats: function (config) {
		var self = this;
		var id = config.id;
		config = config.config;
		var get_options = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		};
		// Wee need the token!
		if(config.token.length > 1) {
			if(config.debuglogging) { console.log('MMM-homeassistant-sensors: Adding token', config.token) }
			get_options.headers['Authorization'] = 'Bearer ' + config.token;
		}
		// Builds all the urls.
		const urls = config.values.map(sensor => self.buildUrl(config, sensor.sensor));
		// Fetches all the data.
		const promises = urls.map(url => fetch(url, get_options));
		Promise.all(promises)
			.then(responses => Promise.all(responses.map(r => r.json())))
			.then(data => {
				// Returning the j-son element...
				return data
			})
			.then(body => {
				if (config.debuglogging) { console.log('MMM-homeassistant-sensors response successful. calling STATS_RESULT') }
				self.sendSocketNotification('STATS_RESULT', { id: id, data: body });
			})
			.catch(error => {
				if (config.debuglogging) {
					console.error('MMM-homeassistant-sensors ERROR:', error);
				}
			});
	},
	
	// The actual building of each url to be fetched.
	buildUrl: function(config, sensor) {
		if(config.debuglogging) { console.log('MMM-homeassistant-sensors: Configured Sensors: ', config.values); }
		var url = config.host;
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
