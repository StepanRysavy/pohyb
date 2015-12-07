(function (P, undefined) {

	if (P === undefined) return;

	var listOfTimelines = [];

	function createCas (continous) {

		var tweens = [],
			continous = continous || true,
			previous;

		var api = {
			offset: function (animation, offset) {

				offset = offset || 0;

				if (continous === true && tweens.length > 0) {

					previous = tweens[tweens.length - 1];

					offset = (previous.timeStart - animation.timeStart + previous.duration) / 1000 + offset - animation.delay;

				}

				animation.offset(offset);
			},
			setup: function (animation, offset) {
				api.offset(animation, offset);
				tweens.push(animation);
			},
			to: function (symbol, time, to, offset) {

				var animation = P.to(symbol, time, to);
				api.setup(animation, offset);

			},
			from: function (symbol, time, from, offset) {

				var animation = P.from(symbol, time, from);
				api.setup(animation, offset);

			},
			fromTo: function (symbol, time, from, to, offset) {

				var animation = P.from(symbol, time, from);
				api.setup(animation, offset);

			},
			set: function (symbol, to, offset) {
				var animation = P.to(symbol, 0, to);
				api.setup(animation, offset);
			},
			pause: function () {
				tweens.forEach(function (animation) {
					animation.pause();
				});
			}, 
			play: function () {
				tweens.forEach(function (animation) {
					animation.play();
				});
			}
		};

		return api;
	}

	window.Cas = function () {

		var cas = createCas();
		listOfTimelines.push(cas);

		return cas;
	}

})(window.Pohyb);