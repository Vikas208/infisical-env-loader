import * as vscode from "vscode";
import { InfisicalData } from "./infisical.class";
import * as path from "path";
import * as fs from "fs";
import { workerData } from "worker_threads";
import {
  ENV_MANAGER_WORKSPACE_ENV,
  ENV_MANAGER_WORKSPACE_TOKEN,
} from "./constant";

export async function loadEvnFiles(
  token: string,
  loadFromLastSelectedEnvironment = false,
  environmentFileSlug = ""
) {
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
  let pickedItem: vscode.QuickPickItem | undefined;
  if (!loadFromLastSelectedEnvironment) {
    const quickPickItems = infisical.getQuickPickItems();
    pickedItem = quickPickItems.length > 0 ? quickPickItems[0] : undefined;
    if (quickPickItems.length > 1) {
      pickedItem = await vscode.window.showQuickPick(quickPickItems, {
        canPickMany: false,
        matchOnDetail: true,
        placeHolder: "Choose Environment",
        title: "Environment",
      });
    }
  } else {
    pickedItem = {
      label: environmentFileSlug,
    };
  }

  if (!pickedItem) {
    throw new Error("No Environment Selected");
  }
  InfisicalData.pickedItem = pickedItem.label;
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
}

export async function loadLaunchJson() {
  // Get the currently active workspace folder
  const workspaceFolder = vscode.workspace.workspaceFolders;

  if (workspaceFolder && workspaceFolder.length > 0) {
    // Define the path to the launch.json file
    const launchJsonPath = path.join(
      workspaceFolder[0].uri.fsPath,
      ".vscode",
      "launch.json"
    );

    // Check if launch.json file exists
    if (fs.existsSync(launchJsonPath)) {
      // Read the launch.json file
      const launchJsonContent = fs.readFileSync(launchJsonPath, "utf-8");

      try {
        // Parse the launch.json content as JSON
        const launchJsonConfig = JSON.parse(launchJsonContent);
        const configuration = launchJsonConfig.configurations;
        if (
          !configuration ||
          (configuration instanceof Array && configuration.length === 0)
        ) {
          vscode.window.showErrorMessage("Unable to load configuration");
          return;
        }
        console.log(configuration);
        let quickPickItems: Array<vscode.QuickPickItem> = configuration.map(
          (e: any) => {
            return {
              label: e.type,
              picked: configuration[0].type === e.type,
            };
          }
        );
        let pickedItem: vscode.QuickPickItem | undefined = quickPickItems[0];
        if (quickPickItems.length > 1) {
          pickedItem = await vscode.window.showQuickPick(quickPickItems, {
            canPickMany: false,
            matchOnDetail: true,
            placeHolder: "Choose Configuration",
            title: "Configuration",
          });
        }

        const envConfigure = configuration.find(
          (e: any) => e.type === pickedItem?.label
        );

        const env = envConfigure.env;

        if (!env) {
          vscode.window.showErrorMessage("Unable to find env variable");
          return;
        }

        if (!env[ENV_MANAGER_WORKSPACE_TOKEN]) {
          vscode.window.showErrorMessage("Unable to load token");
          return;
        }

        if (!env[ENV_MANAGER_WORKSPACE_ENV]) {
          vscode.window.showErrorMessage("Unable to load env file");
          loadEvnFiles(env[ENV_MANAGER_WORKSPACE_TOKEN]);
          return;
        }

        loadEvnFiles(
          env[ENV_MANAGER_WORKSPACE_TOKEN],
          true,
          env[ENV_MANAGER_WORKSPACE_ENV]
        );
      } catch (error) {
        vscode.window.showErrorMessage((error as string).toString());
        console.error("Error parsing launch.json:", error);
      }
    } else {
      vscode.window.showErrorMessage(
        "launch.json file not found in the workspace folder."
      );
    }
  } else {
    vscode.window.showErrorMessage("No workspace folder found.");
  }
}
