// (C) Copyright 2014-2015 Hewlett-Packard Development Company, L.P.

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var Introduction = require('./Introduction');
var Philosophy = require('./Philosophy');
var Basics = require('./Basics');
var Patterns = require('./Patterns');
var Showcase = require('./Showcase');
var Login = require('./patterns/Login');
var Section = require('grommet/components/Section');
var TBD = require('grommet/components/TBD');
var GrommetDocument = require('grommet/components/Document');
var Footer = require('grommet/components/Footer');
var Menu = require('grommet/components/Menu');

var CONTENTS = [
  {route: "sg_introduction", label: 'Introduction', component: Introduction, default: true},
  {route: "sg_philosophy", label: 'Philosophy', component: Philosophy,
    contents: [
      {
        label: 'Best Practices',
        id: 'best-practices'
      },
      {
        label: 'Usability',
        id: 'usability'
      },
      {
        label: 'Interactions',
        id: 'interactions'
      },
      {
        label: 'Mobile',
        id: 'mobile'
      },
      {
        label: 'Accessibility',
        id: 'accessibility'
      }
    ]},
  {route: "sg_basics", label: 'Basics', component: Basics,
    contents: [
      {
        label: 'Color',
        id: 'color'
      },
      {
        label: 'Text',
        id: 'text'
      },
      {
        label: 'Typography',
        id: 'typography'
      },
      {
        label: 'Writing Style',
        id: 'writing-style'
      },
      {
        label: 'Date and Time',
        id: 'date-time'
      },
      {
        label: 'Capitalization',
        id: 'capitalization'
      },
      {
        label: 'Icons',
        id: 'icons'
      }
    ]},
  {route: "sg_patterns", label: 'Patterns', component: Patterns,
    contents: [
      {route: "sg_login", label: 'Login', component: Login},
      {route: "sg_header", label: 'Header', component: TBD},
      {route: "sg_dashboard", label: 'Dashboard', component: TBD},
      {route: "sg_search", label: 'Search', component: TBD}
    ]
  },
  {route: "sg_showcase", label: 'Showcase', component: Showcase,
    contents: [
      {id: "oneview-dashboard", label: 'OneView Dashboard'},
      {id: "oneview-masterpage", label: 'OneView Master Page'},
      {id: "propel-dashboard", label: 'Propel Dashboard'},
      {id: "propel-prod-detail", label: 'Propel Product Detail'}
    ]
  }
];

var StyleGuide = React.createClass({

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  render: function () {

    this._chapterIndex = -2;

    var chapterLinks = CONTENTS.map(function (chapter, index) {
      var chapterActive = this.context.router.isActive(chapter.route);
      var pageActive = (chapter.hasOwnProperty('contents') &&
        chapter.contents.some(function (page) {
          return page.route ? this.context.router.isActive(page.route) : false;
        }.bind(this)));
      var active = chapterActive || pageActive;

      var className = '';
      if (active) {
        className = 'active';
        this._chapterIndex = index;
      }

      return (
        <Link key={chapter.label} to={chapter.route} className={className}>
          {chapter.label}
        </Link>
      );
    }.bind(this));

    var chapter = CONTENTS[this._chapterIndex];
    var header = React.createFactory(chapter.component.Header)();
    var pageLinks = null;
    var nextLink = null;
    var onPage = false;
    var layoutCompact = false;

    if (chapter.hasOwnProperty('contents')) {

      var activePageIndex = -2;
      pageLinks = chapter.contents.map(function (page, index) {

        var className = '';
        if (page.route && this.context.router.isActive(page.route)) {
          className = 'active';
        }

        var pageLink = page.id ?
          <a key={page.id} href={"#" + page.id} className={className}>{page.label}</a>
        : (
          <Link key={page.label} to={page.route} className={className}>
            {page.label}
          </Link>
        );

        if (page.route && this.context.router.isActive(page.route)) {
          onPage = true;
          activePageIndex = index;
          layoutCompact = true;
          header = (
            <Menu direction="left" colored={true}>
              {chapterLinks[this._chapterIndex]}
              {pageLink}
            </Menu>
          );
        } else if (activePageIndex === (index - 1)) {
          nextLink = pageLink;
        }

        return pageLink;

      }.bind(this));
    }

    var next = null;
    if (! nextLink) {
      nextLink = chapterLinks[this._chapterIndex + 1];
    }
    if (nextLink) {
      next = <span>Next: {nextLink}</span>;
    }

    if (onPage) {
      // we are on a page, no chapters
      chapterLinks = null;
    }

    var colorIndex = this._chapterIndex + 1;

    return (
      <div>
        <Section direction="right" colorIndex={"neutral-" + colorIndex}
          compact={layoutCompact}>
          <Menu direction="down" colored={true} >
            {chapterLinks}
          </Menu>
          {header}
        </Section>
        <Section direction="right">
          <Menu direction="down" inline={true}>{pageLinks}</Menu>
          <GrommetDocument colorIndex={"neutral-" + colorIndex}>
            <RouteHandler />
          </GrommetDocument>
        </Section>
        <Footer scrollTop={true}>
          <Menu></Menu>
          <Menu className="flex-1" direction="left">{next}</Menu>
        </Footer>
      </div>
    );
  }
});

var Empty = React.createClass({
  render: function () {
    return (<div></div>);
  }
});

function createContentRoutes(contents, level) {
  var result = [];
  contents.forEach(function (content) {

    var handler;
    if (level > 1) {
      handler = content.component;
    } else {
      handler = content.component.Section;
    }
    if (! handler) {
      handler = Empty;
    }

    if (content.default) {
      result.push(
        <DefaultRoute key={content.label} name={content.route}
          handler={handler} />
      );
    } else {
      result.push(
        <Route key={content.label} name={content.route}
          path={content.label.toLowerCase()}
          handler={handler} />
      );
    }

    if (content.hasOwnProperty('contents')) {
      result = result.concat(createContentRoutes(content.contents, level + 1));
    }
  });
  return result;
}

StyleGuide.routes = function () {
  var routes = createContentRoutes(CONTENTS, 1);
  return (
    <Route name="style guide" path="styleguide" handler={StyleGuide}>
      {routes}
    </Route>
  );
};

module.exports = StyleGuide;
