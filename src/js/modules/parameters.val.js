(function (Pohyb, undefined) {
	if (!Pohyb) return;

	Pohyb.addParametersFunctions("val", {
		get: function () {

			var value, result;

			value = window.getComputedStyle(arguments[1],null)[arguments[0]];
			result = Number(value) || 0;

			return [result];
		},
		set: function () {

			arguments[1].style[arguments[0]] = arguments[2][0];
		},
		parse: function () {
			var a = arguments[1];

			if (typeof a === "array") return a;
			if (typeof a === "string") return [Number(a)];

			return [a];
		}
	});
	
	Pohyb.addParameters(["opacity"], "val", 1);
	
})(Pohyb);