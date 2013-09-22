define(['SocialNetView', 'text!templates/profiles.html', 'text!templates/status.html', 'models/Status', 'views/Status'], 
	function(SocialNetView, profileTemplate, statusTemplate, Status, statusView){
	var profileView =SocialNetView.extend({
		el : $('#content'),

		initialize : function(){
			this.model.on('change', this.render, this);
		},

		render : function(){
			this.$el.html(_.template(profileTemplate, this.model.toJSON()));
			


			var statusCollection = this.model.get('status');
			if(null !=statusCollection){
				_.each(statusCollection, function(statusJson){
					var 	statusModel 	= new Status(statusJson),
						statusHtml 	= (new StatusView({model : statusModel})).render.el;
					$(statusHtml).prependTo('.status_list').hide().fadeIn('slow');

				});
			}
			return this;


		}

	});

	return profileView;
});