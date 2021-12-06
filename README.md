# APhOrum

## Dev Setup

### Backend
`apt-get install golang`
`cd backend && go get .`
### Frontend
`apt-get install nodejs npm`<br>
`cd frontend && npm install`

## Others
The latex engine assumes `xelatex` binary is available in your `$PATH`

## Running locally

### Backend
`cd backend && go run main.go`
### Frontend
To compile JSX with watch in `frontend/src`, run 
`cd frontend && npx babel --watch src --out-dir static --presets react-app/prod`

## Contribution Notes
These are practices followed currently:
### Backend
- Add new handlers in `main.go` and create separate files within the package `main`.
### Frontend
- Add dom container in index.html
- Add component in main.js


## Custom Notes
### cheeku
Use `"/c/Program Files/MongoDB/Server/5.0/bin/mongod.exe" --dbpath ~/Documents/MongoData` to start local mongo