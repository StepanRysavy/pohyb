(function (Pohyb, undefined) {
	if (!Pohyb) return;

	var defaults = {
		unit: undefined
	}

	Pohyb.addParametersFunctions("color", {
		get: function () {

			var value, result, args = arguments;

			value = getStyle(args[1], args[0]);

			console.log(value);

			value = value.split("(")[1].split(")")[0].split(", ");

			result = [{
				value: Number(value[0]) || 0,
				unit: defaults.unit
			}, {
				value: Number(value[1]) || 0,
				unit: defaults.unit
			}, {
				value: Number(value[2]) || 0,
				unit: defaults.unit
			}];

			return result;
			
		},
		set: function () {
			arguments[1].style[arguments[0]] = "rgb(" + Math.round(arguments[2][0].value) + ", " + Math.round(arguments[2][1].value) + ", " + Math.round(arguments[2][2].value) + ")";
		},
		parse: function () {
			var a = arguments[1], parsed;

			if (arguments[1].indexOf("#") > -1) {

				a = Number("0x" + a.split("#")[1]);

				parsed = [(a & 0xFF0000)>>16, (a & 0xFF00)>>8, a & 0xFF];

			}

			if (arguments[1].indexOf("rgb") > -1) {
				a = a.split("(")[1].split(")")[0].split(",");

				parsed = [Number(a[0]), Number(a[1]), Number(a[2])];
			}

			return [
				{value: parsed[0], unit: defaults.unit},
				{value: parsed[1], unit: defaults.unit},
				{value: parsed[2], unit: defaults.unit}
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

      				return "rgb("+(iClr & 0xFF)+","+((iClr & 0xFF00)>>8)+","+
      					((iClr & 0xFF0000)>>16)+")";
  				})(elem);

		} else if (elem.style[name]) {
			return elem.style[name];
		} else  {
			return null;
		}
	}

})(Pohyb);
