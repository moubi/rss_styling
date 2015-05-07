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
      return parseInt(a.TimeStart.replace(':', '')) - parseInt(b.TimeStart.replace(':', ''));
    });

    // If it is single post
    if (Feed.singlepost() && items.length) {
      // If it is to be displayed full day or going to happen now
      if (Feed.showalways() || Feed.happenNow(items[0])) {
        items = [items[0]];
        items[0].singlepost = true;
      }
    }

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
        var itemsCopy = Feed.items.slice(0, Feed.options.limit),
          feed = Feed.json(xmlDoc);

        Feed.items = Feed.sort(feed);
        if (!_isEqual(itemsCopy, Feed.items.slice(0, Feed.options.limit))) {
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

  Feed.setHours = function(date, hours) {
    return date.setHours.apply(date, hours);
  };

  Feed.json = function(xmlDoc) {
    return $.xml2json(xmlDoc).channel.item;
  }

  Feed.dayDiff = function(time1, time2) {
    return Math.ceil((time1 - time2)/(1000*60*60*24));
  };

  Feed.unit = function(unit) {
    if (!Feed.options.unit) { return true; }

    // Event belongs to several units
    if (unit.length) {
      var i = unit.length;
      while (i--) {
        if (unit[i] == Feed.options.unit) {
          return true;
        }
      }
      return false;
    }
    return unit == Feed.options.unit;
  };

  Feed.afterMidnight = function(time1, time2) {
    return (Feed.dayDiff(time1, time2) == 1 && Feed.hours(time1) <= 3);
  };

  Feed.futureToday = function(date1, date2, time1, time2, time3) {
    return (date1 == date2 && (time1 >= time2 || time1 < time2 && time2 < time3));
  };

  Feed.singlepost = function() {
    return Feed.options.singlepost == 'true';
  };

  Feed.showalways = function() {
    return Feed.options.showalways == 'true';
  };

  Feed.happenNow = function(item) {
    var timeStart = Feed.setHours(new Date(), item.TimeStart.split(':')),
      timeEnd = Feed.setHours(new Date(), item.TimeEnd.split(':')),
      diff = Math.abs(Math.round((timeStart - new Date())/6000)),
      diffEnd = Math.round((timeEnd - new Date())/6000);

    // 5 min before or after event start time or between start and end time
    return diff <= 5 || (diff > 0 && diffEnd >= 0);
  };

  function _todaysItems(array) {
    var currentDate = Feed.day(),
      currentTime = Feed.time(),
      i = array.length,
      todaysItems = [], dateStart, timeStart, dateEnd;

    while (i--) {
      dateStart = Feed.day(array[i].DateStart);
      dateEnd = Feed.day(array[i].DateEnd);
      timeStart = Feed.time(array[i].DateStart + ' ' + array[i].TimeStart);
      timeEnd = Feed.time(array[i].DateStart + ' ' + array[i].TimeEnd);

      // If current date is between DateStart and DateEnd
      if (currentDate <= dateEnd && currentDate >= dateStart) {
        dateStart = currentDate;
        timeStart = Feed.setHours(new Date(currentDate), array[i].TimeStart.split(':'));
        timeEnd = Feed.setHours(new Date(currentDate), array[i].TimeEnd.split(':'));
      }

      // If it is going to happen today, it is not passed and is of a unit
      if (Feed.futureToday(dateStart, currentDate, timeStart, currentTime, timeEnd) || Feed.afterMidnight(timeStart, currentTime)) {
        if (Feed.unit(array[i].Unit)) {
          todaysItems.push(array[i]);
        }
      }
    }
    return todaysItems;
  };

  function _isEqual(feed1, feed2) {
    return JSON.stringify(feed1) === JSON.stringify(feed2);
  }

  window.Feed = Feed;
})();
