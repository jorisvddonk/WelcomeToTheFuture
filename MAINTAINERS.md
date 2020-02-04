## Building the containers and pushing them

```
cd backend
docker build . -t jorisd/welcome-to-the-future-backend
docker push jorisd/welcome-to-the-future-backend

cd ..

cd frontend
docker build . -t jorisd/welcome-to-the-future-frontend
docker push jorisd/welcome-to-the-future-frontend
```
