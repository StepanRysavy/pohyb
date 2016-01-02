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
    tl.to($(".square"), 1, {borderTopColor: "#00ff00", marginTop: 20}); 
    tl.to($(".text"), 1, {color: "#ff0000"}); 

    tl.to($(".transformator"), 1, {opacity: .5}); 
    tl.to($(".transformator"), 1, {scaleX: 2}); 
    tl.to($(".transformator"), 1, {rotate: -10});
    tl.to($(".transformator"), 1, {scale: 2});
    tl.to($(".transformator"), 1, {translateX: 10});
    tl.to($(".transformator"), 1, {translateY: 20});
    tl.to($(".transformator"), 1, {skew: .1});
    


})();