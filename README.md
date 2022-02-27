# DrafterLife

This unofficially the official Fantasy Overwatch League site.

This project is bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Local Development

To run the project, you'll need to setup a local `.env` file containing credentials to authenticate with our MongoDB cluster.

After the credentials are setup, you start the `express` server by running the following:

```
npm install
npm run server
```

You can then start the front end `react` server by running the following:

```
npm run ui
```

## Pushing changes to prod

To deploy any changes to prod, you first need to merge any changes with the `main` branch of this project. After, run `git push heroku main`. 

If you are authenticated through the heroku cli, you can run `heroku logs --tail` to follow the status of the app for debugging purposes.