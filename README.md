# erp
A web application for Enterprise Resource Planning.

## How to Deploy Locally

Follow the steps below to install and configure Docker, Docker Compose, and Git, clone the repository, and start the application.

### Prerequisites

This project requires the following environment:
- **Operating System**: Ubuntu 20.04 LTS
- **Docker**
- **Docker Compose**
- **Git**

### Step 1: Install Docker

1. **Update your system**:
    ```bash
    sudo apt update
    sudo apt upgrade -y
    ```

2. **Install Docker**:
    - Install Docker dependencies:
      ```bash
      sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
      ```
    - Add Docker's GPG key:
      ```bash
      curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
      ```
    - Add Docker's repository:
      ```bash
      echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu focal stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
      ```
    - Install Docker:
      ```bash
      sudo apt update
      sudo apt install docker-ce docker-ce-cli containerd.io -y
      ```

    - Start Docker:
      ```bash
      sudo systemctl start docker
      sudo systemctl enable docker
      ```

    - Add your user to the Docker group to run Docker without `sudo`:
      ```bash
      sudo usermod -aG docker $USER
      ```

### Step 2: Install Docker Compose

1. Download and install Docker Compose:
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. Verify Docker Compose installation:
   ```bash
   docker-compose --version
   ```

### Step 3: Install Git

1. Install Git:
   ```bash
   sudo apt install git -y
   ```

2. Verify Git installation:
   ```bash
   git --version
    ```

### Step 4: Clone the Repository

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/ewaslota/erp.git
   ```

2. Navigate to the project directory:
   ```bash
   cd erp
   ```

3. Copy the development environment configuration:
   ```bash
   cp .env.dev.dist .env
   ```

### Step 5: Start the Application

1. Run the following command to build and start the containers:
   ```bash
   docker-compose up -d
   ```

2. Once the services are up, you can access the following services:

### Local Links (development)

- **Frontend**: [http://localhost:8889](http://localhost:8889)
- **Backend (API)**: [http://localhost:8881/api](http://localhost:8881/api)
- **phpMyAdmin**: [http://localhost:8882](http://localhost:8882)
- **Mailhog**: [http://localhost:8026](http://localhost:8026)
- **MySQL**: `localhost:3307` (You can connect via phpMyAdmin or any MySQL client)
   - **Username**: `erp`
   - **Password**: `pass123`
   - **Database**: `expenses`

### Staging Links

The following are the staging links for the services:

- **Staging Frontend**: [http://162.55.215.13:8889](http://162.55.215.13:8889)
- **Staging Backend (API)**: [http://162.55.215.13:8881/api](http://162.55.215.13:8881/api)
- **Staging phpMyAdmin**: [http://162.55.215.13:8882](http://162.55.215.13:8882)
- **Staging Mailhog**: [http://162.55.215.13:8026](http://162.55.215.13:8026)

### Production Links

The following are the production links for the services:

- **Production Frontend**: [https://erp.smartvizz.com](https://erp.smartvizz.com)
- **Production Backend (API)**: [https://erp.smartvizz.com/api](https://erp.smartvizz.com/api)
- **Production phpMyAdmin**: [https://erp.smartvizz.com/phpmyadmin](https://erp.smartvizz.com/phpmyadmin)

### Demo User (each environment: Development, Staging and Production)

For each environment development, staging and production environments, you can use the following demo credentials to log in:

- **Username**: `demo`
- **Password**: `pass123`

### Backend API Documentation

The backend API is documented and can be accessed using **Bruno** by importing the collection from the following file:

- **Bruno Collection**: `<project_path>/backend/api-docs/erp/bruno.json`

The **Bruno collection** contains the API endpoints for interacting with the ERP backend,
such as user authentication, expense management, and more.
You can import the API documentation into **Bruno** by using this collection file located in your system
at the path mentioned above.


### Stopping the Application

To stop the application, run:
   ```bash
   docker-compose down
   ```

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
