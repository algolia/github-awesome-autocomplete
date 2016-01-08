/* global Hogan */

module.exports = Hogan.compile('<div class="aa-suggestion aa-user">' +
  //'{{#followers}}<span class="aa-infos">{{ followers }} <i class="octicon octicon-person"></i></span>{{/followers}}' +
  '<div class="aa-thumbnail"><img src="https://avatars.githubusercontent.com/{{ login }}?size=30" /></div>' +
  '<a href="https://github.com/{{ login }}">'+
    '{{#name}}<span class="aa-name">{{{ _highlightResult.name.value }}}</span> {{/name}}' +
    '<span class="aa-login">{{{ _highlightResult.login.value }}}</span>' +
  '</a>' +
  '{{#company}}<br><span class="aa-company"><i class="octicon octicon-organization"></i> {{{ _highlightResult.company.value }}}</span>{{/company}}' +
'</div>');
