const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    ExtensionContent: './src/content/ExtensionContent.tsx',
    popup: './src/popup/Popup.tsx',
    content: './src/content/ContentScript.tsx',
    background: './src/background.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.svg'], // Ajoutez '.svg' ici pour l'importer comme module
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // Chargeur pour les fichiers de police
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]', // Place les fichiers dans un dossier "fonts" dans le build
        },
      },
      {
        test: /\.css$/, // Gestion des fichiers CSS
        use: ['style-loader', 'css-loader'], // Loaders CSS
      },
      {
        test: /\.svg$/, // Test pour les fichiers SVG
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgrOptions: {
                icon: true, // Active le mode icône pour permettre les attributs comme style ou className
                export: "ReactComponent",
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '.' }, // Copie tout le contenu de 'public' dans 'dist'
        { from: 'src/content/contentStyles.css', to: '.' }, // Copie le fichier CSS vers le dossier dist
        { from: 'src/assets/icons', to: 'assets/icons' }, // Copie les icônes SVG dans le dossier 'dist/assets/icons'
        { from: 'src/fonts', to: 'fonts' }, // Copie les fonts'
      ],
    }),
  ],
};
