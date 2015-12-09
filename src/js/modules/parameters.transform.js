(function (Pohyb, undefined) {
	if (!Pohyb) return;

	var defaults = {
		unit: undefined
	}, lastTransform, args;

	Pohyb.addParametersFunctions("transform", {
		get: function () {

			var value, result, a = arguments;

			value = window.getComputedStyle(a[1],null)["transform"];

			// TO DO

			result = [
				{value: 1, unit: defaults.unit},	// scaleX
				{value: 1, unit: defaults.unit},	// scaleY
				{value: 0, unit: defaults.unit},	// rotation
				{value: 0, unit: defaults.unit},	// translateX
				{value: 0, unit: defaults.unit}		// translateY
			];

			return result;
			
		},
		set: function () {
			lastTransform = [];
			args = arguments[2];

			lastTransform.push("scale(" + args[0].value + ", " + args[1].value + ")");
			lastTransform.push("rotate(" + args[2].value + "deg)");
			lastTransform.push("translate(" + args[3].value + "px, " + args[4].value + "px)");

			lastTransform = lastTransform.join(" ");

			arguments[1].style["transform"] = lastTransform;
		},
		parse: function () {
			var a = arguments[1],
				b = undefined,
				c,
				type = arguments[0], 
				parsed = [{value: undefined, unit: defaults.unit}, {value: undefined, unit: defaults.unit}, {value: undefined, unit: defaults.unit}, {value: undefined, unit: defaults.unit}, {value: undefined, unit: defaults.unit}];

			if (typeof a === "object" && a.length == 5 && type === "transform") {
				parsed[0].value = a[0];
				parsed[1].value = a[1];
				parsed[2].value = a[2];
				parsed[3].value = a[3];
				parsed[4].value = a[4];

				return parsed;
			}

			if (type === "transform" && typeof a != "object") {
				parsed[0].value = a;
				parsed[1].value = a;
				parsed[2].value = a;
				parsed[3].value = a;
				parsed[4].value = a;

				return parsed;
			}

			if (typeof a === "object") {

				for (var i = 0; i < a.length; i++) {

					type = a[i].key;
					c = a[i].value;			

					if (typeof c === "string") {
						b = c.split(" ");
						b.forEach(function (value, index) {
							b[index] = Number(b[index].split("px")[0]);
						});

						if (b.length === 1) c = b[0];
					}

					if (type === "scaleX") {
						parsed[0].value = Number(c);
					}
					if (type === "scaleY") {
						parsed[1].value = Number(c);
					}
					if (type === "rotate") {
						parsed[2].value = Number(c);
					}
					if (type === "translateX") {
						parsed[3].value = Number(c);
					}
					if (type === "translateY") {
						parsed[4].value = Number(c);
					}

					if (type === "scale") {

						if (b === undefined) {
							parsed[0].value = Number(c);
							parsed[1].value = Number(c);
						} else {
							parsed[0].value = Number(b[0]);
							parsed[1].value = Number(b[1]);
						}
						
					}

					if (type === "translate") {

						if (b === undefined) {
							parsed[3].value = Number(c);
							parsed[4].value = Number(c);
						} else {
							parsed[3].value = Number(b[0]);
							parsed[4].value = Number(b[1]);
						}
					}
				}
			}

			return parsed;
		}
	});
	
	Pohyb.addParameters(["transform"], "transform", 0);
	Pohyb.addParametersBind(["scale", "scaleX", "scaleY", "rotate", "translate", "translateX", "translateY"], "transform");

})(Pohyb);