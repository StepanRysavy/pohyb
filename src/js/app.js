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
    /*
    P.to($(".square"), 2, {left: 0, delay: 3});
    P.to($(".circle"), 2, {top: 200, opacity: .2, delay: 1});
    P.to($(".circle"), 2, {top: 0, opacity: 1, delay: 4});
    /**/
    
})(window, Pohyb, Cas);