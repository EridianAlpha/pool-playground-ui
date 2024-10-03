# Pool Playground UI

🏗️ UNDER DEVELOPMENT 🏗️

The UI for the [Pool Playground ↗](https://pool.eridian.xyz) project.

Built using Next.js, Chakra UI, Wagmi, RainbowKit and Ethers.

## Installation

### Clone repository

```bash
git clone https://github.com/EridianAlpha/pool-playground-ui.git
```

### Install Dependencies

Install the dependencies using the following command:

```bash
yarn
```

### Update Dependencies

To update all dependencies to their latest versions, run the following command:

```bash
# Update all dependencies to their latest versions
yarn upgrade --latest

# Update specific dependencies to their latest versions in interactive mode
yarn upgrade-interactive --latest
```

### Development Commands

This section explains the available scripts in the `package.json` file and their usage during development.

- `yarn dev`  
  This command starts the development server using the `node server.js` script. Use this command during development to see live updates as you make changes to the project.

- `yarn lint`  
  This command checks the code quality and adherence to coding standards using the `next lint` command. It is recommended to run this command before committing changes to ensure code consistency and maintainability.

## Production

### Production Commands

This section explains the available scripts in the `package.json` file and their usage during production deployments.

- `yarn build`  
  This command builds the static site for production using the `next build` command. It generates an optimized build of the site that is suitable for deployment.

- `yarn export`  
  This command exports the static site for production using the `next export` command. It generates an optimized build of the site that is suitable for deployment. The exported site is saved in the `out` directory.

- `yarn start`  
  This command first runs `yarn build` to generate an optimized build of the site and then starts the production server using the `next start` command. Use this command to test the site in a production-like environment locally.

## Bugs and Feature Requests

If you encounter any bugs or have a feature request, please open an issue on GitHub. To help us resolve the issue, please provide the following information:

### Bugs

- A detailed description of the bug.
- Steps to reproduce the bug.
- Expected behavior and actual behavior.
- Screenshots, if possible, and any additional context or information that may help us resolve the bug.
- If you have a solution, suggestion, or code change, please submit a pull request.

### Feature Requests

- For feature requests, questions, or feedback, please open an issue.
- For security issues or general inquiries, please contact [Eridian](https://eridian.xyz) privately.

## Authors

- [Eridian](https://eridian.xyz)

## License

[MIT](https://choosealicense.com/licenses/mit/)
