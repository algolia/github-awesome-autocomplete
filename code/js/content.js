/* global document, window, location, self, Hogan, $, AlgoliaSearch */

;(function() {
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

  var algolia = new AlgoliaSearch('TLCDTR8BIO', '686cce2f5dd3c38130b303e1c842c3e3');
  var users = algolia.initIndex('last_1m_users');

  var templateYourRepo = Hogan.compile('<div class="aa-suggestion aa-your-repo">' +
    '<span class="aa-name">' +
      '<i class="octicon {{#fork}}octicon-repo-forked{{/fork}}{{^fork}}{{#private}}octicon-lock{{/private}}{{^private}}octicon-repo{{/private}}{{/fork}}"></i> ' +
      '<a href="https://github.com/{{ full_name }}/"><span class="owner">{{{ owner }}}</span>/<span class="aa-repo">{{{ highlightedName }}}</span></a>' +
    '</span>' +
  '</div>');

  var templateRepo = Hogan.compile('<div class="aa-suggestion aa-repo">' +
    '<div class="aa-thumbnail"><img src="https://avatars.githubusercontent.com/{{ owner }}?size=30" /></div>' +
    '<div class="aa-infos">{{ watchers }} <i class="octicon octicon-star"></i></div>' +
    '<span class="aa-name">' +
      '{{#is_fork}}<i class="octicon octicon-repo-forked"></i>{{/is_fork}} ' +
      '{{^is_fork}}<i class="octicon octicon-{{#is_private}}lock{{/is_private}}{{^is_private}}repo{{/is_private}}"></i>{{/is_fork}} ' +
      '<a href="https://github.com/{{ full_name }}/"><span class="aa-owner">{{{ owner }}}</span>/<span class="aa-repo-name">{{{ _highlightResult.name.value }}}</span></a>' +
    '</span>' +
    '<div class="aa-description">{{{ _snippetResult.description.value }}}</div>' +
  '</div>');

  var templateIssue = Hogan.compile('<div class="aa-suggestion aa-issue">' +
    '<div class="aa-thumbnail"><img src="https://avatars.githubusercontent.com/{{ repository.owner }}?size=30" /></div>' +
    '<div class="aa-infos"><i class="octicon octicon-comment"></i> {{ comments_count }}</div>' +
    '<span class="aa-name">' +
      '<span class="aa-issue-number">Issue #{{ number }}:</span> <a href="https://github.com/{{ repository.owner }}/{{ repository.name }}/issues/{{ number }}">{{{ _highlightResult.title.value }}}</a><br />' +
      '{{#repository.is_fork}}<i class="octicon octicon-repo-forked"></i>{{/repository.is_fork}} ' +
      '{{^repository.is_fork}}<i class="octicon octicon-{{#repository.is_private}}lock{{/repository.is_private}}{{^repository.is_private}}repo{{/repository.is_private}}"></i>{{/repository.is_fork}} ' +
      '{{ repository.owner }}/<span class="aa-repo-name">{{{ _highlightResult.repository.name.value }}}</span>' +
    '</span>' +
    '<div class="aa-issue-body">{{{ _snippetResult.body.value }}}</div>' +
  '</div>');

  var templateUser = Hogan.compile('<div class="aa-suggestion aa-user">' +
    //'{{#followers}}<span class="aa-infos">{{ followers }} <i class="octicon octicon-person"></i></span>{{/followers}}' +
    '<div class="aa-thumbnail"><img src="https://avatars.githubusercontent.com/{{ login }}?size=30" /></div>' +
    '<a href="https://github.com/{{ login }}">'+
      '{{#name}}<span class="aa-name">{{{ _highlightResult.name.value }}}</span> {{/name}}' +
      '<span class="aa-login">{{{ _highlightResult.login.value }}}</span>' +
    '</a>' +
    '{{#company}}<br><span class="aa-company"><i class="octicon octicon-organization"></i> {{{ _highlightResult.company.value }}}</span>{{/company}}' +
  '</div>');

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
      privateAlgolia = new AlgoliaSearch('TLCDTR8BIO', data.api_key);
      privateAlgolia.setSecurityTags('user_' + data.uid);
      privateRepositories = privateAlgolia.initIndex('my_repositories_production');
      privateIssues = privateAlgolia.initIndex('issues_production');
    }
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
      $.get('https://github.algolia.com/private?' + new Date().getTime(), function(data) {
        setupPrivate(data);
      });
    }
  });

  // private repositories crawl (fallback)
  storageGet('yourRepositories', function(result) {
    if (result && result.yourRepositories && result.yourRepositories.length > 0) {
      yourRepositories = result.yourRepositories;
    } else {
      window.refreshRepositories();
    }
  });

  $(document).ready(function() {
    var $searchContainer = $('.site-search');
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

    var hasResults = 0;
    var resizeColumns = function() {
      if (++hasResults === 1) {
        $searchContainer.find('.tt-dropdown-menu').addClass('single-dataset');
      } else {
        $searchContainer.find('.tt-dropdown-menu').removeClass('single-dataset');
      }
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
          if (privateRepositories) {
            privateRepositories.search(q, function(success, content) {
              if (success) {
                for (var i = 0; i < content.hits.length; ++i) {
                  var hit = content.hits[i];
                  hit.query = q;
                  hit.watchers = hit.watchers_count;
                }
                if (content.hits.length > 0) { resizeColumns(); }
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
              engine.get(q, function(suggestions) {
                var queryWords = tokenize(q);
                var re = new RegExp('(' + $.map(queryWords, function(str) { return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); }).join('|') + ')', 'ig');
                for (var i = 0; i < suggestions.length; ++i) {
                  var sugg = suggestions[i];
                  sugg.highlightedName = sugg.name.replace(re, '<em>$1</em>');
                  sugg.query = q;
                }
                if (suggestions.length > 0) { resizeColumns(); }
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
          var params = { attributesToSnippet: ['description:50'] };
          algolia.startQueriesBatch();
          algolia.addQueryInBatch('top_1m_repos', q, $.extend({ hitsPerPage: parseInt(NB_REPOS / 2 + 1, 10), numericFilters: 'watchers>1000', restrictSearchableAttributes: 'name' }, params));
          algolia.addQueryInBatch('top_1m_repos', q, $.extend({ hitsPerPage: NB_REPOS }, params));
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
            if (suggestions.length > 0) { resizeColumns(); }
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
          if (privateIssues) {
            privateIssues.search(q, function(success, content) {
              if (success) {
                for (var i = 0; i < content.hits.length; ++i) {
                  var hit = content.hits[i];
                  hit.query = q;
                }
                if (content.hits.length > 0) { resizeColumns(); }
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
          users.search(q, function(success, content) {
            var hits = [];
            if (success) {
              for (var i = 0; i < content.hits.length; ++i) {
                var hit = content.hits[i];
                hit.query = q;
                hits.push(hit);
              }
            }
            if (hits.length > 0) { resizeColumns(); }
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
      hasResults = 0;
      if (e.keyCode === 13) { // enter
        submit($(this).val());
      }
    });
  });
})();
