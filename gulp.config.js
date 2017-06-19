module.exports = {
    app: { baseName: 'example' },
    sass: {
        src:         ['example/styles/*.scss'],
        outputStyle: 'compressed'
    },
    buildLocations: {
        css: '.tmp/styles/'
    },
    isDev: true
}