#!/usr/bin/env node

/**
 * Prompt Template Builder
 * 
 * Processes template files with variables and includes to generate final prompt files.
 * 
 * Usage: node build-prompts.js
 * 
 * Template syntax:
 * - {{VARIABLE}} - replaced with values from config
 * - {{INCLUDE:path/to/file.md}} - includes content from shared files
 */

const fs = require('fs');
const path = require('path');

// Configuration for each level
const levelConfigs = {
  A1: {
    LEVEL: 'A1',
    LEVEL_DESCRIPTION: 'beginner',
    TOPIC_COUNT: 16,
    TOTAL_EXERCISES: 160,
    FIRST_TOPIC: 'verbo-estar'
  },
  A2: {
    LEVEL: 'A2',
    LEVEL_DESCRIPTION: 'elementary',
    TOPIC_COUNT: 18,
    TOTAL_EXERCISES: 180,
    FIRST_TOPIC: 'imperativo-afirmativo'
  },
  B1: {
    LEVEL: 'B1',
    LEVEL_DESCRIPTION: 'intermediate',
    TOPIC_COUNT: 21,
    TOTAL_EXERCISES: 210,
    FIRST_TOPIC: 'poder-conseguir'
  },
  B2: {
    LEVEL: 'B2',
    LEVEL_DESCRIPTION: 'upper-intermediate',
    TOPIC_COUNT: 22,
    TOTAL_EXERCISES: 220,
    FIRST_TOPIC: 'futuro-perfeito-indicativo'
  },
  C1: {
    LEVEL: 'C1',
    LEVEL_DESCRIPTION: 'advanced',
    TOPIC_COUNT: 20,
    TOTAL_EXERCISES: 200,
    FIRST_TOPIC: 'condicional-preterito'
  },
  C2: {
    LEVEL: 'C2',
    LEVEL_DESCRIPTION: 'mastery',
    TOPIC_COUNT: 25,
    TOTAL_EXERCISES: 250,
    FIRST_TOPIC: 'modalidade-discursiva'
  }
};

function processTemplate(templatePath, config) {
  let content = fs.readFileSync(templatePath, 'utf8');
  
  // Process includes first
  content = content.replace(/\{\{INCLUDE:([^}]+)\}\}/g, (match, includePath) => {
    const fullIncludePath = path.join(__dirname, includePath);
    if (fs.existsSync(fullIncludePath)) {
      return fs.readFileSync(fullIncludePath, 'utf8');
    } else {
      console.warn(`Warning: Include file not found: ${fullIncludePath}`);
      return `<!-- Include not found: ${includePath} -->`;
    }
  });
  
  // Process variables
  content = content.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
    return config[variable] || match;
  });
  
  return content;
}

function buildPrompts() {
  const templatesDir = path.join(__dirname, 'templates');
  const outputDir = path.join(__dirname, '..');
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Process each level
  for (const [level, config] of Object.entries(levelConfigs)) {
    const templatePath = path.join(templatesDir, `${level}_template.md`);
    
    if (fs.existsSync(templatePath)) {
      const outputPath = path.join(outputDir, `${level}_Exercise_Generation_Prompt.md`);
      const processedContent = processTemplate(templatePath, config);
      
      fs.writeFileSync(outputPath, processedContent);
      console.log(`✅ Generated ${level}_Exercise_Generation_Prompt.md`);
    } else {
      console.log(`⚠️  Template not found: ${templatePath}`);
    }
  }
}

// Create template files for missing levels if they don't exist
function createMissingTemplates() {
  const templatesDir = path.join(__dirname, 'templates');
  const levels = ['A2', 'B2', 'C1', 'C2'];
  
  levels.forEach(level => {
    const templatePath = path.join(templatesDir, `${level}_template.md`);
    if (!fs.existsSync(templatePath)) {
      console.log(`📝 Create ${level}_template.md manually with level-specific topics`);
    }
  });
}

if (require.main === module) {
  console.log('🔨 Building prompt files...');
  createMissingTemplates();
  buildPrompts();
  console.log('✨ Build complete!');
}

module.exports = { processTemplate, levelConfigs };