pipeline {
    agent any
    environment {
        // Set environment variables for Docker Hub credentials
        DOCKERHUB_USER = 'ranur'
        imageName = "ranur/frontend-toserba-pos:latest"
    }
    
    stages {
        stage('Clone or Pull') {
            steps {
                script {
                    if (fileExists('frontend-toserba-pos')) {
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
                        echo "Container node1 was not running or could not be stopped/removed: ${e}"
                    }
                }
            }
        }

        stage('Image Renewal') {
            steps {
                script {
                    try {
                        sh "docker rmi ${imageName}"
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
                        if (fileExists('.env')) {
                            sh 'rm -f .env'
                        }
                        sh 'touch .env'

                        // Using a secret file from Jenkins credentials
                        withCredentials([file(credentialsId: 'DEV_ENV_FRONTEND_TOSPOS', variable: 'SECRET_FILE_PATH')]) {
                            sh 'cat $SECRET_FILE_PATH >> .env'  // Append the secret file content to the .env
                        }
                        sh 'cat .env' // Display the .env file
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('frontend-toserba-pos') {
                    sh "docker build -t ${imageName} ."
                }
            }
        }

        stage('Run New Container') {
            steps {
                sh "docker run -d --name node1 -p 3000:80 ${imageName}"
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'DOCKERHUB_TOKEN', variable: 'DOC_PWD')]) {
                        sh "echo ${DOC_PWD} | docker login -u ${DOCKERHUB_USER} --password-stdin"
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    sh "docker push ${imageName}"
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
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
            echo 'Pipeline was successful!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
