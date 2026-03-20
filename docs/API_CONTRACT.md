# API Contract

This document defines the API contract for the Football Cards application.

## OpenAPI Specification

```yaml
openapi: 3.0.0
info:
  title: Football Cards API
  version: 1.0.0
paths:
  /api/v1/players:
    get:
      summary: Get a list of players
      responses:
        '200':
          description: A list of players
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Player'
  /api/v1/players/{playerId}:
    get:
      summary: Get a player by ID
      parameters:
        - name: playerId
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: A single player
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Player'
components:
  schemas:
    Player:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        position:
          type: string
        team:
          type: string
        image:
          type: string
```
