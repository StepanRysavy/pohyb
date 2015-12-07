(function (Pohyb, undefined) {
	if (!Pohyb) return;

	var lib = window.Basic = window.Basic = {};

	lib.linear = Pohyb.addEasing("linear", function (from, to, progress, config) {

		config = {}.extend(config || {});

		return {fce: Pohyb.getEasing("bezier"), config: config};
	});

	lib.easeOut = Pohyb.addEasing("easeOut", function (from, to, progress, config) {
		var defaults = {
				points: [
					{x: 0, 	 y: 0},
					{x: 0,   y: 100},
					{x: 0,   y: 100},
					{x: 100, y: 100}
				]
			};

		config = defaults.extend(config || {});
		
		return {fce: Pohyb.getEasing("bezier"), config: config};
	});

	lib.easeIn = Pohyb.addEasing("easeIn", function (from, to, progress, config) {
		var defaults = {
				points: [
					{x: 0, 	 y: 0},
					{x: 100, y: 0},
					{x: 100, y: 0},
					{x: 100, y: 100}
				]
			};

		config = defaults.extend(config || {});
		
		return {fce: Pohyb.getEasing("bezier"), config: config};
	});

	lib.easeInOut = Pohyb.addEasing("easeInOut", function (from, to, progress, config) {
		var defaults = {
				points: [
					{x: 0, 	 y: 0},
					{x: 100, y: 0},
					{x: 0,   y: 100},
					{x: 100, y: 100}
				]
			};

		config = defaults.extend(config || {});
		
		return {fce: Pohyb.getEasing("bezier"), config: config};
	});

	Pohyb.setDefaultEasing(lib.linear);
	
})(Pohyb);