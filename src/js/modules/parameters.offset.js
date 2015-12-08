(function (Pohyb, undefined) {
	if (!Pohyb) return;

	Pohyb.addParametersFunctions("offset", {
		get: function () {
			return [arguments[1]["offset" + arguments[3]] || 0];
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
	
	Pohyb.addParameters(["width"], "offset", 0, "Width");
	Pohyb.addParameters(["height"], "offset", 0, "Height");
	
})(Pohyb);