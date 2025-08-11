# E2E Test Reference Guide

## Correct Menu Labels and Navigation

### Main Navigation Menu Items
- **Configuration**: `text=Configurar` (NOT "Configuração")
- **Learn/Practice**: `text=Aprender`
- **Irregular Verbs**: `text=Verbos Irregulares`

### Common Selectors

#### Buttons and Actions
- **Save Configuration**: `text=Salvar Configuração`
- **Multiple Choice Toggle**: `text=Mostrar Opções`
- **Text Input Toggle**: `text=Digitar Resposta`
- **Check Answer**: `text=Verificar resposta`
- **Next Exercise**: `text=Próximo exercício`

#### Form Elements
- **Multiple Choice Options**: `button[data-testid="multiple-choice-option"]`
- **Text Input**: `input[type="text"]`
- **Checkboxes**: `input[type="checkbox"]`
- **Radio Buttons**: `input[type="radio"]`

#### Content Areas
- **Exercise Question**: `h2` (main question heading)
- **Feedback Areas**: `text=/✅ Correto!|❌ Incorreto/`

### Navigation Patterns

#### To Configuration Page
```typescript
await page.click('text=Configurar');
await page.waitForLoadState('networkidle');
```

#### To Irregular Verbs
```typescript
await page.click('text=Aprender');
await page.waitForTimeout(500);
await page.click('text=Verbos Irregulares');
```

#### Configuration Actions
```typescript
// Select/deselect all tenses
await page.click('text=Todos');     // Select all
await page.click('text=Nenhum');    // Deselect all

// Save configuration
await page.click('text=Salvar Configuração');
```

### Common Test Patterns

#### Exercise Navigation
```typescript
// Switch to multiple choice
await page.click('text=Mostrar Opções');
await page.waitForTimeout(1000);

// Click first option (auto-submits)
const options = await page.locator('button[data-testid="multiple-choice-option"]').all();
await options[0].click();

// Navigate to next exercise with Enter key
await page.keyboard.press('Enter');
```

#### Waiting for Content
```typescript
// Wait for exercise to load
await page.waitForSelector('h2', { timeout: 10000 });

// Wait for options to appear
await page.waitForSelector('button[data-testid="multiple-choice-option"]', { timeout: 10000 });

// Wait for feedback
await page.waitForSelector('text=/✅ Correto!|❌ Incorreto/', { timeout: 5000 });
```

### Configuration Specific Selectors

#### Irregular Verbs Configuration
- **Tenses Section**: `text=Verbos Irregulares - Tempos Verbais`
- **Vós Toggle**: `input[type="checkbox"]` with `text=Incluir formas de "vós"`
- **Individual Tense Checkbox**: `input[type="checkbox"][value="tense_name"]`

### Error Prevention Tips

1. **Always use exact text matches** as they appear in the UI
2. **Use `waitForLoadState('networkidle')`** after navigation
3. **Add small timeouts** for UI transitions (`waitForTimeout(500-1000)`)
4. **Use data-testid attributes** when available for more reliable selection
5. **Check for element visibility** before interacting (`isVisible()`)

### Common Mistakes to Avoid

❌ **Wrong**: `text=Configuração`
✅ **Correct**: `text=Configurar`

❌ **Wrong**: `input[type="radio"]` (old multiple choice format)
✅ **Correct**: `button[data-testid="multiple-choice-option"]`

❌ **Wrong**: Clicking "Verificar resposta" in multiple choice mode
✅ **Correct**: Options auto-submit, no need for verification button

❌ **Wrong**: Clicking "Próximo exercício" button
✅ **Correct**: Use `page.keyboard.press('Enter')` for navigation