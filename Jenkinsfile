

pipeline {
    agent any

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
                        sh 'docker rmi front_react'
                    } catch (Exception e) {
                        echo "Image front_react could not be removed: ${e}"
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
                    sh 'docker build -t front_react .'
                }
            }
        }
        stage('Run New Container') {
            steps {
                sh 'docker run -d --name node1  -p 3000:80 front_react'
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
