
/**
 * List all entries of specific folder.
 * @param folder 
 */
export async function listItemsInFolderAsync(folder:string){
  for await (const dirEntry of Deno.readDir(folder)) {
    console.log(dirEntry.name, "isFile:", dirEntry.isFile);
  }
}

// listItemsInFolderAsync("/")
const pwd = Deno.cwd()

listItemsInFolderAsync(pwd)