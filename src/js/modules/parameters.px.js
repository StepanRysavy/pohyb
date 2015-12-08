(function (Pohyb, undefined) {
	if (!Pohyb) return;

	Pohyb.addParametersFunctions("px", {
		get: function () {

			var value, result;

			value = window.getComputedStyle(arguments[1],null)[arguments[0]];
			result = [Number(value.split("px")[0]) || 0];

			return result;
			
		},
		set: function () {
			arguments[1].style[arguments[0]] = arguments[2][0] + "px";
		},
		parse: function () {
			var a = arguments[1];

			if (typeof a === "array") return a;
			if (typeof a === "string") return [Number(a[i].split("px")[0])];

			return [a];
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

})(Pohyb);
