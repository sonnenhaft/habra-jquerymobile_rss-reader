var RssMemory;
(function($){
    RssMemory = function(){
        this.forgetButton = $('.forgetButton');
        this.savedFeeds = $('#savedFeeds');
        this._rememberFeed = this._rememberFeed.bind(this);
    };
    RssMemory.prototype = {
        savedFeeds: null,
        forgetButton: null,
        rememberFeed: function(title, content){
            localStorage.setItem(title, content);
            this._rememberFeed(title, content)
        },
        _forgetFeed: function(title){
            localStorage.removeItem(title);
            var targetBlock = $('[data-title="' + title + '"]');
            targetBlock.fadeOut('slow', function(){
                targetBlock.remove();
            });
            $('[data-save-button="' + title + '"]').show().closest('h4').removeClass('hidden-button');
        },
        _rememberFeed: function(title, content){
            if (title == 'FeedUrl') return;
            var that = this;
            var forgetButton = this.forgetButton.clone().click(function(){
                that._forgetFeed(title);
                return false;
            });
            var feedBlock = $('<div>', {
                'data-title': title,
                'data-collapsed-icon': "arrow-r",
                'data-expanded-icon': "arrow-d"
            }).append($('<h4>', {text: title}).append(forgetButton), $('<p>').html(content));
            this.savedFeeds.append(feedBlock.collapsible());
        },
        initSavedFeeds: function(){
            $.each(localStorage, this._rememberFeed);
        }
    }
})(jQuery);