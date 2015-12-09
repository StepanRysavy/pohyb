(function (Pohyb, undefined) {
	if (!Pohyb) return;

	var defaults = {
		unit: "px"
	}

	Pohyb.addParametersFunctions("shorthand-4", {
		get: function () {

			var value, result, a = arguments;

			value = window.getComputedStyle(a[1],null);
			result = [
				{value: Number(value[a[0] + "Top"].split("px")[0]) || 0, unit: defaults.unit},
				{value: Number(value[a[0] + "Right"].split("px")[0]) || 0, unit: defaults.unit},
				{value: Number(value[a[0] + "Bottom"].split("px")[0]) || 0, unit: defaults.unit},
				{value: Number(value[a[0] + "Left"].split("px")[0]) || 0, unit: defaults.unit}
			];

			return result;
			
		},
		set: function () {
			arguments[1].style[arguments[0]] = arguments[2][0].value + arguments[2][0].unit + " " + arguments[2][1].value + arguments[2][1].unit + " " + arguments[2][2].value + arguments[2][2].unit + " " + arguments[2][3].value + arguments[2][3].unit;
		},
		parse: function () {
			var a = arguments[1];

			if (typeof a === "string") {
				a = a.split(" ");
				a.forEach(function (value, index) {
					a[index] = Number(a[index].split("px")[0]);
				});
			}

			if (typeof a === "object") {
				if (a.length === 1) return [{value: a[0], unit: defaults.unit}, {value: a[0], unit: defaults.unit}, {value: a[0], unit: defaults.unit}, {value: a[0], unit: defaults.unit}];
				if (a.length === 2) return [{value: a[0], unit: defaults.unit}, {value: a[1], unit: defaults.unit}, {value: a[0], unit: defaults.unit}, {value: a[1], unit: defaults.unit}];
				if (a.length === 3) return [{value: a[0], unit: defaults.unit}, {value: a[1], unit: defaults.unit}, {value: a[2], unit: defaults.unit}, {value: a[0], unit: defaults.unit}];

				return {value: a[0], unit: defaults.unit}, {value: a[1], unit: defaults.unit}, {value: a[2], unit: defaults.unit}, {value: a[3], unit: defaults.unit};
			}

			return [{value: a, unit: defaults.unit}, {value: a, unit: defaults.unit}, {value: a, unit: defaults.unit}, {value: a, unit: defaults.unit}];
		}
	});

	Pohyb.addParametersFunctions("shorthand-2", {
		get: function () {

			var value, result, a = arguments;

			value = window.getComputedStyle(a[1],null)[a[0]].split(" ");

			result = [
				Number(value[0].split("px")[0]) || 0,
				Number(value[1].split("px")[0]) || 0
			];

			return result;
			
		},
		set: function () {

			var result = arguments[2][0] + "px " + arguments[2][1] + "px";

			arguments[1].style[arguments[0]] = result;
		},
		parse: function () {
			var a = arguments[1];

			if (typeof a === "string") {
				a = a.split(" ");
				a.forEach(function (value, index) {
					a[index] = Number(a[index].split("px")[0]);
				});
			}

			if (typeof a === "object") {
				if (a.length === 1) return [{value: a[0], unit: defaults.unit}, {value: a[0], unit: defaults.unit}];

				return [{value: a[0], unit: defaults.unit}, {value: a[1], unit: defaults.unit}];
			}

			return [{value: a, unit: defaults.unit}, {value: a, unit: defaults.unit}];
		}
	});
	
	Pohyb.addParameters(["padding", "margin"], "shorthand-4", 0);
	Pohyb.addParameters(["backgroundPosition", "transformOrigin"], "shorthand-2", 0);

})(Pohyb);