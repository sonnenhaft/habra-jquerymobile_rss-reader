jQuery(document).ready(function($){
    var rssMemory = new RssMemory();
    rssMemory.initSavedFeeds();
    // [{url: '', date: DateObject, content:BigContent, desc: SmallContent}, ..]
    var DEFAULT_URL = "http://habrahabr.ru/rss/best";
    var savedUrl = localStorage.getItem('FeedUrl') || savedUrl;
    $('#FeedUrl').attr('placeholder', savedUrl).val(savedUrl).change(function(){
        localStorage.setItem('FeedUrl', $(this).val());
    });
    var saveButton = $('.saveButton');
    $('#feeds').FeedEk({FeedUrl: savedUrl,
        rssError: function(){
            $.mobile.changePage("#rss_error", {transition: 'pop', role: 'dialog'});
        },
        ajaxError: function(){
            $.mobile.changePage("#offline_error", {transition: 'pop', role: 'dialog'});
        },
        success: function(feeds, title){
            $('#rssUrlHeader').text(title);
            $('title').text(title);
            $('#feeds').collapsibleset().append($.map(feeds, function(feed, ignored){
                feed.content = feed.content.replace(/\#[a-z\-\_]+/i, '');
                var feedContent = $('<p>');
                var feedTitle = $('<h4>', {text: feed.title}).one('click', function(){
                    feedContent.html(feed.content)
                });
                var clonedSaveButton = saveButton.clone();
                clonedSaveButton.attr('data-save-button', feed.title).click(function(){
                    clonedSaveButton.fadeOut('slow', function(){
                        clonedSaveButton.closest('h4').addClass('hidden-button');                        
                    });
                    rssMemory.rememberFeed(feed.title, feed.content);
                    return false;
                });
                if (localStorage.getItem(feed.title)){
                    feedTitle.addClass('hidden-button')
                }
                return $('<div>', {
                    'data-role': "collapsible"
                }).append(feedTitle.append(clonedSaveButton), feedContent);
            })).collapsibleset("refresh");
        }});
});