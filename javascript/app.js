(function() {
  var _options = {
    feed: 'grupp00.xml',
    container: '#container'
  };

  var Feed = null;

  function App() {
    this.$items = null;
    this.callback = null;
    this.options = $.extend({}, _options);
  }

  App.prototype.init = function(FeedEngine, callback) {
    Feed = FeedEngine;
    this.callback = callback;

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
      feedItems = Feed.sort(this.$items),
      htmlItems = Feed.match(feedItems, $template);

    $container.html('').append(htmlItems);
    (typeof this.callback === 'function') && this.callback();
  };

  window.App = new App();
})();
