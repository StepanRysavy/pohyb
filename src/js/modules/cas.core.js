(function (P, undefined) {

	if (P === undefined) {
		console.warn("Pohyb library not found");
		return;
	}

	var listOfTimelines = [];

	function createCas () {

		

		var api = {
			from: null,
			to: null,
			fromTo: null,
			set: null,
			play: null,
			pause: null
		};

		return api;
	}

	function create () {

		var cas = createCas();
		listOfTimelines.push(cas);

		return create
	}

	window.Cas = window.Timeline = {
		create: create
	};

})(window.Pohyb);