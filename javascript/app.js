(function() {
  // Default options.
  // These will be overridden by config.xml
  var _options = { config: 'config.xml' };
  var Feed = null;

  function App() {
    this.$container = null;
    this.$itemTemplate = null;
    this.callback = null;
    this.config();
  }

  App.prototype.init = function(FeedEngine, callback) {
    Feed = FeedEngine;
    Feed.options = _options;
    this.$container = $('#container');
    this.$itemTemplate = $('.template > .item');
    this.callback = callback;

    Feed.request();
    Feed.observe();
    $(Feed).on(Feed.events.success, $.proxy(this.append, this));
    $(Feed).on(Feed.events.update, $.proxy(this.newEvent, this));
  };

  App.prototype.append = function() {
    var htmlItems = this.match(Feed.items.slice(0, _options.limit), this.$itemTemplate);

    this.$container.html('').append(htmlItems);
    (typeof this.callback === 'function') && this.callback();
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

  window.App = new App();
})();
