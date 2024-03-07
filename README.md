# Getting Started with Create React App and Redux

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
////

-----------#GIT Commands------------
==============
git status
git stash
git pull origin main
git stash pop
git add .
git commit -m " Some message"
git push

********************** Status Codes *****************
===================================
 exports.responseCodes = {   

codeSwithching : 1002,             // 101 Switching Protocols  
codeSuccess : 1003,                //  success(Create, Get)   
codeUpdated : 1004,                // updated    c
odeNoContentAvailable : 1006,   // No Content Available in the request   
codeBadRequest : 1007,            // Bad Request ( Incorrect Data Format, Missing Tags )    
codeUnauthorized : 1008,           // Unauthorized Access (Trying access which is not assigned to the person)    
codeForbiddenAccess : 1009,       // Forbidden Access   
codePageNotFound : 1010,         // Page Not Found    
codeMethodNotAllowed : 1011,     // Method Not Allowed   
codeUnprocessableEntity : 1012,   // Unprocessable Entity / invalid request    
codeInternalError : 1013,         // Internal Server Error,    
codeTokenExpired : 1014,          // Access token expired    
codeRefreshTokenExpired : 1015,   // Refresh Token expired    
codeDomainExists : 1016   // Refresh Token expired
 };
       
      
 exports.httpCodes = {  

code100 : 100,  // 100 Informational    
code200 : 200,  // Successful request, often a GET    
code201 : 201,  // Successful request after a create, usually a POST   
code204 : 204,  // Successful request with no content returned, usually a PUT or PATCH    
code301 : 301,  // Permanently redirect to another endpoint    
code304 : 304,  // 304 Not Modified    
code400 : 400,  // Bad request (client should modify the request)    
code401 : 401,  // Unauthorized, credentials not recognized    
code403 : 403,  // Forbidden, credentials accepted but don’t have permission    
code404 : 404,  // Not found, the resource does not exist   
code422 : 422,  // Unprocessable Content   
code429 : 429,  // Too many requests, used for rate limiting and should include retry headers    
code405 : 405,  // 405 Method Not Allowed    
code500 : 500,  // Server error, generic and worth looking at other 500-level errors instead    
code503 : 503   // Service unavailable, another where retry headers are useful

};




