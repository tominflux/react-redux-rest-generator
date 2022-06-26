const withPlugins = require('next-compose-plugins')
// const withReactSvg = require('next-react-svg')
// const withImages = require('next-images')
// const optimizedImages = require('next-optimized-images')

/**
 * Next config
 * @See https://nextjs.org/docs/api-reference/next.config.js/introduction
 * @See https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
 * @See https://github.com/cyrilwanner/next-optimized-images
 */

module.exports = withPlugins(
    [
        // Image compression
        // optimizedImages
    ],
    {
        webpack(config, { isServer }) {
            config.module.rules.push({
                test: /\.svg$/,
                use: ['@svgr/webpack']
            })
            if (!isServer) {
                config.resolve.fallback.fs = false
                config.resolve.fallback.dns = false
                config.resolve.fallback.tls = false
                config.resolve.fallback.net = false
                config.resolve.fallback.module = false
            }
            return config
        }
    }
)
