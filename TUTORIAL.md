# Develop and Deploy Microservices with JHipster

> Learn how to develop a microservice architecture with JHipster, Spring Boot, Angular, and MongoDB and deploy it all to the cloud using Kubernetes and Docker.

This tutorial shows you how to build a microservices architecture with [JHipster 4.3.0](https://jhipster.github.io/2017/04/13/jhipster-release-4.3.0.html). 
You'll generate a gateway (powered by Netflix Zuul and the JHipster Gateway), a microservice (that talks to MongoDB), and use Docker Compose to make
sure it all runs locally. Then you'll deploy it to Minikube and Google Cloud using Kubernetes.

## What is JHipster?

JHipster is one of those open-source projects you stumble upon and immediately think, "`Of course!`" It combines three 
very successful frameworks in web development: Bootstrap, Angular, and Spring Boot. Bootstrap was one of the first dominant 
web-component frameworks. Its largest appeal was that it only required a bit of HTML and it worked! All the efforts we 
made in the Java community to develop web components were shown a better path by Bootstrap. It leveled the playing field 
in HTML/CSS development, much like Apple's Human Interface Guidelines did for iOS apps.

JHipster was started by Julien Dubois in October 2013 (Julien's first commit was on 
[October 21, 2013](https://github.com/jhipster/generator-jhipster/commit/c8630ab7af7b6a99db880b3b0e2403806b7d2436)). The 
first public release (version 0.3.1) was launched December 7, 2013. Since then, the project has had over 130 releases! 
It is an open-source, Apache 2.0-licensed project on GitHub. It has a core team of 19 developers and over 320 contributors. 
You can find its homepage at [http://jhipster.github.io](http://jhipster.github.io/). If you look at 
[the project on GitHub](https://github.com/jhipster/generator-jhipster), you can see it's mostly written in JavaScript 
(39%) and Java (27%).

At its core, JHipster is a [Yeoman](http://yeoman.io/) generator. Yeoman is a code generator that you run with a `yo` 
command to generate complete applications or useful pieces of an application. Yeoman generators promote what the Yeoman 
team calls the "`Yeoman workflow`". This is an opinionated client-side stack of tools that can help developers quickly 
build beautiful web applications. It takes care of providing everything needed to get working without the normal pains 
associated with a manual setup.

## Install JHipster 4

The [Installing JHipster](http://jhipster.github.io/installation/) instructions show you all the tools you'll need to 
use a released version of JHipster.

1. Install Java 8 [from Oracle](http://www.oracle.com/technetwork/java/javase/downloads/index.html).
2. Install Git from <https://git-scm.com>.
3. Install Node.js from <http://nodejs.org>. I used Node 6.9.5 to write this article.
4. Install Yarn using the [Yarn installation instructions](https://yarnpkg.com/en/docs/install).
5. Run the following command to install [Yeoman](http://yeoman.io/).

    ```
    yarn global add yo
    ```

6. Run the following command to install JHipster.

    ```
    yarn global add generator-jhipster
    ```

## Microservices with JHipster 

To build a microservices architecture with JHipster, you'll need to generate two applications, and clone another.

* Generate a gateway
* Generate a microservice
* Clone the JHipster Registry

You can see how these components fit in the diagram below.

![JHipster Microservices Architecture](static/jhipster-microservices-architecture.png)

To see what's happening inside your applications, you can use the [JHipster Console](https://jhipster.github.io/monitoring/#jhipster-console), 
a monitoring tool based on the [ELK Stack](https://www.elastic.co/products). I'll cover this tool in the Docker Compose 
section.

## Create an API Gateway

To create a microservices project, open a terminal window and create a `jhipster-microservices-example` directory. Then 
create a `blog` directory for the gateway application. 

```bash
mkdir -p jhipster-microservices-example/blog
```

In JHipster terms, a **gateway** is a normal JHipster application. This means you can develop 
it like a monolith, but it also acts as the entrance to your microservices. More specifically, it provides HTTP 
routing and load balancing, quality of service, security, and API documentation for all microservices.

Navigate into the `blog` directory and run `yo jhipster`. 

You'll be asked a number of questions about the type of  application you want to generate and what features you'd like 
to include. Create the `blog` application with the following settings:

* Application type: `Microservice gateway`
* Base name of the application: `blog`
* Install other generators from the JHipster Marketplace: `No`
* Port: `8080`
* Default package name: `org.jhipster.blog`
* Type of authentication: `JWT`
* Service Discovery and Configuration: `JHipster Registry`
* Type of database: `SQL`
* Production database: `PostgreSQL`
* Development database: `H2 with disk-based persistence`
* Hibernate 2nd-level cache: `Yes, with HazelCast`
* Maven or Gradle: `Maven`
* Other technologies: `Elasticsearch`
* Client framework: `Angular 4`
* Sass for CSS: `Yes`
* Internationalization support: `Yes`
* Native language: `English`
* Additional languages: `Spanish`
* Testing frameworks: `Gatling, Protractor`

![Generating the gateway](static/generating-blog.png)

If you'd like to use the same settings I did, you can place the following `.yo-rc.json` file in the `blog` directory 
and run `yo jhipster` in it. You won't be prompted to answer any questions because the answers are already in `.yo-rc.json`.

```json
{
  "generator-jhipster": {
    "promptValues": {
      "packageName": "org.jhipster.blog",
      "nativeLanguage": "en"
    },
    "jhipsterVersion": "4.3.0",
    "baseName": "blog",
    "packageName": "org.jhipster.blog",
    "packageFolder": "org/jhipster/blog",
    "serverPort": "8080",
    "authenticationType": "jwt",
    "hibernateCache": "hazelcast",
    "clusteredHttpSession": false,
    "websocket": false,
    "databaseType": "sql",
    "devDatabaseType": "h2Disk",
    "prodDatabaseType": "postgresql",
    "searchEngine": "elasticsearch",
    "messageBroker": false,
    "serviceDiscoveryType": "eureka",
    "buildTool": "maven",
    "enableSocialSignIn": false,
    "jwtSecretKey": "055aa488cbab06a1467646ba68b2baf7f88cc2ca",
    "clientFramework": "angular2",
    "useSass": true,
    "clientPackageManager": "yarn",
    "applicationType": "gateway",
    "testFrameworks": [
      "gatling",
      "protractor"
    ],
    "jhiPrefix": "jhi",
    "enableTranslation": true,
    "nativeLanguage": "en",
    "languages": [
      "en",
      "es"
    ]
  }
}
```

The project creation process will take a couple minutes to run, depending on your internet connection speed. When it's 
finished, you should see output like the following.

![Generation success](static/generation-success.png)

Before you can run this project, you'll need to download and start a instance of the [JHipster Registry](https://github.com/jhipster/jhipster-registry).

```bash
git clone git@github.com:jhipster/jhipster-registry.git registry
cd registry && mvn
```

The [JHipster Registry](https://jhipster.github.io/microservices-architecture/#jhipster-registry) is built on Spring 
Cloud Netflix and Spring Cloud Config. Patterns provided by Spring Cloud Netflix include Service Discovery (Eureka),  
Circuit Breaker (Hystrix), Intelligent Routing (Zuul), and Client Side Load Balancing (Ribbon). 

Run `./mvnw` to start the blog application and navigate to <http://localhost:8080> in your favorite browser. The first 
thing you'll notice is a dapper-looking fellow explaining how you can sign in or register.

![Default homepage](static/default-homepage.png)

Sign in with username `admin` and password `admin` and you'll have access to navigate through the Administration section. 
This section offers nice looking UIs on top of some Spring Boot's many monitoring and configuration features. It also 
allows you to administer users:

![User management](static/user-management.png)

It gives you insights into Application and JVM metrics:

![Application and JVM Metrics](static/app-metrics.png)

And it allows you to see the Swagger docs associated with its API.

![Swagger docs](static/swagger-docs.png)

You can run the following command (in a separate terminal window) to run the Protractor tests and confirm everything is 
working properly.

```bash
yarn e2e
```

At this point, it's a good idea to check your project into Git so you can easily see what changes are made going forward.

```bash
git init
git add .
git commit -m "Gateway created"
```

### Generate Entities

For each entity you want to create, you will need:

* a database table;
* a Liquibase change set;
* a JPA entity class;
* a Spring Data `JpaRepository` interface;
* a Spring MVC `RestController` class;
* an Angular model, state, component, dialog components, service; and
* several HTML pages for each component.

In addition, you should have integration tests to verify that everything works and performance tests to verify that it 
runs fast. In an ideal world, you'd also have unit tests and integration tests for your Angular code.

The good news is JHipster can generate all of this code for you, including integration tests and performance tests. In 
addition, if you have entities with relationships, it will generate the necessary schema to support them (with foreign 
keys), and the TypeScript and HTML code to manage them. You can also set up validation to require certain fields as well as control their length.

JHipster supports several methods of code generation. The first uses its [entity sub-generator](https://jhipster.github.io/creating-an-entity/). 
The entity sub-generator is a command-line tool that prompts you with questions which you answer. 
[JDL-Studio](https://jhipster.github.io/jdl-studio/) is a browser-based tool for defining your domain model with JHipster 
Domain Language (JDL). Finally, [JHipster-UML](https://jhipster.github.io/jhipster-uml/) is an option for those that like UML. 
Supported UML editors include [Modelio](https://www.modeliosoft.com/), [UML Designer](http://www.umldesigner.org/), 
[GenMyModel](https://www.genmymodel.com/), and [Visual Paradigm](http://www.visual-paradigm.com/). I like the visual 
nature of JDL-Studio, so I'll use it for this project.

Below is the entity diagram and JDL code needed to generate a simple blog with blogs, entries and tags.

![Blog entity diagram](static/jdl-studio-blog.png)

You can [click on this URL](http://bit.ly/jhipster4-blog-jdl), or copy/paste the contents of the file below to your hard 
drive if you'd like to follow along.

```
entity Blog {
	name String required minlength(3),
	handle String required minlength(2)
}

entity Entry {
	title String required,
	content TextBlob required,
	date ZonedDateTime required
}

entity Tag {
	name String required minlength(2)
}

relationship ManyToOne {
	Blog{user(login)} to User,
	Entry{blog(name)} to Blog
}

relationship ManyToMany {
	Entry{tag(name)} to Tag{entry}
}

paginate Entry, Tag with infinite-scroll
```

Run the following command (in the `blog` directory) to import this file. Running this command will generate entities, tests, and a UI.

```bash
yo jhipster:import-jdl ~/Downloads/jhipster-jdl.jh
```

You'll be prompted to overwrite `src/main/resources/config/liquibase/master.xml`. Type `a` to overwrite this file, as 
well as others.

**WARNING:** There is [a bug](https://github.com/jhipster/generator-jhipster/issues/5634) in JHipster 4.3.0 where it 
generates a file upload field instead of a `<textarea>` for the `entry.content` field. To fix this, edit 
`.jhipster/Entry.json` and add `"fieldTypeBlobContent": "text"` to the  properties for the `content` field. After your 
changes, it should look as follows:

```json
{
    "fieldName": "content",
    "fieldType": "byte[]",
    "fieldTypeBlobContent": "text",
    "fieldValidateRules": [
        "required"
    ]
},
```

Re-generate this entity by running `yo jhipster:entity entry`. If you're using a version greater than 4.3.0, this issue
is likely fixed.

Start the application with `/.mvnw` and run `yarn start` to view the UI for the generated entities. Create a couple 
blogs for the existing `admin` and `user` users, as well as a few blog entries.

![Blogs](static/blogs.png)

![Entries](static/entries.png)

From these screenshots, you can see that users can see each other's data, and modify it.

Check your generated entities into Git.

```bash
git init
git add .
git commit -m "Entities generated"
```

### Add Business Logic

TIP: To configure an IDE with your JHipster project, see [Configuring your IDE](https://jhipster.github.io/configuring-ide/). 
Instructions exist for Eclipse, IntelliJ IDEA, Visual Studio Code, and NetBeans.

To add more security around blogs and entries, open `BlogResource.java` and find the `getAllBlogs()` method. Change the 
following line:

```java
List<Blog> blogs = blogRepository.findAll();
```

To:

```java
List<Blog> blogs = blogRepository.findByUserIsCurrentUser();
```

The `findByUserIsCurrentUser()` method is generated by JHipster in the `BlogRepository` class and allows limiting results 
by the current user.

```java
public interface BlogRepository extends JpaRepository<Blog,Long> {

    @Query("select blog from Blog blog where blog.user.login = ?#{principal.username}")
    List<Blog> findByUserIsCurrentUser();

}
```

After making this change, re-compiling `BlogResource` should trigger a restart of the application thanks to 
[Spring Boot's Developer tools](http://docs.spring.io/spring-boot/docs/current/reference/html/using-boot-devtools.html). 
If you navigate to <http://localhost:9000/blogs>, you should only see the blog for the current user.

![Admin's blog](static/blogs-admin.png)

To add this same logic for entries, open `EntryResource.java` and find the `getAllEntries()` method. Change the following line:

```java
Page<Entry> page = entryRepository.findAll(pageable);
```

To:

```java
Page<Entry> page = entryRepository.findByBlogUserLoginOrderByDateDesc(SecurityUtils.getCurrentUserLogin(), pageable);
```

Using your IDE, create this method in the `EntryRepository` class. It should look as follows:

```java
Page<Entry> findByBlogUserLoginOrderByDateDesc(String currentUserLogin, Pageable pageable);
```

Recompile both changed classes and verify that the `user` user only sees the entries you created for them.

[User's entries](static/entries-user.png)

After making this changes, commit them to Git.

```
git add .
git commit -m "Add business logic"
```

You might notice that this application doesn't look like a blog and it doesn't allow HTML in the content field.

### Make UI Enhancements

When doing UI development on a JHipster-generated application, it's nice to see your changes as soon as you save a file. 
JHipster 4 uses [Browsersync](https://www.browsersync.io/) and [webpack](https://webpack.github.io/) to power this feature. 
You enable this previously by running the following command in the `blog` directory.

```bash
yarn start
```

In this section, you'll change the following:

1. Change the rendered content field to display HTML
2. Change the list of entries to look like a blog

#### Allow HTML

If you enter HTML in the `content` field of a blog entry, you'll notice it's escaped on the list screen.

![Escaped HTML](static/entries-with-html-escaped.png)

To change this behavior, open `entry.component.html` and change the following line:

```html
<td>{{entry.content}}</td>
```

To:

```html
<td [innerHTML]="entry.content"></td>
```

After making this change, you'll see that the HTML is no longer escaped.

[HTML in entries](static/entries-with-html.png)

#### Improve the layout

To make the list of entries look like a blog, replace `<div class="table-responsive">` with HTML so it uses a stacked layout in a single column.

```html
<div class="table-responsive" *ngIf="entries">
    <div infinite-scroll (scrolled)="loadPage(page + 1)" [infiniteScrollDisabled]="page >= links['last']"
         [infiniteScrollDistance]="0">
        <div *ngFor="let entry of entries; trackBy: trackId">
            <h2>{{entry.title}}</h2>
            <small>Posted on {{entry.date | date: 'short'}} by {{entry.blog.user.login}}</small>
            <div [innerHTML]="entry.content"></div>
            <div class="btn-group mb-4 mt-1">
                <button type="submit"
                        [routerLink]="['/', { outlets: { popup: 'entry/'+ entry.id + '/edit'} }]"
                        replaceUrl="true"
                        class="btn btn-primary btn-sm">
                    <span class="fa fa-pencil"></span>
                    <span class="hidden-md-down" jhiTranslate="entity.action.edit">Edit</span>
                </button>
                <button type="submit"
                        [routerLink]="['/', { outlets: { popup: 'entry/'+ entry.id + '/delete'} }]"
                        replaceUrl="true"
                        class="btn btn-danger btn-sm">
                    <span class="fa fa-remove"></span>
                    <span class="hidden-md-down" jhiTranslate="entity.action.delete">Delete</span>
                </button>
            </div>
        </div>
    </div>
</div>
```

Now it looks more like a regular blog!

![Blog entries](static/blog-entries.png)

Commit all your changes to Git.

```
git add .
git commit -m "UI enhancements"
```

## Create a Microservice

To generate a `store` microservice, open a terminal window and navigate to the `jhipster-microservices-example` directory.
Create a `store` directory and run `yo jhipster` in it. Use the following settings to generate a microservice that uses 
MongoDB for its database.

* Application type: `Microservice application`
* Base name of the application: `store`
* Install other generators from the JHipster Marketplace: `No`
* Port: `8081`
* Default package name: `org.jhipster.store`
* Type of authentication: `JWT`
* Service Discovery and Configuration: `JHipster Registry`
* Type of database: `MongoDB`
* Maven or Gradle: `Maven`
* Other technologies: `Elasticsearch`
* Internationalization support: `Yes`
* Native language: `English`
* Additional languages: `Spanish`
* Testing frameworks: `Gatling`

![Generating the microservice](static/generating-store.png)

Commit all your changes to Git.

### Generate Product Entity

### Generate UI for Product Entity

```
git add .
git commit -m "Add store microservice"
```

## Build for Production

A JHipster application can be deployed anywhere a Spring Boot application can be deployed.

JHipster ships with support for deploying to [Cloud Foundry](https://jhipster.github.io/cloudfoundry/), 
[Heroku](https://jhipster.github.io/heroku/), [Kubernetes](https://jhipster.github.io/kubernetes/), 
[AWS](https://jhipster.github.io/aws/), and [AWS with Boxfuse](https://jhipster.github.io/boxfuse/). 

When you prepare a JHipster application for production, it's recommended to use the pre-configured "`production`" profile. 
With Maven, you can package your application by specifying the `prod` profile when building.

```bash
mvn -Pprod package
```

The production profile is used to build an optimized JavaScript client. You can invoke this using webpack by running 
`yarn run webpack:prod`. The production profile also configures gzip compression with a servlet filter, cache headers, 
and monitoring via [Metrics](https://github.com/dropwizard/metrics). If you have a [Graphite](http://graphite.wikidot.com/) 
server configured in your `application-prod.yaml` file, your application will automatically send metrics data to it.

When you run this command, you'll likely get a test failure.

```
Results :

Tests in error:
  BlogResourceIntTest.getAllBlogs:171 » NestedServlet Request processing failed;...

Tests run: 62, Failures: 0, Errors: 1, Skipped: 0
```

The reason this happens is shown in a stack trace in your terminal

```
getAllBlogs(org.jhipster.web.rest.BlogResourceIntTest)  Time elapsed: 0.041 sec  <<< ERROR!
org.springframework.web.util.NestedServletException: Request processing failed; nested exception is
org.springframework.dao.InvalidDataAccessApiUsageException: Authentication object cannot be null;
nested exception is java.lang.IllegalArgumentException: Authentication object cannot be null
```

To fix this, you can use Spring Security Test's [`@WithMockUser`](http://docs.spring.io/spring-security/site/docs/current/reference/html/test-method.html#test-method-withmockuser). Open `BlogResourceIntTest.java` and inject  `UserRepository` as a dependency.

```java
@Autowired
private UserRepository userRepository;
```

Change the `createEntity()` method so it's not `static` and uses the `userRepository` to set a user on the blog entity.

```java
public Blog createEntity(EntityManager em) {
    Blog blog = new Blog()
            .name(DEFAULT_NAME)
            .handle(DEFAULT_HANDLE)
            .user(userRepository.findOneByLogin("user").get());
    return blog;
}
```

Add `@WithMockUser` to the `getAllBlogs()` method.

```java
@Test
@Transactional
@WithMockUser
public void getAllBlogs() throws Exception {
```

After fixing this test, you should be able to run `mvn -Pprod package` without any failures.

## Deploy to the Cloud

### Docker Compose

You can use Docker Compose to start everything if you don't want to start applications manually with Maven.

1. Make sure Docker is running.
2. Build Docker images for the `blog` and `store` applications by running the following command in both directories:

    ```
    ./mvnw package -Pprod docker:build
    ```
    
3. Using your terminal, navigate to the root directory of your project, and create a `docker` directory. Then run the 
following command in it.

    ```
    yo jhipster:docker-compose
    ````
    
    * Select `microservice` for application type
    * Use `../` for the root directory of your microservices
    * Select both `blog` and `store` applications when prompted
    * **Don't** select the clustered database option
    * Setup monitoring using JHipster Console with ELK/Zipkin
    * Select the default value for the JHipster Registry's admin password
    
4. Open Kitematic to view the Blog, Store and JHipster Console.

### Kubernetes 
<!-- Todo: document steps for Google Cloud -->

To save your changes for Kubernetes, commit your changes to Git.

```
git add .
git commit -m "Add Kubernetes"
```

## Learn More

I hope you've enjoyed learning how JHipster can help you develop hip web applications! It's a nifty project, with an easy-to-use entity generator, a pretty UI and many Spring Boot best-practice patterns. The project team follows five simple https://jhipster.github.io/policies/[policies], paraphrased here:

1. The development team votes on policies.
2. JHipster uses technologies with their default configurations as much as possible.
3. Only add options when there is sufficient added value in the generated code.
4. For the Java code, follow the default IntelliJ IDEA formatting and coding guidelines.
5. Use strict versions for third-party libraries.

These policies help the project maintain its sharp edge and streamline its development process. If you have features you'd like to add or if you'd like to refine existing features, you can https://github.com/jhipster/generator-jhipster[watch the project on GitHub] and https://github.com/jhipster/generator-jhipster/blob/master/CONTRIBUTING.md[help with its development] and support. We're always looking for help!

Now that you've learned how to use Angular, Bootstrap 4, and Spring Boot with JHipster, go forth and develop great applications!

## Source Code

The source code for this project is available on GitHub at https://github.com/mraible/jhipster4-demo.
