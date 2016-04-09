(function(){
	var services = {

		userid: "04:84:FE:12:FF:38:80",

		data: null,
		
		installedServices: [],

		init: function() {
			var that = this;

			var ref = new Firebase("https://nfc-service.firebaseio.com/users/");
			ref.child(this.userid).on('value', $.proxy(this.onUserData,this));
		},

		onUserData: function(snapshot) {
			this.data = snapshot.val();
			var that = this;

			$.each(this.data.installed, function(key, service){
				that.installedServices.push(service.uid);
			});

			that.getServices();
		},

		getServices: function() {
			var refServices = new Firebase('https://nfc-service.firebaseio.com');
			refServices.child('services').on('value', $.proxy(this.parseServices, this));
		},

		parseServices: function(snapshot) {

			var serviceContent = $('#services').find('.tab-content');
			var installedContent = $('#home').find('.tab-content');
			var tabs = $('#myTabs');

			var services = snapshot.val();
			
			// empty containers on incoming changes
			tabs.find('#tab-home').removeClass('active');
			$('#home').removeClass('active');
			serviceContent.empty();

			tabs.find('#tab-services').removeClass('active');
			$('#services').removeClass('active');
			installedContent.empty();

			var that = this;
			$.each(services, function(key, service) {
				var template = $(
					'<div class="service-wrapper" data-service-id="'+key+'">'+
						'<div class="service-icon"><img src="'+'http://lanhed.se/nfc/'+service.image+'" alt="'+service.name+'"></div>'+
						'<div class="service-text">'+
							'<h3>'+service.name+'</h3>'+
							'<p>'+service.short+'</p>'+
						'</div>'+
					'</div>');

				if (that.installedServices.indexOf(key) > -1) {
					installedContent.append(template);
				} else {
					serviceContent.append(template);
				}
			});

			if (this.installedServices.length > 0) {
				tabs.find('#tab-home').addClass('active');
				$('#home').addClass('active');
			} else {
				var noServices = $('<div class="service-wrapper no-services">You don\'t have any integrated services.</div>');
				installedContent.append(noServices);
				tabs.find('#tab-services').addClass('active');
				$('#services').addClass('active');
			}
		}
	};

	services.init();
})();