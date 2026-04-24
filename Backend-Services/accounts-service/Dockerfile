# ==========================================
# STAGE 1: Build the Application
# ==========================================
# We use a Maven image that already has Java 17 installed. 
# This environment is used ONLY to compile the code and build the .jar file.
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Create and set the working directory inside the container
WORKDIR /app

# Copy the pom.xml file first. This contains all our project dependencies.
COPY pom.xml .

# Copy the actual source code into the container
COPY src ./src

# Run Maven to compile the code and package it into a .jar file.
# We skip tests to make the build process much faster.
RUN mvn clean package -DskipTests

# ==========================================
# STAGE 2: Run the Application
# ==========================================
# We use a much smaller, lightweight Java runtime image (JRE) just to run the app.
# We do not need the full Maven setup here, which keeps the final image small and secure.
FROM eclipse-temurin:17-jre-jammy

# Create and set the working directory for the runtime container
WORKDIR /app

# Copy the compiled .jar file from the 'build' stage (Stage 1) into this new runtime stage.
COPY --from=build /app/target/*.jar app.jar

# Document the port that this service will run on inside the container
EXPOSE 8084

# The command that actually starts the Spring Boot application when the container launches
ENTRYPOINT ["java", "-jar", "app.jar"]
