FROM gradle:8.14.3 AS build
WORKDIR /app
COPY . /app
RUN  chmod +x ./gradlew
RUN ./gradlew build -x test


FROM eclipse-temurin:21-jdk AS production
COPY --from=build /app/build/libs/BFF-0.0.1-SNAPSHOT.jar ./BFF.jar
CMD [ "java", "-jar", "BFF.jar" ]