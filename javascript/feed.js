(function() {
  function Feed() {}

  Feed.sort = function(array) {
    items = _todaysItems(array);

    items.sort(function(a, b) {
      return a.TimeStart - b.TimeStart
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

  function _todaysItems(array) {
    var currentDate = _day(),
      i = array.length,
      todaysItems = [], date;

    while (i--) {
      date = _day(array[i].Date);
      (date == currentDate) && todaysItems.push(array[i]);
    }
    return todaysItems;
  };

  function _day(date) {
    date = date ? new Date(date) : new Date();
    return date.setHours(0, 0, 0, 0);
  };

  window.Feed = Feed;
})();
