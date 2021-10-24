# APhOrum

## Dev Setup

### Backend
`apt-get install golang`
### Frontend
`apt-get install nodejs npm`<br>
`cd frontend && npm install`

## Others
The latex engine assumes `xelatex` binary is available in your `$PATH`

## Running locally

### Backend
`cd backend && go run *.go`
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
