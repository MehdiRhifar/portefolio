---
description: Translate all French content files to English
agent: general
---

Translate all French markdown content files from src/content/ to English.

Here is the file structure:
- Projects: src/content/projects/fr/*.md → src/content/projects/en/*.md
- Experiences: src/content/experiences/fr/*.md → src/content/experiences/en/*.md
- Education: src/content/education/fr/*.md → src/content/education/en/*.md

For each French file:
1. Read the file content
2. Translate it from French to English while preserving:
   - ALL markdown formatting (headers, lists, code blocks, tables, links, etc.)
   - YAML frontmatter structure (translate only values, NOT keys)
   - Technical terms and proper nouns (keep them in original language)
   - Code snippets and technical identifiers
3. Create or overwrite the English file in the corresponding en/ directory
4. Ensure the en/ directory exists before writing

Important translation rules:
- Translate field values like title, description, achievements, highlights, etc.
- Keep field names in English (title, shortDesc, description, achievements, etc.)
- Maintain dates and structured data unchanged
- Preserve code blocks exactly as they are
- Keep URLs and links intact

After translation is complete, provide a summary showing:
- Number of files translated
- List of files processed with their paths