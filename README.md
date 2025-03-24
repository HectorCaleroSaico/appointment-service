# 💻 Appointment Service 🏥

Proyecto Serverless con AWS Lambda, DynamoDB, SQS, SNS y EventBridge para registrar citas médicas.  
Incluye documentación OpenAPI/Swagger y pruebas unitarias.

---

## 📋 Requisitos Previos

- Node.js (v18+)
- npm o yarn
- **AWS CLI** instalado y configurado
- **Serverless Framework** instalado

### 🔧 Instalar AWS CLI

Descargar e instalar **AWS CLI** desde [AWS CLI Oficial](https://aws.amazon.com/cli/).  
Para verificar la instalación:

```bash
aws --version
```

## 👤 Crear y configurar un usuario IAM en AWS
Inicia sesión en la Consola de AWS.

Ve a IAM (Identity and Access Management).

Crea un nuevo usuario con permisos de AdministratorAccess. Genera una clave de acceso y secreta.

Configura las credenciales en AWS CLI con:

```batch
aws configure
```

```batch
AWS Access Key ID [None]: XXXXXXXXXX
AWS Secret Access Key [None]: XXXXXXXXXX
Default region name [None]: us-east-1
Default output format [None]: json
```

## 💻 Instalar Serverless Framework:

```batch
npm install -g serverless
```

## ⚒️ Configuración Inicial

1️⃣ Clonar el repositorio:

```batch
git clone https://github.com/HectorCaleroSaico/appointment-service.git
```
```batch
cd appointment-service
```
2️⃣ Instalar dependencias:

```batch
npm install
```

## 📂 Estructura del Proyecto

```
src/
├── application/          # Lógica de la aplicación
│   ├── handlers/         # Lambdas
│   ├── services/         # Servicios de negocio
│   └── dtos/             # DTOs
├── domain/               # Modelos de dominio
├── infrastructure/       # AWS (DynamoDB, SNS, EventBridge)
tests/                    # Pruebas unitarias
openapi.yml               # Especificación OpenAPI
serverless.yml            # Deploy Serverless Framework
```

## 🚀 Despliegue

```batch
serverless deploy
```

- Esto creará en AWS: Lambdas: appointment, appointmentPE, appointmentCL.

- DynamoDB: Appointments.

- SQS: SQS_PE, SQS_CL, AppointmentQueue.

- SNS: SNS_PE, SNS_CL.

- EventBridge: AppointmentBus.

> 📌 URLs generadas:

API Gateway: https://74krqwtf02.execute-api.us-east-1.amazonaws.com/dev/appointments

## 📚 Documentación API
El proyecto genera automáticamente un archivo openapi.yml y una interfaz Swagger UI.

Endpoints:

✚ POST **/appointments**

- Registra una nueva cita (estado inicial: pending).

Body:

```json
{
  "insuredId": "12345",
  "scheduleId": 100,
  "countryISO": "PE"
}
```

🔍 GET **/appointments/{insuredId}**

- Lista citas registradas por código del asegurado.

## 📄 Ver documentación en  Swagger UI

```batch
npm run documentation
```

✅ Pruebas Unitarias:

```batch
npm test
```

🛑 Eliminar Recursos:

```batch
serverless remove
```
