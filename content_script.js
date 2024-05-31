function insertScript(file) {
    const url = chrome.runtime.getURL(file);

    const $$script = document.createElement("script");
    $$script.src = url;
    $$script.type = "text/javascript";
    document.body.appendChild($$script);
}

function insertStyleSheet(file) {
    const url = chrome.runtime.getURL(file);

    const $$style = document.createElement("link");
    $$style.href = url;
    $$style.rel = "stylesheet";
    document.body.appendChild($$style);
}

insertScript("./embedding_script.js");
insertStyleSheet("./embedding.css");
