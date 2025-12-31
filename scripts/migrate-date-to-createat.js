#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Migration script to rename 'date' field to 'createAt' in frontmatter
 * Processes all .mdx files in posts/en and posts/zh
 */

const POSTS_DIR = path.join(__dirname, '../posts');
const LOCALES = ['en', 'zh'];

function processFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);

    // Check if 'date' field exists and 'createAt' doesn't
    if (frontmatter.date && !frontmatter.createAt) {
      console.log(`Migrating: ${filePath}`);

      // Rename date to createAt
      frontmatter.createAt = frontmatter.date;
      delete frontmatter.date;

      // Reconstruct the file with updated frontmatter
      const newContent = matter.stringify(content, frontmatter);
      fs.writeFileSync(filePath, newContent, 'utf8');

      console.log(`✓ Migrated: ${filePath}`);
      return true;
    } else if (frontmatter.createAt) {
      console.log(`⊘ Skipped (already has createAt): ${filePath}`);
      return false;
    } else if (!frontmatter.date) {
      console.log(`⊘ Skipped (no date field): ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory not found: ${dirPath}`);
    return 0;
  }

  const files = fs.readdirSync(dirPath);
  let migratedCount = 0;

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile() && (file.endsWith('.md') || file.endsWith('.mdx'))) {
      if (processFile(filePath)) {
        migratedCount++;
      }
    }
  }

  return migratedCount;
}

function main() {
  console.log('Starting migration: date → createAt\n');

  let totalMigrated = 0;

  for (const locale of LOCALES) {
    const localePath = path.join(POSTS_DIR, locale);
    console.log(`\nProcessing locale: ${locale}`);
    console.log('='.repeat(50));

    const count = processDirectory(localePath);
    totalMigrated += count;

    console.log(`\nMigrated ${count} file(s) in ${locale}`);
  }

  console.log('\n' + '='.repeat(50));
  console.log(`\nMigration complete! Total files migrated: ${totalMigrated}`);
}

main();
