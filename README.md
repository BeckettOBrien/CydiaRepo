# Cydia Repo Manager
A Cydia Repository with a simple web management interface

## Features:
- Uploading Packages
- Viewing Hosted Packages
- Deleting Package
- Password-based Authentication

---
## Setup:
Make sure you have access to the `node` and `npm` commands
1. Clone this repo
2. Open `server.js` and change the variables under the `ADJUST` header
    - `PORT` - The port to run the server on. Recommended to leave this as `80`
    - `PASSWORD` - The password to use when logging into the server
    - `REPO_TITLE` - This will show up in the title of the management page
    - `COOKIE_SECRET` - Change this to a random secret string (used to encode cookies)
3. Open `static/Release` and change `Origin`, `Label`, `Codename`, and `Description`
4. Install dependencies with `npm install`
5. Run the server with `sudo node server.js` or configure it to run as a daemon

### NOTE: Binding to port `80` may require root access. If you get an access denied error, make sure you are runnning the command with `sudo`.