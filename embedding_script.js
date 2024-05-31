(() => {
    function insertScriptButtons() {
        // エクスポートボタンの設置
        const export_button = make_export_button("⇩ download");
        document.body.appendChild(export_button);

        // インポートボタンの設置
        const import_button = make_import_button("⇧ upload");
        document.body.appendChild(import_button);
    }

    function make_export_button(textContent) {
        const button = document.createElement("button");
        button.textContent = textContent;
        button.className = "custom-export-label";
        button.onclick = function () {
            const url = location.href;
            const pluginId = url.match(/pluginId=([a-zA-Z0-9]+)/)[1];
            export_settings(pluginId);
        };
        return button;
    }

    function export_settings(pluginId) {
        // Kintoneプラグインの設定を取得
        console.info(`export setting plugin-id: ${pluginId}`);
        const config = kintone.plugin.app.getConfig(pluginId);

        // 取得した設定をJSON形式でBlobオブジェクトに変換
        const blob = new Blob([JSON.stringify(config, null, 2)], {
            type: "application/json",
        });

        // BlobオブジェクトからURLを生成
        const url = URL.createObjectURL(blob);

        // ダウンロード用のaタグを生成
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = pluginId + ".json";

        // aタグをDOMに追加してクリックイベントを発火
        document.body.appendChild(a);
        a.click();

        // 使用したURLオブジェクトを解放
        window.URL.revokeObjectURL(url);
    }

    function make_import_button(textContent) {
        // ファイル入力要素を探す
        var presettedFileInput = document.querySelector('input[type="file"]');

        // 既存のファイル入力要素があれば、それをクリック
        if (presettedFileInput) {
            presettedFileInput.click();
            return;
        }

        const wrapper = document.createElement("div");
        wrapper.className = "file-input-wrapper";

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.id = "file-input";
        fileInput.accept = ".json";
        fileInput.style.display = "none";

        const label = document.createElement("label");
        label.htmlFor = "file-input";
        label.className = "custom-file-label";
        label.textContent = textContent;

        wrapper.appendChild(fileInput);
        wrapper.appendChild(label);

        // ファイルが選択されたときの処理
        fileInput.onchange = function (event) {
            var file = event.target.files[0];
            var reader = new FileReader();

            // ファイル読み込み完了時の処理
            reader.onload = function (event) {
                try {
                    // JSONとしてパース
                    var settings = JSON.parse(event.target.result);

                    // 設定を適用
                    if (settings) {
                        kintone.plugin.app.setConfig(settings);
                    } else {
                        console.error("Invalid settings format.");
                    }
                } catch (error) {
                    console.error("Error parsing JSON: " + error.message);
                }
            };

            // ファイルをテキストとして読み込む
            reader.readAsText(file);
        };

        return wrapper;
    }

    insertScriptButtons();
})();
