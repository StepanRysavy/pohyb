(function (Pohyb, undefined) {
	if (!Pohyb) return;
	
	var defaultUnit = undefined,
		value,
		result,
		parsed;

	Pohyb.addParametersFunctions("color", {
		get: function (attribute, element) {

			value = getStyle(element, attribute);

			value = value.split("(")[1].split(")")[0].split(", ");
			
			result = [Pohyb.read(value[0]), Pohyb.read(value[1]), Pohyb.read(value[2])];

			return result;
			
		},
		set: function (attribute, element, value) {
			return "rgb(" + Math.round(Pohyb.write(value[0])) + ", " + Math.round(Pohyb.write(value[1])) + ", " + Math.round(Pohyb.write(value[2])) + ")";
		},
		parse: function (empty, value) {

			if (value.indexOf("#") > -1) {

				result = Number("0x" + value.split("#")[1]);

				parsed = [(result & 0xFF0000)>>16, (result & 0xFF00)>>8, result & 0xFF];

			}

			if (value.indexOf("rgb") > -1) {
				value = value.split("(")[1].split(")")[0].split(",");

				parsed = [Number(value[0]), Number(value[1]), Number(value[2])];
			}

			return [
				Pohyb.read(parsed[0]),
				Pohyb.read(parsed[1]),
				Pohyb.read(parsed[2])
			];
		}
	});
	
	Pohyb.addParameters(["color", "backgroundColor", "borderLeftColor", "borderTopColor", "borderRightColor", "borderBottomColor"], "color", 0);

	function getStyle(elem, front) {

		var name = front;

		if (document.defaultView && document.defaultView.getComputedStyle) {
			name = name.replace(/([A-Z])/g, "-$1");
			name = name.toLowerCase();
			s = document.defaultView.getComputedStyle(elem, "");
			return s && s.getPropertyValue(name);
		} else if (elem.currentStyle) {
			return (function (el) { // get a rgb based color on IE
      				var oRG=document.body.createTextRange();
      				oRG.moveToElementText(el);
      				var iClr=oRG.queryCommandValue(front === "color" ? "FrontColor" : "BackColor");

      				console.log(iClr);

      				return "rgb(" + (iClr & 0xFF) + "," + ((iClr & 0xFF00)>>8) + "," + ((iClr & 0xFF0000)>>16)+")";
  				})(elem);

		} else if (elem.style[name]) {
			return elem.style[name];
		} else  {
			return null;
		}
	}

})(Pohyb);
