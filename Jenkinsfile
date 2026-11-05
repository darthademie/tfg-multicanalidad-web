pipeline {
    // Le dice a Jenkins que ejecute esto en cualquier nodo disponible
    agent any 

    environment {
        // ID de la credencial de Docker Hub
        DOCKERHUB_CREDS = 'dockerhub-darthademie'
        // Imagen a generar
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

        stage('Pipeline de Integración Continua (CI)') {
            when {
                expression {
                    // Extraemos el mensaje y devolvemos 'true' SOLO si NO contiene la etiqueta
                    def commitMessage = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                    if (commitMessage.contains('[skip ci]')) {
                        echo "Se ha detectado '[skip ci]'. Abortando ejecución para evitar bucle infinito."
                        currentBuild.result = 'ABORTED'
                    }
                    return !commitMessage.contains('[skip ci]')
                }
            }

            stages {
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

                stage('2.5. Análisis DAST (OWASP ZAP)') {
                    steps {
                        echo 'Levantando entorno efímero para auditoría DAST...'
                        sh """
                        # Creamos una red aislada para el test (ignora el error si ya existe)
                        docker network create tfg-sec-net || true
                        
                        # Levantamos la imagen recién compilada
                        docker run -d --rm --name web-target --network tfg-sec-net ${DOCKER_IMAGE}:${TAG}
                        
                        # Damos 5 segundos para que el servidor web interno arranque correctamente
                        sleep 5
                        """

                        echo 'Ejecutando escaneo Baseline de OWASP ZAP...'
                        // catchError permite que el pipeline continúe aunque ZAP encuentre vulnerabilidades
                        catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                            sh """
                            # Damos permisos al workspace local para que ZAP pueda escribir el reporte HTML
                            chmod 777 \$(pwd)
                            
                            # Lanzamos el contenedor oficial de ZAP contra nuestro contenedor web
                            # El flag -I (Ignore) hace que lance warnings pero no aborte el pipeline violentamente
                            docker run --rm --network tfg-sec-net \
                                -v \$(pwd):/zap/wrk/:rw \
                                -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \
                                -t http://web-target:80 \
                                -r zap-report.html -I
                            """
                        }
                    }
                    post {
                        always {
                            echo 'Apagando entorno efímero y publicando reporte...'
                            sh 'docker stop web-target || true'
                            // Guarda el reporte en Jenkins para que puedas descargarlo desde la interfaz
                            archiveArtifacts artifacts: 'zap-report.html', allowEmptyArchive: true
                        }
                    }
                }

                stage('3. Actualizar Manifiestos (GitOps)') {
                    steps {
                        echo 'Actualizando repositorios para ArgoCD...'
                        
                        withCredentials([usernamePassword(credentialsId: 'github-darthademie', passwordVariable: 'GIT_PASS', usernameVariable: 'GIT_USER')]) {
                            sh """
                            # 1. Configurar identidad de Git
                            git config --global user.email "jenkins@teleupm.com"
                            git config --global user.name "Jenkins CI"
                            
                            # 2. Modificar el archivo teleupm-front-deployment.yaml
                            sed -i 's|image: darthademie/tfg-multicanalidad-web:.*|image: darthademie/tfg-multicanalidad-web:${TAG}|g' k8s/teleupm-front-deployment.yaml
                            
                            # 3. Hacer Commit y Push
                            git add k8s/teleupm-front-deployment.yaml
                            git commit -m "gitops: Despliegue automático de versión ${TAG} [skip ci]"
                            git push https://\$GIT_USER:\$GIT_PASS@github.com/darthademie/tfg-multicanalidad-web.git HEAD:main
                            """
                        }
                    }
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