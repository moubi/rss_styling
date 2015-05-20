(function() {

  Grid.$container = null;

  function Grid(length, type) {
    this.length = length;
    this.type = type;

    this.scale();
  }

  Grid.prototype.scale = function() {
    if (this.type == 'list') {
      var padding = 380/this.length + 'px',
        fontSize = 555/this.length - (15 - this.length) + '%';

      console.log(fontSize)

      Grid.$container.css('font-size', fontSize);
      Grid.$container.children().css({
        'padding-top': padding,
        'padding-bottom': padding
      });
    }
  };

  window.Grid = Grid;
})();