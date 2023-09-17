import * as crypto from "crypto";
import axios from "axios";
import * as vscode from "vscode";

interface DecryptType {
  ciphertext: string;
  iv: string;
  tag: string;
  secret: string;
}

export class InfisicalData {
  public serviceTokenData: any;
  private serviceToken: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private BASE_URL: string = "https://app.infisical.com";
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private ALGORITHM: string = "aes-256-gcm";
  private secrets: { [key: string]: string | undefined | null } = {};
  static pickedItem: string;

  constructor(public token: string) {
    this.serviceToken = token;
  }

  async getEnvironments() {
    // 1. Get your Infisical Token data
    const response = await axios.get(`${this.BASE_URL}/api/v2/service-token`, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Bearer ${this.serviceToken}`,
      },
    });
    if (response.status === 200) {
      this.serviceTokenData = response.data;
    }
  }

  getQuickPickItems() {
    const { scopes } = this.serviceTokenData;
    let items: Array<vscode.QuickPickItem> = [];
    for (const scope of scopes) {
      items.push({
        label: scope.environment,
        description: scope.secretPath,
        picked: scopes[0].environment === scope.environment,
      });
    }

    return items;
  }

  async getEnvFile(environment: string | undefined) {
    if (!environment) {
      return;
    }
    const { workspace, encryptedKey, iv, tag } = this.serviceTokenData;
    const serviceTokenSecret = this.serviceToken.substring(
      this.serviceToken.lastIndexOf(".") + 1
    );

    const response = await axios.get(
      `${this.BASE_URL}/api/v3/secrets?${new URLSearchParams({
        environment: environment,
        workspaceId: workspace,
      })}`,
      {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Bearer ${this.serviceToken}`,
        },
      }
    );

    if (response.status === 200) {
      const encryptedSecrets = response.data.secrets;
      const projectKey = this.decrypt({
        ciphertext: encryptedKey,
        iv: iv,
        tag: tag,
        secret: serviceTokenSecret,
      });

      encryptedSecrets.map((secret: any) => {
        const secretKey = this.decrypt({
          ciphertext: secret.secretKeyCiphertext,
          iv: secret.secretKeyIV,
          tag: secret.secretKeyTag,
          secret: projectKey,
        });

        const secretValue = this.decrypt({
          ciphertext: secret.secretValueCiphertext,
          iv: secret.secretValueIV,
          tag: secret.secretValueTag,
          secret: projectKey,
        });

        this.secrets = {
          ...this.secrets,
          [secretKey]: secretValue,
        };
      });
    }
  }

  private decrypt({ ciphertext, iv, tag, secret }: DecryptType) {
    const decipher = crypto.createDecipheriv(
      this.ALGORITHM,
      secret,
      Buffer.from(iv, "base64")
    ) as unknown as crypto.DecipherCCM;
    decipher.setAuthTag(Buffer.from(tag, "base64"));

    let cleartext = decipher.update(ciphertext, "base64", "utf8");
    cleartext += decipher.final("utf8");

    return cleartext;
  }

  loadEnvInTerminal() {
    const terminal = vscode.window.createTerminal({
      env: this.secrets,
      name: "Infisical Env Loader",
      message: `Don't Close this Terminal`,
    });
    terminal.show();
    vscode.window.showInformationMessage("Env File Loaded SuccessFully");
  }
}
