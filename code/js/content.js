/* global document, window, location, screen, self, $, AlgoliaSearch, safari, Hogan */

/////////////////////////////
//
// VARIABLES
//
/////////////////////////////

var NB_REPOS = 3;
var NB_MY_REPOS = 2;
var NB_USERS = 3;
var NB_ISSUES = 3;

/////////////////////////////
//
// TEMPLATES
//
/////////////////////////////

var octiconStar = '<svg aria-hidden="true" class="octicon octicon-star" height="16" role="img" version="1.1" viewBox="0 0 14 16" width="14"><path d="M14 6l-4.9-0.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14l4.33-2.33 4.33 2.33L10.4 9.26 14 6z"></path></svg>';
var octiconFork = '<svg aria-hidden="true" class="octicon octicon-git-branch" height="16" role="img" version="1.1" viewBox="0 0 10 16" width="10"><path d="M10 5c0-1.11-0.89-2-2-2s-2 0.89-2 2c0 0.73 0.41 1.38 1 1.72v0.3c-0.02 0.52-0.23 0.98-0.63 1.38s-0.86 0.61-1.38 0.63c-0.83 0.02-1.48 0.16-2 0.45V4.72c0.59-0.34 1-0.98 1-1.72 0-1.11-0.89-2-2-2S0 1.89 0 3c0 0.73 0.41 1.38 1 1.72v6.56C0.41 11.63 0 12.27 0 13c0 1.11 0.89 2 2 2s2-0.89 2-2c0-0.53-0.2-1-0.53-1.36 0.09-0.06 0.48-0.41 0.59-0.47 0.25-0.11 0.56-0.17 0.94-0.17 1.05-0.05 1.95-0.45 2.75-1.25s1.2-1.98 1.25-3.02h-0.02c0.61-0.36 1.02-1 1.02-1.73zM2 1.8c0.66 0 1.2 0.55 1.2 1.2s-0.55 1.2-1.2 1.2-1.2-0.55-1.2-1.2 0.55-1.2 1.2-1.2z m0 12.41c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2z m6-8c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2z"></path></svg>';
var octiconRepo = '<svg aria-hidden="true" class="octicon octicon-repo repo-icon" height="16" role="img" version="1.1" viewBox="0 0 12 16" width="12"><path d="M4 9h-1v-1h1v1z m0-3h-1v1h1v-1z m0-2h-1v1h1v-1z m0-2h-1v1h1v-1z m8-1v12c0 0.55-0.45 1-1 1H6v2l-1.5-1.5-1.5 1.5V14H1c-0.55 0-1-0.45-1-1V1C0 0.45 0.45 0 1 0h10c0.55 0 1 0.45 1 1z m-1 10H1v2h2v-1h3v1h5V11z m0-10H2v9h9V1z"></path></svg>';
var octiconLock = '<svg aria-hidden="true" class="octicon octicon-lock repo-icon" height="16" role="img" version="1.1" viewBox="0 0 12 16" width="12"><path d="M4 13h-1v-1h1v1z m8-6v7c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V7c0-0.55 0.45-1 1-1h1V4C2 1.8 3.8 0 6 0s4 1.8 4 4v2h1c0.55 0 1 0.45 1 1z m-8.2-1h4.41V4c0-1.22-0.98-2.2-2.2-2.2s-2.2 0.98-2.2 2.2v2z m7.2 1H2v7h9V7z m-7 1h-1v1h1v-1z m0 2h-1v1h1v-1z"></path></svg>';
var octiconComment = '<svg aria-hidden="true" class="octicon octicon-comment-discussion" height="16" role="img" version="1.1" viewBox="0 0 16 16" width="16"><path d="M15 2H6c-0.55 0-1 0.45-1 1v2H1c-0.55 0-1 0.45-1 1v6c0 0.55 0.45 1 1 1h1v3l3-3h4c0.55 0 1-0.45 1-1V10h1l3 3V10h1c0.55 0 1-0.45 1-1V3c0-0.55-0.45-1-1-1zM9 12H4.5l-1.5 1.5v-1.5H1V6h4v3c0 0.55 0.45 1 1 1h3v2z m6-3H13v1.5l-1.5-1.5H6V3h9v6z"></path></svg>';
var octiconOrganization = '<svg aria-hidden="true" class="octicon octicon-organization" height="16" role="img" version="1.1" viewBox="0 0 14 16" width="14"><path d="M4.75 4.95c0.55 0.64 1.34 1.05 2.25 1.05s1.7-0.41 2.25-1.05c0.34 0.63 1 1.05 1.75 1.05 1.11 0 2-0.89 2-2s-0.89-2-2-2c-0.41 0-0.77 0.13-1.08 0.33C9.61 1 8.42 0 7 0S4.39 1 4.08 2.33c-0.31-0.2-0.67-0.33-1.08-0.33-1.11 0-2 0.89-2 2s0.89 2 2 2c0.75 0 1.41-0.42 1.75-1.05z m5.2-1.52c0.2-0.38 0.59-0.64 1.05-0.64 0.66 0 1.2 0.55 1.2 1.2s-0.55 1.2-1.2 1.2-1.17-0.53-1.19-1.17c0.06-0.19 0.11-0.39 0.14-0.59zM7 0.98c1.11 0 2.02 0.91 2.02 2.02s-0.91 2.02-2.02 2.02-2.02-0.91-2.02-2.02S5.89 0.98 7 0.98zM3 5.2c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2c0.45 0 0.84 0.27 1.05 0.64 0.03 0.2 0.08 0.41 0.14 0.59-0.02 0.64-0.53 1.17-1.19 1.17z m10 0.8H1c-0.55 0-1 0.45-1 1v3c0 0.55 0.45 1 1 1v2c0 0.55 0.45 1 1 1h1c0.55 0 1-0.45 1-1v-1h1v3c0 0.55 0.45 1 1 1h2c0.55 0 1-0.45 1-1V12h1v1c0 0.55 0.45 1 1 1h1c0.55 0 1-0.45 1-1V11c0.55 0 1-0.45 1-1V7c0-0.55-0.45-1-1-1zM3 13h-1V10H1V7h2v6z m7-2h-1V9h-1v6H6V9h-1v2h-1V7h6v4z m3-1h-1v3h-1V7h2v3z"></path></svg>';

