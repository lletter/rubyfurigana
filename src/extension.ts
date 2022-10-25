import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "rubyfurigana.addFurigana",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const document = editor.document;
        const selection = editor.selection;

        const input = selection.isEmpty
          ? await vscode.window.showInputBox({
              title: "Add Kanji",
              prompt: "Escape to cancel.",
            })
          : document.getText(selection);

        if (!input) {
          return;
        }

        const elements: { kanji: string; furi: string }[] = [];

        for (const kanji of input.split("")) {
          const furi = await vscode.window.showInputBox({
            title: `Add Furigana for ${kanji}`,
            prompt: "Enter to group with the next kanji.",
          });

          if (!furi) {
            return;
          }

          elements.push({ kanji, furi });
        }

        if (editor.selection.isEmpty) {
          editor.edit((editBuilder) => {
            editBuilder.insert(
              editor.selection.active,
              `<ruby>${elements
                .map((e) => `${e.kanji}<rt>${e.furi}</rt>`)
                .join("")}</ruby>`
            );
          });
        } else {
          editor.edit((editBuilder) => {
            editBuilder.replace(
              editor.selection,
              `<ruby>${elements
                .map((e) => `${e.kanji}<rt>${e.furi}</rt>`)
                .join("")}</ruby>`
            );
          });
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
