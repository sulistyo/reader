;(function() {
reader.collection.Base = Backbone.Collection.extend({
    initialize: function() {
        if (reader.vars.collection[this._name]) {
            for(var i in reader.vars.collection[this._name]) {
                this[i] = reader.vars.collection[this._name][i];
            }
        }
        Backbone.Collection.prototype.initialize.apply(this, arguments);
    }
});

reader.view.Base = Backbone.View.extend({
    el: '<div class="page" />',
    slide: 'left',

    _helpers: {
        header: _.template($('#template-header').html()),
        header1: _.template($('#template-header1').html()),
        footer: _.template($('#template-footer').html()),
        title: _.template($('#template-title').html())
    },

    initialize: function() {
        if (reader.vars.view[this._name]) {
            for(var i in reader.vars.view[this._name]) {
                this[i] = reader.vars.view[this._name][i];
            }
        }

        var html = $('#template-' + this._name).html();
        if (html) {
            this.template = _.template(html);
            $('body').append(this.$el);
        } else {
            throw new Error('Undefined template for: ' + this._name);
        }
    },

    createScroll: function() {
        window.scrollTo(0, 1);
    },

    slidePage: function(slide, noscroll) {
        var that = this, from, to;

        window.scrollTo(0, 1);
        slide = slide || reader.nextSlide || this.slide || 'left';

        this.loading(false);

        if (reader.nextSlide) {
            reader.nextSlide = null;
        }

        if (!reader.currentPage) {
            $('body').append(this._helpers.footer());
            this.$el.addClass('stage-center').show();
            reader.currentPage = this;
            setTimeout(function() {
                if (!noscroll) {
                    that.createScroll();
                    if (reader.scroll) {
                        setTimeout(function() {
                            reader.scroll.refresh();
                        },500);
                    }
                } else {
                    if (reader.scroll) reader.scroll.destroy();
                    reader.scroll = null;
                }
            }, 100);
            return;
        }


        if (slide == 'left') {
            from = 'stage-right';
            to = 'stage-left';
        } else {
            to = 'stage-right';
            from = 'stage-left';
        }
        that.$el.addClass(from);
        setTimeout(function() {
            that.$el.removeClass(from).addClass('stage-center transition');
            reader.currentPage.$el.removeClass('stage-center').addClass(to + ' transition');
            var fn = function() {
                that.$el[0].removeEventListener('webkitTransitionEnd', fn);
                $('.stage-right, .stage-left').removeClass('stage-right').removeClass('stage-left');

                reader.currentPage = that;
                setTimeout(function() {
                    if (!noscroll) {
                        that.createScroll();
                        if (reader.scroll){
                            setTimeout(function() {
                                reader.scroll.refresh();
                            },500);
                        }
                    } else {
                        if (reader.scroll) reader.scroll.destroy();
                        reader.scroll = null;
                    }
                }, 100);
            };
            that.$el[0].addEventListener('webkitTransitionEnd', fn);
        });

    },

    render: function() {
        var data = {
            V: this
        };
        _.extend(data, this._helpers);
        this.$el.html(this.template(data));
        this.slidePage();
    },

    loading: function(title, mode) {
        if (title === false) {
            $('.ui-loader').fadeOut(function() {
                $(this).remove();
            });
            return;
        }
        if (mode === '1') {
            var $loader = $('<div class="ui-loader"><span class="ui-icon ui-icon-alert"></span><h1>' + title + '</h1></div>');
        } else {
            var $loader = $('<div class="ui-loader"><span class="ui-icon ui-icon-loading"></span><h1>' + title + '</h1></div>');
        }
        $('body').append($loader);
    }
});
})();
