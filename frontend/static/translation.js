'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Translator = function (_React$Component) {
    _inherits(Translator, _React$Component);

    function Translator(props) {
        _classCallCheck(this, Translator);

        var _this = _possibleConstructorReturn(this, (Translator.__proto__ || Object.getPrototypeOf(Translator)).call(this, props));

        _this.state = { output_file_path: '' };
        return _this;
    }

    _createClass(Translator, [{
        key: 'onSubmit',
        value: function onSubmit(e) {
            var _this2 = this;

            e.preventDefault();
            this.setState({ output_file_path: '' }); // trigger rerender, TODO: avoid rerender
            fetch('/api/latex_to_pdf', {
                method: 'POST',
                body: JSON.stringify({ content: this.inputContent.value }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                if (response.ok) return response.json();
            }).then(function (json) {
                _this2.setState({ output_file_path: "/ui/" + json['file_name'] }); // trigger rerender
            }).catch(function (err) {
                console.log('Error:', err);
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            return React.createElement(
                'div',
                null,
                React.createElement(
                    'form',
                    { onSubmit: function onSubmit(e) {
                            return _this3.onSubmit(e);
                        } },
                    React.createElement('input', { type: 'text', ref: function ref(content) {
                            return _this3.inputContent = content;
                        } }),
                    React.createElement(
                        'button',
                        { 'class': 'btn btn-primary', type: 'submit' },
                        'Go'
                    )
                ),
                React.createElement('iframe', { src: this.state.output_file_path })
            );
        }
    }]);

    return Translator;
}(React.Component);

export { Translator };