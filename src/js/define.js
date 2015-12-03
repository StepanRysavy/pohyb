(function (undefined) {
	"use strict";

	window = window || {};

	var E = {
			helpers: {},
			functions: {},
			ease: {}
		},
		S = {
			helpers: {},
			functions: {},
			maps: {}
		},
		P = window.Pohyb = {
			__easing: E,
			__params: S,
			__anims: [],
			__now: undefined,
			__defaultEasing: undefined,
			__threshold: 0.01
		},
		R = window.requestAnimationFrame,
		RC = window.cancelAnimationFrame,
		C = window.Cas = {};

	S.helpers.__map = function (name, to, defaults) {

		var args;

		S.maps[name] = {
			get: function () {

				args = Array.prototype.slice.call(arguments)
				args.unshift(name);
				args.push(defaults);

				return S.functions[to].get.apply(this, args);
			},
			set: function () {

				args = Array.prototype.slice.call(arguments)
				args.unshift(name);

				S.functions[to].set.apply(this, args);
			}
		}
	};

	S.map = S.helpers.map = function (arr, to, defaults) {
		for (var i=0; i<arr.length; i++) {
			S.helpers.__map(arr[i], to, defaults);
		}
	};

	S.functions.val = {
		get: function () {
			return (arguments[1].style[arguments[0]] && arguments[1].style[arguments[0]] != "") ? Number(arguments[1].style[arguments[0]]) : (arguments[2] || 0);
		},
		set: function () {
			arguments[1].style[arguments[0]] = arguments[2];
		}
	};

	S.functions.px = {
		get: function () {
			return (arguments[1].style[arguments[0]]) ? Number(arguments[1].style[arguments[0]].split("px")[0]) : (arguments[2] || 0);
		},
		set: function () {
			arguments[1].style[arguments[0]] = arguments[2] + "px";
		}
	};

	E.helpers.bezier = function(t, p0, p1, p2, p3){
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

		if (progress < P.__threshold) progress = 0;
		if (progress > 1 - P.__threshold) progress = 1;

		if (options.points && progress > 0 && progress < 1) {
			progress = E.helpers.bezier(
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

		config = defaults.extend(config || {});

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

			if (animation.onComplete) animation.onComplete();
			
			animation.run = false;

			P.__anims.splice(P.__anims.indexOf(animation), 1);

			if (P.__anims.length === 0) {
				P.__debug("End animation");
				RC(P.__tick);
			}

		} else {
			if (P.__now > animation.timeStart && animation.run === false) {

				animation.run = true;

				if (animation.onStart) animation.onStart();

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

				if (animation.onUpdate) animation.onUpdate();

			}
		}

		P.set(animation.of, animation.values.now);
	};

	P.__tick = function () {

		P.__now = Date.now();

		P.__anims.forEach(function (animation) {
			P.__animate(animation);
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

		animation.onStart = from ? from.onStart : to ? to.onStart : undefined;
		animation.onUpdate = from ? from.onUpdate : to ? to.onUpdate : undefined;
		animation.onComplete = from ? from.onComplete : to ? to.onComplete : undefined;

		P.__addAnim(animation);

		P.__debug("New", animation.of);
	};

	P.set = function (symbol, params) {

		for (var key in params) {
			if (params.hasOwnProperty(key)) {
				if (S.maps[key]) S.maps[key].set(symbol, params[key]);
			}
		}

	};

	P.get = function (symbol, params) {

		var o = {};

		for (var key in S.maps) {
			if (S.maps.hasOwnProperty(key)) {
				if (params[key] !== undefined) o[key] = S.maps[key].get(symbol);
			}
		}

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
		P.__defaultEasing = P.__easing.ease.easeInOut;

		S.map(["left", "right", "top", "bottom"], "px", 0);
		S.map(["opacity"], "val", 1);

	})(); 

})();