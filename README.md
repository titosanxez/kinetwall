## Description

Implementation of a wallet tracking manager. This repository 
provides the implementation for Kinetic's proposed challenge.

## Intent and state of the provided implementation

The system currently implemented serves as a quick prototype that can be used to validate 
the use case and build upon it. I have opted to focus on showcasing as many features as
I could with the allowed schedule, trading off for better robustness and quality of the code.

On one hand, you can see implemented the following functionality:

- User authentication via JWT
- Postgres database persistency for users and wallets
- REST endpoints to handle user login/registration and wallet connection and details retrieval
- Live updates via WebSockets
- API throttling
- Docker containerization of the service
- AWS stack deployment for ECS
- Github workflows to deploy the stack, build and deploy the image
- Frontend for manual testing

On the other hand, there's substantial amount of work related to code quality that is
missing but that I would definitely won't leave out for a production MVP:

- Peer design and code review: an additional pair of good eyes, and an extra
  technical mind, is necessary to spot any overlooked bugs, or improve the current design.
- Automated Unite and End-to-end testing: The testing of the functionality has been done manually,
  but having written automated tests is key to further validate the implementation and
  establish a base fro which to keep making changes.
- Enhanced code comments and design documentation, to gets deeper into the technical
  aspects of the design to include sequencing, components interactions, etc.
- Improved logging: the current logging is very basic and it may not provide traceability
  within the service.
- Frontend improvements: All of the above, as well improving look & feel and error management. 

## Usage

The service allows external interaction through several HTTP endpoints:

### `loginOrCreateUser(userInfo)`

Creates a new user or log ins an existing one via user name and password. This is a
mandatory step prior to using the wallet endpoints.

<details>
 <summary><code>POST</code><code><b>/</b></code><code>users/login</code></summary>

##### Request Body JSON fields

> | name      |  type     | data type               | description                                  |
> |-----------|-----------|-------------------------|----------------------------------------------|
> | username |  optional | string                   | Unique user name                             |
> | password |  optional | string                   | Strong user password                          |



##### Responses

> | http code     | content-type                      | response                 |
> |---------------|-----------------------------------|--------------------------|
> | `201`         | `application/json`                | JSON UserObject          |

where `UserObject` contains `access_token` as JWT to be provided on any subsequent API call.


##### Example cURL

> ```javascript
>  curl -X POST  'localhost:3000/users/login' -d '{"username": "johnwall", "password": "mypass"}' -H "Content-Type: application/json"  | json_pp
> 
>     [
       {
          "userId" : "f07a36d9-3947-48f8-9aa4-38b156fa3d36",
          "username" : "johnwall,
          "feeTotal" : 190509.52,
          "access_token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2...",
       },
      ]
      ...
> 
> ```

</details>

### `getWallets()`

Returns the details for each wallet registered/connected with the calling user.

<details>
 <summary><code>GET</code> <code><b>/</b></code><code>wallets</code></summary>

##### Responses

> | http code     | content-type                      | response                                          |
> |---------------|-----------------------------------|---------------------------------------------------|
> | `200`         | `application/json`                | `Wallet[]` JSON object                            |

where `Wallet` is an object containing the wallet details (see example below)

##### Example cURL

> ```javascript
>  curl -X GET  'localhost:3000/wallets  -H "Content-Type: application/json" -H "Authorization: Bearer <access_token>" | json_pp
>
>     [
       {
           "id": "35596cf7-ac9d-42ec-8a53-429100b67971",
          "owner" : "f07a36d9-3947-48f8-9aa4-38b156fa3d36" // associated user id
          "address" : "0x0B2E60B91ee653202764Fb5D43942A5c1c38C1d8, // wallet public address
          "balance" : "0.5",  // balance in ETH
       },
      ]
      ...
>
> ```

</details>

### `connectWallet(address)`

Connects and associates the wallet specified by its public address.

<details>
 <summary><code>POST</code> <code><b>/</b></code><code>wallets</code></summary>

##### Responses

> | http code     | content-type                      | response                                          |
> |---------------|-----------------------------------|---------------------------------------------------|
> | `201`         | `application/json`                | Wallet JSON object                            |

where `Wallet` is an object containing the wallet details (see example below)

##### Example cURL

> ```javascript
>  curl -X GET  'localhost:3000/wallets  -H "Content-Type: application/json" -H "Authorization: Bearer <access_token>" -d '{"address": "0x0B2E60B91ee653202764Fb5D43942A5c1c38C1d8"}'json_pp
>
       {
           "id": "35596cf7-ac9d-42ec-8a53-429100b67971",
          "owner" : "f07a36d9-3947-48f8-9aa4-38b156fa3d36" // associated user id
          "address" : "0x0B2E60B91ee653202764Fb5D43942A5c1c38C1d8, // wallet public address
          "balance" : "0.5",  // balance in ETH
       },
      ...
>
> ```

</details>


## Building and Running Locally

There are three main separate components that require setup to build.

Note: The project is setup to work only with the `Sepolia` test network.

### Postgres Database

The system relies on a Postgres database running on the default port. You will need to 
install the postgres server and `psql`. The project supplies an `init.sql` file to 
set up the database. You will need to create a `postgres` user and a database 
with name `kinetwall`. 

Then you can run a Postgres instance as follows:

```
pg_ctl -D <db_dir_path> start -l <log_file_path>
```

To initialize the database and load it with the test data:

```bash
psql -U postgres -d kinetwall -f ./persistence/init.sql
```

### Wallet Service

You will need to install `Node.js`, and its package manager `yarn`. Then you can
generate the dependencies by running:

```bash
$ yarn install
```

and finally run the service with:

```bash
$ ETH_PROVIDER_APIKEY=<alchemy eth provider apiky> yarn start

```

Note that `ETH_PROVIDER_APIKEY` is a mandatory variable which should point to the API_KEY 
of a project in your Alchemy account (more on this later)

## System Overview

The current version of the system is fairly basic consisting of a monolithic 
processing service and a Postgres database.

### Service Software Components

The service represents the piece of software in charge of performing the 
wallet tracking API endpoints. The main components forming the service are:

#### Web Server

Provides an interface to manage user and their tracked wallets. This component manages
a connection with the database to manage application data, as well as interacting
with secondary servies such as the on-chain tracker and live updates.

#### Ethereum (on-chain) provider 

This component takes care of accessing on-chain date to obtain the wallet details.

### Websocket server for live updates

A WebSocket server provides periodic updates on any connected wallet for the logged in
user. This component runs a periodic job to check for on-chain changes in the wallet
and provides the wallet details via event message.








