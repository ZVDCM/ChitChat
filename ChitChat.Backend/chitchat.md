# Chit Chat

- [Chit Chat](#chit-chat)
  - [Models](#models)
    - [User Model](#user-model)
    - [Token Model](#token-model)
    - [Chat Model](#chat-model)
  - [Schema](#schema)
    - [Users Type Definition](#users-type-definition)
      - [Primitives](#primitives)
      - [Mutation](#mutation)
    - [Chat Type Definition](#chat-type-definition)
      - [Primitives](#primitives-1)
      - [Query](#query)
      - [Subscription](#subscription)
  - [Operations](#operations)
    - [Users Operations](#users-operations)
      - [Mutation Operations](#mutation-operations)
        - [Login Operation](#login-operation)
          - [Login Variables](#login-variables)
          - [Login Responses](#login-responses)
        - [Register Operation](#register-operation)
          - [Register Variables](#register-variables)
          - [Register Responses](#register-responses)
        - [Refresh Operation](#refresh-operation)
        - [Refresh Responses](#refresh-responses)
        - [Logout Operation](#logout-operation)
          - [Logout Responses](#logout-responses)
        - [Chat Operation](#chat-operation)
          - [Chat Variables](#chat-variables)
          - [Chat Responses](#chat-responses)
    - [Chat Operations](#chat-operations)
      - [Query Operations](#query-operations)
        - [Chat Operation](#chat-operation-1)
          - [Chat Variables](#chat-variables-1)
          - [Chat Responses](#chat-responses-1)
      - [Subscription Operations](#subscription-operations)
        - [MessageAdded Operation](#messageadded-operation)
          - [MessageAdded Responses](#messageadded-responses)

---

## Models

### User Model

```json
{
    "id": "3708c335-ca3e-5ee0-8471-94a641796f36",
    "name": "Rosalie Sandoval",
    "email": "ikogone@ecduk.ms",
    "password": "BzrHWhBTdJPfxxvKzsSMu6rm2eaOnCUbrYyDhpizckdHwedkQQ8aMMCq6HGP",
    "createdAt": "2024-06-14T22:19:57+08:00",
    "updatedAt": "2024-07-01T21:48:09+08:00"
}
```

### Token Model

```json
{
    "id": "e8017bb5-559c-5030-a1c3-7dab5054b8b0",
    "userId": "3f98d75f-a1a5-52ec-b182-a2db092e9a72",
    "value": "PaykzhbaQLHuoi7csmoNWtV016XrdheTYN2GhdzW9kPday5KaxZfuE51ODdxeKSAfgEFYuvQKVIIF5rHv9K5bhdF89VPiCY3wtT03D3Iv9bacN5XQlA1PhKdltPCXaeouPNbiulvg9WNLJV0Wni0kaCb0XyprWzqRTSnABP9OBQItVjC79GE2Amuv0jydKZXtaXRrZq8n9ctjkTDce7RCO6rwRb8RUNwzUjzQS9zdWihzn94erfY8t26AnonZiWMdQKW1neZWfuqaEMRjTZEBiEs6MHktr3FklRh86uO3MRj",
    "disabled": false,
    "createdAt": "2024-09-02T23:14:55+08:00",
    "updatedAt": "2024-10-24T04:06:22+08:00"
}
```

### Chat Model

```json
{
    "id": "2f8986c6-68fd-5810-8075-c856b3217c14",
    "messages": [
        {
            "userId": "45c537ab-e2b7-5b8c-89c4-42dced882d03",
            "userName": "Bobby Martinez",
            "value": "Fugiat amet elit Lorem laboris quis veniam cillum ut ad dolore.",
            "createdAt": "2024-03-16T16:12:14+08:00",
            "updatedAt": "2024-11-18T23:15:36+08:00"
        }
    ],
    "createdAt": "2024-04-26T16:53:12+08:00",
    "updatedAt": "2024-10-07T05:25:06+08:00"
}
```

---

## Schema

### Users Type Definition

#### Primitives

```gql
scalar Date

type Auditable {
    createdAt: Date!
    updatedAt: Date!
}

type User implements Auditable {
    id: ID!
    name: String!
    email: String!
    password: String!
    createdAt: Date!
    updatedAt: Date!
}

type Token implements Auditable {
    id: ID!
    userID: String!
    value: String!
    disabled: Boolean!
    createdAt: Date!
    updatedAt: Date!
}

type UserResponse {
    id: String!
    name: String!
    email: String!
    createdAt: Date!
    updatedAt: Date!
}

type TokenResponse {
    value: String!
}

type AuthResponse {
    user: UserResponse
    token: TokenResponse
}
```

#### Mutation

```gql
type Mutation {
    login(email: String!, password: String!): AuthResponse
    register(
        name: String!
        email: String!
        password: String!
        confirmPassword: String!
    ): AuthResponse
    refresh: AuthResponse
    logout: Boolean
    chat(chatId: ID!, value: String!): Boolean
}
```

---

### Chat Type Definition

#### Primitives

```gql
scalar Date

type Auditable {
    createdAt: Date!
    updatedAt: Date!
}

type Message implements Auditable {
    userID: String!
    userName: String!
    value: String!
    createdAt: Date!
    updatedAt: Date!
}

type Chat implements Auditable {
    id: ID!
    messages: [Message]!
    createdAt: Date!
    updatedAt: Date!
}
```

#### Query

```gql
type Query {
    chat(userId: ID!): Chat
}
```

#### Subscription

```gql
type Subscription {
    messageAdded: Message
}
```

---

## Operations

### Users Operations

#### Mutation Operations

##### Login Operation

```gql
mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        user {
            id
            name
            email
            createdAt
            updatedAt
        }
        token {
            value
        }
    }
}
```

###### Login Variables

```json
{
    "email": "ocoanu@laf.me",
    "password": "klsV9ggk"
}
```

###### Login Responses

```json
{
    "data": {
        "login": {
            "user": {
                "id": "bbef40c8-fcf3-51d2-bb78-13c3585691fa",
                "name": "Nell Morrison",
                "email": "ukhodar@jeh.tp",
                "createdAt": "2024-08-15T06:23:18+08:00",
                "updatedAt": "2024-10-30T09:32:18+08:00"
            },
            "token": {
                "value": "nLr35tzqJMGOKXdcn6Rt9bOYRPag686vNTv7Zh0DygNb3WjeeoBRRabJ19NoXh6126I9wGvXcY1BggfPTI6VEvBimqY2Wl8s5NOhM7iGL9lhZyFDIPtId0qmjCipWEQh8NVNyyd7RO2kBzVRet4sau32OusSU6rfQP2zmzprkrYa6qRhHLrx4gY6NzFmtcxWz3asdTXymKLwFDBPpw5FgMRJgbqWgJCy8D5XMZGs7DmNr8l7vclbZN9bp8ZJfeZjS9oN8st4e0k2Vczx6O2GDtBU5VY3YngyeDQqDITMOgGa"
            }
        }
    }
}
```

```json
{
    "errors": [
        {
            "message": "Nisi quis pariatur elit tempor nostrud.",
            "extensions": {
                "code": "UNAUTHORIZED",
                "exception": {
                    "statusCode": 401
                }
            }
        }
    ],
    "data": null
}
```

##### Register Operation

```gql
mutation Register(
    $name: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
) {
    register(
        name: $name
        email: $email
        password: $password
        confirmPassword: $confirmPassword
    ) {
        user {
            id
            name
            email
            createdAt
            updatedAt
        }
        token {
            value
        }
    }
}
```

###### Register Variables

```json
{
    "name": "Hallie Copeland",
    "email": "zoc@zuufgip.gd",
    "password": "obij8xkp",
    "confirmPassword": "obij8xkp"
}
```

###### Register Responses

```json
{
    "data": {
        "register": {
            "user": {
                "id": "25a9a067-46e9-5ef6-bff6-6135d6628f00",
                "name": "Kyle Wise",
                "email": "zen@duk.ad",
                "createdAt": "2024-11-11T04:51:52+08:00",
                "updatedAt": "2024-11-18T14:25:09+08:00"
            },
            "token": {
                "value": "yUHPhLlnKu69zrq34rZ3vS6zIfb5cj5M2GBCOMgzoy1rvRq3o1nJfwXtdmbdFOfXGfFI8NSxEHFbh51UN28NXZp62b1bIRcBuHfDw1P6N54VLVjt554SFJE5Q1ch38fsAI3aqx3016voQ1Veg2TNsAn7nvTLo7NwVycD7s0j0zqdYmK9gWCmuFpJYQCQxI1g1TDTwLccjwKWJIOwODc863WfH9kyMUobtq354IaGbqsHYcmWIMvj5gviUT2PoPUFEFloAG95vRJLyqe4ohwuhnTuiCDiFs6UZAPP14xJIOCQ"
            }
        }
    }
}
```

```json
{
    "errors": [
        {
            "message": "Anim pariatur cupidatat officia elit veniam eiusmod.",
            "extensions": {
                "code": "BAD_REQUEST",
                "exception": {
                    "statusCode": 400
                }
            }
        }
    ],
    "data": null
}
```

```json
{
    "errors": [
        {
            "message": "Laboris sint aute velit amet ut eu ad eiusmod consequat.",
            "extensions": {
                "code": "CONFLICT",
                "exception": {
                    "statusCode": 409
                }
            }
        }
    ],
    "data": null
}
```

```json
{
    "errors": [
        {
            "message": "Adipisicing eu cillum aliquip consequat nostrud proident elit tempor.",
            "extensions": {
                "code": "UNPROCESSABLE_ENTITY",
                "exception": {
                    "statusCode": 422
                }
            }
        }
    ],
    "data": null
}
```

##### Refresh Operation

```gql
mutation Mutation {
    refresh {
        user {
            id
            name
            email
            createdAt
            updatedAt
        }
        token {
            value
        }
    }
}
```

##### Refresh Responses

```json
{
    "data": {
        "register": {
            "user": {
                "id": "25a9a067-46e9-5ef6-bff6-6135d6628f00",
                "name": "Kyle Wise",
                "email": "zen@duk.ad",
                "createdAt": "2024-11-11T04:51:52+08:00",
                "updatedAt": "2024-11-18T14:25:09+08:00"
            },
            "token": {
                "value": "yUHPhLlnKu69zrq34rZ3vS6zIfb5cj5M2GBCOMgzoy1rvRq3o1nJfwXtdmbdFOfXGfFI8NSxEHFbh51UN28NXZp62b1bIRcBuHfDw1P6N54VLVjt554SFJE5Q1ch38fsAI3aqx3016voQ1Veg2TNsAn7nvTLo7NwVycD7s0j0zqdYmK9gWCmuFpJYQCQxI1g1TDTwLccjwKWJIOwODc863WfH9kyMUobtq354IaGbqsHYcmWIMvj5gviUT2PoPUFEFloAG95vRJLyqe4ohwuhnTuiCDiFs6UZAPP14xJIOCQ"
            }
        }
    }
}
```

```json
{
    "errors": [
        {
            "message": "Cillum reprehenderit do qui irure non dolore ipsum cupidatat et adipisicing minim est.",
            "extensions": {
                "code": "UNAUTHORIZED",
                "exception": {
                    "statusCode": 401
                }
            }
        }
    ],
    "data": null
}
```

```json
{
    "errors": [
        {
            "message": "Deserunt eu consectetur ex pariatur irure velit consequat.",
            "extensions": {
                "code": "FORBIDDEN",
                "exception": {
                    "statusCode": 403
                }
            }
        }
    ],
    "data": null
}
```

##### Logout Operation

```gql
mutation Mutation {
    logout
}
```

###### Logout Responses

```json
{
    "data": {
        "logout": true
    }
}
```

##### Chat Operation

```gql
mutation Chat($chatId: ID!, $value: String!) {
    chat(chatId: $chatId, value: $value)
}
```

###### Chat Variables

```json
{
    "chatId": "72b3ab5a-189a-55a4-a3d3-018d9c60aa62",
    "value": "Irure veniam sit occaecat amet aute sit."
}
```

###### Chat Responses

```json
{
    "data": {
        "chat": true
    }
}
```

```json
{
    "errors": [
        {
            "message": "Et eu excepteur aute ex mollit consequat ullamco minim laborum aliquip deserunt.",
            "extensions": {
                "code": "BAD_REQUEST",
                "exception": {
                    "statusCode": 400
                }
            }
        }
    ],
    "data": null
}
```

```json
{
    "errors": [
        {
            "message": "Irure quis excepteur et adipisicing nostrud in sint veniam.",
            "extensions": {
                "code": "UNAUTHORIZED",
                "exception": {
                    "statusCode": 401
                }
            }
        }
    ],
    "data": null
}
```

```json
{
    "errors": [
        {
            "message": "Qui exercitation anim adipisicing quis et amet et voluptate occaecat ullamco.",
            "extensions": {
                "code": "FORBIDDEN",
                "exception": {
                    "statusCode": 403
                }
            }
        }
    ],
    "data": null
}
```

```json
{
    "errors": [
        {
            "message": "Magna eu consequat sunt est eiusmod incididunt voluptate qui consectetur laboris velit tempor.",
            "extensions": {
                "code": "NOT_FOUND",
                "exception": {
                    "statusCode": 404
                }
            }
        }
    ],
    "data": null
}
```

```json
{
    "errors": [
        {
            "message": "Adipisicing exercitation Lorem quis elit tempor mollit nisi culpa aliqua enim adipisicing proident cillum commodo.",
            "extensions": {
                "code": "UNPROCESSABLE_ENTITY",
                "exception": {
                    "statusCode": 422
                }
            }
        }
    ],
    "data": null
}
```

---

### Chat Operations

#### Query Operations

##### Chat Operation

```gql
query Chat($userId: ID!) {
    chat(userId: $userId) {
        chat {
            id
            messages
            createdAt
            updatedAt
        }
    }
}
```

###### Chat Variables

```json
{
    "userId": "8155ed23-4109-570b-957e-fb3cea9f57c9"
}
```

###### Chat Responses

```json
{
    "data": {
        "chat": {
            "id": "548be483-2dba-593c-8b34-e9fb8f13adc7",
            "messages": [
                {
                    "userId": "20a5d2e7-320c-5fa9-8d38-e43eeb400ba5",
                    "userName": "Lela Rhodes",
                    "value": "Proident ullamco irure ullamco reprehenderit.",
                    "createdAt": "2024-01-03T12:58:15+08:00",
                    "updatedAt": "2024-06-28T20:20:45+08:00"
                }
            ],
            "createdAt": "2024-03-04T14:24:09+08:00",
            "updatedAt": "2024-01-12T23:08:33+08:00"
        }
    }
}
```

```json
{
    "errors": [
        {
            "message": "Officia enim in ullamco ipsum consequat enim dolor ipsum pariatur ex officia.",
            "extensions": {
                "code": "UNAUTHORIZED",
                "exception": {
                    "statusCode": 401
                }
            }
        }
    ],
    "data": null
}
```

```json
{
    "errors": [
        {
            "message": "Duis et reprehenderit pariatur dolor irure elit in pariatur est esse ipsum et est consectetur.",
            "extensions": {
                "code": "FORBIDDEN",
                "exception": {
                    "statusCode": 403
                }
            }
        }
    ],
    "data": null
}
```

```json
{
    "errors": [
        {
            "message": "Ullamco aute eiusmod nostrud mollit pariatur excepteur veniam.",
            "extensions": {
                "code": "NOT_FOUND",
                "exception": {
                    "statusCode": 404
                }
            }
        }
    ],
    "data": null
}
```

#### Subscription Operations

##### MessageAdded Operation

```gql
subscription MessageAdded {
    messageAdded {
        message {
            userId
            userName
            value
            createdAt
            updatedAt
        }
    }
}
```

###### MessageAdded Responses

```json
{
    "data": {
        "message": {
            "userId": "6a22648e-bf0d-538c-a0cb-b892429525b4",
            "userName": "William Adams",
            "value": "Adipisicing proident veniam cupidatat cillum excepteur velit magna do commodo ut commodo.",
            "createdAt": "2024-02-24T21:27:29+08:00",
            "updatedAt": "2024-12-05T00:55:11+08:00"
        }
    }
}
```
