# Infisical Env Loader - Visual Studio Code Extension

![](https://github.com/Vikas208/infisical-env-loader/blob/development/assets/logo.png)

Welcome to the Infisical Env Loader VSCode Extension! This extension simplifies the management of environment variables within Visual Studio Code, making it easier to work with your Infisical-powered projects.

## Features

- **Load Environment Variables via Infisical Service Token**: Load environment variables securely using your Infisical service token.

- **Convenient User Preference Storage**: Save time and effort by remembering your last selected token and environment file.
- **Flexible Configuration with "Reconfigure Infisical"**: Start fresh by removing previously loaded tokens and environment files from the extension storage.

## Run Locally

Clone the project

```bash
  git clone https://github.com/Vikas208/infisical-env-loader
```

Go to the project directory

```bash
  cd infisical-env-loader
```

Install dependencies

```bash
  pnpm install
```

or

```bash
  yarn install
```

or

```bash
  npm install
```

```bash
  vsce package --no-dependencies
```

**Manual Installation of Infisical Env Loader VSCode Extension**

![](https://github.com/Vikas208/infisical-env-loader/blob/development/assets/steps.gif)

Follow these steps to manually install the Infisical Env Loader VSCode Extension using the .vsix file:

1. **Download the .vsix Extension File:**

   - Locate the latest release and find the `.vsix` file associated with it. It will typically be named something like `infisical-env-loader-1.0.0.vsix`,

2. **Install the Extension in Visual Studio Code:**

   - Open Visual Studio Code.
   - Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or by using the shortcut `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac).
   - Click the three dots (ellipsis) at the top-right corner of the Extensions view to open the context menu.
   - Select "Install from VSIX..." from the context menu.

3. **Select the Downloaded .vsix File:**

   - Navigate to the location where you downloaded the `.vsix` file in Step 1.
   - Select the downloaded `.vsix` file.

4. **Confirm Installation:**

   - Visual Studio Code will prompt you to confirm the installation of the extension.
   - Click "Install" to proceed.

5. **Extension Installation Complete:**

   - Once the installation is complete, you will see a notification confirming the successful installation of the Infisical Env Loader VSCode Extension.

6. **Activate the Extension:**

   - You may need to restart Visual Studio Code to activate the extension fully.
   - After restarting, you should be able to use the extension's features as described in the extension's documentation.

## Usage

1. **Loading Environment Variables via Infisical Service Token**:

   - Open Visual Studio Code.
   - Access the command palette (usually `Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
   - Type and select "ENV MANAGER: Load Environment Variables via Service Token."
   - Enter your Infisical service token when prompted.
   - A user-friendly environment file selection interface will appear, simplifying the selection of your desired environment configuration.

2. **Loading Environment Variables from `launch.json`:**

   - Ensure you have a `launch.json` file in your project.
   - Open Visual Studio Code.
   - Navigate to the command palette.
   - Type and select "ENV MANAGER: Load Environment Variables from `launch.json`."
   - Choose the launch configuration from which you want to load the environment variables.
   - **Note**: You have to put the following env variables under the env variable in the `launch.json` file
     1. `infisicalWorkspaceToken`: Service token
     2. `infisicalWorkspaceEnv`: env file name e.g. `dev`

3. **Efficient User Preferences Storage**:

   - After successfully loading environment variables, the extension retains your token and environment file preferences.
   - The next time you use the extension, it offers the option to reload your last selected settings, saving you valuable time and effort.

   - **Select from Last Token**:

     - Choose "ENV MANAGER: Load from Last Selected Token" to load environment variables using your previously selected token settings.
     - This feature streamlines your workflow by automatically applying your previously chosen token settings.

   - **Select from Last Environment File**:
     - Alternatively, opt for "ENV MANAGER: Load from Last Selected Environment File" to quickly access and apply settings from your preferred environment configuration.

4. **Flexible Configuration with "Reconfigure Infisical"**:

   - If you wish to start fresh and remove previously loaded tokens and environment files from the extension storage, select the "Reconfigure Infisical" option from the command palette.

## Feedback and Support

If you have any feedback, questions, or encounter any issues with the Infisical Env Loader VSCode Extension, please don't hesitate to reach out to us. Your input is invaluable as we continue to improve this extension to better serve your needs.

---

Thank you for choosing the Infisical Env Loader VSCode Extension! Happy coding!
