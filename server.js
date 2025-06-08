const url = require('url')
const http = require('http')
const fs = require('fs')

http.createServer((req, res) => {
    console.log(req.method)
    if (req.method == "GET") {
        if (req.url === "/") {
            fs.readFile('contact-ms.html', (err, data) => {
                if (err) {
                    throw err
                }

                res.writeHead(200, { "Content-Type": "text/html" })
                res.end(data)
            })
        }
        if (req.url === "/contact-ms.js") {
            fs.readFile('contact-ms.js', (err, data) => {
                if (err) {
                    throw err
                }

                res.writeHead(200, { "Content-Type": "text/javascript" })
                res.end(data)
            })
        }

        if (req.url.startsWith("/search")) {
            const q = url.parse(req.url, true);
            console.log(q.query);

            readContact(q.query.name, number => {
                if (number) {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ number }));
                } else {
                    res.writeHead(404, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Contact not found" }));
                }
            });
        }
    }

    if (req.method == "POST") {
        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const parsed = JSON.parse(body);
                console.log("Parsed body:", parsed);

                addContact(parsed.name, parsed.number)
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Data received", data: parsed }));
            } catch (e) {
                console.error("Invalid JSON", e);
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON" }));
            }
        });
    }

    if (req.method == "DELETE" && req.url.startsWith('/name')) {
        let q = url.parse(req.url, true)
        deleteContact(q.query.name)

        res.writeHead(200, { "Content-Type": "text/plain" })
        res.end("Successfully deleted")
    }

}).listen(8080)

function addContact(name, number) {
    fs.appendFile('contacts.txt', '\n' + name + ',' + number, (err) => {
        if (err) throw err
    })
}

function readContact(name, callback) {
    fs.readFile('contacts.txt', 'utf-8', (err, data) => {
        if (err) throw err;

        const lines = data.split('\n');
        for (let line of lines) {
            const [n, num] = line.split(',');
            if (n === name) {
                callback(num);
                return;
            }
        }

        callback(null);
    });
}

function deleteContact(_name) {
    fs.readFile('contacts.txt', 'utf-8', (err, data) => {
        if (err) throw err

        let newLines = []
        let lines = data.split('\n')
        for (let line of lines) {
            let [name, number] = line.split(',')
            if (name !== _name) {
                newLines.push(line)
            }
        }

        fs.writeFile('contacts.txt', newLines.join('\n'), (err) => { if (err) throw err })
    })
}