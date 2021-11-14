'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ImageAnnotator = function (_React$Component) {
  _inherits(ImageAnnotator, _React$Component);

  function ImageAnnotator(props) {
    _classCallCheck(this, ImageAnnotator);

    var _this = _possibleConstructorReturn(this, (ImageAnnotator.__proto__ || Object.getPrototypeOf(ImageAnnotator)).call(this, props));

    _this.state = {
      anno: null
    };
    return _this;
  }

  _createClass(ImageAnnotator, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var anno = Annotorious.init({
        image: document.getElementById('img1'),
        widgets: ['COMMENT']
      });
      anno.loadAnnotations('img1_anno.json');
      this.setState({ anno: anno });
    }
  }, {
    key: 'saveAnnotations',
    value: function saveAnnotations() {
      fetch('/api/save_annotations', {
        method: 'POST',
        body: JSON.stringify({ content: JSON.stringify(this.state.anno.getAnnotations()) }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        if (response.ok) return response.text();
      }).then(function (text) {
        console.log(text);
      }).catch(function (err) {
        console.log('Error:', err);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return React.createElement(
        'div',
        null,
        React.createElement('img', { id: 'img1', src: '/ui/img1.jpg', width: '300' }),
        React.createElement(
          'button',
          { onClick: function onClick() {
              return _this2.saveAnnotations();
            } },
          'Save'
        )
      );
    }
  }]);

  return ImageAnnotator;
}(React.Component);

export { ImageAnnotator };