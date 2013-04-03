jQuery.fn.hoverbox = function (options) {
    var settings = jQuery.extend({
        id: 'tooltip',
        top: 20,
        left: -80
    }, options);

    var handle;

    function tooltip(event) {
        if (!handle) {
            // Create an empty div to hold the tooltip
            handle = $('<div style="position:absolute" id="' + settings.id + '"></div>').appendTo(document.body).hide();
        }

        if (event) {
            // Make the tooltip follow the cursor
            handle.css({
                top: (event.pageY + settings.top) + "px",
                left: (event.pageX + settings.left) + "px"
            });
        }

        return handle;
    }

    this.each(function () {
        $(this).hover(
			function (e) {
			    if (this.title) {
			        // Remove default browser tooltips
			        this.t = this.title;
			        this.title = '';
			        this.alt = '';

			        tooltip(e).html(this.t).fadeIn('fast'); //.animate({ opacity: 0 }, 2000);
			    }
			},
			function () {
			    if (this.t) {
			        this.title = this.t;
			        tooltip().hide();
			    }
			}
		);

        $(this).mousemove(tooltip);
    });
};