(function() {
	var loggedin = {

		userid: "04:84:FE:12:FF:38:80",

		data: null,
		
		init: function() {
			var that = this;
			var ref = new Firebase("https://nfc-service.firebaseio.com/users/");
			ref.child(this.userid).on('value', $.proxy(this.onUserData,this));
		},

		onUserData: function(snapshot) {
			this.data = snapshot.val();
			if (this.data) {
				
				//user exsist
				var tpl = $(
					'<div class="details-add">'+
						'<h4 class="js-toggle-input">'+
							'<span class="js-title">'+this.data.name+'</span>'+
						'</h4>'+
						'<p>'+this.data.type+'</p>'+
					'</div>'+
					'<div class="details-add">'+
						'<div class="js-toggle-input">'+
							'<span class="js-title">'+this.data.email+'</span>'+
						'</div>'+
					'</div>');

				$('.user-details').append(tpl);
				$('.cta').append($('<a class="btn btn-default" href="services.html" role="button">Browse services</a>'));

			} else {

				// new user
				var tpl = $(
					'<div class="details-add">'+
						'<h4 class="js-toggle-input">'+
							'<span class="glyphicon glyphicon-plus"></span>'+
							'<span class="js-input"><input type="text" name="name" value="Chip name" /></span>'+
							'<span class="js-title">Chip name</span>'+
						'</h4>'+
						'<p>13.56MHz ISO14443A & NFC Type 2 NTAG216 RFID chipset</p>'+
					'</div>'+
					'<div class="details-add">'+
						'<h4 class="js-toggle-input">'+
							'<span class="glyphicon glyphicon-plus"></span>'+
							'<span class="js-input"><input type="text" name="name" value="Your e-mail address" /></span>'+
							'<span class="js-title">Your e-mail address</span>'+
						'</h4>'+
					'</div>');
				$('.user-details').append(tpl);

				$('.cta').append($('<a class="btn btn-default" href="services.html" role="button">Save and browse services</a>'));
			}
		}
	}

	loggedin.init();
})();