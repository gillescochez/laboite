// plugin default layouts
	$.laboite.layouts = {
		modal: function() {
			var layout = '<div class="laboite-wrap laboite-modal">';
					layout += '<a href="#close" class="laboite-close"><span>${close}</span></a>';
					layout += '<div class="laboite-content"></div>';
					layout += '<div class="laboite-controls">';
						layout += '<a href="#previous" class="laboite-button laboite-previous"><span>${previous}</span></a>';
						layout += '<a href="#next" class="laboite-button laboite-next"><span>${next}</span></a>';
						layout += '<a href="#play" class="laboite-button laboite-play"><span>${play}</span></a>';
						layout += '<a href="#pause" class="laboite-button laboite-pause"><span>${pause}</span></a>';
						layout += '<a href="#stop" class="laboite-button laboite-stop"><span>${stop}</span></a>';
						layout += '<span class="laboite-stats"></span>';
					layout += '</div>';
				layout += '</div>';
			return layout;
		},
		inline: function() {
			var layout = '<div class="laboite-wrap laboite-inline">';
					layout += '<div class="laboite-controls">';
						layout += '<a href="#previous" class="laboite-button laboite-previous"><span>${previous}</span></a>';
						layout += '<a href="#next" class="laboite-button laboite-next"><span>${next}</span></a>';
						layout += '<a href="#play" class="laboite-button laboite-play"><span>${play}</span></a>';
						layout += '<a href="#pause" class="laboite-button laboite-pause"><span>${pause}</span></a>';
						layout += '<a href="#stop" class="laboite-button laboite-stop"><span>${stop}</span></a>';
						layout += '<span class="laboite-stats"></span>';
					layout += '</div>';
					layout += '<div class="laboite-content"></div>';
				layout += '</div>';
			return layout;
		},
		popup: function() {
			var layout = '<!DOCTYPE html><html><title></title><body>';
				layout += '<div class="laboite-wqrap  laboite-popup">';
					layout += '<a  href="#close" class="laboite-button laboite-close"><span>Close</span></a>';
					layout += '<div class="laboite-content"></div>';
					layout += '<div class="laboite-controls">';
						layout += '<a href="#previous" class="laboite-button laboite-previous"><span>${previous}</span></a>';
						layout += '<a href="#next" class="laboite-button laboite-next"><span>${next}</span></a>';
						layout += '<a href="#play" class="laboite-button laboite-play"><span>${play}</span></a>';
						layout += '<a href="#pause" class="laboite-button laboite-pause"><span>${pause}</span></a>';
						layout += '<a href="#stop" class="laboite-button laboite-stop"><span>${stop}</span></a>';
						layout += '<span class="laboite-stats"></span>';
					layout += '</div>';
				layout += '</div></body></html>';
			return layout;
		}
	};