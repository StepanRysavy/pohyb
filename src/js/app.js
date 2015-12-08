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
    tl.to($(".square"), 1, {left: 150, marginLeft: 5});
    tl.to($(".square"), 1, {left: 250, opacity: .2});

})();