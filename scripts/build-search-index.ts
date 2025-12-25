import { buildSearchIndex } from '../src/lib/searchIndex';
import * as path from 'path';
import * as fs from 'fs';

async function build() {
  console.log('Building search index...');

  try {
    const index = await buildSearchIndex(path.join(__dirname, '../docs'));

    // Save index to static directory
    const staticDir = path.join(__dirname, '../static');

    // Ensure static directory exists
    if (!fs.existsSync(staticDir)) {
      fs.mkdirSync(staticDir, { recursive: true });
    }

    // Write index file
    const indexPath = path.join(staticDir, 'search-index.json');
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

    console.log(`Search index built successfully!`);
    console.log(`- Documents indexed: ${index.metadata.totalDocuments}`);
    console.log(`- Modules: ${index.metadata.modules.join(', ')}`);
    console.log(`- Output: ${indexPath}`);
  } catch (error) {
    console.error('Error building search index:', error);
    process.exit(1);
  }
}

build();