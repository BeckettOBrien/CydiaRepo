const express = require('express')
const https = require('https')
const fileupload = require('express-fileupload')
const cookieparser = require('cookie-parser')
const bodyparser = require('body-parser')
const shell = require('shelljs')
const fs = require('fs')
const bcrypt = require('bcrypt')
const app = express()

// ---------------Adjust---------------
const PORT = 80
const MANAGEMENT_ENDPOINT = "/management"
const PASSWORD = "PASSWORD"
const REPO_TITLE = "Basic Repo"
const COOKIE_SECRET = "SECRET-STRING"
const SSL = false
// ------------------------------------

const static = express.static('static')
app.use(fileupload())
app.use(cookieparser(COOKIE_SECRET))
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    return hash
}

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
})

app.get(MANAGEMENT_ENDPOINT, (req, res) => {
    if (!req.signedCookies.password) return res.redirect('/auth')
    if (!(bcrypt.compareSync(PASSWORD, req.signedCookies.password))) {
        return res.redirect('/auth')
    }
    const files = fs.readdirSync("./static/debs").filter((file) => { return !file.startsWith('.') })
    const response = `<!DOCTYPE html>
    <html>
        <head>
            <title>${REPO_TITLE} Management</title>
        </head>
        <body>
            <p>Upload a package:</p>
            <form id="uploadbanner" enctype="multipart/form-data" method="post" action="/upload-package">
                <input id="fileupload" name="deb" type="file", accept=".deb" />
                <input type="submit" value="submit" id="submit" />
            </form>
            <br>
            <p>Hosted Packages:</p>
            <ul>
            ${files.map((val) => {
                return `<il>${val}</il> <form id='delete-${val}' method='post' action='/delete-package-${val}'><input type='submit' value='DELETE' id='submit' /></form>`;
            }).join('<br>')}
            </ul>
        </body>
    </html>`
    res.send(response)
})

app.get('/auth', (req, res) => {
    if (req.signedCookies.password) {
        if (bcrypt.compareSync(PASSWORD, req.signedCookies.password)) {
            return res.redirect(MANAGEMENT_ENDPOINT)
        }
    }
    const response = `<!DOCTYPE html>
    <html>
        <head>
            <title>${REPO_TITLE} Login</title>
        </head>
        <body>
            <p>Please enter your password</p>
            <form id="login" method="post" enctype="application/x-www-form-urlencode">
                <input type="password" name="password">
                <input type="submit" name="submit" value="Login" />
            </form>
        </body>
    </html>`
    res.send(response)
})

app.post('/auth', (req, res) => {
    if (!req.body.password) return res.redirect('/auth')
    if (bcrypt.compareSync(PASSWORD, hashPassword(req.body.password))) {
        res.cookie("password", hashPassword(PASSWORD), { signed: true })
        return res.redirect(MANAGEMENT_ENDPOINT)
    }
    res.redirect('/auth')
})

app.post('/upload-package', async (req, res) => {
    if (!req.signedCookies.password) return res.redirect('/auth')
    if (!(bcrypt.compareSync(PASSWORD, req.signedCookies.password))) {
        return res.redirect('/auth')
    }
    if(!req.files) {
        return res.redirect(MANAGEMENT_ENDPOINT)
    }
    let pacakge = req.files.deb;
    await pacakge.mv(`./static/debs/${pacakge.name}`)
    updatePackages()
    res.redirect(MANAGEMENT_ENDPOINT)
})

app.post('/delete-package-*', async (req, res) => {
    if (!req.signedCookies.password) return res.redirect('/auth')
    if (!(bcrypt.compareSync(PASSWORD, req.signedCookies.password))) {
        return res.redirect('/auth')
    }
    const file = `./static/debs/${req.url.replace("/delete-package-", "")}`;
    console.log(req.url.replace("/delete-package-", ""))
    fs.unlinkSync(file)
    res.redirect(MANAGEMENT_ENDPOINT)
})

app.use(static)

if (SSL) {
    https.createServer({
        key: fs.readFileSync('ssl/server.key'),
        cert: fs.readFileSync('ssl/server.cert')
    }, app).listen(PORT, "0.0.0.0", () => {
        console.log(`Listening on https://localhost:${PORT}`)
    })
} else {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Listening on http://localhost:${PORT}`)
    })
}

function updatePackages() {
    shell.exec('./updatepackages.sh')
}