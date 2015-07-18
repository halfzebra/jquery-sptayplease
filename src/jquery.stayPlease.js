;(function ( $, window, document, undefined ) {
    'use strict';

    var pluginName = 'stayPlease',
        defaults = {
            offset: '',
            until: '',
            wrapperClass: 'js-stay-please_home'
        };

    function Plugin ( element, options ) {

        this.element = element;

        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {

        init: function () {

            this.initialPlacement = this.getPlacementInfo(this.element);

            var that = this,
                $window = $(window),
                $el = $(this.element),
                $wrap = $el.wrap('<div class="' + this.settings.wrapperClass + '"></div>').parent(),
                $until = $(this.settings.until),
                untilPlacement = this.getPlacementInfo($until[0]);

            this.edge = untilPlacement.top + untilPlacement.height;
            this.end = this.edge - this.initialPlacement.height - this.initialPlacement.top;

            this.stop = {
                'position': 'absolute',
                'left': 0,
                'top': this.end,
                'width': this.initialPlacement.width
            };

            this.follow = {
                'position': 'fixed',
                'left': this.initialPlacement.left,
                'top': this.settings.offset,
                'width': this.initialPlacement.width
            };

            $wrap.css({'position': 'relative'});

            this.doTheMoves();

            $window.on('scroll', $.proxy(that.doTheMoves, this));
        },
        getPlacementInfo: function (el) {

            var viewportOffset = el.getBoundingClientRect(),
                placement = {
                    'height': el.offsetHeight,
                    'width': el.offsetWidth,
                    'top': (viewportOffset.top > 0) ? viewportOffset.top : -viewportOffset.top,
                    'left': viewportOffset.left
                };

            return placement;
        },
        doTheMoves: function () {

            console.log(this);

            var $window = $(window),
                $el = $(this.element),
                progress = 0;

            if ($window.scrollTop() > this.initialPlacement.top) {

                progress = $window.scrollTop() + this.initialPlacement.height;

                if (this.edge < progress) {
                    $el.css(this.stop);
                } else {
                    $el.css(this.follow);
                }

            } else {
                $el.attr('style', '');
            }
        }
    });

    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, 'plugin_' + pluginName ) ) {
                $.data( this, 'plugin_' + pluginName, new Plugin( this, options ) );
            }
        });
    };

})( jQuery, window, document );