// WITH ENCAPSULATION:
(function(P){
 
    var cache = [0],
        expando = 'data' + +new Date();
 
    function data(elem) {
 
        var cacheIndex = elem[expando],
            nextCacheIndex = cache.length;
 
        if(!cacheIndex) {
            cacheIndex = elem[expando] = nextCacheIndex;
            cache[cacheIndex] = {};
        }
 
        return {
            get : function(key) {
                return cache[cacheIndex][key];
            },
            set : function(key, val) {
                cache[cacheIndex][key] = val;
                return val;
            }
        }
 
    }
 
    P.data = data;
 
})(Pohyb);