import {join} from "https://deno.land/std/path/mod.ts"
import {BufReader} from "https://deno.land/std/io/bufio.ts"
import {parse} from "https://deno.land/std/encoding/csv.ts"

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
  //
  return result
}

const pwd = Deno.cwd()
const file = join(pwd,"data/sample.csv")

loadCSV(file).then(data=>{
  console.log(data)
})

// const fileUrl = new URL("http://samplecsvs.s3.amazonaws.com/Sacramentorealestatetransactions.csv")

// loadCSV(fileUrl).then(data=>{
//   console.log(data)
// })
