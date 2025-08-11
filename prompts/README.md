# Exercise Prompt Template System

This directory contains a reusable template system for generating Portuguese exercise prompts. The system allows you to modify shared content once and have it automatically applied to all prompt files.

## Structure

```
prompts/
├── shared/                   # Shared content blocks
│   ├── json-structure.md     # JSON format specification
│   ├── exercise-guidelines.md # Exercise creation rules
│   ├── quality-requirements.md # Quality standards
│   └── output-format.md      # Output format instructions
├── templates/                # Template files for each level
│   ├── A1_template.md
│   ├── B1_template.md
│   ├── C1_template.md
│   └── ... (create more as needed)
├── build-prompts.js          # Build script
└── README.md                # This file
```

## How to Use

### 1. Making Changes to Shared Content

To modify content that appears across all prompt files:

1. Edit the appropriate file in `shared/`:
   - `json-structure.md` - JSON format requirements
   - `exercise-guidelines.md` - Rules for creating exercises
   - `quality-requirements.md` - Quality standards
   - `output-format.md` - Output format

2. Run the build script to regenerate all prompt files:
   ```bash
   cd prompts
   node build-prompts.js
   ```

### 2. Making Level-Specific Changes

To modify content specific to one level:

1. Edit the template file in `templates/` (e.g., `A1_template.md`)
2. Run the build script to regenerate that level's prompt

### 3. Adding a New Level

1. Create a new template file in `templates/` (e.g., `A2_template.md`)
2. Add the level configuration to `build-prompts.js` in the `levelConfigs` object
3. Run the build script

## Template Syntax

### Variables
Use `{{VARIABLE_NAME}}` for dynamic content:
- `{{LEVEL}}` - Level code (A1, B1, etc.)
- `{{LEVEL_DESCRIPTION}}` - Level description (beginner, intermediate, etc.)
- `{{TOPIC_COUNT}}` - Number of topics for this level
- `{{TOTAL_EXERCISES}}` - Total exercises (TOPIC_COUNT × 10)
- `{{FIRST_TOPIC}}` - First topic ID for examples

### Includes
Use `{{INCLUDE:path/to/file.md}}` to include shared content:
- `{{INCLUDE:shared/json-structure.md}}`
- `{{INCLUDE:shared/exercise-guidelines.md}}`
- `{{INCLUDE:shared/quality-requirements.md}}`
- `{{INCLUDE:shared/output-format.md}}`

## Example Workflow

1. **Update hint guidelines**: Edit `shared/exercise-guidelines.md` section 3
2. **Regenerate all prompts**: Run `node build-prompts.js`
3. **Result**: All 6 prompt files are updated with the new hint rules

## Benefits

- ✅ **Single source of truth**: Update once, apply everywhere
- ✅ **Consistency**: All prompts use identical shared sections
- ✅ **Maintainability**: Easy to keep all prompts in sync
- ✅ **Flexibility**: Level-specific customizations still possible
- ✅ **Version control**: Track changes to shared content easily

## Generated Files

The build script generates these files in the parent directory:
- `A1_Exercise_Generation_Prompt.md`
- `B1_Exercise_Generation_Prompt.md` 
- `C1_Exercise_Generation_Prompt.md`
- (And others as templates are created)

## Notes

- Always run the build script after making changes
- The generated files should not be edited manually
- Keep templates and shared files under version control
- The build script is idempotent (safe to run multiple times)