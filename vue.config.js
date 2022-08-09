const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    transpileDependencies: true,
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'src/main.html',
            filename: 'index.html',
            title: 'Moon Atlas 3D'
        }
    }
})
