# 接口文档

## modelNode

### 注册

```json
POST /api/model/register
```

#### request params

```json
"file": "zip file || script file",
"data":{
  "name": "model_name",
  "type": "script || rest_api || grpc || local_service || message_queue",
  "param_key": ["param1", "param2"],
  "param_config": [
    {
      "name": "param1",
      "defaultValue": "default_value",
      "prefix": "prefix",
      "required": true,
      "description": "description"
    }
  ],
  "model_config": {
    // 脚本类型配置
    "entry_file": "entry_file",
    "exe_prefix": "python",
    "conda_env": "env_name",

    // REST API配置
    "endpoint": "http://localhost:8080/api/v1/model",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },

    // gRPC配置
    "grpcHost": "localhost",
    "grpcPort": 50051,
    "serviceName": "Greeter",
    "methodName": "SayHello",
    "protoPath": "/path/to/your/protofile.proto",

    // 本地服务配置
    "serviceHost": "localhost",
    "servicePort": 50051,
    "protocol": "http",

    // 消息队列配置
    "queueName": "test_queue",
    "broker": "localhost:5672",
    "exchange": "test_exchange",
    "topic": "test_topic"
  }
},
"parentId": "parent_id"
```

#### Response Body - Register

```json
{
  "code": 200,
  "message": "model registered successfully",
  "success": true,
  "data": "model_id"
}
```

### 获取模型列表

```json
GET /api/model/list
```

#### Response Body - List

```json
{
  "code": 200,
  "message": "model list fetched successfully",
  "success": true,
  "data": [
    {
      "id": "model_id",
      "name": "model_name",
      "type": "script || rest_api || grpc || local_service || message_queue",
      "param_key": ["param1", "param2"],
      "param_config": [
        {
          "name": "param1",
          "defaultValue": "default_value",
          "prefix": "prefix",
          "required": true,
          "description": "description"
        }
      ],
      "model_config": {
        // 脚本类型配置
        "entry_file": "entry_file",
        "exe_prefix": "python",
        "conda_env": "env_name"
      }
    }
  ]
}
```

### 删除模型

```json
DELETE /api/model/:id
```

#### Response Body - Delete

```json
{
  "code": 200,
  "message": "model deleted successfully",
  "success": true
}
```

### 更新模型

```json
PUT /api/model/:id
```

#### request body

```json
{
  "name": "model_name",
  "type": "script || rest_api || grpc || local_service || message_queue",
  "param_key": ["param1", "param2"],
  "param_config": [
    {
      "name": "param1",
      "defaultValue": "default_value",
      "prefix": "prefix",
      "required": true,
      "description": "description"
    }
  ],
  "model_config": {
    // 脚本类型配置
    "entry_file": "entry_file",
    "exe_prefix": "python",
    "conda_env": "env_name"
  }
}
```

#### Response Body - Update

```json
{
  "code": 200,
  "message": "model updated successfully",
  "success": true
}
```

### 模型运行测试

```json
POST /api/model/test/:id
```

#### Response Body - Test

```json
{
  "code": 200,
  "message": "model test successfully",
  "success": true
}
```

### 获取模型后代

```json
GET /api/model/descendants/:id
```

#### Response Body - Descendants

```json
{
  "code": 200,
  "message": "descendants fetched successfully",
  "success": true,
  "data": "descendants"
}
```
