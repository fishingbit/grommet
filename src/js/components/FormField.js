// (C) Copyright 2014-2015 Hewlett-Packard Development Company, L.P.

var React = require('react');

var CLASS_ROOT = "form-field";

var FormField = React.createClass({

  propTypes: {
    error: React.PropTypes.string,
    help: React.PropTypes.node,
    htmlFor: React.PropTypes.string,
    label: React.PropTypes.string,
    required: React.PropTypes.bool
  },

  _onFocus: function () {
    this.setState({focus: true});
  },

  _onBlur: function () {
    this.setState({focus: false});
  },

  _onClick: function () {
    if (this._inputElement) {
      this._inputElement.focus();
    }
  },

  getInitialState: function () {
    return {focus: false};
  },

  componentDidMount: function () {
    var contentsElement = this.refs.contents.getDOMNode();
    var inputElements = contentsElement.querySelectorAll('input, textarea, select');
    if (inputElements.length === 1) {
      this._inputElement = inputElements[0];
      this._inputElement.addEventListener('focus', this._onFocus);
      this._inputElement.addEventListener('blur', this._onBlur);
    }
  },

  componentWillUnmount: function () {
    if (this._inputElement) {
      this._inputElement.removeEventListener('focus', this._onFocus);
      this._inputElement.removeEventListener('blur', this._onBlur);
      delete this._inputElement;
    }
  },

  render: function () {
    var classes = [CLASS_ROOT];
    if (this.state.focus) {
      classes.push(CLASS_ROOT + "--focus");
    }
    if (this.props.required) {
      classes.push(CLASS_ROOT + "--required");
    }
    if (this.props.htmlFor) {
      classes.push(CLASS_ROOT + "--text");
    }

    var error = null;
    if (this.props.error) {
      classes.push(CLASS_ROOT + "--error");
      error = <span className={CLASS_ROOT + "__error"}>{this.props.error}</span>;
    }
    var help = null;
    if (this.props.help) {
      help = <span className={CLASS_ROOT + "__help"}>{this.props.help}</span>;
    }

    return (
      <div className={classes.join(' ')} onClick={this._onClick}>
        {error}
        <label className={CLASS_ROOT + "__label"} htmlFor={this.props.htmlFor}>
          {this.props.label}
        </label>
        <span ref="contents" className={CLASS_ROOT + "__contents"}>
          {this.props.children}
        </span>
        {help}
      </div>
    );
  }

});

module.exports = FormField;
