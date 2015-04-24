(function() {
  var _options = {
    url: 'grupp00.xml',
    container: '#container',
    limit: 15
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

    Feed.request(this.options.url);
    Feed.observe(this.options.url);
    $(Feed).on(Feed.events.success, $.proxy(this.append, this));
  };

  App.prototype.append = function() {
    var $container = $(this.options.container),
      $template = $('.template > .item'),
      htmlItems = Feed.match(Feed.items.slice(0, this.options.limit), $template);

    $container.html('').append(htmlItems);
    (typeof this.callback === 'function') && this.callback();
  };

  window.App = new App();
})();
