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
		P = window._pohybDebugFile = {
			easing: E,
			parameters: S,
			tweens: [],
			__now: undefined,
			__defaultEasing: undefined,
			__threshold: 0.01
		},
		R = window.requestAnimationFrame,
		RC = window.cancelAnimationFrame;



	E.addFunction = function (name, cb) {
		E.functions[name] = cb;

		return cb;
	}

	E.addHelper = function (name, cb) {
		E.helpers[name] = cb;

		return cb;
	}

	E.addEasing = function (name, cb) {
		E.ease[name] = cb;

		return cb;
	}

	E.getEasing = function (name) {
		return E.functions[name];
	}

	E.setDefault = function (easing) {
		P.__defaultEasing = easing;
	}

	S.helpers.map = function (name, to, defaults, propertyName) {

		var args;

		S.maps[name] = {
			get: function () {

				args = Array.prototype.slice.call(arguments)
				args.unshift(name);
				args.push(defaults, propertyName || name);

				return S.functions[to].get.apply(this, args);
			},
			set: function () {

				args = Array.prototype.slice.call(arguments)
				args.unshift(name);
				args.push(propertyName || name);

				S.functions[to].set.apply(this, args);
			},
			parse: function () {

				args = Array.prototype.slice.call(arguments)
				args.unshift(name);
				args.push(defaults, propertyName || name);

				return S.functions[to].parse.apply(this, args);

			}
		}
	};

	S.addParameter = function (arr, to, defaults, propertyName) {
		for (var i=0; i<arr.length; i++) {
			S.helpers.map(arr[i], to, defaults, propertyName);
		}
	};

	S.addFunction = function (name, obj) {
		S.functions[name] = obj;

		return obj;
	}

	S.addHelper = function (name, cb) {
		S.helpers[name] = cb;

		return cb;
	}

	P.__debug = function () {
		console.log(arguments);
	};

	P.__animate = function (animation) {

		if (animation.suspend === true) return;

		if (P.__now > animation.timeStart + animation.duration) {

			P.set(animation.of, P.parse(animation.settings.to));

			if (animation.onComplete) animation.onComplete();
			
			animation.run = false;

			P.tweens.splice(P.tweens.indexOf(animation), 1);

			if (P.tweens.length === 0) {
				RC(P.__tick);
			}

		} else {

			if (P.__now > animation.timeStart && animation.run === false) {

				animation.run = true;

				if (animation.onStart) animation.onStart();

				animation.values.from = P.parse(animation.settings.from) || P.get(animation.of, animation.settings.to);
				animation.values.to = P.parse(animation.settings.to) || P.get(animation.of, animation.settings.from);
				animation.values.now = {};
				
				var backup = P.get(animation.of, animation.settings.to);

				for (var key in animation.values.to) {
					if (animation.values.to.hasOwnProperty(key)) {
						animation.values.now[key] = animation.values.from ? animation.values.from[key] : backup[key];
					}
				}

			}

			if (animation.run === true) {

				animation.progress = (P.__now - animation.timeStart) / animation.duration;

				for (var key in animation.values.now) {
					if (animation.values.now.hasOwnProperty(key)) {

						animation.values.now[key] = [];

						animation.values.from[key].forEach(function (value, index) {
							animation.values.now[key][index] = value + animation.ease.fce(
								animation.progress,
								value, 
								animation.values.to[key][index],
								animation.ease.config
							);
						});
					}
				}

				if (animation.onUpdate) animation.onUpdate();

				P.set(animation.of, animation.values.now);


			}
		}
	};

	P.__tick = function () {

		P.__now = Date.now();

		P.tweens.forEach(function (animation) {
			P.__animate(animation);
		});

		R(P.__tick);
	};

	P.__create = function (symbol, time, from, to, now) {

		if (P.tweens.length === 0) {
			R(P.__tick);
		}

		if (to === undefined) {
			to = P.get(symbol, from);			
			if (from.ease) to.ease = from.ease;
			if (from.delay) to.delay = from.delay; 
		}

		if (from !== undefined) {
			P.set(symbol, from);
		}

		var animation = {};

		animation.of = symbol;
		animation.time = time;
		animation.delay = to.delay || 0;
		animation.run = false;
		animation.suspend = false;

		animation.timeStart = now + animation.delay * 1000;
		animation.duration = animation.time * 1000;
		animation.progress = 0;

		if (to.ease) {

			if (typeof to.ease === "string") {
				if (E.ease[to.ease]()) {
					animation.ease = E.ease[to.ease]();
				} else {
					animation.ease = P.__defaultEasing();
				}
			} else if (typeof to.ease === "function") {
				animation.ease = {
					fce: to.ease().fce || to.ease,
					config: to.ease().config || {}
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

		P.tweens.push(animation);

		animation.pause = function () {
			animation.suspend = true;

			var now = P.__now || Date.now();

			if (animation.progress === 0 && now < animation.timeStart) {
				animation.delayStartBy = animation.timeStart - now;
			}
		};

		animation.play = function () {

			animation.timeStart = P.__now - (animation.duration * animation.progress) + (animation.delayStartBy || 0);
			animation.suspend = false;
		};

		animation.offset = function (offset) {
			animation.timeStart += offset * 1000;
		};

		return animation;
	};

	P.parse = function (params) {

		if (params === undefined) return undefined;

		var o = {};

		for (var key in S.maps) {
			if (S.maps.hasOwnProperty(key)) {
				if (params[key] !== undefined) o[key] = S.maps[key].parse(params[key]);
			}
		}

		return o;
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
		return P.fromTo(symbol, time, undefined, to);
	};

	P.from = function (symbol, time, from) {
		return P.fromTo(symbol, time, from, undefined);
	};

	P.fromTo = function (symbol, time, from, to) {

		var now = Date.now();

		if (symbol.length) {
			symbol.forEach(function (s) {
				return P.__create(s, time, from, to, now);
			});
		} else {
			return P.__create(symbol, time, from, to, now);
		}
	};

	P.setTreshold = function (value) {
		P.__threshold = value;
	}

	window.Pohyb = window.Tween = {
		to: P.to,
		from: P.from,
		fromTo: P.fromTo,

		get: P.get,
		set: P.set,

		offset: P.offset,

		addEasingHelper: E.addHelper,
		addEasingFunction: E.addFunction,
		addEasing: E.addEasing,

		addParametersHelper: S.addHelper,
		addParametersFunctions: S.addFunction,
		addParameters: S.addParameter,

		getEasing: E.getEasing,
		getTreshold: function () {return P.__threshold},

		setDefaultEasing: E.setDefault,
		setTreshold: P.setTreshold
	}


})();