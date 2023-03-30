# Serverless - AWS Node.js Typescript

# Serverless - AWS Node.js Typescript

## Installation/deployment instructions

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for lambda functions
- `libs` - containing shared code base between lambdas

```
authorization-service
├── src
│   ├── functions               # Lambda configuration and source code folder
│   │   ├── functionName
│   │   │   ├── handler.ts      # `functionName` lambda source code
│   │   │   ├── index.ts        # `functionName` lambda Serverless configuration
│   │
│   └── libs                    # Lambda shared code
│       └── handlerResolver.ts  # Sharable library for resolving lambda handlers
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
```