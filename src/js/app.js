(function (W, P, C, undefined) {

    var $ = function (query, element) {

    	element = element || document;

    	if (element.querySelectorAll(query).length > 1) {
    		return element.querySelectorAll(query);
    	} else {
    		return element.querySelector(query);
    	}
    };

    P.to($(".square"), 2, {left: 100});

    setTimeout(function () {
    	P.to($(".square"), 2, {left: 0});
    }, 3000);
    
})(window, Pohyb, Cas);