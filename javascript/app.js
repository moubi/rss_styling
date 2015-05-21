(function() {
  // Default options.
  // These will be overridden by config.xml
  var _options = { config: 'config.xml' };
  var Feed = null;
  var Grid = null;

  var CLASSES = {
    LIST: 'list',
    SPECIAL: 'special',
    DEFAULT: 'default'
  };

  function App() {
    this.$container = null;
    this.$itemTemplate = null;
    this.callback = null;
    this.config();
  }

  App.prototype.init = function(GridEngine, FeedEngine, callback) {
    this.$container = $('#container');
    this.$itemTemplate = $('.template > .item');
    this.callback = callback;
    Feed = FeedEngine;
    Grid = GridEngine;
    Grid.$container = this.$container;
    Feed.options = _options;

    Feed.request();
    Feed.observe();
    $(Feed).on(Feed.events.success, $.proxy(this.append, this));
    $(Feed).on(Feed.events.update, $.proxy(this.newEvent, this));
  };

  App.prototype.append = function() {
    if (Feed.items.length) {
      var htmlItems = this.match(Feed.items.slice(0, _options.limit), this.$itemTemplate);
      htmlItems = _shuffle(htmlItems);

      this.$container.html('').append(htmlItems);
      this.layout();
      (typeof this.callback === 'function') && this.callback();
    }
  };

  App.prototype.match = function(feedItems, $template) {
    var template = null,
      length = feedItems.length, i,
      items = [];

    for (i = 0; i < length; i++) {
      template = _match($template.clone(), feedItems[i], i+1);
      items.push(template);
    }

    return items;
  };

  App.prototype.newEvent = function() {
    var feedItems = Feed.items.slice(0, _options.limit);
    this.append();
  };

  App.prototype.config = function() {
    $.ajax({ url: _options.config, dataType: 'xml', async: false, success: function(xmlDoc) {
      $.extend(_options, $.xml2json(xmlDoc));
    }});
  };

  App.prototype.layout = function() {
    this.$container.removeClass();
    this.$container.addClass(CLASSES[_options.template.toUpperCase()]);
    new Grid(Feed.items.slice(0, _options.limit).length, _options.template);
  };

  function _match($template, item, id) {
    $template.children().each(function(index, el) {
      el = $(el);
      el.html(item[el.data('rss-tag')]);
    });

    $template.attr({
      'data-myorder': id,
      'data-TimeStart': item.TimeStart,
      'data-TimeEnd': item.TimeEnd,
      'data-DateStart': item.DateStart
    });
    return $template;
  }

  function _shuffle(array) {
    var j, i, temp, length = array.length;
    array = array.slice(0);

    for (var i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }

  window.App = new App();
})();
