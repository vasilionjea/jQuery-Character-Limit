/**
 * name:            Limit
 * version:         0.0.1
 * author:          Billy Onjea  (istocode.com)
 * description:     A jQuery Plugin that limits amount of characters in a textarea or contentEditable element
 * homepage:        http://istocode.com/shared/javascript/jquery/limit
 * files:           limit.js, jquery.js 
 * license:         GNU GPLv2 or higher
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Copyright (C) 2012  Billy Onjea
 * GPL License url: www.gnu.org/licenses/gpl-2.0.txt
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
**/
;(function($) {
	$.fn.limit = function(options) {
		var settings = $.extend({}, $.fn.limit.defaults, options);

		//Initialize
		return this.each(function(i) {
			var $this = $(this), 
			labelContent = '<div class="remaining">' + settings.label + '&nbsp; <span class="count">' + settings.maxlength + '</span></div>', 
			$count;

			//Handle insert
			switch(settings.visible) {
				case 'before':
				case 'after':
					if (settings.visible === 'before') {
						$this.before(labelContent);
						$count = $this.prev().find('.count');
					}

					if (settings.visible === 'after') {
						$this.after(labelContent);
						$count = $this.next().find('.count');
					}					

					//Add maxlength on input/textarea elements
					$this.attr('maxlength', settings.maxlength);
					break;

				case false: //TODO: Handle without an insert in page when false
					$this.before(labelContent);
					$count = $this.prev().find('.count');

					//Add maxlength on input/textarea elements
					$this.attr('maxlength', settings.maxlength);
					$count.parent().remove();	
					break;			
			}

			//Update Chars
			var update = function() {
				//Initially remove any error classes
				$count.removeClass('error');
				
				var countTextNumber = $count.text()*1; 

				//Calculate remaining characters
				var remaining_chars = settings.maxlength - ($this.val().length || $this.text().length); //val() for input or text() for contentEditable

				if (remaining_chars === 0 || remaining_chars < 0) {
					$count.addClass('error');

					if ($this.attr('contenteditable')) {
						var strText = $this.text();
						$this.text(strText.slice(0, settings.maxlength));

						$this.blur(); //not a fix - maybe I should just preventDefault()
					} else {
						//Don't rely on dynamic maxlength attr - slice text if maxlength doesn't have the expected value
						if ($this.attr('maxlength')*1 !== settings.maxlength) {
							var strVal = $this.val();
							$this.val(strVal.slice(0, settings.maxlength));

							//console.log('maxlength attr was hacked - therefore input value was sliced!');
						}
					}
				}

				//Update count label if needed
				if (countTextNumber !== remaining_chars) {
					$count.text(remaining_chars);
				}
			};			

			$this.on('input keyup paste', function(e) {
				setTimeout(update, 0); //makes sure that the update function executes last (after all events are fired) in the call stack
			});

			//Call update at first in case input is pre-filled
			update();
		});
	};

	//Default Settings
	$.fn.limit.defaults = {
		maxlength: 300,
		label: 'Remaining:',
		visible: 'before'
	};
}(jQuery));