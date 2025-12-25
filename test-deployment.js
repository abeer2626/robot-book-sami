/**
 * Deployment readiness test script
 * Run with: node test-deployment.js
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Testing Deployment Readiness\n');

// Test 1: Check required files exist
const requiredFiles = [
  'package.json',
  'vercel.json',
  'rag-backend/requirements.txt',
  'rag-backend/app/main.py',
  'docs/intro.md',
  'sidebars.ts'
];

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Test 2: Check vercel.json configuration
console.log('\n⚙️  Checking vercel.json:');
try {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  console.log(`  ✅ Routes: ${vercelConfig.routes.length} configured`);
  console.log(`  ✅ Builds: ${vercelConfig.builds.length} configured`);
  console.log(`  ✅ Env vars: ${Object.keys(vercelConfig.env || {}).length} configured`);
} catch (err) {
  console.log('  ❌ Error parsing vercel.json');
}

// Test 3: Check package.json scripts
console.log('\n🔧 Checking package.json scripts:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const scripts = packageJson.scripts || {};
  console.log('  Available scripts:', Object.keys(scripts).join(', '));
  if (scripts.build) console.log('  ✅ Build script found');
  if (scripts.start) console.log('  ✅ Start script found');
} catch (err) {
  console.log('  ❌ Error parsing package.json');
}

// Test 4: Check Python requirements
console.log('\n🐍 Checking Python backend:');
try {
  const requirements = fs.readFileSync('rag-backend/requirements.txt', 'utf8');
  const reqCount = requirements.split('\n').filter(line => line.trim() && !line.startsWith('#')).length;
  console.log(`  ✅ ${reqCount} Python dependencies`);
} catch (err) {
  console.log('  ❌ Error reading requirements.txt');
}

// Test 5: Check environment template
console.log('\n🔑 Checking environment configuration:');
const envFiles = ['.env.example', '.env.template'];
envFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Test 6: Check build output
console.log('\n🏗️  Checking build output:');
const buildDir = path.join(__dirname, 'build');
if (fs.existsSync(buildDir)) {
  const files = fs.readdirSync(buildDir);
  console.log(`  ✅ Build directory exists with ${files.length} items`);

  // Check key files
  const requiredBuildFiles = ['index.html', '404.html', 'docs', 'assets'];
  requiredBuildFiles.forEach(file => {
    const exists = fs.existsSync(path.join(buildDir, file));
    console.log(`    ${exists ? '✅' : '❌'} /${file}`);
  });
} else {
  console.log('  ❌ Build directory not found. Run `npm run build` first.');
}

console.log('\n🎉 Deployment readiness check complete!');
console.log('\nNext steps for Vercel deployment:');
console.log('1. Push code to GitHub repository');
console.log('2. Connect repository to Vercel');
console.log('3. Add environment variables in Vercel dashboard');
console.log('4. Deploy!');