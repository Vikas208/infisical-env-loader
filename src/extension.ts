// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { InfisicalData } from "./helpers/infisical.api";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "infisical-env-loader" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "infisical-env-loader.loadToken",
    async () => {
      // The code you place here will be executed every time your command is executed
      // Get Token from User
      try {
        const token = await vscode.window.showInputBox({
          placeHolder: "Please enter Infisical Project Service Token here",
          title: "Infisical Project Service Token",
          validateInput(value) {
            if (!value || value === "") {
              return "Please Enter Valid Token";
            }
            return null;
          },
        });
        if (!token) {
          return;
        }
        const infisical = new InfisicalData(token);

        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Loading data",
          },
          async () => {
            await infisical.getEnvironments().catch((e) => {
              vscode.window.showErrorMessage(
                "Failed to fetch data please check your token"
              );
              throw e;
            });
          }
        );
        //   console.log(scopes);
        const pickedItem = await vscode.window.showQuickPick(
          infisical.getQuickPickItems(),
          {
            canPickMany: false,
            matchOnDetail: true,
            placeHolder: "Choose Environment",
            title: "Environment",
          }
        );

        if (!pickedItem) {
          return;
        }
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Loading data",
          },
          async () => {
            await infisical.getEnvFile(pickedItem?.label).catch((e) => {
              vscode.window.showErrorMessage("Failed to fetch data");
              throw e;
            });
          }
        );
        infisical.loadEnvInTerminal();
      } catch (err) {
        console.log(err);
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
