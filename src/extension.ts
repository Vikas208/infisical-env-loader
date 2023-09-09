// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { InfisicalData } from "./services/infisical.class";
import {
  ENV_MANAGER_DEFAULT_ENV,
  ENV_MANAGER_TOKEN,
} from "./services/constant";
import { loadEvnFiles, loadLaunchJson } from "./services/loaders";

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
  let loadToken = vscode.commands.registerCommand(
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
        context.workspaceState.update(
          `${ENV_MANAGER_TOKEN}${context.extension.id}`,
          token
        );
        await loadEvnFiles(token);
        context.workspaceState.update(
          `${ENV_MANAGER_DEFAULT_ENV}${context.extension.id}`,
          InfisicalData.pickedItem
        );
      } catch (err) {
        console.log("infisical-env-loader.loadToken", err);
      }
    }
  );

  let loadExistingToken = vscode.commands.registerCommand(
    "infisical-env-loader.loadExistingToken",
    async () => {
      try {
        const token: string | undefined = context.workspaceState.get(
          `${ENV_MANAGER_TOKEN}${context.extension.id}`
        );
        if (!token) {
          vscode.commands.executeCommand("infisical-env-loader.loadToken");
          vscode.window.showErrorMessage("Unable to load token");
          return;
        }
        await loadEvnFiles(token);
        context.workspaceState.update(
          `${ENV_MANAGER_DEFAULT_ENV}${context.extension.id}`,
          InfisicalData.pickedItem
        );
      } catch (err) {
        console.log("infisical-env-loader.loadExistingToken", err);
      }
    }
  );

  let loadDefaultEnv = vscode.commands.registerCommand(
    "infisical-env-loader.loadDefaultEnv",
    async () => {
      try {
        const token: string | undefined = context.workspaceState.get(
          `${ENV_MANAGER_TOKEN}${context.extension.id}`
        );
        if (!token) {
          vscode.commands.executeCommand("infisical-env-loader.loadToken");
          vscode.window.showErrorMessage("Unable to load token");
          return;
        }

        const envFile: string | undefined = context.workspaceState.get(
          `${ENV_MANAGER_DEFAULT_ENV}${context.extension.id}`
        );
        if (!envFile) {
          vscode.commands.executeCommand(
            "infisical-env-loader.loadExistingToken"
          );
          vscode.window.showErrorMessage("Unable to load env file");
          return;
        }

        await loadEvnFiles(token, true, envFile);
      } catch (err) {
        console.log("infisical-env-loader.loadExistingToken", err);
      }
    }
  );

  let reconfigureInfisical = vscode.commands.registerCommand(
    "infisical-env-loader.reconfigureInfisical",
    async () => {
      try {
        context.workspaceState.keys().map((e) => {
          context.workspaceState.update(e, undefined);
        });
        vscode.window.showInformationMessage("Infisical reconfigured");
      } catch (err) {
        console.log("infisical-env-loader.loadExistingToke", err);
        vscode.window.showErrorMessage("Unable to reconfigure Infisical");
      }
    }
  );

  let loadInfisicalWorkspaceSettings = vscode.commands.registerCommand(
    "infisical-env-loader.loadInfisicalWorkspaceSettings",
    async () => {
      try {
        await loadLaunchJson();
      } catch (err) {
        console.log("infisical-env-loader.loadExistingToke", err);
      }
    }
  );

  context.subscriptions.push(loadToken);
  context.subscriptions.push(loadExistingToken);
  context.subscriptions.push(loadDefaultEnv);
  context.subscriptions.push(reconfigureInfisical);
  context.subscriptions.push(loadInfisicalWorkspaceSettings);
}

// This method is called when your extension is deactivated
export function deactivate() {}
