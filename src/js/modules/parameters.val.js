(function (Pohyb, undefined) {
	if (!Pohyb) return;
	
	var defaults = {
		unit: false
	}

	Pohyb.addParametersFunctions("val", {
		get: function () {

			var element = arguments[1], attribute = arguments[0], value, result;

			value = Pohyb.computed(element, attribute);
			result = [{value: Number(value) || 0, unit: defaults.unit}];

			return result;
		},
		set: function () {

			arguments[1].style[arguments[0]] = arguments[2][0].value;
		},
		parse: function () {
			var a = arguments[1];

			if (typeof a === "array") return [{value: a[0], unit: defaults.unit}];
			if (typeof a === "string") return [{value: Number(a), unit: defaults.unit}];

			return [{value: a, unit: defaults.unit}];
		}
	});
	
	Pohyb.addParameters(["opacity"], "val", 1);
	
})(Pohyb);