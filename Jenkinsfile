pipeline {
    agent none

    stage('parralel build') {
        parallel {
            stage('Run on amd64') {
                agent {
                    label 'jenkins-slave-amd64'
                }
                steps {
                    runSteps('amd64')
                }
            }

            stage('Run on armv7') {
                agent {
                    label 'jenkins-slave-armv7'
                }
                steps {
                    runSteps('amdv7')
                }
            }

            stage('Run on arm64v8') {
                agent {
                    label 'jenkins-slave-arm64v8'
                }
                steps {
                    runSteps('arm64v8')
                }
            }
        }
    }
}


void runSteps(label) {
    stage('Build on ' + label) {
        
    }

    stage('Test on ' + label) {
        echo('nothing to test bro')
    }
}