(function (undefined) {

    var $ = function (query, element) {

    	element = element || document;

    	if (element.querySelectorAll(query).length > 1) {
    		return element.querySelectorAll(query);
    	} else {
    		return element.querySelector(query);
    	}
    };

    Pohyb.from($(".square"), 2, {left: 150, delay: 2});
   /* Pohyb.to($(".square"), 2, {left: 100, ease: Back.easeInOut});
    Pohyb.to($(".square"), 2, {left: 0, delay: 3, ease: Back.easeInOut});
    Pohyb.to($(".circle"), 2, {top: 200, opacity: .2, delay: 1});
    Pohyb.to($(".circle"), 2, {top: 0, opacity: 1, delay: 4, height: 20});*/

})();