/* global document, window, location, screen, self, $ */

;(function() {
  var algoliasearch = require('algoliasearch');
  var simpleStorage = {};
  var firefox = typeof self !== 'undefined' && typeof self.port !== 'undefined';
  function storageSet(key, value) {
    if (firefox) {
      self.port.emit('update-storage', [key, value]);
    } else {
      var v = {};
      v[key] = value;
      chrome.storage.local.set(v);
    }
  }

  function storageGet(key, cb) {
    if (firefox) {
      self.port.emit('read-storage');
      cb(simpleStorage);
    } else {
      chrome.storage.local.get(key, cb);
    }
  }

  function getURL(asset) {
    if (firefox) {
      if (asset === 'images/algolia128x40.png') {
        return self.options.logoUrl;
      } else if (asset === 'images/close-16.png') {
        return self.options.closeImgUrl;
      } else {
        return asset;
      }
    } else {
      return chrome.extension.getURL(asset);
    }
  }

  var NB_REPOS = 3;
  var NB_MY_REPOS = 2;
  var NB_USERS = 3;
  var NB_ISSUES = 3;

  var algolia = algoliasearch('TLCDTR8BIO', '686cce2f5dd3c38130b303e1c842c3e3');
  var users = algolia.initIndex('last_1m_users');

  var templateYourRepo = require('../templates/yourRepo.mustache');
  var templateRepo = require('../templates/repo.mustache');
  var templateIssue = require('../templates/issue.mustache');
  var templateUser = require('../templates/user.mustache');

  // crawl the repositories associated to a user or an organization
  var yourRepositories = [];
  var crawlRepositories = function(url, organization) {
    $.get(url).success(function(data) {
      // parse HTML-based list of repositories
      $('<ul>' + data + '</ul>').find('li').each(function() {
        var isPrivate = $(this).hasClass('private');
        var isFork = $(this).hasClass('fork');
        var owner = $(this).find('span.owner').text() || $(this).find('span.repo-and-owner').attr('title').split('/')[0];
        var name = $(this).find('span.repo').text();
        var fullName = owner + '/' + name;
        yourRepositories.push({
          organization: organization,
          full_name: fullName,
          owner: owner,
          name: name,
          fork: isFork,
          private: isPrivate
        });
      });

      // save to local storage
      storageSet('yourRepositories', yourRepositories);
    });
  };

  // crawl repositories (fallback)
  window.refreshRepositories = function() {
    yourRepositories = [];

    // crawl your repositories
    crawlRepositories('/dashboard/ajax_your_repos');

    // get the homepage to fetch your list of organization
    $.ajax('/', { headers: { 'X-Requested-With' : 'fake' } }).success(function(data) {
      $(data).find('.select-menu-list a.select-menu-item').each(function() {
        var href = $(this).attr('href');
        if (href.indexOf('/orgs/') === 0) {
          // and crawl all of them
          var organization = href.split('/')[2];
          crawlRepositories('/organizations/' + organization + '/ajax_your_repos', organization);
        }
      });
    });
  };

  // tokenization helper
  var tokenize = function(d) {
    if (!d) {
      return [];
    }
    var tokens = d.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[^a-zA-Z0-9]/g, ' ').replace(/ +/g, ' ').toLowerCase().trim().split(' ');
    tokens.push(d.replace(/[^a-zA-Z0-9]/g, '').toLowerCase());
    return tokens;
  };

  // private repositories & issues
  var privateAlgolia, privateRepositories, privateIssues;
  function setupPrivate(data) {
    storageSet('private', data);
    if (data && data.uid && data.api_key) {
      privateAlgolia = algoliasearch('TLCDTR8BIO', data.api_key);
      privateAlgolia.setSecurityTags('user_' + data.uid);
      privateRepositories = privateAlgolia.initIndex('my_repositories_production');
      privateIssues = privateAlgolia.initIndex('issues_production');
    }
  }
  var reloadPrivate = function() {
    $.get('https://github.algolia.com/private?' + new Date().getTime(), function(data) {
      setupPrivate(data);
    });
  };
  if (firefox) {
    self.port.on('reload-private', function() {
      reloadPrivate();
    });
  }
  window.clearPrivateKey = function() {
    setupPrivate(null);
    privateAlgolia = privateRepositories = privateIssues = null;
  };
  storageGet('private', function(result) {
    if (result) {
      setupPrivate(result.private);
    }
    if (!privateAlgolia) {
      reloadPrivate();
    }
  });

  // connect with GitHub
  window.connectWithGitHub = function() {
    var width = 1050;
    var height = 700;
    var left = (screen.width - width) / 2 - 16;
    var top = (screen.height - height) / 2 - 50;
    var windowFeatures = 'menubar=no,toolbar=no,status=no,width=' + width + ',height=' + height + ',left=' + left + ',top=' + top;
    var win = window.open("https://github.algolia.com/signin", "authPopup", windowFeatures);
    win.onunload = function() {
      reloadPrivate();
    };
  };

  // private repositories crawl (fallback)
  storageGet('yourRepositories', function(result) {
    if (result && result.yourRepositories && result.yourRepositories.length > 0) {
      yourRepositories = result.yourRepositories;
    } else {
      window.refreshRepositories();
    }
  });

  $(document).ready(function() {
    var $searchContainer = $('form#search_form, .site-search');
    var $q = $searchContainer.find('input[name="q"]');
    var isRepository = $searchContainer.hasClass('repo-scope');

    $q.parent().addClass('awesome-autocomplete');
    $q.parent().append('<a class="icon icon-delete" href="#" style="background: url(' + getURL('images/close-16.png') + ') no-repeat 0 0;"></a>');

    // Clear input
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

    // parse the DuckDuckGo-like query
    var parseQuery = function(q) {
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
    };

    // setup auto-completion menu
    $q.typeahead({ highlight: false, hint: false }, [
      // top-menu help
      {
        source: function(q, cb) { cb([]); }, // force empty
        name: 'default',
        templates: {
          empty: function(data) {
            return '<div class="aa-query">Press <em>&lt;Enter&gt;</em> to ' +
              '<span class="aa-query-default">search for "<em>' + $('<div />').text(data.query).html() + '</em>"' + ($searchContainer.hasClass('repo-scope') ? ' in this repository':'') + '</span>' +
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
            return '<div class="aa-query"><i class="octicon octicon-repo"></i>&nbsp; Search "' + $('<strong />').text(hit.query).text() + '" in this repository</div>';
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
            privateRepositories.search(parsedQuery.q, {}, function(error, content) {
              if (!error) {
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
              local: yourRepositories,
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
          algolia.addQueryInBatch('top_1m_repos', parsedQuery.q, $.extend({ hitsPerPage: parseInt(NB_REPOS / 2 + 1, 10), numericFilters: 'watchers>1000', restrictSearchableAttributes: 'name' }, params));
          algolia.addQueryInBatch('top_1m_repos', parsedQuery.q, $.extend({ hitsPerPage: NB_REPOS }, params));
          algolia.sendQueriesBatch(function(error, content) {
            var suggestions = [];
            if (!error) {
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
            privateIssues.search(parsedQuery.q, {}, function(error, content) {
              if (!error) {
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
          users.search(parsedQuery.q, {}, function(error, content) {
            var hits = [];
            if (!error) {
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
              'With <i class="octicon octicon-heart"></i> from <a href="https://www.algolia.com/?utm_source=github-awesome-autocomplete&utm_medium=link&utm_campaign=github-awesome-autocomplete_search"><img src="' + getURL('images/algolia128x40.png') + '" title="Algolia" /></a>' +
              '</div>';
          }
        }
      }
    ]).on('typeahead:selected', function(event, suggestion, dataset) {
      if (dataset === 'current-repo') {
        submit(suggestion.query, $('.pagehead .entry-title a.js-current-repository').attr('href') + '/search');
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
        $container.find('span.aa-query-cursor').html('go to <strong>' + suggestion.login + '</strong>\'s profile').show();
      } else if (dataset === 'repos' || dataset === 'private') {
        $container.find('span.aa-query-cursor').html('go to <strong>' + suggestion.full_name + '</strong>').show();
      } else if (dataset === 'issues') {
        $container.find('span.aa-query-cursor').html('go to <strong>' + suggestion.repository.owner + '/' + suggestion.repository.name + ' #' + suggestion.number + '</strong>').show();
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
})();
