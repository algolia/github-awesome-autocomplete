/* global document, window, location, chrome */

;(function() {
  var handlers = require('./modules/handlers').create('ct');
  require('./modules/msg').init('ct', handlers);

  var $ = require('./libs/jquery-1.11.2.min.js');
  window.jQuery = window.jQuery || $;
  var Hogan = require('./libs/hogan-3.0.1.js');
  require('./libs/typeahead.jquery.min.js');
  require('./libs/algoliasearch.min.js');

  var NB_REPOS = 5;
  var NB_USERS = 3;

  var algolia = new window.AlgoliaSearch('TLCDTR8BIO', '686cce2f5dd3c38130b303e1c842c3e3');
  var users = algolia.initIndex('github_users');

  var templateUser = Hogan.compile('<a class="aa-user" href="https://github.com/{{ login }}">' +
    '{{#followers}}<span class="aa-infos">{{ followers }} <i class="octicon octicon-person"></i></span>{{/followers}}' +
    '<div class="aa-thumbnail"><img src="https://avatars2.githubusercontent.com/u/{{ id }}?v=2&s=30" /></div>' +
    '{{#name}}<span class="aa-name">{{{ _highlightResult.name.value }}}</span>{{/name}}' +
    '{{^name}}<span class="aa-name">{{{ _highlightResult.login.value }}}</span>{{/name}}' +
    '{{#name}}<span class="aa-login">{{{ _highlightResult.login.value }}}</span>{{/name}}' +
    '{{#company}}<br><span class="aa-company"><i class="octicon octicon-organization"></i> {{{ _highlightResult.company.value }}}</span>{{/company}}' +
  '</a>');

  var templateRepo = Hogan.compile('<a class="aa-repo" href="https://github.com/{{ full_name }}/">' +
    '{{#stargazers_count}}<div class="aa-infos">{{ stargazers_count }} <i class="octicon octicon-star"></i></div>{{/stargazers_count}}' +
    '<span class="aa-name">{{{ _highlightResult.full_name.value }}}</span>' +
    '<div class="aa-description">{{{ _snippetResult.description.value }}}</div>' +
  '</a>');

  $(document).ready(function() {
    var $q = $('.site-search input[name="q"]');
    var $form = $q.closest('form');

    $q.parent().addClass('awesome-autocomplete');

    var submit = function(q) {
      location.href = $form.attr('action') + '?utf8=✓&q=' + encodeURIComponent(q);
    };

    $q.typeahead({ highlight: false, hint: false }, [
      {
        source: function(q, cb) { cb([]); }, // force empty
        name: 'default',
        templates: {
          empty: function(data) {
            return '<div class="aa-query">' +
              'Press <em>&lt;Enter&gt;</em> to search for "<em>' + $('<div />').text(data.query).html() + '</em>"' +
              '</div>';
          }
        }
      },
      {
        source: function(q, cb) {
          var params = { attributesToRetrieve: ['full_name', 'homepage', 'stargazers_count', 'forks_count'], attributesToSnippet: ['description:50'] };
          algolia.startQueriesBatch();
          algolia.addQueryInBatch('github_repos', q, $.extend({ hitsPerPage: parseInt(NB_REPOS / 2 + 1, 10), numericFilters: 'stargazers_count>1000', restrictSearchableAttributes: 'name' }, params));
          algolia.addQueryInBatch('github_repos', q, $.extend({ hitsPerPage: NB_REPOS }, params));
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
                  suggestions.push(hit);
                }
              }
            }
            cb(suggestions);
          });
        },
        name: 'repos',
        templates: {
          header: '<div class="aa-category">Repositories</div>',
          suggestion: function(hit) { return templateRepo.render(hit); }
        }
      },
      {
        source: users.ttAdapter({ hitsPerPage: NB_USERS, attributesToRetrieve: ['login', 'name', 'id', 'company', 'followers'] }),
        name: 'users',
        templates: {
          header: '<div class="aa-category">Users</div>',
          suggestion: function(hit) { return templateUser.render(hit); }
        }
      },
      {
        source: function(q, cb) { cb([]); }, // force empty
        name: 'branding',
        templates: {
          empty: function() {
            return '<div class="aa-branding">' +
              'Realtime Search by <a href="https://www.algolia.com"><img src="' + chrome.extension.getURL('images/algolia128x40.png') + '" title="Algolia" /></a>' +
              '</div>';
          }
        }
      }
    ]).on('typeahead:selected', function(event, suggestion, dataset) {
      if (dataset === 'users') {
        location.href = 'https://github.com/' + suggestion.login;
      } else if (dataset === 'repos') {
        location.href = 'https://github.com/' + suggestion.full_name;
      } else {
        console.log('Unknown dataset: ' + dataset);
      }
    }).on('keypress', function(e) {
      if (e.keyCode === 13) { // enter
        submit($(this).val());
      }
    }).focus();
  });
})();
