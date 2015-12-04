(function (Pohyb, undefined) {
	if (!Pohyb) return;

	var bezier = Pohyb.addEasingHelper("bezier", function(t, p0, p1, p2, p3){
		var cX = 3 * (p1.x - p0.x),
			bX = 3 * (p2.x - p1.x) - cX,
			aX = p3.x - p0.x - cX - bX;

		var cY = 3 * (p1.y - p0.y),
			bY = 3 * (p2.y - p1.y) - cY,
			aY = p3.y - p0.y - cY - bY;

		var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
		var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;

		return {x: x, y: y};
	});

	Pohyb.addEasingFunction("bezier", function (progress, from, to, options) {

		if (progress < Pohyb.getTreshold()) progress = 0;
		if (progress > 1 - Pohyb.getTreshold()) progress = 1;

		if (options.points && progress > 0 && progress < 1) {
			progress = bezier(
				progress,
				options.points[0],
				options.points[1],
				options.points[2],
				options.points[3]
			).y / 100;
		} else {
			progress = progress;
		}		

		return (to - from) * (progress);
	});
	
})(Pohyb);