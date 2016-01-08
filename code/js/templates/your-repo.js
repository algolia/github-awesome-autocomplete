/* global Hogan */

module.exports = Hogan.compile('<div class="aa-suggestion aa-your-repo">' +
  '<span class="aa-name">' +
    '<i class="octicon {{#fork}}octicon-repo-forked{{/fork}}{{^fork}}{{#private}}octicon-lock{{/private}}{{^private}}octicon-repo{{/private}}{{/fork}}"></i> ' +
    '<a href="https://github.com/{{ full_name }}/"><span class="owner">{{{ owner }}}</span>/<span class="aa-repo">{{{ highlightedName }}}</span></a>' +
  '</span>' +
'</div>');
