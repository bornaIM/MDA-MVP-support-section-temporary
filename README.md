# MDA-MVP-support-section-temporary

If you wish to use this library, please import the CSS in your global entrypoint (_app.tsx or layout.tsx)
Example: react-datepicker will not have styles if you don't include "import 'react-datepicker/dist/react-datepicker.css';" in your global entrypoint.

## Example from MDA
Add this to package.json dependencies:
```
    "support-package": "file: PATH_TO_PROJECT"
```

and run `npm install`

## How to use it

### DEV
In `next.config.js`, make sure to add this package to transpilePackages:
```
const config = withConfig({
    transpilePackages: ['support-package'], // THIS
...
```

Edit for your path and run `npm run build:dev` and run this command in the project from which you're importing support-package:
```
npm i PATH_TO_TGZs
```