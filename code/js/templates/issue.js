/* global Hogan */

module.exports = Hogan.compile('<div class="aa-suggestion aa-issue">' +
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
