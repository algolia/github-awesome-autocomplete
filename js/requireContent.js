require.load = function (context, moduleName, url) {
  var xhr;
  var complete = false;
  onScriptLoad = context.onScriptLoad;
  xhr = new XMLHttpRequest();
  xhr.open("GET", chrome.extension.getURL(url) + '?r=' + new Date().getTime(), true);
  xhr.onreadystatechange = function (e) {
    if (xhr.readyState === 4 && !complete) {
      complete = true;
      eval(xhr.responseText);
      context.completeLoad(moduleName)
    }
  };
  xhr.send(null);
};