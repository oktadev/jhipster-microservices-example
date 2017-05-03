# JHipster Microservices Example

> A microservice architecture created with JHipster. Uses Spring Cloud, Spring Boot, Angular, and MongoDB for a simple blog/store applications. 

To run this app, you'll need to install Java 8, Maven, and [Docker](https://docs.docker.com/engine/installation/).

**NOTE:** If you're not on Mac or Windows, you may need to [install Docker Compose](https://docs.docker.com/compose/install/) as well.

1. Start the registry using `mvn` in the `registry` directory.
2. Install dependencies in the `blog` directory, build the UI, and run the Spring Boot app.
 
    ```
    yarn && yarn webpack:dev
    mvn
    ``` 
    
3. Start MongoDB using Docker Compose in the `store` directory.
    
    ```bash
    docker-compose -f src/main/docker/mongodb.yml up
    ```
    
4. Install dependencies in the `store` directory, build the UI, and run the Spring Boot app.
 
    ```
    yarn && yarn webpack:dev
    mvn
    ``` 
    
You should be able to see the `blog` app at <http://localhost:8080> and edit products (from the `store` app)

## Docker Compose

You can use Docker Compose to start everything if you don't want to start applications manually with Maven.

1. Make sure Docker is running.
2. Build Docker images for the `blog` and `store` applications by running the following command in both directories:

    ```
    ./mvnw package -Pprod docker:build
    ```
    
3. Open a terminal, navigate to the `docker` directory of this project, and run the following command:

    ```
    docker-compose up
    ````
    
    TIP: Add `-d` to the end of the command above if you want it to run as a daemon.
    
4. Open Kitematic to view the Blog, Store and JHipster Console.

To create activity in JHipster Console's charts, you run the Gatling tests in the `blog` and `store` projects.

To remove all Docker containers, run the following commands or do it manually using Kitematic.

```bash
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
```

To find what's running on a port on OS, use `sudo lsof -i :9092 # checks port 9092`.

## Kubernetes

1. Install [Docker](https://docs.docker.com/engine/installation/) and [kubectl](http://kubernetes.io/docs/user-guide/prereqs/).
2. Install [VirtualBox](https://www.virtualbox.org/wiki/Downloads) and [Minikube](https://github.com/kubernetes/minikube/releases).
3. Start Minikube using `minikube start`.
4. To be able to work with the docker daemon, run the `docker-env` command in your shell:

    ```
    eval $(minikube docker-env)
    ```

5. Create Docker images of the `blog` and `store` applications:

    * Maven: `./mvnw package -Pprod docker:build`
    * Gradle: `./gradlew bootRepackage -Pprod buildDocker`
  
6. Modify `kubernetes/blog/blog-deployment.yml` to add `imagePullPolicy: IfNotPresent`.

    ```
    image: blog
    imagePullPolicy: IfNotPresent
    ```

7. Modify `kubernetes/store/store-deployment.yml` to add `imagePullPolicy: IfNotPresent`.

    ```
    image: store
    imagePullPolicy: IfNotPresent
    ```
    
8. Run the following commands in the `kubernetes` directory to deploy to Minikube. Run `minikube dashboard` to see the deployed containers.

    ```
    kubectl apply -f registry
    kubectl apply -f blog
    kubectl apply -f store
    ```

9. Run `minikube service blog` to view the blog application. You can also run `kubectl get po -o wide --watch` to see the status of each pod.

To remove all deployed containers, run the following command:

    kubectl delete deployment --all

If you run `minikube delete` and have trouble running `minikube start` afterward, run `rm -rf ~/.minikube`. See [this issue](https://github.com/kubernetes/minikube/issues/290) for more information.

## Google Cloud

1. Create a Google Cloud project at [console.cloud.google.com](https://console.cloud.google.com/).
2. Install [Google Cloud SDK](https://cloud.google.com/sdk/) and set project using:
  
       gcloud config set project <project-name>

3. Create a cluster:
  
       gcloud container clusters create <cluster-name> --machinetype=n1-standard-2 --scopes cloud-platform

4. Run `kubectl` commands to deploy.

    ```
    kubectl apply -f registry
    kubectl apply -f blog
    kubectl apply -f store
    ```

5. Use port-forwarding to see the registry app locally.

       kubectl port-forward jhipster-registry-0 8761:8761

6. Scale microservice apps as needed:

       kubectl scale deployment store —replicas=3
    
To see a screencast of this process, [watch this YouTube video](https://youtu.be/dgVQOYEwleA).

## AWS

If you know how to deploy this architecture to AWS, I'd love to hear about it! I [tried in anger](https://groups.google.com/forum/#!msg/jhipster-dev/NNA3TScENVE/WmbG2Qt_AwAJ), but ultimately failed.
