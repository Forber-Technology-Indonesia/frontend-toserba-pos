

pipeline {
    agent any

    stages {
        stage('Clone or Pull') {
            steps {
                script {
                    if (fileExists('frontend-toserba-pos')) {
                            sh 'rm -r frontend-toserba-pos'
                        // dir('frontend-toserba-pos') {
                        //     sh 'git fetch'
                        //     sh 'git checkout master'
                        //     sh 'git pull origin master'
                        // }
                    } else {
                        sh 'git clone -b master https://github.com/Forber-Technology-Indonesia/frontend-toserba-pos.git'
                    }
                }
            }
        }
        stage('Container Renewal') {
            steps {
                script {
                    try {
                        sh 'docker stop pos1'
                        sh 'docker rm pos1'
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
                        sh 'docker rmi ranur/react'
                    } catch (Exception e) {
                        echo "Image ranur/react could not be removed: ${e}"
                    }
                }
            }
        }
        stage('Copy .env File') {
            steps {
                script {
                    sh 'cat /mnt/env-aset/pos1/.env'
                    sh 'cp /mnt/env-aset/pos1/.env frontend-toserba-pos/.env'
                    sh 'cat frontend-toserba-pos/.env'
                }
            }
        }
        stage('Build Docker New Image') {
            steps {
                dir('frontend-toserba-pos') {
                    sh 'docker build -t ranur/react .'
                }
            }
        }
        stage('Run New Container') {
            steps {
                sh 'docker run -d --name pos1  -p 3007:80 ranur/react'
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
