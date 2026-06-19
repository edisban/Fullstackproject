#!/bin/sh
set -e
./mvnw "-Dflyway.url=jdbc:postgresql://db:5432/Project_db" "-Dflyway.user=postgres" "-Dflyway.password=edis46" flyway:repair
