pipeline {
    // Le dice a Jenkins que ejecute esto en cualquier nodo disponible
    agent any 

    environment {
        // ID de la credencial que crearemos en Jenkins para tu Docker Hub
        DOCKERHUB_CREDS = 'dockerhub-darthademie'
        // Añadir docker.io/ explícitamente para evitar conflictos con Podman
        DOCKER_IMAGE = 'docker.io/darthademie/tfg-multicanalidad-web'
        // Usamos el número de build de Jenkins (1, 2, 3...) como versión única
        TAG = "1.${env.BUILD_NUMBER}"
    }

    stages {
        stage('1. Obtener Código') {
            steps {
                echo 'Descargando código desde GitHub...'
                // Descarga la rama 'main' de tu repositorio público
                git branch: 'main', url: 'https://github.com/darthademie/tfg-multicanalidad-web.git'
            }
        }

        stage('2. Construir Imagen') {
            steps {
                echo "Construyendo la imagen ${DOCKER_IMAGE}:${TAG}..."
                // Construimos la imagen y le asignamos dos etiquetas: la versión exacta y 'latest'
                sh "docker build --load -t ${DOCKER_IMAGE}:${TAG} -t ${DOCKER_IMAGE}:latest ."

                // Forzamos la etiqueta absoluta saltándonos la restricción de Podman (moby/buildkit)
                sh "docker tag ${DOCKER_IMAGE}:${TAG} docker.io/${DOCKER_IMAGE}:${TAG}"
                sh "docker tag ${DOCKER_IMAGE}:latest docker.io/${DOCKER_IMAGE}:latest"

                sh "docker images"
            }
        }

        stage('3. Subir a Docker Hub') {
            steps {
                echo 'Autenticando en Docker Hub y subiendo imágenes...'
                // withCredentials inyecta tu usuario y contraseña de forma ultra-segura para que no salgan en los logs
                withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDS, passwordVariable: 'DOCKERHUB_PASS', usernameVariable: 'DOCKERHUB_USER')]) {
                    sh "echo \$DOCKERHUB_PASS | docker login -u \$DOCKERHUB_USER --password-stdin"
                    
                    // Hacemos el push usando explícitamente docker.io
                    sh "docker push docker.io/${DOCKER_IMAGE}:${TAG}"
                    sh "docker push docker.io/${DOCKER_IMAGE}:latest"
                }
            }
        }
    }

    post {
        always {
            echo 'Limpiando el entorno de trabajo...'
            // Borramos las imágenes locales del nodo para que el disco de Jenkins no se llene con los días
            sh "docker rmi ${DOCKER_IMAGE}:${TAG} || true"
            sh "docker rmi ${DOCKER_IMAGE}:latest || true"
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