const webpack = require('webpack');

module.exports = {
    // ...

    devServer: {
        allowedHosts: ['localhost', 'https://www.p2pvaults.com/'], // Specify allowed hosts
        // other dev server options
    },

    plugins: [
        // Work around for Buffer is undefined:
        // https://github.com/webpack/changelog-v5/issues/10
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],

    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs'], // Include .mjs files        
        fallback: {
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer")
        }
    },
};
