# Cucumber BDD Testing Guide

This document explains the Behavior-Driven Development (BDD) testing setup for the Angular Calculator using Cucumber.js.

## Overview

The Cucumber tests complement the existing unit tests by providing acceptance tests written in natural language (Gherkin syntax). These tests validate the calculator's behavior from a user's perspective.

## Prerequisites

- Node.js and npm installed
- Angular development server running
- Chrome/Chromium browser available
- All dependencies installed (`npm install`)

## Running Cucumber Tests

### Prerequisites
**IMPORTANT**: The Angular development server must be running before executing Cucumber tests.

1. **Start Angular server (REQUIRED):**
   ```bash
   npm start
   ```
   Wait for the "compiled successfully" message.

2. **In a new terminal, run Cucumber tests:**
   ```bash
   npm run test:cucumber:direct
   ```

### Alternative Commands
```bash
# Direct Cucumber execution
npx cucumber-js --config cucumber.config.js

# Test specific feature file
npx cucumber-js --config cucumber.config.js features/simple-test.feature

# Run unit tests only
npm run test:unit
```

## Test Structure

### Feature Files (`features/*.feature`)
Written in Gherkin syntax describing calculator behavior:

- **`calculator-operations.feature`** - Basic arithmetic operations
- **`calculator-input.feature`** - Number input and display
- **`calculator-clear-delete.feature`** - Clear and delete functions  
- **`calculator-edge-cases.feature`** - Error handling and edge cases

### Step Definitions (`features/step_definitions/*.js`)
JavaScript implementation of the Gherkin steps that:
- Control the browser using Puppeteer
- Interact with calculator buttons
- Verify display values and states

### Support Files (`features/support/*.js`)
Configuration and world setup:
- Browser management
- Angular server lifecycle
- Test environment setup

## Feature Coverage

### 1. Basic Calculator Operations (7 scenarios)
```gherkin
Scenario: Adding two positive numbers
  When I click "5"
  And I click "+"
  And I click "3"  
  And I click "="
  Then the display should show "8"
```

**Covered Operations:**
- Addition, subtraction, multiplication, division
- Division by zero error handling
- Decimal number calculations
- Operation chaining

### 2. Calculator Input and Display (7 scenarios)
```gherkin
Scenario: Entering multi-digit numbers
  When I click "1" then "2" then "3" then "4"
  Then the display should show "1234"
```

**Covered Features:**
- Single and multi-digit entry
- Decimal point handling
- Initial zero replacement
- Multiple decimal point prevention

### 3. Clear and Delete Functions (6 scenarios)
```gherkin
Scenario: Delete last digit with DEL button
  Given I have entered "456"
  When I click "DEL"
  Then the display should show "45"
```

**Covered Functions:**
- AC (All Clear) button
- DEL (Delete) button behavior
- Error state recovery
- Fresh calculation start

### 4. Edge Cases and Error Handling (7 scenarios)
```gherkin
Scenario: Division by zero shows error
  When I perform calculation "10 ÷ 0"
  Then the display should show "Error"
  And the calculator should be in error state
```

**Covered Cases:**
- Division by zero
- Very large/small numbers
- Consecutive equals operations
- Operation without second operand
- Multiple operations in sequence

## Gherkin Keywords

- **Feature:** High-level description of functionality
- **Background:** Steps that run before each scenario
- **Scenario:** Individual test case
- **Given:** Initial context/state
- **When:** Actions performed
- **Then:** Expected outcomes
- **And/But:** Additional steps

## Custom Step Definitions

### Navigation Steps
- `Given I have a calculator open`
- `Given the display shows "value"`

### Input Actions
- `When I click "button"`
- `When I click "btn1" then "btn2"`
- `When I perform calculation "expression"`

### State Setup
- `Given I have entered "number"`
- `Given I have a division by zero error`

### Assertions
- `Then the display should show "value"`
- `Then the display should show a number close to "value"`
- `Then the display should show a number in scientific notation`

## Browser Automation

The tests use **Puppeteer** to:
- Launch headless Chrome browser
- Navigate to calculator application
- Simulate button clicks
- Read display values
- Verify UI states

## Reporting

Test results are generated in multiple formats:
- **Console**: Progress bar showing test execution
- **JSON**: `reports/cucumber-report.json` for CI/CD integration
- **HTML**: `reports/cucumber-report.html` for detailed visual report

## Configuration

### `cucumber.config.js`
```javascript
module.exports = {
  default: {
    require: ['features/support/world.js', 'features/step_definitions/*.js'],
    format: ['progress-bar', 'json:reports/cucumber-report.json'],
    paths: ['features/**/*.feature'],
    timeout: 60000
  }
};
```

### Test Timeouts
- **Overall timeout**: 60 seconds per scenario
- **Page navigation**: 30 seconds
- **Button interactions**: 50ms delays for UI updates

## Troubleshooting

### Common Issues

**1. Angular server not starting:**
```bash
# Check if port 4200 is available
netstat -an | findstr :4200

# Kill any processes using the port
taskkill /PID <process_id> /F
```

**2. Browser launch failures:**
```bash
# Install Chrome dependencies (Linux)
sudo apt-get install -y gconf-service libasound2-dev

# Update Puppeteer
npm install puppeteer@latest
```

**3. Test timeouts:**
- Increase timeout in `cucumber.config.js`
- Check Angular compilation time
- Verify system resources

**4. Button not found errors:**
- Verify calculator is fully loaded
- Check for correct button text/symbols
- Ensure display selectors match component

### Debugging Tests

**Enable browser visibility:**
```javascript
// In features/support/world.js
globalBrowser = await puppeteer.launch({
  headless: false, // Set to false to see browser
  devtools: true   // Enable dev tools
});
```

**Add console logging:**
```javascript
// In step definitions
console.log('Current display:', await this.getCurrentDisplay());
```

**Screenshot on failure:**
```javascript
// In After hook
if (scenario.result.status === 'failed') {
  await this.page.screenshot({path: `error-${Date.now()}.png`});
}
```

## Best Practices

1. **Write descriptive scenarios** that tell a story
2. **Use Background steps** for common setup
3. **Keep steps atomic** and reusable
4. **Test both happy path and error cases**
5. **Use meaningful assertions** with clear error messages
6. **Group related scenarios** in the same feature file
7. **Make tests independent** - each scenario should work in isolation

## Integration with CI/CD

The Cucumber tests can be integrated into continuous integration:

```yaml
# Example GitHub Actions workflow
- name: Run Unit Tests
  run: npm run test:unit

- name: Run BDD Tests  
  run: npm run test:cucumber

- name: Upload Test Reports
  uses: actions/upload-artifact@v2
  with:
    name: test-reports
    path: reports/
```

This BDD testing approach ensures the calculator works correctly from an end-user perspective and provides living documentation of the expected behavior.