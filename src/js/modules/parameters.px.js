(function (Pohyb, undefined) {
	if (!Pohyb) return;
	
	var defaultUnit = "px",
		value,
		result;

	Pohyb.addParametersFunctions("px", {
		get: function (attribute, element) {

			var position;

			value = Pohyb.computed(element, attribute);
			position = Pohyb.computed(element, "position");

			if (position === "static" && ["left", "right", "top", "bottom"].indexOf(attribute) > -1) {
				element.style["position"] = "relative";
				value = "0px";
			}

			result = Pohyb.split(value, defaultUnit, 0);
			result = Pohyb.read(result, defaultUnit);
			result = [result];

			return result;
			
		},
		set: function (attribute, element, value) {
			return Pohyb.write(value[0]);
		},
		parse: function (empty, value) {

			if (typeof value === "string") return [Pohyb.additive(value, defaultUnit)];

			return [Pohyb.read(value, defaultUnit)];
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
