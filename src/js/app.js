(function (undefined) {

    var $ = function (query, element) {

    	element = element || document;

    	if (element.querySelectorAll(query).length > 1) {
    		return element.querySelectorAll(query);
    	} else {
    		return element.querySelector(query);
    	}
    };

    var tl = new Cas();
    tl.to($(".square"), 1, {left: 150});
    tl.to($(".circle"), 1, {left: 100});
    tl.to($(".text"), 1, {fontSize: 20});
    tl.set($(".circle"), {opacity: .5}, -.5);
    tl.to($(".square"), 1, {left: 250, opacity: .2});

    setTimeout(tl.pause, 750);
    setTimeout(tl.play, 1500);

})();