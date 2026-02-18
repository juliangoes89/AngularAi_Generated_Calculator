const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

// Background steps
Given('I have a calculator open', async function () {
  // This is handled in the Before hook in world.js
  const calculatorElement = await this.page.$('.calculator');
  assert(calculatorElement, 'Calculator should be visible');
});

Given('the display shows {string}', async function (expectedValue) {
  const displayValue = await this.getCurrentDisplay();
  assert.strictEqual(displayValue, expectedValue, `Expected display to show "${expectedValue}" but got "${displayValue}"`);
});

Given('I have entered {string}', async function (numberString) {
  // Clear first, then enter the number
  await this.clickButton('AC');
  
  for (let char of numberString) {
    await this.clickButton(char);
  }
  
  const displayValue = await this.getCurrentDisplay();
  assert.strictEqual(displayValue, numberString, `Expected to enter "${numberString}" but display shows "${displayValue}"`);
});

Given('I have a division by zero error', async function () {
  await this.clickButton('5');
  await this.clickButton('÷');
  await this.clickButton('0');
  await this.clickButton('=');
  
  const displayValue = await this.getCurrentDisplay();
  assert.strictEqual(displayValue, 'Error', 'Should have division by zero error');
});

// When steps - Actions
When('I click {string}', async function (buttonText) {
  await this.clickButton(buttonText);
});

When('I click {string} then {string}', async function (firstButton, secondButton) {
  await this.clickButton(firstButton);
  await this.clickButton(secondButton);
});

When('I click {string} then {string} then {string}', async function (firstButton, secondButton, thirdButton) {
  await this.clickButton(firstButton);
  await this.clickButton(secondButton);
  await this.clickButton(thirdButton);
});

When('I click {string} then {string} then {string} then {string}', async function (first, second, third, fourth) {
  await this.clickButton(first);
  await this.clickButton(second);
  await this.clickButton(third);
  await this.clickButton(fourth);
});

When('I perform calculation {string}', async function (calculation) {
  // Parse and execute calculation like "10 ÷ 0" or "999999999 × 999999999"
  const parts = calculation.split(' ');
  
  // Enter first number
  for (let char of parts[0]) {
    await this.clickButton(char);
  }
  
  // Click operator
  await this.clickButton(parts[1]);
  
  // Enter second number
  for (let char of parts[2]) {
    await this.clickButton(char);
  }
  
  // Click equals
  await this.clickButton('=');
});

// Then steps - Assertions
Then('the display should show {string}', async function (expectedValue) {
  const displayValue = await this.getCurrentDisplay();
  assert.strictEqual(displayValue, expectedValue, `Expected display to show "${expectedValue}" but got "${displayValue}"`);
});

Then('the display should show a number close to {string}', async function (expectedValue) {
  const displayValue = await this.getCurrentDisplay();
  const actualNumber = parseFloat(displayValue);
  const expectedNumber = parseFloat(expectedValue);
  
  assert(!isNaN(actualNumber), `Display should show a number but got "${displayValue}"`);
  assert(Math.abs(actualNumber - expectedNumber) < 0.01, 
    `Expected number close to ${expectedNumber} but got ${actualNumber}`);
});

Then('the display should show a number in scientific notation', async function () {
  const displayValue = await this.getCurrentDisplay();
  const isScientificNotation = /^\d\.\d+e[+\-]\d+$/.test(displayValue);
  assert(isScientificNotation || displayValue === 'Error', 
    `Expected scientific notation or Error but got "${displayValue}"`);
});

Then('the display should show a very small number', async function () {
  const displayValue = await this.getCurrentDisplay();
  const number = parseFloat(displayValue);
  
  assert(!isNaN(number), `Display should show a number but got "${displayValue}"`);
  assert(number > 0 && number < 0.001, 
    `Expected a very small positive number but got ${number}`);
});

Then('the previous display should be empty', async function () {
  const previousDisplay = await this.getPreviousDisplay();
  assert.strictEqual(previousDisplay, '', `Expected previous display to be empty but got "${previousDisplay}"`);
});

Then('the calculator should be in error state', async function () {
  const displayValue = await this.getCurrentDisplay();
  assert.strictEqual(displayValue, 'Error', 'Calculator should be in error state');
});

Then('I can start fresh calculations', async function () {
  // Test that we can enter a number after clearing error
  await this.clickButton('5');
  const displayValue = await this.getCurrentDisplay();
  assert.strictEqual(displayValue, '5', 'Should be able to start fresh calculations');
});

Then('I can perform normal calculations', async function () {
  // Test a simple calculation to verify normal operation
  await this.clickButton('2');
  await this.clickButton('+');
  await this.clickButton('3');
  await this.clickButton('=');
  
  const displayValue = await this.getCurrentDisplay();
  assert.strictEqual(displayValue, '5', 'Should be able to perform normal calculations');
});