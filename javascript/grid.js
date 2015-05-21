(function() {

  Grid.$container = null;

  function Grid(length, type) {
    this.length = length;
    this.type = type;

    this.scale();
  }

  Grid.prototype.scale = function() {
    var padding, fontSize, width;

    if (this.type == 'list') {
      padding = 380/this.length,
      fontSize = 555/this.length - (15 - this.length) + '%';

    } else if (this.type == 'special') {
      padding = 450/this.length,
      fontSize = 15*(6 + 15/this.length) + '%';

    } else {
      padding = 510/this.length,
      fontSize = 1500/this.length - (105 - 7*this.length) + '%';

      if (this.length <= 4 && this.length > 1) {
        width = '43%';
        padding = padding - 30 * (5 - this.length);
        fontSize = parseInt(fontSize) - (100 * (5 - this.length)) + '%';

      } else {
        width = '100%';
        padding = 180;
        fontSize = '350%';
      }
    }

    _css(fontSize, padding, width);
  };

  function _css(fontSize, padding, width) {
    Grid.$container.css('font-size', fontSize);
    Grid.$container.children().css({
      'padding-top': padding,
      'padding-bottom': padding
    });
    width && Grid.$container.children().css('width', width);
  }

  window.Grid = Grid;
})();
