tasks.register<Exec>("npmBuild") {
    commandLine("npm", "run", "build")
}

tasks.register("assembleDebug") {
    dependsOn("npmBuild")
    doLast {
        println("React web application compiled successfully.")
    }
}

tasks.register("assemble") {
    dependsOn("assembleDebug")
}

tasks.register("build") {
    dependsOn("assembleDebug")
}
