(function (Pohyb, undefined) {
	if (!Pohyb) return;
	
	var defaultUnit = undefined,
		value,
		result;

	Pohyb.addParametersFunctions("val", {
		get: function (attribute, element) {

			value = Pohyb.computed(element, attribute);

			result = [Pohyb.read(value)];

			return result;
		},
		set: function (attribute, element, value) {

			return Pohyb.write(value[0]);

		},
		parse: function (empty, value) {

			if (typeof value === "string") return [Pohyb.additive(value, defaultUnit)];

			return [Pohyb.read(value)];
		}
	});
	
	Pohyb.addParameters(["opacity"], "val", 1);
	
})(Pohyb);