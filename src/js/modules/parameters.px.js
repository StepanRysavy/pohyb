(function (Pohyb, undefined) {
	if (!Pohyb) return;

	Pohyb.addParametersFunctions("px", {
		get: function () {
			return (arguments[1].style[arguments[0]]) ? Number(arguments[1].style[arguments[0]].split("px")[0]) : (arguments[2] || 0);
		},
		set: function () {
			arguments[1].style[arguments[0]] = arguments[2] + "px";
		}
	});
	
	Pohyb.addParameters(["left", "right", "top", "bottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "px", 0);

})(Pohyb);
