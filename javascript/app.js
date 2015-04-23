(function() {
  var _options = {
    feed: 'grupp00.xml',
    container: '.container'
  };

  var Feed = null;

  function App() {
    this.$items = null;
    this.options = $.extend({}, _options);
  }

  App.prototype.init = function(FeedEngine, options) {
    Feed = FeedEngine;

    if (options) {
      $.extend(this.options, options);
    }

    $.ajax({
      url: this.options.feed,
      dataType: 'xml',
      success: $.proxy(this.feed, this)
    });
  };

  App.prototype.feed = function(xmlDoc) {
    var $items = $.xml2json(xmlDoc).channel.item;

    if ($items.length) {
      this.$items = $items;
      this.append();
    }
  };

  App.prototype.append = function() {
    var $container = $(this.options.container),
      $template = $('.template > .item'),
      feedItems = Feed.sort(this.$items).reverse(),
      i = feedItems.length,
      htmlItems = [];

    while (i--) {
      htmlItems.push(Feed.match(feedItems[i], $template.clone()));
    }
    $container.html('').append(htmlItems);
  };

  window.App = new App;
})();
