(function (undefined) {

    var $ = function (query, element) {

    	element = element || document;

    	if (element.querySelectorAll(query).length > 1) {
    		return element.querySelectorAll(query);
    	} else {
    		return element.querySelector(query);
    	}
    };

    var p = Pohyb.from($(".square"), 3, {left: 150, delay: 2});
    p.pause();
    setTimeout(p.play, 1000);

})();