;(function() {
    window.reader = {
        debug: false,
        view: {},
        collection: {},

        initialize: function() {
            this.bindEvents();

            var fn = function() {
                reader.registerEvents();

                reader.Router.instance = new reader.Router();
                Backbone.history.start({
                    pushState: false
                });

            };
            if (reader.debug) {
                reader.load(CONF.files, fn);
            } else {
                fn();
            }
        },

        bindEvents: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },
        onDeviceReady: function() {
            // alert(device.name + '--' + device.cordova + '--' + device.platform + '--' + device.uuid + '--' + device.version);
        },
        datediff: function (fromDate, toDate) {
            /*
            * DateFormat month/day/year hh:mm:ss
            * ex.
            * datediff('01/01/2011 12:00:00','01/01/2011 13:30:00','seconds');
            */
            var second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24, week = day * 7;
            fromDate = new Date(fromDate);
            toDate = new Date(toDate);
            var timediff = toDate - fromDate;
            if (isNaN(timediff)) return NaN;
            var yr = toDate.getFullYear() - fromDate.getFullYear();
            var mnth = ((toDate.getFullYear() * 12 + toDate.getMonth()) - (fromDate.getFullYear() * 12 + fromDate.getMonth()));
            var wek = Math.floor(timediff / week);
            var dys = Math.floor(timediff / day);
            var hrs = Math.floor(timediff / hour);
            var mins = Math.floor(timediff / minute);
            var secs = Math.floor(timediff / second);

	         	if (timediff > 31536000000) {
                if (yr > 1)
                    return yr + " years ago";
                else return yr + " year ago";

            }
            else {
                if (mnth > 0) {
                    if (mnth > 1)
                        return mnth + " months ago";
                    else
                        return mnth + " month ago";
                }
                else {
                    if (dys > 1) { 
      	                if (dys == 1){
  		                      return "yesterday";
	                      } else {
                        		return dys + " days ago";
                      	}
                    } else {
                        if (hrs > 0) { return hrs + " hours ago"; }
                        else {
                            if (mins > 0) { return mins + " minutes ago"; }
                            else {
                                if (secs > 0) return secs + " seconds ago";
                            }

                        }
                    }

                }


            }


        },

        load: function(url, callback) {
            if (!Array.isArray(url)) {
                url = [ url ];
            }

            if (!reader.debug) {
                callback();
                return;
            }

            url.unshift(0);
            url[0] = 'app/config/var.js';

            $.ajaxSetup({
                cache: false
            });

            var fn = function(item, cb) {
                var a = item.split('/');
                a = a[a.length - 1];
                a = a.split('.');

                if (a[1] == 'html') {
                    $.get(item, function(data) {
                        var $script = $('<sc' + 'ript type="text/template" id="template-' + a[0] + '"></sc' + 'ript>');
                        $script.html(data).appendTo('body');
                        cb();
                    });
                } else {
                    $.getScript(item, function(script, textStatus) {
                        cb();
                    }, function(jqxhr, settings, exception) {
                        console.error('Something error happen when loading', item, exception);
                        cb(exception);
                    }).fail(function(a, b, c) {
                        console.error(arguments);
                        console.error(item);
                    });
                }
            };

            async.forEachSeries(url, fn, function(err) {
                if (err) {
                    console.error(err);
                } else {
                    callback();
                }
            });
        },

        showPopup: function(templateId, data) {
            if (!reader.view.Popup.instance) {
                reader.view.Popup.instance = new reader.view.Popup();
            }
            reader.view.Popup.instance.render({
                templateId: templateId,
                data: data
            });
        },

        registerEvents: function() {
            // document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

            var self = this;
            var fnAdd = function(event) {
                // event.stopImmediatePropagation();
                var $target = $(event.target);
                var $a = $(event.target);
                if (event.target.tagName != 'A') {
                    $a = $target.parent('a');
                    $target = $target.parent('a, .ui-btn');
                }
                $target.addClass('tap');
                $target.parent('.ui-btn').addClass('tap');

                var url = $a.attr('data-url');

                if (url) {
                    localStorage['URLPage::url'] = url;
                }
            };
            var fnRemove = function(event) {
                // event.stopImmediatePropagation();
                var $target = $(event.target);
                if (event.target.tagName != 'A') {
                    $target = $target.parent('a');
                }
                $target.removeClass('tap');
                $target.parent('.ui-btn').removeClass('tap');
            };

            if (document.documentElement.hasOwnProperty('ontouchstart')) {
                $('body').on('touchstart', 'a', fnAdd);
                $('body').on('touchend', 'a', fnRemove);
            } else {
                $('body').on('mousedown', 'a', fnAdd);
                $('body').on('mouseup', 'a', fnRemove);
            }

            window.addEventListener('orientationchange', function () {
                window.scrollTo(0, 1);
                // reader.currentPage.$el.addClass('hide');
                setTimeout(function() {
                    if (reader.view.CountyMapPage.instance == reader.currentPage) {
                        reader.currentPage.tryRender();
                    }
                    // reader.currentPage.$el.removeClass('hide');
                }, 400);
            }, false);
        }
    };
})();
