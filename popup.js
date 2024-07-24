document.getElementById('extract').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: extractData
      },
      (results) => {
        if (chrome.runtime.lastError) {
          console.error('Script injection error: ', chrome.runtime.lastError.message);
          document.getElementById('result').textContent = 'Error: ' + chrome.runtime.lastError.message;
          return;
        }

        if (results && results[0] && results[0].result) {
          const data = results[0].result;
          try {
            const htmlTable = CreateView(data, 'lightPro', true);
            document.getElementById('result').innerHTML = htmlTable;
          } catch (e) {
            console.error('Error formatting data: ', e);
            document.getElementById('result').textContent = 'Error formatting data.';
          }
        } else {
          document.getElementById('result').textContent = 'No data-digitalanalytics tags found.';
        }
      }
    );
  });
});
// go through the results and look for json object and createView of that json object
function extractData() {
  const elements = document.querySelectorAll('[data-digitaldata]');
  let data = [];
  elements.forEach(el => {
    let elementData = {};
    elementData.tagName = el.tagName;
    elementData.attributes = {};
    Array.from(el.attributes).forEach(attr => {
      elementData.attributes[attr.name] = attr.value;
    });
    data.push(elementData);
  });
  return data;
}