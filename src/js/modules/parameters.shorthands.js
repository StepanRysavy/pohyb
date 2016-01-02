(function (Pohyb, undefined) {
	if (!Pohyb) return;
	
	var defaultUnit = "px",
		defaultValue = 0,
		value,
		result,
		read = function (value) {
			return Pohyb.read(value, defaultUnit);
		},
		write = function (value) {
			return Pohyb.write(value);
		},
		split = function (value) {
			return Pohyb.split(value, defaultUnit, defaultValue);
		};

	Pohyb.addParametersFunctions("shorthand-4", {
		get: function (attribute, element) {

			value = window.getComputedStyle(element,null);
			result = [
				read(split(value[attribute + "Top"])),
				read(split(value[attribute + "Right"])),
				read(split(value[attribute + "Bottom"])),
				read(split(value[attribute + "Left"]))
			];

			return result;
			
		},
		set: function (attribute, element, value) {

			return [write(value[0]), write(value[1]), write(value[2]), write(value[3])].join(" ");

		},
		parse: function (empty, value) {

			if (typeof value === "string") {
				value = value.split(" ");
				value.forEach(function (value, index) {
					value[index] = split(value[index]);
				});
			}

			if (typeof value === "object") {
				if (value.length === 1) result = [read(value[0]), read(value[0]), read(value[0]), read(value[0])];
				if (value.length === 2) result = [read(value[0]), read(value[1]), read(value[0]), read(value[1])];
				if (value.length === 3) result = [read(value[0]), read(value[1]), read(value[2]), read(value[0])];
				if (value.length === 4) result = [read(value[0]), read(value[1]), read(value[2]), read(value[3])];
			}

			if (typeof value === "number") {
				result = [read(value), read(value), read(value), read(value)];
			}

			return result;
		}
	});

	Pohyb.addParametersFunctions("shorthand-2", {
		get: function (attribute, element) {

			value = Pohyb.computed(element, attribute).split(" ");

			result = [
				read(split(value[0])),
				read(split(value[1]))
			];

			return result;
			
		},
		set: function (attribute, element, value) {
			return write(value[0]);
		},
		parse: function (empty, value) {

			if (typeof value === "string") {
				value = value.split(" ");
				value.forEach(function (value, index) {
					value[index] = split(value[index]);
				});
			}

			if (typeof value === "object") {
				if (value.length === 1) return [read(value[0]), read(value[0])];

				return [read(value[0]), read(value[1])];
			}

			return [read(value), read(value)];
		}
	});
	
	Pohyb.addParameters(["padding", "margin"], "shorthand-4", 0);
	Pohyb.addParameters(["backgroundPosition", "transformOrigin"], "shorthand-2", 0);

})(Pohyb);