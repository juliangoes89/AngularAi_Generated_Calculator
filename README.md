# Angular Calculator App

A beautiful, responsive calculator built with Angular 18+ and TypeScript.

## Features

- ✨ **Modern Design**: Glass-morphism UI with gradient backgrounds
- 🧮 **Basic Operations**: Addition, subtraction, multiplication, division
- 🔢 **Number Support**: Integers and decimal numbers
- 🚨 **Error Handling**: Division by zero and invalid operation handling
- 📱 **Responsive**: Works on desktop and mobile devices
- ⌨️ **Interactive**: Smooth animations and hover effects

## Getting Started

### Prerequisites

- Node.js (version 20.19 or higher)
- npm (comes with Node.js)
- Angular CLI (optional, but recommended)

### Installation

1. Clone or download the project
2. Navigate to the project directory:
   ```bash
   cd angular-calculator
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Run the development server:
```bash
npm start
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any of the source files.

### Build

Build the project for production:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Testing

Run the unit tests:
```bash
npm test
```

## Project Structure

```
src/
├── app/
│   └── app.component.ts    # Main calculator component
├── index.html              # Main HTML file
├── main.ts                # Application bootstrap
└── styles.css             # Global styles
```

## Calculator Operations

- **AC**: All Clear - resets the calculator
- **DEL**: Delete - removes the last entered digit
- **Numbers (0-9)**: Input numbers
- **Decimal (.)**: Add decimal point
- **Operators (+, -, ×, ÷)**: Perform calculations
- **Equals (=)**: Calculate and display result

## Technologies Used

- **Angular 18**: Frontend framework
- **TypeScript**: Programming language
- **CSS3**: Styling with modern features (backdrop-filter, gradients)
- **HTML5**: Semantic markup

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is open source and available under the MIT License.