/* global AlgoliaSearch */
var algolia = new AlgoliaSearch(
  "TLCDTR8BIO",
  "686cce2f5dd3c38130b303e1c842c3e3"
);
var repositories = algolia.initIndex("repositories");

// Provide help text to the user.
// chrome.omnibox.setDefaultSuggestion({
//   description: "Find GitHub repositories..."
// });

var isFirefox = false;
if (typeof browser !== 'undefined') {
  isFirefox = true;
}

function formatSuggestion(hit) {
  var content = hit._highlightResult.description.value;
  content = content.replace(/<(\/)?em>/g, "<$1match>");

  var descriptionUrl =
    "<url>https://github.com/" +
    hit._highlightResult.full_name.value +
    "</url>";
  descriptionUrl = descriptionUrl.replace(/<(\/)?em>/g, "<$1match>");

  return {
    content: "https://github.com/" + hit.full_name,
    description: descriptionUrl + " <dim>" + content + "</dim>"
  };
}

function formatFirefoxSuggestion(hit) {
  return {
    content: "https://github.com/" + hit.full_name,
    description: hit.full_name + ": " + hit.description
  };
}

// Update the suggestions whenever the input is changed.
chrome.omnibox.onInputChanged.addListener(function(text, addSuggestions) {
  repositories.search(text, function(success, content) {
    if (!success) {
      addSuggestions([
        {
          content: "https://github.com/search?q=" + text,
          description: "An error occurred while fetching data from Algolia"
        }
      ]);
      return;
    }

    if (content.hits.length === 0) {
      addSuggestions([
        {
          content: "https://github.com/search?q=" + text,
          description: "No results found, search on GitHub by pressing [ENTER]"
        }
      ]);
      return;
    }
    var hits = content.hits;
    var suggestions = [];

    for (var index in hits) {
      if (isFirefox) {
        suggestions.push(formatFirefoxSuggestion(hits[index]));
      } else {
        suggestions.push(formatSuggestion(hits[index]));
      }
    }
    addSuggestions(suggestions);
  });
});

// Open the page based on how the user clicks on a suggestion.
chrome.omnibox.onInputEntered.addListener(function(text, disposition) {
  var url = text;

  if (url.lastIndexOf("https://github.com/", 0) !== 0) {
    url = "https://github.com/search?q=" + text;
  }

  switch (disposition) {
    case "currentTab":
      chrome.tabs.update({ url: url });
      break;
    case "newForegroundTab":
      chrome.tabs.create({ url: url });
      break;
    case "newBackgroundTab":
      chrome.tabs.create({ url: url, active: false });
      break;
  }
});
