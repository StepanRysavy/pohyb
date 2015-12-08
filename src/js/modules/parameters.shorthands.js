(function (Pohyb, undefined) {
	if (!Pohyb) return;

	Pohyb.addParametersFunctions("shorthand", {
		get: function () {

			var value, result, a = arguments;

			value = window.getComputedStyle(a[1],null);
			result = [
				Number(value[a[0] + "Top"].split("px")[0]) || 0,
				Number(value[a[0] + "Right"].split("px")[0]) || 0,
				Number(value[a[0] + "Bottom"].split("px")[0]) || 0,
				Number(value[a[0] + "Left"].split("px")[0]) || 0,
			];

			return result;
			
		},
		set: function () {
			arguments[1].style[arguments[0]] = arguments[2][0] + "px " + arguments[2][1] + "px " + arguments[2][2] + "px " + arguments[2][3] + "px";
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
				if (a.length === 1) return [a[0], a[0], a[0], a[0]];
				if (a.length === 2) return [a[0], a[1], a[0], a[1]];
				if (a.length === 3) return [a[0], a[1], a[2], a[1]];

				return a;
			}

			return [a, a, a, a];
		}
	});
	
	Pohyb.addParameters(["padding", "margin"], "shorthand", 0);

})(Pohyb);