# Frontend Documentation for Aptos Fullstack Project

## Overview

This frontend application is built using React and interacts with the Aptos blockchain to manage a liquidity pool. It allows users to lock liquidity into the smart contract and withdraw it gradually.

## Getting Started

To set up the frontend application, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd aptos-fullstack-project/frontend
   ```

2. **Install Dependencies**
   Make sure you have Node.js installed. Then, run the following command to install the necessary packages:
   ```bash
   npm install
   ```

3. **Run the Application**
   Start the development server with:
   ```bash
   npm start
   ```
   This will launch the application in your default web browser at `http://localhost:3000`.

## Project Structure

- **public/index.html**: The main HTML file that serves as the entry point for the React application.
- **src/App.tsx**: The main component that sets up the application structure and routing.
- **src/components/LiquidityPool.tsx**: A React component that allows users to interact with the liquidity pool smart contract.
- **src/services/aptosService.ts**: Contains functions for interacting with the Aptos blockchain and calling smart contract functions.
- **src/styles/App.css**: CSS styles for the application.

## Dependencies

This project uses the following key dependencies:
- React
- React Router (for routing)
- Axios (for making HTTP requests)

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.