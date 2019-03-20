# Bambank

A prototype web application that allows users to trade in Bambeuros.

## Requirements

The web application was required to:

- Allow a user to register an account
- Allow a user to login to their account
- Give a user 100 Bambeuros when they register
- Allow a user to transfer funds to another user
- Allow a user to view their transactions

## Running locally

If you wish to run this application locally, you need to provide firebase database details as environment variables.
The Firebase Console can be found [here]()

You can then add those values to a .env file in the following manner

```env
  API_KEY=
  AUTH_DOMAIN=
  DATABASE_URL=
  PROJECT_ID=
  STORAGE_BUCKET=
  MESSAGE_SENDER_ID=
  SECRET_ID=
```

**NOTE** the SECRET_ID here is simply a secret key that you must set.

Once you have that setup, you should run **npm install** in the root of the directory to get all of the required libraries.

Finally you should be able to use **node index.js** to run the application on http://localhost:8081