var templateYourRepo = Hogan.compile('<div class="aa-suggestion aa-your-repo">' +
  '<span class="aa-name">' +
    '{{#fork}}' + octiconFork + '{{/fork}}{{^fork}}{{#private}}' + octiconLock + '{{/private}}{{^private}}' + octiconRepo + '{{/private}}{{/fork}} ' +
    '<a href="https://github.com/{{ full_name }}/"><span class="owner">{{{ owner }}}</span>/<span class="aa-repo">{{{ highlightedName }}}</span></a>' +
  '</span>' +
'</div>');
var templateRepo = Hogan.compile('<div class="aa-suggestion aa-repo">' +
  '<div class="aa-thumbnail"><img src="https://avatars.githubusercontent.com/{{ owner }}?size=30" /></div>' +
  '<div class="aa-infos">' + octiconStar + ' {{ watchers }}</div>' +
  '<span class="aa-name">' +
    '{{#is_fork}}' + octiconFork + '{{/is_fork}} ' +
    '{{^is_fork}}{{#is_private}}' + octiconLock + '{{/is_private}}{{^is_private}}' + octiconRepo + '{{/is_private}}{{/is_fork}} ' +
    '<a href="https://github.com/{{ full_name }}/"><span class="aa-owner">{{{ owner }}}</span>/<span class="aa-repo-name">{{{ _highlightResult.name.value }}}</span></a>' +
  '</span>' +
  '<div class="aa-description">{{{ _snippetResult.description.value }}}</div>' +
'</div>');
var templateIssue = Hogan.compile('<div class="aa-suggestion aa-issue">' +
  '<div class="aa-thumbnail"><img src="https://avatars.githubusercontent.com/{{ repository.owner }}?size=30" /></div>' +
  '<div class="aa-infos">' + octiconComment + ' {{ comments_count }}</div>' +
  '<span class="aa-name">' +
    '<span class="aa-issue-number">Issue #{{ number }}:</span> <a href="https://github.com/{{ repository.owner }}/{{ repository.name }}/issues/{{ number }}">{{{ _highlightResult.title.value }}}</a><br />' +
    '{{#repository.is_fork}}' + octiconFork + '{{/repository.is_fork}} ' +
    '{{^repository.is_fork}}{{#repository.is_private}}' + octiconLock + '{{/repository.is_private}}{{^repository.is_private}}' + octiconRepo + '{{/repository.is_private}}{{/repository.is_fork}} ' +
    '{{ repository.owner }}/<span class="aa-repo-name">{{{ _highlightResult.repository.name.value }}}</span>' +
  '</span>' +
  '<div class="aa-issue-body">{{{ _snippetResult.body.value }}}</div>' +
'</div>');
var templateUser = Hogan.compile('<div class="aa-suggestion aa-user">' +
  '<div class="aa-thumbnail"><img src="https://avatars.githubusercontent.com/{{ login }}?size=30" /></div>' +
  '<a href="https://github.com/{{ login }}">'+
    '{{#name}}<span class="aa-name">{{{ _highlightResult.name.value }}}</span> {{/name}}' +
    '<span class="aa-login">{{{ _highlightResult.login.value }}}</span>' +
  '</a>' +
  '{{#company}}<br><span class="aa-company">' + octiconOrganization + ' {{{ _highlightResult.company.value }}}</span>{{/company}}' +
'</div>');

