(function() {
  function Feed() {}

  Feed.events = { success: 'success' };
  Feed.items = [];

  Feed.sort = function(array) {
    items = _todaysItems(array);

    items.sort(function(a, b) {
      return _time(a.Date + ' ' + a.TimeStart) - _time(b.Date + ' ' + b.TimeStart);
      // return a.TimeStart - b.TimeStart
    });
    return items;
  };

  Feed.match = function(feedItems, $template) {
    var template = null,
      length = feedItems.length, i,
      items = [];

    for (i = 0; i < length; i++) {
      template = $template.clone();
      template.children().each(function(index, el) {
        el = $(el);
        el.html(feedItems[i][el.data('rss-tag')]);
      });

      template.attr('data-myorder', i+1);
      items.push(template);
    }

    return items;
  };

  Feed.request = function(url) {
    $.ajax({ url: url, dataType: 'xml', success: _success });
  };

  Feed.observe = function(url) {
    setInterval(function() {

    }, 60000);
  };

  function _success(xmlDoc) {
    var items = $.xml2json(xmlDoc).channel.item;

    if (items.length) {
      Feed.items = Feed.sort(items);
      $(Feed).triggerHandler(Feed.events.success);
    }
  }

  function _todaysItems(array) {
    var currentDate = _day(),
      currentTime = _time(),
      i = array.length,
      todaysItems = [], date, time;

    while (i--) {
      date = _day(array[i].Date);
      time = _time(array[i].Date + ' ' + array[i].TimeStart);

      if (date == currentDate && time >= currentTime) {
        todaysItems.push(array[i]);
      }
    }
    return todaysItems;
  };

  function _day(date) {
    date = date ? new Date(date) : new Date();
    return date.setHours(0, 0, 0, 0);
  };

  function _time(date) {
    return date ? new Date(date).getTime() : new Date().getTime();
  }

  window.Feed = Feed;
})();
