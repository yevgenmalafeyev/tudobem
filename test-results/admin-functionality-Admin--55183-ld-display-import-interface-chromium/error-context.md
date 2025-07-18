# Page snapshot

```yaml
- banner:
  - img
  - heading "Tudobem Admin" [level=1]
  - button "Logout"
- navigation:
  - button "📁 Data Management"
  - button "📊 Question Stats"
  - button "📈 Usage Analytics"
- main:
  - heading "📤 Export Questions" [level=2]
  - paragraph: Export all questions, answers, and explanations from the database as a ZIP-compressed JSON file.
  - button "📥Export Database"
  - heading "📥 Import Questions" [level=2]
  - paragraph: Import questions from a ZIP file containing JSON data. This will add new questions to the database.
  - text: Select ZIP file to import
  - button "Choose File"
  - button "📤Import Data" [disabled]
  - heading "📋 Instructions" [level=3]
  - paragraph:
    - strong: "Export:"
    - text: Downloads all questions from the database as a ZIP file containing JSON data.
  - paragraph:
    - strong: "Import:"
    - text: Uploads a ZIP file containing JSON data to add new questions to the database.
  - paragraph:
    - strong: "File Format:"
    - text: ZIP files should contain a JSON file with an array of question objects.
  - paragraph:
    - strong: "Note:"
    - text: Import will not overwrite existing questions with the same content.
- alert
```