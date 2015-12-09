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
    tl.to($(".square"), 1, {left: 100, width: 200, opacity: .5, margin: 10});
    tl.to($(".transformator"), 1, {transform: [2, 2, 50, 0, 0]});
    tl.to($(".transformator"), 1, {scale: .5, rotate: 90}); 

})();