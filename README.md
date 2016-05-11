# Expenses app

Another app to try out

- ES6
- React/Redux
- WebPack
- NPM Script as a "build tool"
- KOA (tried feathers but felt its abit too complicated ... less support on stackoverflow)

## Seperation of Concerns?

- Server (API)
- Client (React/Redux)
- Client has an AppID (or ClientID)

## Models

### Expense

Field | Type | Description
------|------|------------
name | String |
unitCost | float |
qty | int |
unit | String |
totalCost | float |
category | String |
tags | Array<String> |
receipt | Receipt |
timestamp | timestamp |
user | User |

### Receipt

Field | Type | Description
------|------|------------
image | String |
totalCost | Float |
location | String |
timestamp | String |
user | User |

### Category

Field | Type | Description
------|------|------------
name | String |
color | String |
user | User |

### Tag

Field | Type | Description
------|------|------------
name | String |
user | User |

### User

- displayName
- facebookId

## React Hierarchy

* [unauthenticated]
  + Login Button
    - onClick: login with google TODO!!!
    - onLogin: login with server
    - onLoginFail: show error

* [authenticated]
  + Profile
    + Login Button
    + Logout Button
