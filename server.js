const express = require('express')
const fileupload = require('express-fileupload')
const shell = require('shelljs')
const fs = require('fs')
const app = express()
const port = 80

const static = express.static('static')
app.use(fileupload())

app.get('/', (req, res) => {
    const files = fs.readdirSync("./static/debs")
    const response = `<!DOCTYPE html>
    <html>
        <head>
            <title>Basic Repo Management</title>
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

app.post('/upload-package', async (req, res) => {
    if(!req.files) {
        return res.send({
            status: false,
            message: 'No file uploaded'
        });
    }
    let pacakge = req.files.deb;
    res.send({
        status: true,
        message: "File uploaded"
    })
    await pacakge.mv(`./static/debs/${pacakge.name}`)
    updatePackages()
    res.redirect('/')
})

app.post('/delete-package-*', async (req, res) => {
    const file = `./static/debs/${req.url.replace("/delete-package-", "")}`;
    console.log(req.url.replace("/delete-package-", ""))
    fs.unlinkSync(file)
    res.redirect('/')
})

// This goes last
app.use(static)

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})

function updatePackages() {
    shell.exec('./updatepackages.sh')
}