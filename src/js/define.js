(function (W, undefined) {
	"use strict";

	window = W;

	var P = {},
		E = {},
		R = window.requestAnimationFrame,
		RC = window.cancelAnimationFrame,
		C = window.Cas = {};

	E.ease = function (from, to, progress, options) {

		var power = 1.30,
			ease = 0,
			breakpoint = 50;

		if (options) {
			power = options.power || power;
			ease = options.ease || ease;
			breakpoint = options.breakpoint || breakpoint;
		}

		progress *= 100;

		if (progress === 0 || progress === 100) {
			progress = progress;
		} else {
			if (ease === 0) {
				if (progress < breakpoint) {
					progress = breakpoint - Math.pow(Math.pow(breakpoint, power) - Math.pow(progress, power), 1/power);
				} else {
					progress = 100 - Math.pow(Math.pow(Math.abs(breakpoint - 100), 1/power) - Math.pow(progress - breakpoint, 1/power), power);
				}
			} else if (ease === -1) {
				progress = 100 - Math.pow(Math.pow(100, 1/power) - Math.pow(progress, 1/power), power);
			} else {
				progress = 100 - Math.pow(Math.pow(100, power) - Math.pow(progress, power), 1/power);
			}
		}

		return (to - from) * (progress / 100);
	};

	E.linear = function (from, to, progress) {
		return E.ease(from, to, progress, {power: 1});
	};

	E.easeOut = function (from, to, progress, config) {
		return E.ease(from, to, progress, extend({power: 1.3, ease: 1}, config || {}));
	};

	E.easeIn = function (from, to, progress, config) {
		return E.ease(from, to, progress, extend({power: 1.3, ease: -1}, config || {}));
	};

	E.easeInOut = function (from, to, progress, config) {
		return E.ease(from, to, progress, extend({power: 1.3, breakpoint: 30}, config || {})); 
	}

	P = window.Pohyb = {
		__easeLibrary: E,
		__anims: [],
		__now: undefined,
		__defaultEasing: E.easeInOut
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

		animation.ease = to.ease || P.__defaultEasing;

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
				if (key === "top") symbol.style.top = params[key] + "px";
				if (key === "opacity") symbol.style.opacity = params[key];

			}
		}
	};

	P.get = function (symbol, params) {

		var o = {};

		if (params.left !== undefined) o.left = (symbol.style.left) ? Number(symbol.style.left.split("px")[0]) : 0;
		if (params.top !== undefined) o.top = (symbol.style.top) ? Number(symbol.style.top.split("px")[0]) : 0;
		if (params.opacity !== undefined) o.opacity = (symbol.style.opacity) ? Number(symbol.style.opacity) : 1;

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