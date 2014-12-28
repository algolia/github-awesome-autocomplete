/* global document, window, location, chrome */

;(function() {
  var handlers = require('./modules/handlers').create('ct');
  require('./modules/msg').init('ct', handlers);

  var $ = require('./libs/jquery-1.11.2.min.js');
  window.jQuery = window.jQuery || $;
  var Hogan = require('./libs/hogan-3.0.1.js');
  require('./libs/typeahead.bundle.min.js');
  require('./libs/algoliasearch.min.js');

  var NB_REPOS = 3;
  var NB_MY_REPOS = 2;
  var NB_USERS = 3;
  var NB_ISSUES = 3;

  var algolia = new window.AlgoliaSearch('TLCDTR8BIO', '686cce2f5dd3c38130b303e1c842c3e3');
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
    '<span class="aa-name"><a href="https://github.com/{{ full_name }}/"><span class="aa-owner">{{{ owner }}}</span>/<span class="aa-repo-name">{{{ _highlightResult.name.value }}}</span></a></span>' +
    '<div class="aa-description">{{{ _snippetResult.description.value }}}</div>' +
  '</div>');

  var templateIssue = Hogan.compile('<div class="aa-suggestion aa-issue">' +
    '<div class="aa-thumbnail"><img src="https://avatars.githubusercontent.com/{{ repository.owner }}?size=30" /></div>' +
    '<div class="aa-infos"><i class="octicon octicon-comment"></i> {{ comments_count }}</div>' +
    '<span class="aa-name">' +
      '<span class="aa-issue-number">Issue #{{ number }}:</span> <a href="https://github.com/{{ repository.owner }}/{{ repository.name }}/issues/{{ number }}">{{{ _highlightResult.title.value }}}</a><br />' +
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
      chrome.storage.local.set({ yourRepositories: yourRepositories });
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
    chrome.storage.local.set({ private: data });
    if (data && data.uid && data.api_key) {
      privateAlgolia = new window.AlgoliaSearch('TLCDTR8BIO', data.api_key);
      privateAlgolia.setSecurityTags('user_' + data.uid);
      privateRepositories = privateAlgolia.initIndex('my_repositories_production');
      privateIssues = privateAlgolia.initIndex('issues_production');
    }
  }
  window.reloadPrivateKey = function() {
    $.get('https://github.algolia.com/private?' + new Date().getTime(), function(data) {
      setupPrivate(data);
    });
  };
  chrome.storage.local.get('private', function(result) {
    if (result) {
      setupPrivate(result.private);
    }
    if (!privateAlgolia) {
      window.reloadPrivateKey();
    }
  });

  // private repositories crawl (fallback)
  chrome.storage.local.get('yourRepositories', function(result) {
    if (result && result.yourRepositories && result.yourRepositories.length > 0) {
      yourRepositories = result.yourRepositories;
    } else {
      window.refreshRepositories();
    }
  });

  $(document).ready(function() {
    var $q = $('.site-search input[name="q"]');
    $q.parent().addClass('awesome-autocomplete');
    $q.parent().append('<a class="icon icon-delete" href="#" style="background: url(' + chrome.extension.getURL('images/close-16.png') + ') no-repeat 0 0;"></a>');

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
    var submit = function(q) {
      location.href = $form.attr('action') + '?utf8=✓&q=' + encodeURIComponent(q);
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
              '<span class="aa-query-default">search for "<em>' + $('<div />').text(data.query).html() + '</em>"</span>' +
              '<span class="aa-query-cursor"></span>' +
              '</div>';
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
              'With <i class="octicon octicon-heart"></i> from <a href="https://www.algolia.com/?utm_source=github-awesome-autocomplete&utm_medium=link&utm_campaign=github-awesome-autocomplete_search"><img src="' + chrome.extension.getURL('images/algolia128x40.png') + '" title="Algolia" /></a>' +
              '</div>';
          }
        }
      }
    ]).on('typeahead:selected', function(event, suggestion, dataset) {
      if (dataset === 'users') {
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
