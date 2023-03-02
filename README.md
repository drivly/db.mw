# [db.mw](https://db.mw) - [The Multi World Database](https://db.mw)

- **[Relational](#):** traditional RDMS that maintain relational integrity & enforce schema and foreign key constraints
- **[Document](#):** flexible document database to support flexible schema & embedded objects
- **[Graph](#):** model relationships between things as `[subject] [verb] [object]` & query graph traversals
- **[Search](#):** full-text search across data stored in relational, document, or graph databases

The [Multi World Database](https://db.mw), provides a simple yet extremely powerful set of APIs and SDKs 

- [Hypermedia-driven REST API](https://db.mw/api) at https://db.mw/api
- [GraphQL API & Query UI](https://db.mw/graphql) at https://db.mw/graphql
- [Javascript/Typescript SDK](https://npmjs.com/db.mw) with https://sdk.co and published on [NPM](https://npmjs.com/db.mw) and at https://pkg.do/db.mw

The structure, schemas, primary keys, relationships, data sources, and seed data is defined in [GraphDL](https://graphdl.org)

```yaml
User:
 _name: ${name} <${email}>
 _icon: 🧑
 name:  string
 email: email
 image: url
 posts: [Post.Author]
 
Post:
 _id:         slugify(Title)
 _name:       title
 _icon:       📋
 title:       string
 description: string
 tags:        [string]
 content:     markdown
 createdAt:   createdAt()
 createdBy:   createdBy()
 author:      User.Email
```

The backend data storage and query capabilities are supported through a variety of database providers:

- [Durable Objects](#) support the [Document World](#) and [Graph World](#) via [database.do](https://database.do)
- [Prisma](#) supports the [Relational World](#) on [Postgres](#), [MySQL](#), [Mongo](#), [SQL Server](#), [SQLite](#) & [Cockroach DB](#)
- [Mongo](#) supports the [Relational World](#) via [Prisma](#), the [Document](#) and [Graph Worlds](#) via [mongo.do](https://mongo.do), and the [Search](#) via [Mongo Atlas](#)
- [GitHub](#) supports the [Document World](#) and [Graph World](#) on [JSON](#), [YAML](#), [CSV](#), and [TSV](#) files via [repo.do](https://repo.do)
- [Airtable](#) supports the [Relational World](#) and [Graph World](#) via [airtable.do](https://airtable.do)

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

Create a new database with custom subdomain

https://db.mw/new/northwind -> https://northwind.driv.ly

Create a new database with custom domain

https://db.mw/new/db.driv.ly -> https://db.driv.ly

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
