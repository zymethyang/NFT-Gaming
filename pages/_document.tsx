/* eslint-disable @next/next/no-sync-scripts */
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class CommonDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <script src="https://cdn.jsdelivr.net/npm/@alch/alchemy-web3@latest/dist/alchemyWeb3.min.js" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CommonDocument;
