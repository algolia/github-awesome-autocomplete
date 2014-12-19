/*global document, window */

;(function() {
  var handlers = require('./modules/handlers').create('ct');
  require('./modules/msg').init('ct', handlers);

  var $ = require('./libs/jquery-1.11.2.min.js');
  window.jQuery = window.jQuery || $;
  var Hogan = require('./libs/hogan-3.0.1.js');
  require('./libs/typeahead.jquery.min.js');
  require('./libs/algoliasearch.min.js');

  console.log('extension is loaded');
  $(document).ready(function() {
    var $q = $('.site-search input[name="q"]');
    $q.parent().addClass('awesome-autocomplete');

    var algolia = new window.AlgoliaSearch('TLCDTR8BIO', '686cce2f5dd3c38130b303e1c842c3e3', { tld: 'net' });
    var users = algolia.initIndex('github_users');

    var templateUser = Hogan.compile('<a class="aa-user" href="https://github.com/{{ login }}">' +
      '<div class="aa-login">' +
        '<span class="aa-followers"><i class="octicon octicon-star"></i> {{ followers }}</span>' +
        '<span class="aa-thumbnail"><img src="https://avatars2.githubusercontent.com/u/{{ id }}?v=2&s=30" /> ' +
        '{{#name}}</span>' +
        '<span class="aa-name">{{{ _highlightResult.name.value }}}</span> ' +
        '{{/name}}' +
        '<span class="aa-login">{{{ _highlightResult.login.value }}}</span> ' +
        '{{#company}}' +
        '<br><span class="aa-company">{{{ _highlightResult.company.value }}}</span>' +
        '{{/company}}' +
      '</div>' +
    '</a>');


    var templateRepo = Hogan.compile('<a class="aa-repo" href="https://github.com/{{ full_name }}">' +
      '<div class="aa-full_name">' +
        '<div class="aa-infos"><i class="octicon octicon-star"></i> {{ stargazers_count }} <i class="octicon octicon-repo-forked"></i> {{ forks_count }}</div>' +
        '{{{ _highlightResult.full_name.value }}} ' +
        '{{#homepage}}' +
        '<span class="aa-link">{{{ _highlightResult.homepage.value }}}</span>' +
        '{{/homepage}}' +
      '</div>' +
      '<div class="aa-description">{{{ _snippetResult.description.value }}}</div>' +
    '</a>');

    // typeahead.js initialization
    $q.typeahead(null, [
      {
        source: function(q, cb) {
          var params = { attributesToRetrieve: ['full_name', 'homepage', 'stargazers_count', 'forks_count'], attributesToSnippet: ['description:50'] };
          algolia.startQueriesBatch();
          algolia.addQueryInBatch('github_repos', q, $.extend({ hitsPerPage: 3, numericFilters: 'stargazers_count>1000', restrictSearchableAttributes: 'name' }, params));
          algolia.addQueryInBatch('github_repos', q, $.extend({ hitsPerPage: 5 }, params));
          algolia.sendQueriesBatch(function(success, content) {
            var suggestions = [];
            if (success) {
              var dedup = {};
              for (var i = 0; i < content.results.length && suggestions.length < 5; ++i) {
                for (var j = 0; j < content.results[i].hits.length && suggestions.length < 5; ++j) {
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
        displayKey: 'repos',
        templates: {
          header: '<div class="category"><i class="fa fa-file-text"></i> Repositories</div>',
          suggestion: function(hit) { return templateRepo.render(hit); }
        }
      },
      {
        source: users.ttAdapter({ hitsPerPage: 3, attributesToRetrieve: ['login', 'name', 'id', 'company', 'followers'] }),
        displayKey: 'users',
        templates: {
          header: '<div class="category"><i class="fa fa-user"></i> Users</div>',
          suggestion: function(hit) { return templateUser.render(hit); }
        }
      }
    ]).focus();
  });
})();
