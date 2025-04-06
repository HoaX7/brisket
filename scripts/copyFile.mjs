import { copyFile } from 'fs/promises'
import { join } from 'path'

const args = process.argv.slice(2)
if (args.length < 2) {
  throw new Error('rm.mjs: requires atleast two parameter. src and dest');
}

const src = join(process.cwd(), args.shift());
const dest = join(process.cwd(), args.shift());

console.log(`cp.mjs: copying ${src} to ${dest}`)
await copyFile(src, dest)
