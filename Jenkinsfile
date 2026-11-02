pipeline {
    // Le dice a Jenkins que ejecute esto en cualquier nodo disponible
    agent any 

    environment {
        // ID de la credencial que crearemos en Jenkins para tu Docker Hub
        DOCKERHUB_CREDS = 'dockerhub-darthademie'
        // Añadir docker.io/ explícitamente para evitar conflictos con Podman
        DOCKER_IMAGE = 'darthademie/tfg-multicanalidad-web'
        // Usamos el número de build de Jenkins (1, 2, 3...) como versión única
        TAG = "1.${env.BUILD_NUMBER}"
    }

    stages {
        stage('1. Obtener Código') {
            steps {
                echo 'Descargando código desde GitHub...'
                git branch: 'main', url: 'https://github.com/darthademie/tfg-multicanalidad-web.git'
            }
        }

        stage('2. Construir y Subir a Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDS, passwordVariable: 'DOCKERHUB_PASS', usernameVariable: 'DOCKERHUB_USER')]) {
                    echo 'Autenticando en Docker Hub...'
                    sh "echo \$DOCKERHUB_PASS | docker login -u \$DOCKERHUB_USER --password-stdin"
                    
                    echo "Compilando y subiendo directamente ${DOCKER_IMAGE}:${TAG} con BuildKit..."
                    sh "docker build --push -t ${DOCKER_IMAGE}:${TAG} -t ${DOCKER_IMAGE}:latest ."
                }
            }
        }
    }
    post {
        always {
            echo 'Limpiando el workspace de Jenkins...'
            cleanWs() // Borra los ficheros clonados del espacio de trabajo
        }
        success {
            echo "[INFO] Pipeline completado. Imagen subida con éxito como ${TAG} y latest."
        }
        failure {
            echo "[ERROR] El pipeline ha fallado. Revisa la consola para ver los detalles."
        }
    }
}