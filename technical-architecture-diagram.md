```
+---------------------+     +----------------------+     +---------------------+
|                     |     |                      |     |                     |
|  Client Website     |     |  Embedded Chat       |     |  Admin Dashboard    |
|                     |     |  Widget              |     |                     |
+----------+----------+     +-----------+----------+     +---------+-----------+
           |                            |                          |
           |                            |                          |
           v                            v                          v
+----------+----------------------------+-------------------------------------+
|                                                                             |
|                           Frontend Layer                                    |
|                                                                             |
+----------+----------------------------+-------------------------------------+
           |                            |                          |
           |                            |                          |
           v                            v                          v
+----------+----------+     +-----------+----------+     +---------+-----------+
|                     |     |                      |     |                     |
|  Authentication     |     |  API Gateway         |     |  WebSocket Server  |
|  Service            |     |                      |     |  (Real-time Chat)   |
|                     |     |                      |     |                     |
+----------+----------+     +-----------+----------+     +---------+-----------+
           |                            |                          |
           |                            |                          |
           v                            v                          v
+---------------------+--------------------------------------------------+
|                                                                        |
|                           Backend Services                             |
|                                                                        |
|  +---------------+    +---------------+    +---------------+           |
|  |               |    |               |    |               |           |
|  | Conversation  |    | Knowledge     |    | Analytics     |           |
|  | Service       |    | Base Service  |    | Service       |           |
|  |               |    |               |    |               |           |
|  +-------+-------+    +-------+-------+    +-------+-------+           |
|          |                    |                    |                    |
|          |                    |                    |                    |
|          v                    v                    v                    |
|  +-------+-------+    +-------+-------+    +-------+-------+           |
|  |               |    |               |    |               |           |
|  | AI Processing |    | Business      |    | Reporting     |           |
|  | Service       |    | Profile Mgmt  |    | Engine        |           |
|  |               |    |               |    |               |           |
|  +---------------+    +---------------+    +---------------+           |
|                                                                        |
+------------------------+-------------------------+---------------------+
                         |                         |
                         |                         |
                         v                         v
              +----------+-----------+   +---------+------------+
              |                      |   |                      |
              |  PostgreSQL          |   |  Redis Cache         |
              |  Database            |   |                      |
              |                      |   |                      |
              +----------------------+   +----------------------+
                         |
                         |
                         v
              +----------+-----------+
              |                      |
              |  External AI API     |
              |  (OpenAI/Claude)     |
              |                      |
              +----------------------+
```
