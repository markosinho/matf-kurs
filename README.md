
#Technologies

#####Database: mongo, docker image
* mongo https://hub.docker.com/_/mongo
* mongo-express https://hub.docker.com/_/mongo-express

#####Backend (typescript)
* nodejs, express

#####Frontend:
* React
* Bootstrap

#Repos
* Backend repo: https://github.com/markosinho/matf-kurs
* Frontend repo: https://github.com/markosinho/matf-levi9-zadatak


#Run scripts
*Navigate to projects root directories*

####Backend:
*Configure server port in* `/config/local.yaml`
1. *Startup database*
    * `docker-compose up`
2. *Start nodejs express application*
    * `npm run build`
    * `npm start`

####Frontend:
*Configure backend server address in* `/src/config.json`
1. *Start front end*
    * `npm start`