# Cydia Repo Template
A Cydia Repository template with a simple web management interface for non-static hosting

## Features:
- Uploading Packages
- Viewing Hosted Packages
- Deleting Package
- Password-based Authentication
- Optional HTTPS

---
## Setup:
Make sure you have access to the `node` and `npm` commands
1. Clone this repo
2. Open `server.js` and change the variables under the `ADJUST` header
    - `PORT` - The port to run the server on. Recommended to leave this as `80`
    - `MANAGEMENT_ENDPOINT` - The http endpoint that the management dashboard is hosted at
    - `PASSWORD` - The password to use when logging into the server
    - `REPO_TITLE` - This will show up in the title of the management page
    - `COOKIE_SECRET` - Change this to a random secret string (used to encode cookies)
    - `SSL` - Enables SSL anv https. Make sure you follow the steps below to create a certificate first
3. Open `index.html` and customize it to be the homepage of your repo
4. Open `static/Release` and change `Origin`, `Label`, `Codename`, and `Description`
5. Install dependencies with `npm install`
6. Run the server with `sudo node server.js` or configure it to run as a daemon

## Optional Steps:
If you want to run the the server with https:
- Use something like `nginx` as a reverse-proxy (I recommend using `certbot` becuase it is really easy to instantly get an ssl certificate and redirect all http traffic to https)
- Or you can follow theese instructions to setup https:
1. Make a directory `ssl/` and add `server.cert` and `server.key` (aqquiring the certificate is up to you, I recommend letsencrypt)
2. Set `SSL` to `true` in the `ADJUST` section

---
### NOTE: Binding to port `80` may require root access. If you get an access denied error, make sure you are runnning the command with administrator privileges.
