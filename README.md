# JHipster Microservices Example

> A microservice architecture created with JHipster. Uses Spring Cloud, Spring Boot, Angular, and MongoDB for a simple blog/store applications. 

To run this app, you'll need to install Java 8, [Node.js](https://nodejs.org/) 6.11, [Yarn](https://yarnpkg.com/lang/en/docs/install/), and [Docker](https://docs.docker.com/engine/installation/).

**NOTE:** If you're not on Mac or Windows, you may need to [install Docker Compose](https://docs.docker.com/compose/install/) as well.

1. Start the registry by running `./mvnw -Pprod` in the `registry` directory.
2. Install dependencies in the `blog` directory, build the UI, and run the Spring Boot app.
 
    ```
    yarn
    ./mvnw 
    ``` 
    
3. Start MongoDB using Docker Compose in the `store` directory.
    
    ```bash
    docker-compose -f src/main/docker/mongodb.yml up
    ```
    
4. Install dependencies in the `store` directory, build the UI, and run the Spring Boot app.
 
    ```
    yarn
    ./mvnw 
    ``` 
    
You should be able to see the `blog` app at <http://localhost:8080> and edit products (from the `store` app)

## Run with Docker Compose

You can use Docker Compose to start everything if you don't want to start applications manually with Maven.

1. Make sure Docker is running.
2. Build Docker images for the `blog` and `store` applications by running the following command in both directories.

    ```
    ./mvnw package -Pprod docker:build
    ```
    
3. Open a terminal, navigate to the `docker` directory of this project, and run the following command. If you have a lot
of RAM on your machine, you might want to adjust Docker's default setting (2 GB).

    ```
    docker-compose up -d
    ````
    
    TIP: Remove `-d` from the end of the command above if you want to see logs from all containers in the current window.
    
4. Use [Kitematic](https://kitematic.com/) to view the ports and logs for the services deployed.

To create activity in JHipster Console's charts, you run the Gatling tests in the `blog` and `store` projects.

```bash
./mvnw gatling:execute
```

To remove all Docker containers, run the following commands or do it manually using Kitematic.

```bash
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
```

To find what's running on a port on macOS, use `sudo lsof -i :9092 # checks port 9092`.

## Run with Kubernetes and Minikube

1. Install [kubectl](https://kubernetes.io/docs/tasks/kubectl/install/), [VirtualBox](https://www.virtualbox.org/wiki/Downloads), and [Minikube](https://github.com/kubernetes/minikube/releases).
2. Start Minikube using `minikube start`.
3. To be able to work with the docker daemon, make sure Docker is running, then run the following command in your terminal:

    ```bash
    eval $(minikube docker-env)
    ```

4. Create Docker images of the `blog` and `store` applications:

   ```bash
   ./mvnw package -Pprod docker:build
   ```

5. Navigate to the `kubernetes` directory in your terminal and re-generate the files so they match your Docker repository name.

   ```
   jhipster kubernetes
   ```
   
   Follow the instructions for tagging and pushing the Docker images.

   ```bash
   docker image tag blog mraible/blog
   docker push mraible/blog
   docker image tag store mraible/store
   docker push mraible/store
   ```
   
6. Use `kubectl` to deploy to Minikube. 

    ```
    kubectl apply -f registry
    kubectl apply -f blog
    kubectl apply -f store
    ```
    
    The deployment process can take several minutes to complete. Run `minikube dashboard` to see the deployed containers.
    You can also run `kubectl get po -o wide --watch` to see the status of each pod.

6. Run `minikube service blog` to view the blog application. You should be able to login and add blogs, entries, and products.

To remove all deployed containers, run the following command:

    kubectl delete deployment --all
    
To stop Minikube, run `minikube stop`.

**NOTE:** If you run `minikube delete` and have trouble running `minikube start` afterward, run `rm -rf ~/.minikube`. 
See [this issue](https://github.com/kubernetes/minikube/issues/290) for more information.

## Google Cloud

1. Create a Google Cloud project at [console.cloud.google.com](https://console.cloud.google.com/).
2. Navigate to <https://console.cloud.google.com/kubernetes/list> to initialize the Container Engine for your project. 
3. Install [Google Cloud SDK](https://cloud.google.com/sdk/) and set project using:
  
       gcloud config set project <project-name>

4. Create a cluster:
  
       gcloud container clusters create <cluster-name> --machine-type=n1-standard-2 --scopes cloud-platform --zone us-west1-a
       
   To see a list of possible zones, run `gcloud compute zones list`.
   
5. Push the `blog` and `store` docker images to [Docker Hub](https://hub.docker.com/). You will need to create an account 
and run `docker login` to push your images. The images can be run from any directory.

    ```bash
    docker image tag blog mraible/blog
    docker push mraible/blog
    docker image tag store mraible/store
    docker push mraible/store
    ```

6. Run `kubectl` commands to deploy.

    ```bash
    kubectl apply -f registry
    kubectl apply -f blog
    kubectl apply -f store
    ```

7. Use port-forwarding to see the registry app locally.

       kubectl port-forward jhipster-registry-0 8761:8761
    
8. Run `kubectl svc blog` to view the blog application on Google Cloud.

9. Scale microservice apps as needed with `kubectl`:

       kubectl scale --replicas=3 deployment/store
    
To see a screencast of this process, [watch this YouTube video](https://youtu.be/dgVQOYEwleA).

## AWS

If you know how to deploy this architecture to AWS, I'd love to hear about it! I [tried in anger](https://groups.google.com/forum/#!msg/jhipster-dev/NNA3TScENVE/WmbG2Qt_AwAJ), but ultimately failed.
