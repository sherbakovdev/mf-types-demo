- Run `pnpm install` to install the dependencies.
- Run `pnpm run dev` to start the development server. 
- Run `pnpm run clean` to remove the `dist` and `@mf-types` folders.

When you start development server for **the first time**, you will see a warning:
```
Unable to download federated types for 'shell' from 'http://localhost:3000/@mf-types.zip' because 'Request failed with status code 404', skipping...
```

The next time you start the development server, you won't see any errors anymore. To reproduce it again, run the clean command to delete `dist` and `@mf-types` from both services and start the development server again. 