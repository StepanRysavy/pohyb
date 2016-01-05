(function (Pohyb, undefined) {
	if (!Pohyb) return;

	var lib = window.Back = window.Back || {};

	lib.easeOut = Pohyb.addEasing("backOut", function (from, to, progress, config) {
		var defaults = {
				points: [
					{x: 0, 	 y: 0},
					{x: 0,   y: 150},
					{x: 50,  y: 100},
					{x: 100, y: 100}
				]
			};

		config = defaults.extend(config || {});
		
		return {fce: Pohyb.getEasing("bezier"), config: config};
	});

	lib.easeIn = Pohyb.addEasing("backIn", function (from, to, progress, config) {

		var defaults = {
				points: [
					{x: 0, 	 y: 0},
					{x: 50,  y: 0},
					{x: 100, y: -50},
					{x: 100, y: 100}
				]
			};

		config = defaults.extend(config || {});
		
		return {fce: Pohyb.getEasing("bezier"), config: config};
	});

	lib.easeInOut = Pohyb.addEasing("backInOut", function (from, to, progress, config) {
		var defaults = {
				points: [
					{x: 0, 	 y: 0},
					{x: 5,  y: 0},
					{x: 30,  y: -200},
					{x: 70,  y: 400},
					{x: 95,  y: 100},
					{x: 100, y: 100}
				]
			};

		config = defaults.extend(config || {});

		// if (!config.points) config.points = defaults.points;
		
		return {fce: Pohyb.getEasing("path"), config: config}; 
	});
	
})(Pohyb);