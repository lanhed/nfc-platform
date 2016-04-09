(function() {
	var service = {

		userid: "04:84:FE:12:FF:38:80",
		
		serviceId: null,
		serviceKey: null,

		installedServices: [],

		init: function(serviceId) {

			this.serviceId = serviceId;

			var ref = new Firebase("https://nfc-service.firebaseio.com/users/");
			ref.child(this.userid).once('value', $.proxy(this.onUserData, this));
		},

		onUserData: function(snapshot) {
			this.data = snapshot.val();
			var that = this;

			$.each(this.data.installed, function(key, service){
				var uid = service.uid;
				that.installedServices.push(uid);

				if (uid.indexOf(that.serviceId) !== -1) {
					that.serviceKey = key;
				}
				
			});

			that.setupEventListeners();

			that.getData(this.serviceId);

		},

		setupEventListeners: function() {

			$('#service-container').on('click', '.js-toggle-input', function(e) {

				// find changed values
				var _edit = $(this).parent().parent().find('.js-toggle-input.edit');
				var _value = _edit.find('input').val();
				var _title = _edit.find('.js-title');
				_title.text(_value);

				// change back state of element
				_edit.removeClass('edit');

				// change state of clicked element
				$(this).addClass('edit');
				var _input = $(this).find('input');
				_input[0].setSelectionRange(0, _input[0].value.length);

			});

			$('#service-container').on('click', '.btn-danger', $.proxy(this.removeService, this));

			$(document).on('mouseup', function(e) {
				var _container = $('.js-toggle-input.edit');
				if (!_container.is(e.target) && _container.has(e.target).length === 0) {

					var _value = _container.find('input').val();
					var _title = _container.find('.js-title');

					if (_title.text().indexOf(_value) === -1 && _value) {
						// TODO: change icon glyphicon-ok

						// TODO: save value somehow...
						
					}
					_title.text(_value);
					_container.removeClass('edit');
				}
			});

			$('#service-container').on('click','.btn-done', $.proxy(this.saveService, this));
			$('#service-container').on('click','.btn-ok', function(e) {
				window.location.href="services.html"
			});

		},

		saveService: function(e){
			var _container = $('.js-toggle-input.edit');

			var _value = _container.find('input').val();
			var _title = _container.find('.js-title');

			var ref = new Firebase('https://nfc-service.firebaseio.com/users/'+this.userid+'/installed');
			var pushRef = ref.push({'uid':this.serviceId});
			window.location.href="/nfc/services.html";
		},

		removeService: function(e) {
			var ref = new Firebase('https://nfc-service.firebaseio.com/users/'+this.userid+'/installed/'+this.serviceKey);
			ref.remove($.proxy(this.onRemoveComplete, this));
		},

		onRemoveComplete: function(error) {
			if (error) {
				console.log('syncronisation failed');
			} else {
				//window.location.href="services.html";
			}
		},

		getData: function(uid) {

			var that = this;
			var refServices = new Firebase('https://nfc-service.firebaseio.com');
			refServices.child('/services/'+uid).on('value', function(snapshot) {
				var service = snapshot.val();

				var template = $(
					'<div class="service-container" data-service-id="'+uid+'">'+
						'<div class="service-icon"><img src="'+service.image+'" alt="'+service.name+'"></div>'+
						'<div class="service-text">'+
						'<h3>'+service.name+'</h3>'+
						'<p>'+service.short+'</p>'+
					'</div>'+
					'<div class="service-description">'+service.description+'</div>'+
					'<h3>Connect to '+service.name+'</h3>'+

					'<div class="details-container"></div>'+

					'<div><a href="#">Terms & conditions</a></div>'+
					'<div>'+
						'<input id="agree-to-terms" type="checkbox" value="checkbox"> '+
						'<label for="agree-to-terms">I agree to the terms</label>'+
					'</div>'+
					'<button class="btn btn-default btn-done">Done</button>'+
				'</div>');

				var template2 = $(
					'<div class="service-container" data-service-id="'+uid+'">'+
						'<div class="service-icon"><img src="'+service.image+'" alt="'+service.name+'"></div>'+
						'<div class="service-text">'+
						'<h3>'+service.name+'</h3>'+
						'<p>'+service.short+'</p>'+
					'</div>'+
					'<div class="service-description">'+service.description+'</div>'+
					'<div class="details-container"></div>'+
					'<button class="btn btn-default btn-ok">OK</button>'+
					'<button class="btn btn-default btn-danger">Remove</button>'+
				'</div>');

				var fields = service.connection.fields;
				for(var props in fields) {
					var detailsTemplate = $(
						'<div class="details-add">'+
							'<h4 class="js-toggle-input">'+
								'<span class="glyphicon glyphicon-plus"></span>'+
								'<span class="js-input"><input type="text" name="'+props+'" value="'+fields[props]+'" /></span>'+
								'<span class="js-title">'+fields[props]+'</span>'+
							'</h4>'+
						'</div>');
					template.find('.details-container').append(detailsTemplate);
				}

				if (that.installedServices.indexOf(that.serviceId) !== -1) {
					$('#service-container').append(template2);
				} else {
					$('#service-container').append(template);
				}
			});
		}
	};

	service.init(window.location.hash.substr(1));
})();