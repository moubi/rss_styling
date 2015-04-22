(function() {
  function App() {
    this.$items = null;
  }

  App.prototype.init = function(rss) {
    if (!rss) { throw 'RSS feed must be provided' }

    $.ajax({
      url: rss,
      dataType: 'xml',
      success: $.proxy(this.feed, this)
    });
  };

  App.prototype.feed = function(xmlDoc) {
    $items = $.xml2json(xmlDoc).channel.item

    if ($items.length) {
      this.$items = $items;
      this.append();
    }
  };

  App.prototype.append = function() {
    i = this.$items.length;
    while (i--) {
      console.log(i);
      // el = $(el);
    }
  };

  window.App = new App;
})();
