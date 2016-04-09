(function(){

	var app = {

		init: function() {

			this.setupEventListeners();

		},

		setupEventListeners: function() {

			$('#myTabs a').click(function (e) {
				e.preventDefault()
				$(this).tab('show')
			});

			$('.tab-content').on('click', '.service-wrapper', function(e) { 
				window.location.href="/nfc/service.html#"+$(e.currentTarget).data('service-id');
			});

		}

	};

	app.init();
})();