/////////////////////////////
//
// STORAGE & IMAGES
//
/////////////////////////////

var firefox = typeof self !== 'undefined' && typeof self.port !== 'undefined';

function getURL(asset) {
  if (firefox) {
    if (asset === 'images/algolia128x40.png') {
      return self.options.logoUrl;
    } else if (asset === 'images/close-32.png') {
      return self.options.closeImgUrl;
    } else {
      return asset;
    }
  } else if (typeof chrome !== 'undefined') {
    return chrome.extension.getURL(asset);
  } else if (typeof safari !== 'undefined') {
    return safari.extension.baseURI + asset;
  } else {
    return asset;
  }
}

var simpleStorage = {};
var storage = {
  set: function(key, value) {
    if (firefox) {
      self.port.emit('update-storage', [key, value]);
    } else if (typeof chrome !== 'undefined') {
      var v = {};
      v[key] = value;
      chrome.storage.local.set(v);
    } else {
      window.localStorage.setItem(key, value);
    }
  },

  get: function(key, cb) {
    if (firefox) {
      self.port.emit('read-storage');
      cb(simpleStorage);
    } else if (typeof chrome !== 'undefined') {
      chrome.storage.local.get(key, cb);
    } else {
      cb(window.localStorage.getItem(key));
    }
  }
};

/////////////////////////////
//
// REPOSITORIES CRAWL
//
/////////////////////////////

var crawledRepositories = [];

function crawlPage(url, organization) {
  $.get(url).success(function(data) {
    // parse HTML-based list of repositories
    $('<ul>' + data + '</ul>').find('li').each(function() {
      var isPrivate = $(this).hasClass('private');
      var isFork = $(this).hasClass('fork');
      var owner = $(this).find('span.owner').text() || $(this).find('span.repo-and-owner').attr('title').split('/')[0];
      var name = $(this).find('span.repo').text();
      var fullName = owner + '/' + name;
      crawledRepositories.push({
        organization: organization,
        full_name: fullName,
        owner: owner,
        name: name,
        fork: isFork,
        private: isPrivate
      });
    });

    // save to local storage
    storage.set('crawledRepositories', crawledRepositories);
  });
}

function crawlRepositories() {
  crawledRepositories = [];

  // crawl your repositories
  crawlPage('/dashboard/ajax_your_repos');

  // get the homepage to fetch your list of organization
  $.ajax('/', { headers: { 'X-Requested-With' : 'fake' } }).success(function(data) {
    $(data).find('.select-menu-list a.select-menu-item').each(function() {
      var href = $(this).attr('href');
      if (href.indexOf('/orgs/') === 0) {
        // and crawl all of them
        var organization = href.split('/')[2];
        crawlPage('/organizations/' + organization + '/ajax_your_repos', organization);
      }
    });
  });
}

storage.get('crawledRepositories', function(result) {
  if (result && result.crawledRepositories && result.crawledRepositories.length > 0) {
    crawledRepositories = result.crawledRepositories;
  } else {
    crawlRepositories();
  }
});

/////////////////////////////
//
// PRIVATE SEARCH
//
/////////////////////////////

