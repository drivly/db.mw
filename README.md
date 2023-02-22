# [db.mw](https://db.mw) - The Multi World Database

- *[Relational](#):* traditional RDMS that maintain relational integrity & enforce schema and foreign key constraints
- *[Document](#):* flexible document database to support flexible schema & embedded objects
- *[Graph](#):* model relationships between things as `[subject] [verb] [object]` & query graph traversals
- *[Search](#):* full-text search across data stored in relational, document, or graph databases

[db.mw](https://db.mw), the [Multi World Database](https://db.mw), provides a simple yet extremely powerful set of APIs and SDKs 

- [Hypermedia-driven REST API](https://db.mw/api) at https://db.mw/api
- [GraphQL API & Query UI](https://db.mw/graphql) at https://db.mw/graphql
- [Javascript/Typescript SDK](https://npmjs.com/db.mw) on [NPM](https://npmjs.com/db.mw) and at https://pkg.do/db.mw



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
