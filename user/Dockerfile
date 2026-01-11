# ============================================
# User Service - Dockerfile
# ============================================

FROM gradle:8.14.3 AS build
WORKDIR /app
COPY . /app
RUN  chmod +x ./gradlew
RUN ./gradlew build


FROM eclipse-temurin:21-jdk AS production
COPY --from=build /app/build/libs/user-0.0.1-SNAPSHOT.jar ./user.jar
CMD [ "java", "-jar", "user.jar" ]