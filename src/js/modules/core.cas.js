(function (P, undefined) {

	if (P === undefined) return;

	var listOfTimelines = [];

	function createCas (continous) {

		var tweens = [],
			continous = continous || true,
			previous;

		var api = {
			offset: function (animation, offset) {

				var _offset = offset || 0;

				if (continous === true && tweens.length > 0) {

					previous = tweens[tweens.length - 1];

					var previousTime = previous.timeStart + previous.duration;

					_offset = previousTime + (_offset * 1000) + ((animation.delay || 0) * 1000);

				} else {

					_offset = animation.timeStart + ((animation.delay || 0) * 1000);

				}

				animation.newStartTime(_offset);

				return animation;
			},
			setup: function (animation, offset) {
				animation = api.offset(animation, offset);
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