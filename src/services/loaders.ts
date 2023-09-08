import * as vscode from "vscode";
import { InfisicalData } from "./infisical.class";

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
