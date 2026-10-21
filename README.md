# The African Exporter

A React frontend for The African Exporter's trade and sourcing platform. It provides public company and quote-request pages, buyer and merchant registration, and separate buyer, merchant, and administrator workspaces for requests and orders.

Built with React 18, Create React App, React Router, Material UI, Redux Toolkit, Axios, and Chart.js.

## Local development

Node.js and npm are required. The Dockerfile uses Node 18, which records the project's original container runtime.

```sh
git clone https://github.com/Zoiku/tae.git
cd tae
npm install
npm start
```

The development server normally opens at `http://localhost:3000`.

## Backend configuration

The API is separate from this repository. `src/Services/AxiosInstance.js` currently points to `https://theafricanexporter.com/ms/api/v1` and attaches a bearer token from session storage. Update that source setting to a development API before exercising authentication, requests, or order actions.

A frontend build does not provision accounts, API services, or database data. Review other integration settings in `src/Services/` and analytics components for the target environment.

## Commands

- `npm start`: development server.
- `npm test`: Create React App test runner.
- `npm run build`: production assets in `build/`.

Serve `build/` on a static host with fallback to `index.html` for browser routes. The Dockerfile references `nginx/nginx.conf`, which is absent from this repository; supply the missing configuration before using that container build.

## Code guide

- `src/App.js`: routes and session initialization.
- `src/Pages/`: public pages and role-specific dashboards.
- `src/Services/`: authentication, products, buyer, merchant, and admin API calls.
- `src/Protected/`: role-specific route guards.
- `src/Redux/`: application state.
- `src/Components/`, `src/Material/`, `src/Styles/`: interface and styling.

Check public navigation and each role's flows against a development backend when changing integration behavior.
