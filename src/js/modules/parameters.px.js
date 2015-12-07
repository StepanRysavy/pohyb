(function (Pohyb, undefined) {
	if (!Pohyb) return;

	Pohyb.addParametersFunctions("px", {
		get: function () {

			var value, result;

			value = window.getComputedStyle(arguments[1],null)[arguments[0]];
			result = Number(value.split("px")[0]) || 0;

			return result;
			
		},
		set: function () {
			arguments[1].style[arguments[0]] = arguments[2] + "px";
		}
	});
	
	Pohyb.addParameters(["fontSize", "letterSpacing", "lineHeight", "left", "right", "top", "bottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "px", 0);

})(Pohyb);
