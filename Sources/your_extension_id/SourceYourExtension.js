// SPDX-License-Identifier: GPL-3.0-or-later

// Vistava makes the "vistava.js" library available at the path 
// "../../Dependencies/vistava.js/src/" (relative to this file when deployed), 
// so the submodule in this repository is just for development purposes.
import { Source } from "../../Dependencies/vistava.js/src/Shared/Source.js";

// If your source provides paginated results, consider using "SourceSegmented" instead.
export default class SourceYourExtension extends Source {
   // The following JSdoc typedefs work similar to a file-scoped import.
   /**
    * @template T
    * @typedef {import(
    * "../../Dependencies/vistava.js/src/Shared/CachedCollection.js")
    * .CollectionRetriever<T>} CollectionRetriever<T>
    */

   /**
    * @typedef {import(
    * "../../Dependencies/vistava.js/src/Components/TileGrid/Shared/TileValue.js")
    * .TileValueInitializer} TileValueInitializer
    */

   /**
    * @param {object} configuration The value of the "configuration"
    * object from the definition file.
    */
   constructor(configuration) {
      super(configuration);
   }

   /**
    * @param {string} query The query string, provided by Vistava, user input or the "queryTarget"
    * value of a tile the user clicked.
    * @returns {CollectionRetriever<TileValueInitializer>}
    */
   createCollectionRetriever(query) {
      return async (offset, count) => {
         /** @type {TileValueInitializer[]} */
         let results = [];
         for (let i = 0; i < count; i++) {
            results.push(this.#generateValue(query, i + offset));
         }
         return results;
      }
   }

   /**
    * @param {string} query
    * @param {number} index
    * @returns {TileValueInitializer} An object initializer used to populate the tiles shown 
    * to the user.
    */
   #generateValue(query, index) {
      // Generate an image text using the "imageTextPrefix"
      // configuration parameter.
      let imageText = ((this.configuration.imageTextPrefix ?? "") +
         " #" + index).trim();
      imageText = encodeURIComponent(imageText);
      return {
         // The label may be hidden depending on Vistava configuration.
         label: `${query} #${index}`,
         mediaType: "image/png",
         mediaUrl: `https://placehold.co/400x400.png?text=${imageText}`,
         thumbnailType: "image/png",
         thumbnailUrl: `https://placehold.co/200x200.png?text=${imageText}`
      }
   }
}