(function() {
  function Feed() {}

  Feed.sort = function(array) {
    items = _todaysItems(array);

    items.sort(function(a, b) {
      return a.TimeStart - b.TimeStart
    });
    return items;
  };

  Feed.match = function(item, $template) {
    var $placeholders = $template.children();

    $placeholders.each(function(index, el) {
      el = $(el);
      el.html(item[el.data('rss-tag')]);
    });
    return $template;
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
