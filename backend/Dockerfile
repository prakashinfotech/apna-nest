FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy everything from the backend directory
COPY . .

# Restore and publish the API project
RUN dotnet restore
RUN dotnet publish src/ApnaNest.API/ApnaNest.API.csproj -c Release -o out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# .NET 9 default port is 8080. Render will map its public port to this.
ENV ASPNETCORE_HTTP_PORTS=8080

ENTRYPOINT ["dotnet", "ApnaNest.API.dll"]
