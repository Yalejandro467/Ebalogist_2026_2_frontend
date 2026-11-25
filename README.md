# E-Balogist – Frontend

Aplicación web desarrollada con Angular para la gestión de información de la empresa de carpintería E-Balogist. Este frontend consume una API REST desarrollada con Python y FastAPI.

## Tecnologías utilizadas

- Angular 22
- TypeScript
- HTML y CSS
- Python y FastAPI (backend)
- PostgreSQL mediante Neon (base de datos)

## Módulos del sistema

El frontend cuenta con cinco módulos de gestión:

1. **Usuarios:** administración de usuarios.
2. **Clientes:** registro, consulta, actualización y eliminación de clientes.
3. **Productos:** gestión del catálogo de productos.
4. **Pedidos:** administración de pedidos.
5. **Detalles de pedido:** gestión de los productos asociados a cada pedido.

Cada módulo permite realizar las operaciones CRUD que soporta su respectivo endpoint del backend.

## Requisitos previos

- Node.js y npm.
- Angular CLI.
- Python instalado.
- Backend E-Balogist disponible localmente.

## Cómo ejecutar el proyecto

### 1. Iniciar el backend

Abrir una terminal en la carpeta del proyecto backend y ejecutar:

```powershell
python -m uvicorn api:app --reload
```

La API estará disponible en:

http://127.0.0.1:8000

Documentación interactiva de FastAPI:

http://127.0.0.1:8000/docs

### 2. Iniciar el frontend

Abrir otra terminal en la carpeta del proyecto frontend y ejecutar:

```powershell
npm install
npm start
```

Abrir el navegador en:

http://localhost:4200

## Repositorio

Repositorio individual del frontend:

https://github.com/Yalejandro467/Ebalogist_2026_2_frontend

## Video de sustentación

En el siguiente enlace se encuentra el video de sustentación del cuarto entregable del proyecto E-Balogist, donde se presenta el funcionamiento del frontend desarrollado en Angular, su integración con el backend y las operaciones CRUD de las entidades.

**Enlace al video:** https://youtu.be/hdZ_xSUo0gA

**Visibilidad:** Público.
