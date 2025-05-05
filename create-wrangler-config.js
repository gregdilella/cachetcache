#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration values
const config = {
  name: "cachetcache-sveltekit",
  main: ".svelte-kit/cloudflare/_worker.js",
  compatibility_date: new Date().toISOString().split('T')[0], // Today's date
  workers_dev: true,
  routes: [],
  site: {
    bucket: ".svelte-kit/cloudflare",
  }
};

// Build the toml content
const buildToml = (config) => {
  let toml = '';
  
  // Add basic config
  toml += `name = "${config.name}"\n`;
  toml += `main = "${config.main}"\n`;
  toml += `compatibility_date = "${config.compatibility_date}"\n`;
  
  if (config.workers_dev !== undefined) {
    toml += `workers_dev = ${config.workers_dev}\n`;
  }
  
  // Add routes if any
  if (config.routes && config.routes.length > 0) {
    toml += '\n[routes]\n';
    config.routes.forEach(route => {
      toml += `  ${route.pattern} = "${route.zone_name}"\n`;
    });
  }
  
  // Add site config
  if (config.site) {
    toml += '\n[site]\n';
    toml += `  bucket = "${config.site.bucket}"\n`;
  }
  
  return toml;
};

// Generate the toml file
const generateWranglerToml = () => {
  const tomlContent = buildToml(config);
  const outputFile = path.join('.svelte-kit', 'cloudflare', 'wrangler.toml');
  
  // Make sure the directory exists
  const dir = path.dirname(outputFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Write the file
  fs.writeFileSync(outputFile, tomlContent);
  console.log(`✅ Created wrangler.toml in ${outputFile}`);
};

// Run the generator
generateWranglerToml(); 