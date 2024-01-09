# Chit Chat Chat

- [Chit Chat Chat](#chit-chat-chat)
  - [Models](#models)
    - [Chat Model](#chat-model)
  - [Schema](#schema)
    - [Primitives](#primitives)
    - [Query](#query)
    - [Subscription](#subscription)
  - [Operations](#operations)
    - [Query Operations](#query-operations)
      - [Chat Operation](#chat-operation)
        - [Chat Variables](#chat-variables)
        - [Chat Responses](#chat-responses)
    - [Subscription Operations](#subscription-operations)
      - [MessageAdded Operation](#messageadded-operation)
        - [MessageAdded Responses](#messageadded-responses)

---

## Models

### Chat Model

```json
{
    "uid": "2f8986c6-68fd-5810-8075-c856b3217c14",
    "messages": [
        {
            "userUid": "45c537ab-e2b7-5b8c-89c4-42dced882d03",
            "userDisplayName": "Bobby Martinez",
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

### Primitives

```gql
interface Auditable {
    createdAt: String!
}

type Message implements Auditable {
    userUid: String!
    userDisplayName: String!
    value: String!
    createdAt: String!
}

type Chat implements Auditable {
    uid: ID!
    messages: [Message]!
    createdAt: String!
}
```

### Query

```gql
type Query {
    chat(userUid: ID!): Chat
}
```

### Subscription

```gql
type Subscription {
    messageAdded: Message
}
```

---

## Operations

### Query Operations

#### Chat Operation

```gql
query Chat($userUid: ID!) {
    chat(userUid: $userUid) {
        chat {
            uid
            messages
            createdAt
        }
    }
}
```

##### Chat Variables

```json
{
    "userUid": "8155ed23-4109-570b-957e-fb3cea9f57c9"
}
```

##### Chat Responses

```json
{
    "data": {
        "chat": {
            "uid": "548be483-2dba-593c-8b34-e9fb8f13adc7",
            "messages": [
                {
                    "userUid": "20a5d2e7-320c-5fa9-8d38-e43eeb400ba5",
                    "userDisplayName": "Lela Rhodes",
                    "value": "Proident ullamco irure ullamco reprehenderit.",
                    "createdAt": "2024-01-03T12:58:15+08:00",
                    "updatedAt": "2024-06-28T20:20:45+08:00"
                }
            ],
            "createdAt": "2024-03-04T14:24:09+08:00",
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

### Subscription Operations

#### MessageAdded Operation

```gql
subscription MessageAdded {
    messageAdded {
        message {
            userUid
            userDisplayName
            value
            createdAt
        }
    }
}
```

##### MessageAdded Responses

```json
{
    "data": {
        "message": {
            "userUid": "6a22648e-bf0d-538c-a0cb-b892429525b4",
            "userDisplayName": "William Adams",
            "value": "Adipisicing proident veniam cupidatat cillum excepteur velit magna do commodo ut commodo.",
            "createdAt": "2024-02-24T21:27:29+08:00",
        }
    }
}
```
