(function($){
    $.fn.FeedEk = function(opt){
        var def = $.extend({
            FeedUrl: "http://habrahabr.ru/rss/best",
            success: function(){},
            ajaxError:function(){},
            rssError: function(){}
        }, opt);
        var $this = $($(this).attr("id"));
        var rssJSON = null;
        $.ajax({
            url: "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&output=json&q=" + encodeURIComponent(def.FeedUrl) + "&hl=en&callback=?",
            dataType: "json"
        }).done(function(data){
            if (!data || !data.responseData || !data.responseData.feed || !data.responseData.feed.entries) {
                def.rssError();
                return
            }
            var rssJSON = $.map(data.responseData.feed.entries, function(feed, index){
                return {
                    title: feed.title,
                    url: feed.link,
                    desc: feed.contentSnippet,
                    date: new Date(feed.publishedDate),
                    content: feed.content
                }
            });
            def.success(rssJSON , data.responseData.feed.title);
        }).error(def.ajaxError);
    };
})(jQuery);