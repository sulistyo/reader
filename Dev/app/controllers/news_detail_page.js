;(function() {
reader.view.NewsDetailPage = reader.view.Base.extend({
    _name: 'NewsDetailPage',
     events: {
				'click a': 'handleLink'
    },

		handleLink: function(e) {
				e.stopPropagation();
				if ($(event.target).hasClass('goback')){
		        reader.nextSlide = "right";
				} else {
						e.preventDefault();
						var ref = window.open($(event.target).attr('href'), '_blank', 'location=yes');
				}
		},

    render: function() {
        var data = {
            V: this
        };
        var that = this;
        data.subject = localStorage['NewsDetailPage::title'];
        data.content = localStorage['NewsDetailPage::content'];
        _.extend(data, this._helpers);
        this.$el.html(this.template(data));
        this.slidePage();
    }
});

reader.view.NewsDetailPage.instance = new reader.view.NewsDetailPage();
})();
