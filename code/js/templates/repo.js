/* global Hogan */

module.exports = Hogan.compile('<div class="aa-suggestion aa-repo">' +
  '<div class="aa-thumbnail"><img src="https://avatars.githubusercontent.com/{{ owner }}?size=30" /></div>' +
  '<div class="aa-infos">{{ watchers }} <i class="octicon octicon-star"></i></div>' +
  '<span class="aa-name">' +
    '{{#is_fork}}<i class="octicon octicon-repo-forked"></i>{{/is_fork}} ' +
    '{{^is_fork}}<i class="octicon octicon-{{#is_private}}lock{{/is_private}}{{^is_private}}repo{{/is_private}}"></i>{{/is_fork}} ' +
    '<a href="https://github.com/{{ full_name }}/"><span class="aa-owner">{{{ owner }}}</span>/<span class="aa-repo-name">{{{ _highlightResult.name.value }}}</span></a>' +
  '</span>' +
  '<div class="aa-description">{{{ _snippetResult.description.value }}}</div>' +
'</div>');
