# Expenses app

Another app to try out

- ES6
- React/Redux
- Browserify/watchify
- NPM Script as a "build tool"
- OrientDB
  - Graph/Document DB Hybrid
  - With transactions support

## Development Guide

- `npm run copy` to copy static files
- `npm run develop` to start `nodemon`, `browser-sync` and `watchify`

## Seperation of Concerns

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