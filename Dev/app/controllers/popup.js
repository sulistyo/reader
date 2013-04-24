(function() {
    reader.view.Popup = Backbone.View.extend({
        el: '<div class="ui-popup-placeholder" />',

        events: {
            'click .ui-popup-overlay': 'close',
            'click .ui-popup-close': 'close'
        },

        close: function(evt) {
            evt.preventDefault();
            evt.stopImmediatePropagation();
            this.hide();
            return false;
        },

        initialize: function() {
            this.$el.appendTo('body');
        },

        hide: function() {
            this.$el.hide();
        },

        render: function(options) {
            console.log($('#' + options.templateId));
            var template = _.template('<div class="ui-popup-overlay" /><div class="ui-popup"><a href="#" class="ui-popup-close">x</a>' + $('#template-' + options.templateId).html() + '</div>');
            this.$el.html(template(options.data.toJSON()));
            this.$el.show();
            var $popup = $('.ui-popup');
            $popup.css({
                'left': ($(window).width() - $popup.width()) / 2,
                'top': ($(window).height() - $popup.height()) / 2
            });
        }
    });
})();
