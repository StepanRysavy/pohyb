(function (undefined) {
	"use strict";

	if (window === undefined) window = {};

	var Easing = {
			helpers: {},
			functions: {},
			ease: {}
		},
		Parameters = {
			helpers: {},
			functions: {},
			maps: {},
			binds: []
		},
		Pohyb = window._pohybDebugFile = {
			easing: Easing,
			parameters: Parameters,
			tweens: [],
			__now: undefined,
			__defaultEasing: undefined,
			__threshold: 0.01
		},
		R = window.requestAnimationFrame,
		RC = window.cancelAnimationFrame;



	Easing.addFunction = function (name, cb) {
		Easing.functions[name] = cb;

		return cb;
	}

	Easing.addHelper = function (name, cb) {
		Easing.helpers[name] = cb;

		return cb;
	}

	Easing.addEasing = function (name, cb) {
		Easing.ease[name] = cb;

		return cb;
	}

	Easing.getEasing = function (name) {
		return Easing.functions[name];
	}

	Easing.setDefault = function (easing) {
		Pohyb.__defaultEasing = easing;
	}

	Parameters.helpers.create = function (name, to, defaults, propertyName) {

		var args;

		Parameters.maps[name] = {
			defaults: defaults,
			to: to,
			get: function () {

				args = Array.prototype.slice.call(arguments);
				args = [].concat(name, args, defaults, propertyName);

				var getter = Parameters.functions[to].get.apply(this, args);

				// console.log ("Getter", getter);

				return getter;
			},
			set: function () {

				args = Array.prototype.slice.call(arguments);
				args = [].concat(name, args, propertyName);

				args[1].style[args[0]] = Parameters.functions[propertyName || to].set.apply(this, args);

			},
			parse: function () {

				args = Array.prototype.slice.call(arguments);
				args = [].concat(name, args, defaults, propertyName);

				var parser = Parameters.functions[to].parse.apply(this, args);

				// console.log ("Parser", args, parser);

				return parser;

			}
		}
	};

	Parameters.getBind = function (name) {

		for (var i=0; i<Parameters.binds.length; i++) {
			if (Parameters.binds[i].links.indexOf(name) > -1) return Parameters.binds[i].to;
		}

		return undefined;
	};

	Parameters.addBind = function (arr, to) {
		Parameters.binds.push({
			links: arr,
			to: to
		});

		arr.forEach(function (link) {
			Parameters.helpers.create(link, Parameters.maps[to].to, Parameters.maps[to].defaults, to);
		});
	};

	Parameters.addParameter = function (arr, to, defaults, propertyName) {
		for (var i=0; i<arr.length; i++) {
			Parameters.helpers.create(arr[i], to, defaults, propertyName);
		}
	};

	Parameters.addFunction = function (name, obj) {
		Parameters.functions[name] = obj;

		return obj;
	}

	Parameters.addHelper = function (name, cb) {
		Parameters.helpers[name] = cb;

		return cb;
	}

	Pohyb.__debug = function () {
		console.log(arguments);
	};

	Pohyb.__animate = function (animation) {

		if (animation.suspend === true) return;

		if (Pohyb.__now > animation.timeStart + animation.duration) {

			Pohyb.set(animation.of, Pohyb.parse(animation.settings.to, animation.of, false));

			if (animation.onComplete) animation.onComplete();
			
			animation.run = false;

			Pohyb.tweens.splice(Pohyb.tweens.indexOf(animation), 1);

			if (Pohyb.tweens.length === 0) {
				RC(Pohyb.__tick);
			}

		} else {

			if (Pohyb.__now > animation.timeStart && animation.run === false) {

				animation.run = true;

				if (animation.onStart) animation.onStart();

				animation.values.from = Pohyb.parse(animation.settings.from, animation.of, true) || Pohyb.get(animation.of, animation.settings.to);
				animation.values.to = Pohyb.parse(animation.settings.to, animation.of, true) || Pohyb.get(animation.of, animation.settings.from);
				animation.values.now = {};
				
				var backup = Pohyb.get(animation.of, animation.settings.to);

				for (var key in animation.values.to) {
					if (animation.values.to.hasOwnProperty(key)) {
						animation.values.now[key] = animation.values.from ? animation.values.from[key] : backup[key];
					}
				}

			}

			if (animation.run === true) {

				animation.progress = (Pohyb.__now - animation.timeStart) / animation.duration;

				for (var key in animation.values.now) {
					if (animation.values.now.hasOwnProperty(key)) {

						animation.values.now[key] = [];

						animation.values.from[key].forEach(function (from, index) {

							if (animation.values.to[key][index].value === undefined) {

								animation.values.now[key][index] = {
									value: from.value,
									unit: from.unit
								};

							} else {

								animation.values.now[key][index] = {
									value: from.value + animation.ease.fce(
										animation.progress,
										from.value, 
										animation.values.to[key][index].value,
										animation.ease.config
									),
									unit: from.unit
								};
							}

						});
					}
				}

				if (animation.onUpdate) animation.onUpdate();

				Pohyb.set(animation.of, animation.values.now);


			}
		}
	};

	Pohyb.__tick = function () {

		Pohyb.__now = Date.now();

		Pohyb.tweens.forEach(function (animation) {
			Pohyb.__animate(animation);
		});

		R(Pohyb.__tick);
	};

	Pohyb.__create = function (symbol, time, from, to, now) {

		if (Pohyb.tweens.length === 0) {
			R(Pohyb.__tick);
		}

		if (to === undefined) {
			to = Pohyb.get(symbol, from);			
			if (from.ease) to.ease = from.ease;
			if (from.delay) to.delay = from.delay; 
		}

		if (from !== undefined) {
			Pohyb.set(symbol, from);
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
				if (Easing.ease[to.ease]()) {
					animation.ease = Easing.ease[to.ease]();
				} else {
					animation.ease = Pohyb.__defaultEasing();
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
						fce: Pohyb.__defaultEasing().fce,
						config: to.ease.config
					}
				} else {
					animation.ease = Pohyb.__defaultEasing();
				}
			} else {
				animation.ease = Pohyb.__defaultEasing();
			}
		} else {
			animation.ease = Pohyb.__defaultEasing();
		}

		animation.values = {};

		animation.settings = {};
		animation.settings.from = from;
		animation.settings.to = to; 

		animation.onStart = from ? from.onStart : to ? to.onStart : undefined;
		animation.onUpdate = from ? from.onUpdate : to ? to.onUpdate : undefined;
		animation.onComplete = from ? from.onComplete : to ? to.onComplete : undefined;

		Pohyb.tweens.push(animation);

		animation.pause = function () {
			animation.suspend = true;

			var now = Pohyb.__now || Date.now();

			if (animation.progress === 0 && now < animation.timeStart) {
				animation.delayStartBy = animation.timeStart - now;
			}
		};

		animation.play = function () {

			animation.timeStart = Pohyb.__now - (animation.duration * animation.progress) + (animation.delayStartBy || 0);
			animation.suspend = false;
		};

		animation.offset = function (offset) {
			animation.timeStart += offset * 1000;
		};

		return animation;
	};

	Pohyb.parse = function (params, of, calculate) {

		if (params === undefined) return undefined;

		var o = {}, binds = [], bindsName = [];

		for (var key in Parameters.maps) {
			if (Parameters.maps.hasOwnProperty(key)) {
				if (params[key] !== undefined) {

					var binder = Parameters.getBind(key);

					if (binder === undefined) {
						o[key] = Parameters.maps[key].parse(params[key], of, calculate);
					} else if (bindsName.indexOf(binder) === -1) {
						binds.push({
							name: binder,
							list: [{key: key, value: params[key]}]
						});
						bindsName.push(binder);
					} else {
						binds[bindsName.indexOf(binder)].list.push({key: key, value: params[key]});
					}					
				}
			}
		}

		binds.forEach(function (link) {
			o[link.name] = Parameters.maps[link.name].parse(link.list, of, calculate);
		});

		return o;
	};

	Pohyb.set = function (symbol, params) {

		for (var key in params) {
			if (params.hasOwnProperty(key)) {
				if (Parameters.maps[key]) Parameters.maps[key].set(symbol, params[key]);
			}
		}

	};

	Pohyb.get = function (symbol, params) {

		var o = {};

		var o = {}, binds = [], bindsName = [];

		for (var key in Parameters.maps) {
			if (Parameters.maps.hasOwnProperty(key)) {
				if (params[key] !== undefined) {

					var binder = Parameters.getBind(key);

					if (binder === undefined) {
						o[key] = Parameters.maps[key].get(symbol);
					} else if (bindsName.indexOf(binder) === -1) {
						binds.push({
							name: binder,
							list: [{key: key, value: params[key]}]
						});
						bindsName.push(binder);
					} else {
						binds[bindsName.indexOf(binder)].list.push({key: key, value: params[key]});
					}					
				}
			}
		}

		binds.forEach(function (link) {
			o[link.name] = Parameters.maps[link.name].get(symbol);
		});

		return o;
	};

	Pohyb.to = function (symbol, time, to) {
		return Pohyb.fromTo(symbol, time, undefined, to);
	};

	Pohyb.from = function (symbol, time, from) {
		return Pohyb.fromTo(symbol, time, from, undefined);
	};

	Pohyb.fromTo = function (symbol, time, from, to) {

		var now = Date.now();

		if (symbol.length) {
			symbol.forEach(function (s) {
				return Pohyb.__create(s, time, from, to, now);
			});
		} else {
			return Pohyb.__create(symbol, time, from, to, now);
		}
	};

	Pohyb.setTreshold = function (value) {
		Pohyb.__threshold = value;
	}

	Pohyb.computed = function (element, attribute) {
		return window.getComputedStyle(element,null)[attribute];
	}

	Pohyb.read = function (value, defaultUnit) {
		return {value: Number(value), unit: defaultUnit || undefined};
	}

	Pohyb.write = function (obj) {
		return obj.unit ? obj.value + obj.unit : obj.value
	}

	Pohyb.split = function (value, unit, defaultValue) {
		if (unit === undefined) {
			return Number(value) || (defaultValue || 0);
		} else {
			return Number(value.split(unit)[0]) || (defaultValue || 0);
		}
	}

	window.Pohyb = window.Tween = {
		to: Pohyb.to,
		from: Pohyb.from,
		fromTo: Pohyb.fromTo,

		get: Pohyb.get,
		set: Pohyb.set,

		read: Pohyb.read,
		write: Pohyb.write,
		split: Pohyb.split,

		offset: Pohyb.offset,

		addEasingHelper: Easing.addHelper,
		addEasingFunction: Easing.addFunction,
		addEasing: Easing.addEasing,

		addParametersHelper: Parameters.addHelper,
		addParametersFunctions: Parameters.addFunction,
		addParametersBind: Parameters.addBind,
		addParameters: Parameters.addParameter,

		getEasing: Easing.getEasing,
		getTreshold: function () {return Pohyb.__threshold},

		setDefaultEasing: Easing.setDefault,
		setTreshold: Pohyb.setTreshold,

		computed: Pohyb.computed
	}


})();