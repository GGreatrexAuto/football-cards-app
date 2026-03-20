# Frontend Wireframes

This document contains the wireframes for the Football Cards application, designed to align with the project's requirements, architectural plan, and branding guidelines.

## Main Page - Card Creator

The main page allows users to create and customize a football player card. The layout is divided into the control panel on the left and the live card preview on the right.

```
+---------------------------------------------------------------------------------------------------------+
| Football Cards                                                [My Cards] [Print] [Save]                 |
| (Roboto Font, #1976D2)                                                                                  |
+---------------------------------------------------------------------------------------------------------+
|                                  |                                                                      |
|  --- FORM CONTROLS ---           |  --- LIVE PREVIEW ---                                                |
|  (Background: #F5F5F5)           |  (Background: #F5F5F5)                                               |
|                                  |                                                                      |
|  +-----------------------------+ |  +----------------------------------------------------------------+  |
|  | Player Details              | |  |                                                                |  |
|  |-----------------------------| |  |   +----------------------------------------------------------+   |  |
|  | Name: [___________________] | |  |   | +------------------------------------------------------+ |   |  |
|  |                             | |  |   | |                                                      | |   |  |
|  | Club: [Select Club] v       | |  |   | |                      +--------+                      | |   |  |
|  | Nat.: [Select Nation] v     | |  |   | |      92              |  PIC   |       CAM            | |   |  |
|  | League: [Select League] v   | |  |   | |      RATING          |        |       POSITION       | |   |  |
|  |                             | |  |   | |                      +--------+                      | |   |  |
|  +-----------------------------+ |  |   | |                                                      | |   |  |
|                                  |  |   | |                   PLAYER NAME                        | |   |  |
|  +-----------------------------+ |  |   | |                                                      | |   |  |
|  | Player Stats                | |  |   | |   +----------+    +----------+    +----------+       | |   |  |
|  |-----------------------------| |  |   | |   | 88 DEF   |    | 95 CTRL  |    | 93 ATT   |       | |   |  |
|  | DEF: [ 88 ]  CTRL: [ 95 ]   | |  |   | |   +----------+    +----------+    +----------+       | |   |  |
|  | ATT: [ 93 ]                 | |  |   | +------------------------------------------------------+ |   |  |
|  |                             | |  |   +----------------------------------------------------------+   |  |
|  | Rating: 92 (Read-only)      | |  |                                                                |  |
|  | [Randomize Stats] (Casino Icon) | |  +----------------------------------------------------------------+  |
|  +-----------------------------+ |  |                                                                      |
|                                  |  |                                                                      |
|  +-----------------------------+ |  |                                                                      |
|  | Image & Background          | |  |                                                                      |
|  |-----------------------------+ |  |                                                                      |
|  | [Upload Image]              | |  |                                                                      |
|  | Image URL: [_______________] | |  |                                                                      |
|  | [Use Stock Photo]           | |  |                                                                      |
|  |                             | |  |                                                                      |
|  | Background: [Select Bkg] v  | |  |                                                                      |
|  +-----------------------------+ |  |                                                                      |
|                                  |                                                                      |
+---------------------------------------------------------------------------------------------------------+
```

## "My Cards" Gallery

This page will display all the cards the user has saved in their browser's Local Storage.

```
+-----------------------------------------------------------------+
| Football Cards                               [Create New Card]  |
+-----------------------------------------------------------------+
|                                                                 |
|  +-----------+   +-----------+   +-----------+   +-----------+  |
|  |           |   |           |   |           |   |           |  |
|  |  Card 1   |   |  Card 2   |   |  Card 3   |   |  Card 4   |  |
|  | (Click to |   | (Click to |   | (Click to |   | (Click to |  |
|  |  Load)    |   |  Load)    |   |  Load)    |   |  Load)    |  |
|  +-----------+   +-----------+   +-----------+   +-----------+  |
|                                                                 |
|  +-----------+   +-----------+                                  |
|  |           |   |           |                                  |
|  |  Card 5   |   |  Card 6   |                                  |
|  | (Click to |   | (Click to |                                  |
|  |  Load)    |   |  Load)    |                                  |
|  +-----------+   +-----------+                                  |
|                                                                 |
+-----------------------------------------------------------------+
```

## Printable Card Format

A special view of the card, formatted with CSS (`@media print`) to be ~3.5 x 2.5 inches when printed. This view is not directly visible in the UI but is triggered by the "Print" button.

```
(Hidden from main view, for printing only)
+----------------------------------+
|                                  |
|    +--------------------------+    |
|    | +----------------------+ |    |
|    | |                      | |    |
|    | |      +--------+      | |    |
|    | |  92  |  PIC   | CAM  | |    |
|    | |      +--------+      | |    |
|    | |                      | |    |
|    | |     PLAYER NAME      | |    |
|    | |                      | |    |
|    | |  +--+   +--+   +--+  | |    |
|    | |  |DF|   |CL|   |AT|  | |    |
|    | |  +--+   +--+   +--+  | |    |
|    | +----------------------+ |    |
|    +--------------------------+    |
|                                  |
+----------------------------------+
```
