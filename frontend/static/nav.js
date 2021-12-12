'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _MaterialUI = MaterialUI,
    Tabs = _MaterialUI.Tabs,
    Tab = _MaterialUI.Tab,
    Box = _MaterialUI.Box,
    Typography = _MaterialUI.Typography;


function TabPanel(props) {
  var children = props.children,
      value = props.value,
      index = props.index,
      other = _objectWithoutProperties(props, ['children', 'value', 'index']);

  return React.createElement(
    'div',
    Object.assign({
      role: 'tabpanel',
      hidden: value !== index,
      id: 'simple-tabpanel-' + index,
      'aria-labelledby': 'simple-tab-' + index
    }, other),
    value === index && React.createElement(
      Box,
      { sx: { p: 3 } },
      React.createElement(
        Typography,
        null,
        children
      )
    )
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: 'simple-tab-' + index,
    'aria-controls': 'simple-tabpanel-' + index
  };
}

var Navigator = function (_React$Component) {
  _inherits(Navigator, _React$Component);

  function Navigator(props) {
    _classCallCheck(this, Navigator);

    var _this = _possibleConstructorReturn(this, (Navigator.__proto__ || Object.getPrototypeOf(Navigator)).call(this, props));

    _this.handleChange = function (_, newValue) {
      _this.setState({ value: newValue });
    };

    _this.state = { value: 0 };
    return _this;
  }

  _createClass(Navigator, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        Box,
        { sx: { width: '100%' } },
        React.createElement(
          Box,
          { sx: { borderBottom: 1, borderColor: 'divider' } },
          React.createElement(
            Tabs,
            { value: this.state.value, onChange: this.handleChange },
            React.createElement(Tab, Object.assign({ label: 'Bulletin' }, a11yProps(0))),
            React.createElement(Tab, Object.assign({ label: 'Files' }, a11yProps(1))),
            React.createElement(Tab, Object.assign({ label: 'Feedback' }, a11yProps(2))),
            React.createElement(Tab, Object.assign({ label: 'Polls' }, a11yProps(3))),
            React.createElement(Tab, Object.assign({ label: 'Translation' }, a11yProps(4))),
            React.createElement(Tab, Object.assign({ label: 'Marking' }, a11yProps(5)))
          )
        ),
        React.createElement(
          TabPanel,
          { value: this.state.value, index: 0 },
          'Bulletin'
        ),
        React.createElement(
          TabPanel,
          { value: this.state.value, index: 1 },
          'Files'
        ),
        React.createElement(
          TabPanel,
          { value: this.state.value, index: 2 },
          'Feedback'
        ),
        React.createElement(
          TabPanel,
          { value: this.state.value, index: 3 },
          'Polls'
        ),
        React.createElement(
          TabPanel,
          { value: this.state.value, index: 4 },
          'Translation'
        ),
        React.createElement(
          TabPanel,
          { value: this.state.value, index: 5 },
          'Marking'
        )
      );
    }
  }]);

  return Navigator;
}(React.Component);

export { Navigator };