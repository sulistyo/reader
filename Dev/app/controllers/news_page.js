;(function() {

reader.collection.NewsCollection = reader.collection.Base.extend({
    _name: 'NewsCollection',
    url: '',

    fetch: function() {
        var that = this;
        if (google) {
            try {
                if (!google.feeds) {
                    google.load("feeds", "1", {
                        callback: function() {
                            var feed = new google.feeds.Feed(that.url + "?t=" + new Date().getTime());
                            feed.setNumEntries(100);
                            feed.load(function (result) {
                                if (!result.error) {
                                    entries = result.feed.entries;
                                    localStorage["NewsCollection:entries"] = JSON.stringify(entries);
                                    that.reset(entries);
                                }
                            });
                        }
                    });
                } else {

                }
            } catch (ex) {
                console.log(ex);
            }

        }
    }
});

reader.view.NewsPage = reader.view.Base.extend({
    _name: 'NewsPage',
    collection: new reader.collection.NewsCollection(),

    initialize: function() {
        reader.view.Base.prototype.initialize.apply(this, arguments);
    },

		events: {
			 'click a': 'saveData'
		},

    saveData: function(){
      localStorage['NewsDetailPage::title'] = $(event.target).attr('data-title').replace(/-/g, ' ');
			localStorage['NewsDetailPage::content'] = $(event.target).siblings('div.content').html();
    },  

    render: function() {
        var that = this;
        var run = false;
        var fn = function() {
            that.loading(false);
            var data = {
                models: that.collection.models,
                now: new Date()
            };
            _.extend(data, that._helpers);
            that.$el.html(that.template(data));
            that.$el.find('.ui-listview-home > li:first').addClass('first');
            that.$el.find('.ui-listview-home > li:last').addClass('last');
            if (!run) {
                that.slidePage();
                run = true;
            }

            that.createScroll();
        };

        fn();

       if (!this.collection.length) {
/*
            if (navigator.network.connection.type == Connection.NONE){
                var data = {
	                models: that.collection.models,
  	              now: new Date()
                };
                _.extend(data, that._helpers);
                that.$el.html(that.template(data));
                this.slidePage();
                this.loading('No internet connectivity detected, please reconnect and try again!','1');
            } else {
*/
                this.loading('Loading reader News List');
                this.collection.on('reset', fn);
                this.collection.fetch();
//            }
        }

    }
});

reader.view.NewsPage.instance = new reader.view.NewsPage();
})();
