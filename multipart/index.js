const Hapi = require('@hapi/hapi')
const fs = require('fs')
const path = require('path')

const init = async () => {
    const server = Hapi.server({
        port:3000,
        host: 'localhost',
    })

    server.route([
        {
            method: 'POST',
            path: '/uploads',
            handler: async (request) => {
                const { data } = request.payload;
                // 90823385.png
                console.log(data)
                console.log(data.hapi.headers)

                const filename = data.hapi.filename;
                const directory = path.resolve(__dirname,'uploads')
                if(!fs.existsSync(directory)) {
                    fs.mkdirSync(directory)
                }

                // membuat writeable stream
                const location = `${directory}/${filename}`
                const fileStream = fs.createWriteStream(location)

                try {
                    const result = await new Promise((resolve, reject) => {
                        fileStream.on('error',(error) => reject(error))
                        data.pipe(fileStream)
                        data.on('end', () => resolve(filename))
                    })


                    return {message: 'Anda berhasil melakukan request'}
                } catch (error) {
                    return { message: 'Berkas gagal diproses'}
                }
            },
            options: {
                payload: {
                    allow: 'multipart/form-data',
                    multipart: true,
                    output: 'stream'
                }
            }
        }
    ])

    await server.start()

    console.log(`Server start at ${server.info.uri}`)
}

init()