var savedUrl = localStorage.getItem('FeedUrl') || 'https://habr.ru/rss/best';

$.get('https://zebrazobrazubra.000webhostapp.com/?url=' + savedUrl, function (data) {
    var rssMemory = new RssMemory();
    rssMemory.initSavedFeeds();

    const feeds = $(data).find('item').toArray().map(item => ({
        content: $(item).find('description').html().toString().replace('<![CDATA[', '').replace(']]&gt;', ''),
        image: $(item).find('url').text(),
        title: $(item).find('title').text().replace('<![CDATA[', '').replace(']]>', '')
    }));

    $('#feeds').collapsibleset().html(feeds.map(({content, title}, index) => `<div data-role="collapsible" text-id="${index}">
                    <h4${localStorage.getItem(title) ? 'class="hidden-button"' : ''}>
                        ${title}
                         <a href="index.html" data-role="button"
                               data-iconpos="right" data-theme="b" data-icon="plus"
                               data-mini="true" class="saveButton ui-btn-right  ui-btn ui-shadow ui-corner-all ui-btn-icon-left  ui-icon-plus"> </a>    
                    </h4>
                    <p></p>
            </div>`).join('')).collapsibleset('refresh');

    $('.saveButton').click(function () {
        let {title, content} = feeds[$(this).parent().parent().parent().attr('text-id')];
        $(this).fadeOut('slow', function () {
            $(this).closest('h4').addClass('hidden-button');
        });
        rssMemory.rememberFeed(title, content);
        return false;
    });

    $('h4').one('click', function () {
        $(this).parent().find('p').html(feeds[$(this).parent().attr('text-id')].content)
    })
}).fail(function () {
    // $.mobile.changePage("#rss_error", {transition: 'pop', role: 'dialog'});
    $.mobile.changePage("#offline_error", {transition: 'pop', role: 'dialog'});
});
