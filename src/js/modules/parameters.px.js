(function (Pohyb, undefined) {
	if (!Pohyb) return;

	var defaults = {
		unit: "px"
	}

	Pohyb.addParametersFunctions("px", {
		get: function () {

			var value, result;

			value = window.getComputedStyle(arguments[1],null)[arguments[0]];
			result = [{
				value: Number(value.split("px")[0]) || 0,
				unit: defaults.unit
			}];

			return result;
			
		},
		set: function () {
			arguments[1].style[arguments[0]] = arguments[2][0].value + arguments[2][0].unit;
		},
		parse: function () {
			var a = arguments[1];

			if (typeof a === "array") return [{value: a[0], unit: defaults.unit}];
			if (typeof a === "string") return [{value: Number(a.split("px")[0]), unit: defaults.unit}];

			return [{value: a, unit: defaults.unit}];
		}
	});
	
	Pohyb.addParameters(["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "px", 0);
	Pohyb.addParameters(["marginLeft", "marginRight", "marginTop", "marginBottom"], "px", 0);
	Pohyb.addParameters(["outlineWidth"], "px", 0);
	Pohyb.addParameters(["borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"], "px", 0);
	Pohyb.addParameters(["borderBottomLeftRadius", "borderBottomRightRadius", "borderTopLeftRadius", "borderTopRightRadius"], "px", 0);
	Pohyb.addParameters(["left", "right", "top", "bottom"], "px", 0);
	Pohyb.addParameters(["fontSize", "letterSpacing", "lineHeight"], "px", 0);
	Pohyb.addParameters(["minWidth", "minHeight", "maxWidth", "maxHeight"], "px", 0);
	Pohyb.addParameters(["backgroundPositionX", "backgroundPositionY"], "px", 0);

})(Pohyb);
