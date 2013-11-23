(function($){
    var console = window.console || (window.console = {}),
        cache = $.cache || {},
        jQueryElementIdPropertyName = $.expando;

    function groupAutoCollapsed(caption, writeToLogFunction) {
        try {
            console.groupCollapsed(caption);
            writeToLogFunction.call(this);
        } finally {
            console.groupEnd();
        }
    };

    function generateElementCaption($element) {
        var id = $element.attr('id'),
            cssClass = $element.attr('class');

        return "{0} {1} {2} {3}".replace("{0}", $element.get(0).tagName)
                                .replace("{1}", id ? "#" + id : "")
                                .replace("{2}", cssClass ? "." + cssClass : "")
                                .replace("{3}", $element.get(0)[jQueryElementIdPropertyName] || "")
    };

    function getElementCaption($element) {
        return $element.selector || generateElementCaption($element);
    };

    function logElementEvents(element) {
        var $element = $(element),
            element = $element.get(0),
            cacheItem = cache[element[jQueryElementIdPropertyName]] || {},
            events = cacheItem.events || [];

        groupAutoCollapsed(getElementCaption($element), function() {
            $.each(events, function(eventName, supscriptions){
                groupAutoCollapsed(eventName, function() {
                    $.each(supscriptions, function(i, subscription) {
                        console.log(element);
                        console.log(subscription);
                        console.log(subscription.handler);
                    });
                });
            });
        });
    };

    /*
     * Log to console all handlers assigned through jQuery to DOM nodes
     * @param  {String}   elements   DOM node or jQuery set of DOM nodes
     */
    console.logEvents = function(elements) {
        var $elements = $(elements);

        if ($elements.size() < 2) {
            logElementEvents($elements);
        } else {
            groupAutoCollapsed(getElementCaption($elements), function(){
                $.each($elements, function(){
                    logElementEvents(this);
                });
            });
        }
    };

})(jQuery)