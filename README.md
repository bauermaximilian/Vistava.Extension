# Vistava Extension Template

This repository contains a template that can be used as a starting point for new extensions. Before starting with this template, it is recommended to read the [Vistava developer documentation](https://vistava.net/docs.html#/6-development) or look at the implementation of existing extensions (such as [SMK-Vistava](https://github.com/bauermaximilian/SMK-Vistava)).

## How to use this template

0. Make sure you have **node.js** (version 26 or newer) and **npm** (version 12 or newer) installed.
1. Click the "Use this template" button in the top-right corner of the GitHub page, then "Create a new repository", and follow the steps on the screen.
2. Clone your new repository _including_ the submodules
   ```bash
   git clone --recurse-submodules https://github.com/YOUR_USERNAME/YOUR_EXTENSION.git
   ```
3. Decide on a **unique extension ID** that consists only of lowercase letters, numbers, and underscores (e.g. `smk` or `website123`).
4. Open the `package.json` and edit the following properties:
   - `"name"`: The unique extension ID of your extension (from step 3)
   - `"author"`: Your name (or username)
   - `"version"`: The version of your extension
   - `"description"`: A short description of your extension
   
   Note that the values of these fields will be used by the build script. The remaining fields can be left as they are.

5. Rename the main module file under `Sources/your_extension_id/SourceYourExtension.js` to something that fits your project (e.g. `SourceSMK.js` or `SourceWebsite123.js`).
6. Rename the parent `your_extension_id` folder in the `/Sources` directory to **exactly** match your extension ID (e.g. `smk` or `website123`).
7. Rename the `your_extension_id.source.json` file so it starts with your **exact extension ID**, followed by `.source.json` (e.g. `smk.source.json` or `website123.source.json`), then open that `.source.json` file.
8. Change the value of the `"moduleFileName"` field to the new path of the main module file, relative to the `.source.json` file (e.g. `"smk/SourceSMK.js"` or `"website123/SourceWebsite123.js"`).
9. Change the value of the `"name"` field to the name of the extension that should be displayed in Vistava, which can be different from the `extensionId` (e.g. `"National Gallery of Denmark"` or `"Website123.net"`).
10. Save your changes.
11. Implement your extension, starting with the main module file (from steps 5 and 8) - you can create more files, but all of them _must_ be inside the extension subfolder (from step 6).

## How to "build" the extension
If you have not done so already, run `npm install` once from your repository root to install the required dependencies.

Then run `npm run build` - when everything is configured correctly, this creates an extension bundle with the extension ID, version, and correct file extension under the `/dist` folder. This is the file you can distribute to users and install inside Vistava.

**Note:** The build script copies `package.json` and `README.md` into the extension bundle. Although Vistava does not use these files, users can use them to find information about the extension's author and license.

## Development recommendations

It is highly recommended to use an IDE (like VS Code) that supports type-checking JavaScript files (using the type annotations in the `vistava.js` library and the `jsconfig.json` file in this repository root) - this gives you an experience similar to coding in TypeScript, with the benefit that the files can be loaded right into Vistava (or any modern web browser) without transpilation.

To quickly test and debug your code, you can create a symbolic link from the "Sources" directory to the Vistava settings directory (under `include`), replacing the existing "Sources" directory there with the symbolic link. Then, run Vistava with the `--debug-mode` flag to open the Chromium developer tools at startup. Refresh Vistava (with the **Refresh** button) to reload any changes to your extension.

Of course, before deploying the extension to users, make sure to test importing the extension package at least once. It is also recommended to provide users with short documentation explaining whether they should make changes to the configuration file and how (and that they might need a compatible editor like Notepad++ for this).

## Licensing your extension

Vistava, `vistava.js`, and this repository are all under the GPL-3.0 license. This means that your extension also needs to use that license (because that's how the GPL works) or a license compatible with GPL-3.0.

If you decide to license your extension under GPL-3.0, I recommend adding the following comment at the start of every source file:

```js
// SPDX-License-Identifier: GPL-3.0-or-later
```

Your extension documentation (for example, `README.md`) should also contain a "License" section with the typical copyright information and GPL license notice, as shown below.

**Note:** The instructions above summarize the most important steps and do not constitute legal advice. Properly licensing your work under the GPL might require additional steps.

# License

Copyright (C) 2020-2026 Maximilian Bauer

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.