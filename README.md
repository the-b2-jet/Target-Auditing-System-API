# Vulnerability Management API

A simple REST API for managing vulnerability assessment targets, built with Node.js. Which will be used for other applications.

## Features

- **Full CRUD Operations** - Create, Read, Update, and Delete vulnerability targets
- **RESTful API** - Follows standard REST conventions
- **JSON Storage** - Persists data in a JSON file

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/targets` | Retrieve all targets |
| GET | `/api/targets/{id}` | Retrieve a single target by ID |
| POST | `/api/targets` | Add a new target |
| PUT | `/api/targets/{id}` | Update an existing target |
| DELETE | `/api/targets/{id}` | Delete a target |

## Target Data Structure

```json
{
  "id": 1,
  "target_ip": "192.168.1.15",
  "hostname": "WEB-SERVER-01",
  "vulnerability_type": "Remote Code Execution (RCE)",
  "vulnerability_severity": "10.0",
  "status": "exploited",
  "access_level": "root",
  "os_info": "Ubuntu 22.04.4 LTS",
  "open_ports": [22, 80, 443, 8080],
  "notes": "Additional information about the vulnerability",
  "logged_at": "2026-04-23T11:16:14.978Z",
  "updated_at": "2026-04-23T11:16:14.978Z"
}

```
# Getting Started

## Prerequisites

        Node.js installed on your system

## Installation
        
 ### Clone the repository

> git clone https://github.com/yourusername/vulnerability-api.git

> cd vulnerability-api

### Ensure the data directory exists with a targets.json file

> mkdir -p data

# Start the server

> node server.js

**The server will run on http://127.0.0.1:1337**

# Usage (with curl)

## Get all targets

>curl -X GET http://127.0.0.1:1337/api/targets

## Get a single target

>curl -X GET http://127.0.0.1:1337/api/targets/1

## Add a new target

>       curl -X POST http://127.0.0.1:1337/api/targets \
>          -H "Content-Type: application/json" \
>          -d '{
>          "id": 1,
>          "target_ip": "192.168.1.15",
>          "hostname": "WEB-SERVER-01",
>          "vulnerability_type": "Remote Code Execution (RCE)",
>          "vulnerability_severity": "10.0",
>          "status": "exploited",
>          "access_level": "root",
>          "os_info": "Ubuntu 22.04.4 LTS",
>          "open_ports": [22, 80, 443, 8080],
>          "notes": "Additional information about the vulnerability",
>          "logged_at": "2026-04-23T11:16:14.978Z",
>          "updated_at": "2026-04-23T11:16:14.978Z"
>}

## Update target

>       curl -X PUT http://127.0.0.1:1337/api/targets/1 \
>          -H "Content-Type: application/json" \
>          -d '{
>            "status": "patched",
>            "notes": "Vulnerability has been mitigated"
>          }'
## Delete a target

>       curl -X DELETE http://127.0.0.1:1337/api/targets/1

## Error Responses

|Status|Code Description|
|--------|----------|
|200|Success|
|201|Target created successfully|
|400|Invalid JSON format|
|404|Endpoint or target not found|
