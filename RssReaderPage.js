const addFeedToDom = (title, description) => {
    const forgetButton = $('.forgetButton').clone().click(function () {
        const savedFeeds = JSON.parse(localStorage.getItem('feeds') || '[]');
        savedFeeds.splice(savedFeeds.indexOf(({title: t}) => t === title), 1)
        localStorage.setItem('feeds', JSON.stringify(savedFeeds));
        const targetBlock = $('[data-title="' + title + '"]');
        targetBlock.fadeOut('slow', () => targetBlock.remove());
        $('[data-save-button="' + title + '"]').show().closest('h4').removeClass('hidden-button');
        return false;
    });

    $('#savedFeeds').append($('<div>', {
        'data-title': title,
        'data-collapsed-icon': "arrow-r",
        'data-expanded-icon': "arrow-d"
    }).append(
        $('<h4>', {text: title}).append(forgetButton),
        $('<p>').html(description)
    ).collapsible());
}

const savedFeeds = JSON.parse(localStorage.getItem('feeds') || '[]');
savedFeeds.forEach(feed => {
    addFeedToDom(feed.title, feed.description);
})

const setFeeds = feeds => {
    $('#feeds').collapsibleset().html(feeds.map(({description, title}, index) => `<div data-role="collapsible" text-id="${index}">
                    <h4${localStorage.getItem(title) ? 'class="hidden-button"' : ''}>
                        ${title}
                         <a href="index.html" data-role="button"
                               data-iconpos="right" data-theme="b" data-icon="plus"
                               data-mini="true" class="saveButton ui-btn-right  ui-btn ui-shadow ui-corner-all ui-btn-icon-left  ui-icon-plus"> </a>    
                    </h4>
                    <p></p>
            </div>`).join('')).collapsibleset('refresh');

    $('.saveButton').click(function () {
        const feed = feeds[$(this).parent().parent().parent().attr('text-id')];
        $(this).fadeOut('slow', function () {
            $(this).closest('h4').addClass('hidden-button');
        });

        const savedFeeds = JSON.parse(localStorage.getItem('feeds') || '[]');
        savedFeeds.push(feed);
        localStorage.setItem('feeds', JSON.stringify(savedFeeds))
        addFeedToDom(feed.title, feed.description)
        return false;
    });

    const savedFeeds = JSON.parse(localStorage.getItem('feeds') || '[]');
    savedFeeds.forEach(({title}) => {
        const idx = feeds.findIndex(({title: t}) => title === title);
        $(`[text-id="${idx}"] h4`).addClass('hidden-button');
    });

    $('#feeds h4').one('click', function () {
        $(this).parent().find('p').html(feeds[$(this).parent().attr('text-id')].description)
    })
}

const savedUrl = localStorage.getItem('CurrentRssUrl') || 'https://habr.ru/rss/best';
$('#CurrentRssUrl').val(savedUrl);
$.get('https://cors-anywhere.herokuapp.com/' + savedUrl, (d) => {
    const replace = (xml, tag) => xml.querySelector(tag).innerHTML.toString()
        .replace('<![CDATA[', '')
        .replace(']]>');
    const channel = d.querySelector('channel');
    const item = Array.from(channel.querySelectorAll('item')).map(item => ({
        description: replace(item, 'description'),
        title: replace(item, 'title'),
    }))
    const title = replace(channel, 'title');
    $('#RssChannelTitle').text(title);
    $('title').text(title);
    setFeeds(item);
}).fail(function () {
    // $.mobile.changePage("#rss_error", {transition: 'pop', role: 'dialog'});
    $.mobile.changePage("#offline_error", {transition: 'pop', role: 'dialog'});
});
