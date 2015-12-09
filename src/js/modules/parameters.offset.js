(function (Pohyb, undefined) {
	if (!Pohyb) return;

	var defaults = {
		unit: "px"
	}

	Pohyb.addParametersFunctions("offset", {
		get: function () {

			var name = arguments[0].split("");
			name[0] = name[0].toUpperCase();
			name = "offset" + name.join("");

			var result = [{value: arguments[1][name] || 0, unit: defaults.unit}];

			return result;
		},
		set: function () {
			arguments[1].style[arguments[3]] = arguments[2][0].value + arguments[2][0].unit;
		},
		parse: function () {
			var a = arguments[1];

			if (typeof a === "array") return [{value: a[0], unit: defaults.unit}];
			if (typeof a === "string") return [{value: Number(a.split("px")[0]), unit: defaults.unit}];

			return [{value: a, unit: defaults.unit}];
		}
	});
	
	Pohyb.addParameters(["width"], "offset", 0);
	Pohyb.addParameters(["height"], "offset", 0);
	
})(Pohyb);