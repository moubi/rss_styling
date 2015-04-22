(function() {
  function App() {}

  App.prototype.init = function(rss) {
    if (!rss) { throw 'RSS feed must be provided' }

    $.ajax({
      url: rss,
      dataType: 'xml',
      success: $.proxy(this.feed, this)
    });
  };

  App.prototype.feed = function(xmlDoc) {
    console.log($(xmlDoc.documentElement).find('item'));
  };

  window.App = new App;
})();
