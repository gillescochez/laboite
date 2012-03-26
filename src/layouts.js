/*
	Minimum layout required by laboite
	
	<div class="laboite-wrap">
		<div class="laboite-container">
			<div class="laboite-content"></div>
		</div>
	</div>
	
*/	
	
	// plugin default layouts
	$.laboite.layouts = {
	
		modal: function() {
		
			var layout = '<div class="laboite-wrap laboite-modal">';
					layout += '<a href="#close" class="laboite-close"><span>${close}</span></a>';
					layout += '<div class="laboite-container"><div class="laboite-content"></div></div>';
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
					layout += '<div class="laboite-container"><div class="laboite-content"></div></div>';
				layout += '</div>';
				
			return layout;
		}
	};