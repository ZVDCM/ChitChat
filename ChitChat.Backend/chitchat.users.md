# Chit Chat

- [Chit Chat](#chit-chat)
  - [Models](#models)
    - [User Model](#user-model)
    - [Token Model](#token-model)
  - [Schema](#schema)
    - [Primitives](#primitives)
    - [Query](#query)
    - [Mutation](#mutation)
  - [Operations](#operations)
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

---

## Models

### User Model

```json
{
    "uid": "3708c335-ca3e-5ee0-8471-94a641796f36",
    "displayName": "Rosalie Sandoval",
    "email": "ikogone@ecduk.ms",
    "password": "BzrHWhBTdJPfxxvKzsSMu6rm2eaOnCUbrYyDhpizckdHwedkQQ8aMMCq6HGP",
    "createdAt": "2024-06-14T22:19:57+08:00"
}
```

### Token Model

```json
{
    "uid": "e8017bb5-559c-5030-a1c3-7dab5054b8b0",
    "userId": "3f98d75f-a1a5-52ec-b182-a2db092e9a72",
    "value": "PaykzhbaQLHuoi7csmoNWtV016XrdheTYN2GhdzW9kPday5KaxZfuE51ODdxeKSAfgEFYuvQKVIIF5rHv9K5bhdF89VPiCY3wtT03D3Iv9bacN5XQlA1PhKdltPCXaeouPNbiulvg9WNLJV0Wni0kaCb0XyprWzqRTSnABP9OBQItVjC79GE2Amuv0jydKZXtaXRrZq8n9ctjkTDce7RCO6rwRb8RUNwzUjzQS9zdWihzn94erfY8t26AnonZiWMdQKW1neZWfuqaEMRjTZEBiEs6MHktr3FklRh86uO3MRj",
    "disabled": false,
    "createdAt": "2024-09-02T23:14:55+08:00"
}
```

---

## Schema

### Primitives

```gql
interface Auditable {
    createdAt: String!
}

type User implements Auditable {
    uid: ID!
    displayName: String!
    email: String!
    password: String!
    createdAt: String!
}

type UserResponse {
    uid: String!
    displayName: String!
    email: String!
    createdAt: String!
}
```

### Query

```gql
type Query {
    _dummy: String
}
```

### Mutation

```gql
type Mutation {
    login(email: String!, password: String!): UserResponse
    register(
        displayName: String!
        email: String!
        password: String!
        confirmPassword: String!
    ): UserResponse
    refresh: UserResponse
    logout: Boolean
    chat(chatUid: ID!, value: String!): Boolean
}
```

---

## Operations

### Mutation Operations

#### Login Operation

```gql
mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        uid
        displayName
        email
        createdAt
    }
}
```

##### Login Variables

```json
{
    "email": "ocoanu@laf.me",
    "password": "klsV9ggk"
}
```

##### Login Responses

```json
{
    "data": {
        "login": {
            "uid": "bbef40c8-fcf3-51d2-bb78-13c3585691fa",
            "displayName": "Nell Morrison",
            "email": "ukhodar@jeh.tp",
            "createdAt": "2024-08-15T06:23:18+08:00"
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

#### Register Operation

```gql
mutation Register(
    $displayName: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
) {
    register(
        displayName: $displayName
        email: $email
        password: $password
        confirmPassword: $confirmPassword
    ) {
        uid
        displayName
        email
        createdAt
    }
}
```

##### Register Variables

```json
{
    "displayName": "Hallie Copeland",
    "email": "zoc@zuufgip.gd",
    "password": "obij8xkp",
    "confirmPassword": "obij8xkp"
}
```

##### Register Responses

```json
{
    "data": {
        "register": {
            "uid": "25a9a067-46e9-5ef6-bff6-6135d6628f00",
            "displayName": "Kyle Wise",
            "email": "zen@duk.ad",
            "createdAt": "2024-11-11T04:51:52+08:00"
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

#### Refresh Operation

```gql
mutation Mutation {
    refresh {
        uid
        displayName
        email
        createdAt
    }
}
```

##### Refresh Responses

```json
{
    "data": {
        "refresh": {
            "uid": "25a9a067-46e9-5ef6-bff6-6135d6628f00",
            "displayName": "Kyle Wise",
            "email": "zen@duk.ad",
            "createdAt": "2024-11-11T04:51:52+08:00"
        }
    }
}
```

```json
{
    "errors": [
        {
            "message": "Cillum reprehenderit do qui irure non dolore ipsum cupuidatat et adipisicing minim est.",
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

#### Logout Operation

```gql
mutation Mutation {
    logout
}
```

##### Logout Responses

```json
{
    "data": {
        "logout": true
    }
}
```

#### Chat Operation

```gql
mutation Chat($chatUid: ID!, $value: String!) {
    chat(chatUid: $chatUid, value: $value)
}
```

##### Chat Variables

```json
{
    "chatUid": "72b3ab5a-189a-55a4-a3d3-018d9c60aa62",
    "value": "Irure veniam sit occaecat amet aute sit."
}
```

##### Chat Responses

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
            "message": "Magna eu consequat sunt est eiusmod incuiduidunt voluptate qui consectetur laboris velit tempor.",
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
            "message": "Adipisicing exercitation Lorem quis elit tempor mollit nisi culpa aliqua enim adipisicing prouident cillum commodo.",
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
