(function (W, undefined) {
	"use strict";

	window = W;

	var P = window.Pohyb = {
			__easeLibrary: {},
			__anims: [],
			__now: undefined
		},
		E = P.__easeLibrary,
		R = window.requestAnimationFrame,
		RC = window.cancelAnimationFrame,
		C = window.Cas = {};

	E.linear = function (from, to, progress) {
		return (to - from) * progress;
	};

	P.__debug = function () {
		console.log(arguments);
	};

	P.__animate = function (animation) {

		if (P.__now > animation.timeEnd) {
			animation.values.now = P.__translate(animation.values.to);
		} else {
			if (P.__now > animation.timeStart && animation.run === false) {

				animation.run = true;

				animation.values.from = P.__translate(animation.settings.from || P.get(animation.of, animation.settings.to));
				animation.values.now = P.__translate(animation.settings.from || P.get(animation.of, animation.settings.to));
				animation.values.to = P.__translate(animation.settings.to || P.get(animation.of, animation.settings.from));
				
			}

			if (animation.run === true) {

				for (var key in animation.values.now) {
					if (animation.values.now.hasOwnProperty(key)) {
						animation.values.now[key] = animation.values.from[key] + animation.ease(
							animation.values.from[key], 
							animation.values.to[key],
							(P.__now - animation.timeStart) / animation.duration
						);
					}
				}

			}
		}

		P.set(animation.of, animation.values.now);
	};

	P.__check = function (animation) {

		if (animation.timeEnd < P.__now) {
			animation.run = false;
			P.__debug("End", animation.of);
			P.__anims.splice(P.__anims.indexOf(animation), 1);
		}

		if (P.__anims.length === 0) {
			P.__debug("End animation");
			RC(P.__tick);
		}

	};

	P.__tick = function () {

		P.__now = Date.now();

		P.__anims.forEach(function (animation) {
			P.__animate(animation);
			P.__check(animation);
		});

		R(P.__tick);
	};

	P.__addAnim = function (animation) {
		P.__anims.push(animation);
	};

	P.__translate = function (params) {
		return params;
	};

	P.__create = function (symbol, time, from, to, now) {

		if (P.__anims.length === 0) {
			P.__debug("Start animation");
			R(P.__tick);
		}

		var animation = {};

		animation.of = symbol;
		animation.time = time;
		animation.delay = to.delay || 0;
		animation.run = false;

		animation.timeStart = now + animation.delay * 1000;
		animation.timeEnd = animation.timeStart + animation.time * 1000;
		animation.duration = animation.time * 1000;

		animation.ease = to.ease || E.linear;

		animation.values = {};

		animation.settings = {};
		animation.settings.from = from;
		animation.settings.to = to;

		P.__addAnim(animation);

		P.__debug("New", animation.of);
	};

	P.set = function (symbol, params) {

		for (var key in params) {
			if (params.hasOwnProperty(key)) {

				if (key === "left") symbol.style.left = params[key] + "px";

			}
		}
	};

	P.get = function (symbol, params) {

		var o = {};

		if (params.left !== undefined) o.left = symbol.offsetLeft || 0;

		return o;
	};

	P.to = function (symbol, time, to) {
		P.fromTo(symbol, time, undefined, to);
	};

	P.from = function (symbol, time, from) {
		P.fromTo(symbol, time, from, undefined);
	};

	P.fromTo = function (symbol, time, from, to) {

		var now = Date.now();

		if (symbol.length) {
			symbol.forEach(function (s) {
				P.__create(s, time, from, to, now);
			});
		} else {
			P.__create(symbol, time, from, to, now);
		}
	};

})(window || {});