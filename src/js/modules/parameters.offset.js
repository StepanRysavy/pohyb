(function (Pohyb, undefined) {
	if (!Pohyb) return;
	
	var defaultUnit = "px",
		value,
		result;

	Pohyb.addParametersFunctions("offset", {
		get: function (attribute, element) {

			var name = attribute.split("");
			name[0] = name[0].toUpperCase();
			name = "offset" + name.join("");

			var result = [Pohyb.read(element[name], defaultUnit)];

			return result;
		},
		set: function (attribute, element, value) {

			return Pohyb.write(value[0]);

		},
		parse: function (empty, value) {

			if (typeof value === "array") return [Pohyb.read(value[0], defaultUnit)];
			if (typeof value === "string") return [Pohyb.read(Pohyb.split(value[0], defaultUnit, 0), defaultUnit)];

			return [Pohyb.read(value, defaultUnit)];
		}
	});
	
	Pohyb.addParameters(["width"], "offset", 0);
	Pohyb.addParameters(["height"], "offset", 0);
	
})(Pohyb);