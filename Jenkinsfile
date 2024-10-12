

pipeline {
    agent any
    def imageName = "ranur/${imageName}:latest"
     environment {
        // Set environment variables for Docker Hub credentials
        DOCKERHUB_USER = 'ranur'
    }
    stages {
        stage('Clone or Pull') {
            steps {
                script {
                    if (fileExists('frontend-toserba-pos')) {
                            // sh 'rm -r frontend-toserba-pos'
                        dir('frontend-toserba-pos') {
                            sh 'git fetch'
                            sh 'git checkout development'
                            sh 'git pull origin development'
                        }
                    } else {
                        sh 'git clone -b development https://github.com/Forber-Technology-Indonesia/frontend-toserba-pos.git'
                    }
                }
            }
        }
        stage('Container Renewal') {
            steps {
                script {
                    try {
                        sh 'docker stop node1'
                        sh 'docker rm node1'
                    } catch (Exception e) {
                        echo "Container apache1 was not running or could not be stopped/removed: ${e}"
                    }
                }
            }
        }
        stage('Image Renewal') {
            steps {
                script {
                    try {
                        sh 'docker rmi ${imageName}'
                    } catch (Exception e) {
                        echo "Image ${imageName} could not be removed: ${e}"
                    }
                }
            }
        }
        stage('Config .env File') {
            steps {
                script {
                        dir('frontend-toserba-pos') {
                            if (fileExists('.env')){
                                sh 'rm -r .env'
                            }
                            sh 'touch .env'
                            // withCredentials([string(credentialsId: 'GOOGLE_CLIENT_ID', variable: 'GC_ID')]) {
                            //     sh 'echo "REACT_APP_GOOGLE_CLIENT_ID=${GC_ID}" >> .env'
                            // }
                            // sh 'cat .env'
                            // withCredentials([string(credentialsId: 'API1_BASEURL', variable: 'API1_BASEURL')]) {
                            //     sh 'echo "REACT_APP_API1_URL=${API1_BASEURL}" >> .env'
                            // }
                            // sh 'cat .env'
                            // withCredentials([string(credentialsId: 'TOKEN', variable: 'TOKEN')]) {
                            //     sh 'echo "TOKEN=${TOKEN}" >> .env'
                            // }

                            // sh 'cat /mnt/env-aset/node1/.env'
                            // sh 'cp /mnt/env-aset/node1/.env frontend-toserba-pos/.env'
                             // Using a secret file from Jenkins credentials
                            withCredentials([file(credentialsId: 'DEV_ENV_FRONTEND_TOSPOS', variable: 'SECRET_FILE_PATH')]) {
                                sh 'cat $SECRET_FILE_PATH >> .env'  // Append the secret file content to the .env
                            }
                            sh 'cat .env'
                        }
                }
            }
        }
        stage('Build Docker New Image') {
            steps {
                dir('frontend-toserba-pos') {
                    sh 'docker build -t ${imageName} .'
                }
            }
        }
        stage('Run New Container') {
            steps {
                sh 'docker run -d --name node1  -p 3000:80 ${imageName}'
            }
        }
        stage('Push Image and Remove') {
            steps {
                sh 'docker run -d --name node1  -p 3000:80 ${imageName}'
            }
        }
        stage('Login to Docker Hub') {
            steps {
                script {
                    // Login to Docker Hub using credentials

                    withCredentials([string(credentialsId: 'DOCKERHUB_TOKEN', variable: 'DOC_PWD')]) {
                        sh "echo ${DOC_PWD} | docker login -u ${DOCKERHUB_USER} --password-stdin"
                     }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Push the Docker image to Docker Hub
                    sh "docker push ${imageName}"
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    // Remove Docker image locally after pushing
                    sh "docker rmi ${imageName}"
                }
            }
        }
    }
    post {
        always {
            echo 'This will always run'
        }
        success {
            echo 'This will run only if successful'
        }
        failure {
            echo 'This will run only if failed'
        }
    }
}
