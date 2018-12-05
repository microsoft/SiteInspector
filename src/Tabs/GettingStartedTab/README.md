# Getting Started Tab
This is a starting template for creating a tab that plugs into SiteInspector blade. This template has basic support for accessing custom UI components exposed by the parent application: SiteInspector.
## Prerequisites
* Node.js must be installed on your system.
* [React](https://reactjs.org/) - React.js framework
* [Redux](https://www.pluralsight.com/courses/react-redux-react-router-es6)- Redux for maintaining application state
## Getting Started
You would want to make the below changes,at the very least, to convert this template to your cutsom tab:
1. In webpack.config file, change the output filename to the name that you want for your final compiled tab.
2. In package.json change the name as well as the author to desired values.
3. Modify the dependencies in package.json as per the npm requirements of your final tab.
4. Update the title and redux state namespace in the config file to your tab name.
5. Update the reducer,actions and component with your tabs requirements.
6. Update index.jsx file with valid imports as your component names have changed.
## Building
1. Open command prompt and change directory to point to your project's directory
2. Execute "npm install" command. This will install all npm packages that your project needs
3. Execute "npm run lint:fix" command to autocorrect formattings and/or convert to ES6 syntax.   
Please fix any lint errors not addressed by lint:fix. 
4. Execute "npm run build" to create a unminifed compiled version of your tab. This will be located in the ../dist folder.
5. You can then copy over the compiled js file from the ../dist folder to any storage of your choosing. The config file of the parent application is going to access the tab from this storage location.
## Help
For any help with this template, reach out to siteinspector@microsoft.com