const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);

async function* walk(dir) {
  const files = await readdirAsync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await statAsync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        yield* walk(filePath);
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        yield filePath;
      }
    }
  }
}

async function fixImports(filePath) {
  const content = await readFileAsync(filePath, 'utf8');
  let modified = content;

  // 相対インポートパスに.js拡張子を追加
  modified = modified.replace(
    /from ['"]([\.\/]+[^'"]*?)['"];/g,
    (match, importPath) => {
      if (!importPath.endsWith('.js')) {
        return `from '${importPath}.js';`;
      }
      return match;
    }
  );

  if (modified !== content) {
    await writeFileAsync(filePath, modified, 'utf8');
    console.log(`Fixed imports in ${filePath}`);
  }
}

async function main() {
  for await (const filePath of walk(process.cwd())) {
    await fixImports(filePath);
  }
}

main().catch(console.error); 