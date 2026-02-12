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
In `next.config.js`, make sure to add this snippet:
```
if (!isDevWorkspace) {
    // Dynamically generate aliases for every export in the framework
    // to ensure singleton usage and correct sub-path mapping.
    try {
        const frameworkPkgPath = path.resolve(
            './node_modules/@dexcomit/web-vendor-framework/package.json'
        );
        const frameworkPkg = require(frameworkPkgPath);
        const frameworkDir = path.dirname(frameworkPkgPath);

        const frameworkAliases = {};
        Object.entries(frameworkPkg.exports || {}).forEach(
            ([key, value]) => {
                const target =
                    typeof value === 'object'
                        ? value.import || value.module || value.default
                        : value;

                if (target) {
                    const aliasKey =
                        key === '.'
                            ? '@dexcomit/web-vendor-framework$'
                            : path.join(
                                    '@dexcomit/web-vendor-framework',
                                    key
                                );
                    
                    // Resolve the target path
                    let targetPath = path.resolve(frameworkDir, target);

                    // If target is an index file, alias to the directory instead
                    // This often helps Webpack resolve imports more naturally
                    if (target.endsWith('/index.js')) {
                        targetPath = path.dirname(targetPath);
                    }

                    frameworkAliases[aliasKey] = targetPath;
                }
            }
        );

        config.resolve.alias = {
            ...config.resolve.alias,
            ...frameworkAliases,
            react: path.resolve('./node_modules/react'),
            'react-dom': path.resolve('./node_modules/react-dom'),
            '@dexcomit/web-ui-lib': path.resolve(
                './node_modules/@dexcomit/web-ui-lib'
            ),
            'support-package': path.resolve(
                './node_modules/support-package'
            ),
            next: path.resolve('./node_modules/next'),
            'next-translate': path.resolve(
                './node_modules/next-translate'
            ),
        };
    } catch (e) {
        console.error('Failed to generate framework aliases:', e);
    }
}
```