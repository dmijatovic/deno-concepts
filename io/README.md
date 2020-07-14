# IO with DENO

Deno lib has number of methods for I/O. [See documentation here](https://doc.deno.land/https/github.com/denoland/deno/releases/latest/download/lib.deno.d.ts#Deno.readDirSync).

```bash
# read text file
deno run --allow-read readFile.ts

# deno list directiry
deno run --allow-read listFiles.ts

# deno read csv
deno run --allow-read readCSV.ts
```

Important! You need to close file/resource on your own.

```javascript
async function loadCSV(fileName:string | URL){
  // open file
  const file = await Deno.open(fileName,{read:true})
  // pass it to buffer
  const buffer = new BufReader(file)
  //parse csv
  const result = await parse(buffer,{
    header:true,
    comment:"#"
  })
  // close file
  Deno.close(file.rid)
  // return data as js object
  return result
}
```
