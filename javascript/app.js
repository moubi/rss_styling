(function() {
  _options = {
    feed: 'grupp00.xml',
    container: '.container'
  };

  function App() {
    this.$items = null;
    this.options = $.extend({}, _options);
  }

  App.prototype.init = function(options) {
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
    $items = $.xml2json(xmlDoc).channel.item

    if ($items.length) {
      this.$items = $items;
      this.append();
    }
  };

  App.prototype.append = function() {
    $container = $(this.options.container);
    $template = $container.children(':first-child');
    i = this.$items.length;
    items = []

    while (i--) {
      // $template.clone()
      // this.$items[i]
    }
  };

  window.App = new App;
})();
