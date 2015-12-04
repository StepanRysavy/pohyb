(function (Pohyb, undefined) {
	if (!Pohyb) return;

	Pohyb.addParametersFunctions("val", {
		get: function () {
			return (arguments[1].style[arguments[0]] && arguments[1].style[arguments[0]] != "") ? Number(arguments[1].style[arguments[0]]) : (arguments[2] || 0);
		},
		set: function () {
			arguments[1].style[arguments[0]] = arguments[2];
		}
	});
	
	Pohyb.addParameters(["opacity"], "val", 1);
	
})(Pohyb);