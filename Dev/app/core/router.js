reader.Router = Backbone.Router.extend({
    routes: {
        '*actions': 'defaultAction'
    },

    defaultAction: function(uri) {
				if (uri === '' || uri === null) {
            uri = 'NewsPage';
        }

        var segments = uri.split('/');

        if (!reader.view[segments[0]]) {
            throw new Error('No view match for segments[0]: ' + segments[0]);
        }
        reader.view[segments[0]].instance.render();
    }
});
