## 💫 ** Radio Enchufe Virtual ** 💫

This project has all my knowledge acquired so far, it will improve over time. We will receive your contributions or collaborations, with your help we will be able to make a great open source project. Be free, be happy!!

# Clone It 🏁

### Clone repo

- [Git](https://git-scm.com/downloads)

```
git clone git@github.com:enchufevirtual/radio-api.git
cd radio-api
```

### Node

- [Node.js](https://nodejs.org/en/download/) (**v18.14.2**)

```
node -v
npm install
```

### Docker

This project utilizes Docker to create and manage containers for the MySQL service and phpMyAdmin. If you wish to use these containers, make sure to have Docker installed on your machine.

- [Docker](https://www.docker.com/get-started/)

Check if you have Docker installed by running the following command in your terminal:

```
docker -v
```

If you don't have Docker installed, follow the instructions on the provided link to install it on your system.

### Docker Compose

This project utilizes Docker Compose to simplify the deployment of multiple containers. Docker Compose allows you to define and manage the services, networks, and volumes required for your application in a single YAML file.

If you want to use Docker Compose for this project, make sure you have Docker installed on your machine. Docker Compose is usually included as part of the Docker installation package, but in some cases, you may need to install it separately.

- [Docker](https://www.docker.com/get-started/)

You can check if you have Docker Compose installed by running the following command in your terminal:

```
docker-compose -v
```
If Docker Compose is not installed, please refer to the Docker documentation for instructions on how to install it for your specific operating system.

Once you have Docker Compose installed, you can use the provided `docker-compose.yml` file in the project repository to manage the required containers. This file defines the services and their configurations.

To start the application using Docker Compose, navigate to the project directory and run the following command:

```
docker-compose up -d
```

### Set up Database

Before running the application, make sure you have your database set up. This project uses MariaDB for development. If you're using the same database, you won't encounter any issues. Otherwise, you'll need to configure the files located in the database and libs folders, where the database configurations are stored.

Once you have your database created or the MARIADB and phpMyAdmin services up and running, execute the following command in the console to create the database tables:

```
npm run migrations:run
```

##### Development

All the backend works on port 4000, if you already have it in use change this port in the index.ts


```
npm run dev
```

##### Production

```
npm run build
```

✅ Social Media: @enchufevirtual
📨 Contact me - <chendodev@gmail.com>