var privateAlgolia, privateRepositories, privateIssues;

function setupPrivate(data) {
  storage.set('private', data);
  if (data && data.uid && data.api_key) {
    privateAlgolia = new AlgoliaSearch('TLCDTR8BIO', data.api_key);
    privateAlgolia.setSecurityTags('user_' + data.uid);
    privateRepositories = privateAlgolia.initIndex('my_repositories_production');
    privateIssues = privateAlgolia.initIndex('issues_production');
  }
}

function reloadPrivate() {
  $.get('https://github.algolia.com/private?' + new Date().getTime(), function(data) {
    setupPrivate(data);
  });
}

function connectWithGitHub() {
  var width = 1050;
  var height = 700;
  var left = (screen.width - width) / 2 - 16;
  var top = (screen.height - height) / 2 - 50;
  var windowFeatures = 'menubar=no,toolbar=no,status=no,width=' + width + ',height=' + height + ',left=' + left + ',top=' + top;
  if (typeof safari !== 'undefined') {
    var win = window.open("https://github.algolia.com/signin", "authPopup", windowFeatures);
    win.onunload = function() {
      reloadPrivate();
    };
  }
}

storage.get('private', function(result) {
  if (result) {
    setupPrivate(result.private);
  }
  if (!privateAlgolia) {
    reloadPrivate();
  }
});

if (firefox) {
  self.port.on('connect-with-github', connectWithGitHub);
} else if (typeof chrome !== 'undefined') {
  chrome.runtime.onMessage.addListener(function(request) {
    if (request.type === 'connect-with-github') {
      connectWithGitHub();
    }
  });
} else if (typeof safari !== 'undefined') {
  safari.self.addEventListener('message', function(message) {
    if (message.name === 'connect-with-github') {
      connectWithGitHub();
    }
  }, false);
}

/////////////////////////////
//
// HELPERS
//
/////////////////////////////

function tokenize(d) {
  if (!d) {
    return [];
  }
  var tokens = d.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[^a-zA-Z0-9]/g, ' ').replace(/ +/g, ' ').toLowerCase().trim().split(' ');
  tokens.push(d.replace(/[^a-zA-Z0-9]/g, '').toLowerCase());
  return tokens;
}

// parse the DuckDuckGo-like query
function parseQuery(q) {
  var p = {
    q: q,
    privateRepositories: true,
    topRepositories: true,
    issues: true,
    users: true
  };
  if (q && q.length > 2 && q[0] === '!' && q[2] === ' ') {
    var command = q[1];
    if (command === 'i') {
      p.privateRepositories = p.topRepositories = p.users = false;
    } else if (command === 'p') {
      p.issues = p.topRepositories = p.users = false;
    } else if (command === 'r') {
      p.issues = p.users = false;
    } else if (command === 'u') {
      p.issues = p.topRepositories = p.privateRepositories = false;
    } else {
      return p;
    }
    p.q = q.slice(3);
  }
  return p;
}

function sanitize(text) {
  return $('<div />').text(text).html();
}

/////////////////////////////
//
// TYPEAHEAD
//
/////////////////////////////

