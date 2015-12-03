(function (undefined) {
	"use strict";

	window = window || {};

	var E = window.PohybEase = {
			helpers: {},
			functions: {},
			ease: {}
		},
		P = window.Pohyb = {
			__easeLibrary: E,
			__anims: [],
			__now: undefined,
			__defaultEasing: undefined
		},
		R = window.requestAnimationFrame,
		RC = window.cancelAnimationFrame,
		C = window.Cas = {};

	E.helpers.__bezier = function(t, p0, p1, p2, p3){
		var cX = 3 * (p1.x - p0.x),
			bX = 3 * (p2.x - p1.x) - cX,
			aX = p3.x - p0.x - cX - bX;

		var cY = 3 * (p1.y - p0.y),
			bY = 3 * (p2.y - p1.y) - cY,
			aY = p3.y - p0.y - cY - bY;

		var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
		var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;

		return {x: x, y: y};
	};

	E.functions.bezier = function (from, to, progress, options) {

		if (progress === 0) return from;
		if (progress === 1) return to;

		if (options.points) {
			progress = E.helpers.__bezier(
				progress,
				options.points[0],
				options.points[1],
				options.points[2],
				options.points[3]
			).y / 100;
		} else {
			progress = progress;
		}		

		return (to - from) * (progress);
	};

	E.ease.linear = function (from, to, progress, config) {
		config = {}.extend(config || {});

		return {fce: E.functions.bezier, config: config};
	};

	E.ease.easeOut = function (from, to, progress, config) {
		var defaults = {
				points: [
					{x: 0, 	 y: 0},
					{x: 0,   y: 100},
					{x: 0,   y: 100},
					{x: 100, y: 100}
				]
			};

		config = defaults.extend(config || {});
		
		return {fce: E.functions.bezier, config: config};
	};

	E.ease.easeIn = function (from, to, progress, config) {
		var defaults = {
				points: [
					{x: 0, 	 y: 0},
					{x: 100, y: 0},
					{x: 100, y: 0},
					{x: 100, y: 100}
				]
			};

		config = defaults.extend(config || {});
		
		return {fce: E.functions.bezier, config: config};
	};

	E.ease.easeInOut = function (from, to, progress, config) {
		var defaults = {
				points: [
					{x: 0, 	 y: 0},
					{x: 100, y: 0},
					{x: 0,   y: 100},
					{x: 100, y: 100}
				]
			};

		config = defaults.extend(config || {});

		// if (!config.points) config.points = defaults.points;
		
		return {fce: E.functions.bezier, config: config};
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
						animation.values.now[key] = animation.values.from[key] + animation.ease.fce(
							animation.values.from[key], 
							animation.values.to[key],
							(P.__now - animation.timeStart) / animation.duration,
							animation.ease.config
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

		if (to.ease) {

			if (typeof to.ease === "string") {
				if (E.ease[to.ease]()) {
					animation.ease = E.ease[to.ease]();
				} else {
					animation.ease = P.__defaultEasing();
				}
			} else if (typeof to.ease === "function") {
				animation.ease = {
					fce: to.ease().fce,
					config: {}
				}
			} else if (typeof to.ease === "object") {
				if (to.ease.fce && to.ease.config) {
					animation.ease = to.ease;
				} else if (to.ease.fce) {
					animation.ease = {
						fce: to.ease.fce,
						config: {}
					}
				} else if (to.ease.config) {
					animation.ease = {
						fce: P.__defaultEasing().fce,
						config: to.ease.config
					}
				} else {
					animation.ease = P.__defaultEasing();
				}
			} else {
				animation.ease = P.__defaultEasing();
			}
		} else {
			animation.ease = P.__defaultEasing();
		}

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

	(function () {
		P.__defaultEasing = P.__easeLibrary.ease.easeInOut;
	})(); 

})();