import { cp, rm } from 'fs/promises'
import { existsSync } from 'fs'
import { resolve } from 'path'

const src = resolve(process.cwd(), 'documentation', 'build')
const dest = resolve(process.cwd(), 'public', 'documentation')

async function main () {
  if (!existsSync(src)) {
    console.error(`Source docs build not found: ${src}`)
    process.exit(1)
  }

  // Remove existing destination if present
  try {
    await rm(dest, { recursive: true, force: true })
  } catch (e) {
    // ignore
  }

  // Copy recursively (Node 16+)
  try {
    await cp(src, dest, { recursive: true })
    console.log('Docs copied to', dest)
  } catch (err) {
    console.error('Failed to copy docs:', err)
    process.exit(2)
  }
}

main()
