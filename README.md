# db.mw - Database Middleware

```json
{
  "api": {
    "name": "db.mw",
    "description": "🚀 Database API",
    "url": "https://db.mw/api",
    "type": "https://apis.do/database",
    "login": "https://db.mw/login",
    "signup": "https://db.mw/signup",
    "repo": "https://github.com/drivly/db.mw"
  }
}
```

List all available databases 

https://db.mw

Create a new database

https://db.mw/new -> https://w7trk.db.mw

Create a new database with a specific name

https://db.mw/new?name=northwind -> https://northwind.db.mw

Import data into a database

https://northwind.db.mw/import/json.fyi/northwind.json

List collections in a database

https://northwind.db.mw

List items in a collection

https://northwind.db.mw/Customers

Paginate through a collection

https://northwind.db.mw/Customers?page=2

Change the `pageSize`

https://northwind.db.mw/Customers?pageSize=100

Alternatively, use `skip` and `limit`

https://northwind.db.mw/Customers?skip=100&limit=20

Get a random `sample`

https://northwind.db.mw/Customers?sample=5

Only get specific fields

https://northwind.db.mw/Customers?fields=firstName,lastName
