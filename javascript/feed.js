(function() {
  function Feed() {}

  Feed.events = {
    success: 'success',
    update: 'update'
  };
  Feed.items = [];
  Feed.options = null;

  Feed.sort = function(array) {
    items = _todaysItems(array);

    items.sort(function(a, b) {
      return Feed.time(a.DateStart + ' ' + a.TimeStart) - Feed.time(b.DateStart + ' ' + b.TimeStart);
    });
    return items;
  };

  Feed.request = function() {
    $.ajax({ url: Feed.options.url, dataType: 'xml', success: function(xmlDoc) {
      Feed.items = Feed.sort(Feed.json(xmlDoc));
      $(Feed).triggerHandler(Feed.events.success);
    }});
  };

  Feed.observe = function() {
    setInterval(function() {
      $.ajax({ url: Feed.options.url, dataType: 'xml', success: function(xmlDoc) {
        var itemsCopy = Feed.items.slice(0),
          feed = Feed.json(xmlDoc);

        Feed.items = Feed.sort(feed);
        if (!_isEqual(feed, Feed.items)) {
          // Check if new feed is different than the current one
          $(Feed).triggerHandler(Feed.events.update);
        }
      }});
    }, 60000);
  };

  Feed.day = function(date) {
    date = date ? new Date(date) : new Date();
    return date.setHours(0, 0, 0, 0);
  };

  Feed.time = function(date) {
    return date ? new Date(date).getTime() : new Date().getTime();
  };

  Feed.hours = function(time) {
    return new Date(time).getHours();
  };

  Feed.json = function(xmlDoc) {
    return $.xml2json(xmlDoc).channel.item;
  }

  Feed.dayDiff = function(time1, time2) {
    return Math.ceil((time1 - time2)/(1000*60*60*24));
  };

  Feed.unit = function(unit) {
    if (!isNaN(Feed.options.unit*1)) { return true; }
    return (unit == Feed.options.unit) || false;
  };

  Feed.afterMidnight = function(time1, time2) {
    return (Feed.dayDiff(time1, time2) == 1 && Feed.hours(time1) <= 3);
  };

  Feed.futureToday = function(date1, date2, time1, time2) {
    return (date1 == date2 && time1 >= time2);
  };

  Feed.singlepost = function() {
    if (typeof Feed.options.singlepost == 'string') {
      return Feed.options.singlepost == 'true';
    } else if (typeof Feed.options.singlepost == 'number') {
      return !!Feed.options.singlepost;
    }
    return Feed.options.singlepost;
  };

  function _todaysItems(array) {
    var currentDate = Feed.day(),
      currentTime = Feed.time(),
      i = array.length,
      todaysItems = [], date, time;

    while (i--) {
      date = Feed.day(array[i].DateStart);
      time = Feed.time(array[i].DateStart + ' ' + array[i].TimeStart);

      // If it is going to happen today, it is not passed and is of a unit
      if (Feed.futureToday(date, currentDate, time, currentTime) || Feed.afterMidnight(time, currentTime)) {
        if (Feed.unit(array[i].Unit)) {
          todaysItems.push(array[i]);

          // If it is single post
          if (Feed.singlepost()) {
            console.log(Feed.options.singlepost)
            break;
          }
        }
      }
    }
    return todaysItems;
  };

  function _isEqual(feed1, feed2) {
    return JSON.stringify(feed1[0]) === JSON.stringify(feed2[0]);
  }

  window.Feed = Feed;
})();
