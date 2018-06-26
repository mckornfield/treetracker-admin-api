# treetracker-admin-api
 
 This is the TreeTracker's Admin Panel RESTful API.

 It is developed using Node.js and based on the library LoopBack v3: https://loopback.io/doc/en/lb3/index.html.

# Local Setup
1. Install treetracker-admin-api repo
2. Install nginx locally (brew install nginx)
3. Install treetracker-admin-api/scripts/nginx-treetracker-admin as the default nginx server
4. Start nginx
5. export NODE_PORT=3001
6. start treetracker-admin-api (node server/server.js)
7. Install treetracker-admin repo to nginx default directory

## Alternative setup for MS Windows (Works on Linux and Mac also)
On Windows the easiest way to develop and debug Node.js applications is using Visual Studio Code.
It comes with Node.js support out of the box.

https://code.visualstudio.com/docs

## Setup
To run docker on a local machine, you will have to install Docker first. Docker is a linux container technology, so running it on Mac or Windows requires an application with an attached linux VM. Docker provides one for each OS by default.

[Docker for Mac](https://docs.docker.com/docker-for-mac/install/)
[Docker for Windows](https://docs.docker.com/docker-for-windows/install/)

To install on linux, you can run `sudo apt-get install -y docker-ce` but there is [additional setup](https://docs.docker.com/install/linux/docker-ce/ubuntu/#set-up-the-repository) to verify keys, etc.

## Dockerw script

Run `./dockerw build` to build the image of the mobile API locally using defaults, and to run the image use `./dockerw run`.

To see what arguments can be passed, simply run `./dockerw`. In order to use something created in the `build` mode, you must specify the same arguments in the `run` mode or it will attempt to pull the image. There is also an `up` mode that can be used, to build and run in one command with the same arguments.

There is a `docker-compose.yml` file that essentially ties together a postgresql database and the node server that this repository provides. It also mounts some configuration, one file that is generated and the other that is mounted from source control.