$(document).ready(function() {
  var $searchContainer = $('form#search_form, .site-search');
  var $q = $searchContainer.find('input[name="q"]');
  var isRepository = $searchContainer.hasClass('repo-scope');

  $q.parent().addClass('awesome-autocomplete');
  $q.parent().append('<a class="icon icon-delete" href="#" style="background: url(' + getURL('images/close-32.png') + ') no-repeat top left / 16px 16px;"></a>');

  // clear input
  var $clearInputIcon = $('.site-search .icon-delete');
  $clearInputIcon.on('click touch', function(event) {
    event.preventDefault();
    $q.val('');
    $clearInputIcon.removeClass('active');
    $q.focus();
  });

  // handle <Enter> action
  var $form = $q.closest('form');
  var submit = function(q, action) {
    action = action || $form.attr('action');
    location.href = action + '?utf8=✓&q=' + encodeURIComponent(q);
  };

  // public index
  var algolia = new AlgoliaSearch('TLCDTR8BIO', '686cce2f5dd3c38130b303e1c842c3e3');
  var users = algolia.initIndex('users');

  // setup auto-completion menu
  $q.typeahead({ highlight: false, hint: false }, [
    // top-menu help
    {
      source: function(q, cb) { cb([]); }, // force empty
      name: 'default',
      templates: {
        empty: function(data) {
          return '<div class="aa-query">Press <em>&lt;Enter&gt;</em> to ' +
            '<span class="aa-query-default">search for "<em>' + sanitize(data.query) + '</em>"' + ($searchContainer.hasClass('repo-scope') ? ' in this repository' : '') + '</span>' +
            '<span class="aa-query-cursor"></span>' +
            '</div>';
        }
      }
    },
    // this repository
    {
      source: function(q, cb) {
        var hits = [];
        if (isRepository && !$searchContainer.hasClass('repo-scope')) {
          hits.push({ query: q });
        }
        cb(hits);
      },
      name: 'current-repo',
      displayKey: 'query',
      templates: {
        suggestion: function(hit) {
          return '<div class="aa-query">' + octiconRepo + '&nbsp; Search "' + sanitize(hit.query) + '" in this repository</div>';
        }
      }
    },
    // private repositories
    {
      source: function(q, cb) {
        var parsedQuery = parseQuery(q);
        if (!parsedQuery.privateRepositories) {
          cb([]);
          return;
        }
        if (privateRepositories) {
          privateRepositories.search(parsedQuery.q, function(success, content) {
            if (success) {
              for (var i = 0; i < content.hits.length; ++i) {
                var hit = content.hits[i];
                hit.query = q;
                hit.watchers = hit.watchers_count;
              }
              cb(content.hits);
            } else {
              cb([]);
            }
          }, { attributesToSnippet: ['description:50'], hitsPerPage: NB_MY_REPOS });
        } else {
          var engine = new window.Bloodhound({
            name: 'private',
            local: crawledRepositories,
            datumTokenizer: function(d) { return tokenize(d.owner).concat(tokenize(d.name)); },
            queryTokenizer: tokenize,
            limit: NB_MY_REPOS
          });
          engine.initialize().done(function() {
            engine.get(parsedQuery.q, function(suggestions) {
              var queryWords = tokenize(parsedQuery.q);
              var re = new RegExp('(' + $.map(queryWords, function(str) { return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); }).join('|') + ')', 'ig');
              for (var i = 0; i < suggestions.length; ++i) {
                var sugg = suggestions[i];
                sugg.highlightedName = sugg.name.replace(re, '<em>$1</em>');
                sugg.query = q;
              }
              cb(suggestions);
            });
          });
        }
      },
      name: 'private',
      displayKey: 'query',
      templates: {
        header: '<div class="aa-category">Your Repositories</div>',
        suggestion: function(hit) {
          var template = privateRepositories ? templateRepo : templateYourRepo;
          return template.render(hit);
        }
      }
    },
    // top repositories
    {
      source: function(q, cb) {
        var parsedQuery = parseQuery(q);
        if (!parsedQuery.topRepositories) {
          cb([]);
          return;
        }
        var params = { attributesToSnippet: ['description:50'] };
        algolia.startQueriesBatch();
        algolia.addQueryInBatch('repositories', parsedQuery.q, $.extend({ hitsPerPage: parseInt(NB_REPOS / 2 + 1, 10), numericFilters: 'watchers>1000', restrictSearchableAttributes: 'name' }, params));
        algolia.addQueryInBatch('repositories', parsedQuery.q, $.extend({ hitsPerPage: NB_REPOS }, params));
        algolia.sendQueriesBatch(function(success, content) {
          var suggestions = [];
          if (success) {
            var dedup = {};
            for (var i = 0; i < content.results.length && suggestions.length < NB_REPOS; ++i) {
              for (var j = 0; j < content.results[i].hits.length && suggestions.length < NB_REPOS; ++j) {
                var hit = content.results[i].hits[j];
                if (dedup[hit.objectID]) {
                  continue;
                }
                dedup[hit.objectID] = true;
                hit.query = q;
                suggestions.push(hit);
              }
            }
          }
          cb(suggestions);
        });
      },
      name: 'repos',
      displayKey: 'query',
      templates: {
        header: '<div class="aa-category">Top Repositories</div>',
        suggestion: function(hit) { return templateRepo.render(hit); }
      }
    },
    // private issues
    {
      source: function(q, cb) {
        var parsedQuery = parseQuery(q);
        if (!parsedQuery.issues) {
          cb([]);
          return;
        }
        if (privateIssues) {
          privateIssues.search(parsedQuery.q, function(success, content) {
            if (success) {
              for (var i = 0; i < content.hits.length; ++i) {
                var hit = content.hits[i];
                hit.query = q;
              }
              cb(content.hits);
            } else {
              cb([]);
            }
          }, { attributesToSnippet: ['body:20'], hitsPerPage: NB_ISSUES });
        } else {
          cb([]);
        }
      },
      name: 'issues',
      displayKey: 'query',
      templates: {
        header: '<div class="aa-category">Your Issues</div>',
        suggestion: function(hit) { return templateIssue.render(hit); }
      }
    },
    // users
    {
      source: function(q, cb) {
        var parsedQuery = parseQuery(q);
        if (!parsedQuery.users) {
          cb([]);
          return;
        }
        users.search(parsedQuery.q, function(success, content) {
          var hits = [];
          if (success) {
            for (var i = 0; i < content.hits.length; ++i) {
              var hit = content.hits[i];
              hit.query = q;
              hits.push(hit);
            }
          }
          cb(hits);
        }, { hitsPerPage: NB_USERS, attributesToRetrieve: ['login', 'name', 'id', 'company', 'followers'] });
      },
      name: 'users',
      displayKey: 'query',
      templates: {
        header: '<div class="aa-category">Last Active Users</div>',
        suggestion: function(hit) { return templateUser.render(hit); }
      }
    },
    // branding
    {
      source: function(q, cb) { cb([]); }, // force empty
      name: 'branding',
      templates: {
        empty: function() {
          return '<div class="aa-branding">' +
            'With <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 510 510"><path d="M255 489.6l-35.7-35.7C86.7 336.6 0 257.55 0 160.65 0 81.6 61.2 20.4 140.25 20.4c43.35 0 86.7 20.4 114.75 53.55C283.05 40.8 326.4 20.4 369.75 20.4 448.8 20.4 510 81.6 510 160.65c0 96.9-86.7 175.95-219.3 293.25L255 489.6z" fill="#D80027"/></svg> from <a href="https://www.algolia.com/?utm_source=github-awesome-autocomplete&utm_medium=link&utm_campaign=github-awesome-autocomplete_search"><img src="' + getURL('images/algolia128x40.png') + '" title="Algolia" /></a>' +
            '</div>';
        }
      }
    }
  ]).on('typeahead:selected', function(event, suggestion, dataset) {
    if (dataset === 'current-repo') {
      submit(suggestion.query, $('.js-site-search-form').data('repo-search-url') + '/search');
    } else if (dataset === 'users') {
      location.href = 'https://github.com/' + suggestion.login;
    } else if (dataset === 'repos' || dataset === 'private') {
      location.href = 'https://github.com/' + suggestion.full_name;
    } else if (dataset === 'issues') {
      location.href = 'https://github.com/' + suggestion.repository.owner + '/' + suggestion.repository.name + '/issues/' + suggestion.number;
    } else {
      console.log('Unknown dataset: ' + dataset);
    }
  }).on('typeahead:cursorchanged', function(event, suggestion, dataset) {
    var $container = $('.aa-query');
    $container.find('span').hide();
    if (dataset === 'users') {
      $container.find('span.aa-query-cursor').html('go to <strong>' + sanitize(suggestion.login) + '</strong>\'s profile').show();
    } else if (dataset === 'repos' || dataset === 'private') {
      $container.find('span.aa-query-cursor').html('go to <strong>' + sanitize(suggestion.full_name) + '</strong>').show();
    } else if (dataset === 'issues') {
      $container.find('span.aa-query-cursor').html('go to <strong>' + sanitize(suggestion.repository.owner) + '/' + sanitize(suggestion.repository.name) + ' #' + sanitize(suggestion.number) + '</strong>').show();
    } else {
      $container.find('span.aa-query-default').show();
    }
  }).on('keyup', function() {
    if ($(this).val().length > 0) {
      $clearInputIcon.addClass('active');
    } else {
      $clearInputIcon.removeClass('active');
    }
  }).on('keypress', function(e) {
    if (e.keyCode === 13) { // enter
      submit($(this).val());
    }
  });
});
