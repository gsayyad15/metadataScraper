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
            const formattedData = JSON.stringify(data, null, 2);
            document.getElementById('result').textContent = formattedData;
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

function extractData() {
  const elements = document.querySelectorAll('[data-digitaldata]');
  let data = [];
  elements.forEach(el => {
    data.push({
      tagName: el.tagName,
      attributes: Array.from(el.attributes).reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {})
    });
  });
  return data;
}
