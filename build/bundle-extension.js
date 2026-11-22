// SPDX-License-Identifier: GPL-3.0-or-later

import { pack } from '7zip-min';
import { existsSync, rmSync } from "fs";
import { cp, mkdir, rm, rmdir } from 'fs/promises';
import { join } from "path";

const sourceDirectory = "Sources";
const outputDirectory = "dist";
const extensionBundleFileExtension = "vex.zip";

try {
   let extensionIdentifier = (process.env["npm_package_name"] ?? "").trim();
   let extensionVersion = (process.env["npm_package_version"] ?? "").trim();

   if (extensionIdentifier.length === 0) {
      throw new Error("No valid extension identifier was specified!");
   }
   if (extensionVersion.length === 0) {
      throw new Error("No valid extension version was specified!");
   }

   if (!/^[a-z0-9_]+$/.test(extensionIdentifier)) {
      throw new Error("The specified extension identifier is invalid! " +
         "Only lowercase letters, digits and underscores are allowed.");
   }

   console.log(`Starting bundling of extension "${extensionIdentifier}" (version ${extensionVersion})...`);

   let expectedExtensionDefinitionFileName = `${extensionIdentifier}.source.json`;
   let expectedExtensionSourceDirectoryName = `${extensionIdentifier}`;
   let bundleFileName = `${extensionIdentifier}-${extensionVersion}.${extensionBundleFileExtension}`;

   let expectedExtensionDefinitionFilePath = join(sourceDirectory, expectedExtensionDefinitionFileName);
   let expectedExtensionSourceDirectoryPath = join(sourceDirectory, expectedExtensionSourceDirectoryName);
   let extensionBundleTargetFilePath = join(outputDirectory, bundleFileName);

   if (!existsSync(expectedExtensionDefinitionFilePath)) {
      throw new Error(`The extension definition file "${expectedExtensionDefinitionFilePath}" wasn't found!`);
   }
   if (!existsSync(expectedExtensionSourceDirectoryPath)) {
      throw new Error(`The extension source files directory "${expectedExtensionDefinitionFilePath}" wasn't found!`);
   }
   if (existsSync(extensionBundleTargetFilePath)) {
      console.info(`Found existing extension bundle file under "${extensionBundleTargetFilePath}" - overwriting...`);
      rmSync(extensionBundleTargetFilePath);
   } else {
      console.info(`Creating new extension bundle file under "${extensionBundleTargetFilePath}"...`);
   }

   try {
      const readmeFileName = "README.md";
      const packageFileName = "package.json";
      const tmpDirName = "tmp";
      let tmpPath = join(tmpDirName, extensionIdentifier);
      process.chdir(sourceDirectory);

      // Ensure previous temporary files don't accidentally pollute the build
      if (existsSync(join("..", "dist", tmpDirName))) {
         throw new Error("Fragments from previous build found! Please remove \"dist/tmp\" and try again.");
      }

      // Add the actual extension files into the bundle
      await pack(join("..", expectedExtensionDefinitionFilePath), join("..", extensionBundleTargetFilePath));
      await pack(join("..", expectedExtensionSourceDirectoryPath), join("..", extensionBundleTargetFilePath));

      // Add the package.json/README.md file into the bundle (using the temporary "dist/tmp" directory)
      process.chdir(join("..", outputDirectory));
      await mkdir(tmpPath, { recursive: true });
      await cp(join("..", packageFileName), join(tmpPath, packageFileName));
      if (existsSync(join("..", readmeFileName))) {
         await cp(join("..", readmeFileName), join(tmpPath, readmeFileName));
      }
      process.chdir(tmpDirName);
      await pack(extensionIdentifier, join("..", bundleFileName));

      // Remove temporary files created to get the package.json/README.md into the bundle
      try {
         await rm(join(extensionIdentifier, packageFileName));
         if (existsSync(join(extensionIdentifier, readmeFileName))) {
            await rm(join(extensionIdentifier, readmeFileName));
         }
         await rmdir(extensionIdentifier);
         process.chdir("..");
         await rmdir(tmpDirName);
      } catch (error) {
         console.warn("Couldn't clean up temporary files! Please remove \"dist/tmp\" manually.");
      }
   } catch (error) {
      throw new Error(`Creating extension bundle failed: ${error}`);
   }

   console.info(`Success: Created extension bundle under "${extensionBundleTargetFilePath}".`);
} catch (error) {
   console.error(`${error}`);
}