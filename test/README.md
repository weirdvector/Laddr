# Laddr/test/

This directory holds all of our unit tests for the Node API. The first file to look at here would be ```test.js```. It sets our NODE_ENV environment variable to be test, so we swap over to our testing database in our ```app/models.js``` file. We use the Mocha framework for testing, with Chai and ChaiHTTP being responsible for the actual unit tests. We set some generic variables like user and organization names and passwords, which we pass through to the required files. The order of the requires here is important, because some of the later tests rely on the results of the early tests. For example, we make a call to our user route, creating a user in the database, before we call our login route and try to log in with our user. This might not be the best way of doing testing, because once something fails it tends to fail all of the subsequent tests. But we can then go back through the routes and find the first test that failed and fix it there before rerunning the tests.

Essentially in this folder all of the files correspond to a file in ```/app/api```. Each file here tests the functionality of the route defined there. 