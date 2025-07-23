import { Toaster } from "react-hot-toast";
import { CartProvider } from "../src/context/CartContext"; // ✅ import CartProvider
import Layout from "../src/components/Layout";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <script src="https://cdn.tailwindcss.com"></script>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body {
                background-color: #f3f4f6 !important;
                font-family: system-ui, -apple-system, sans-serif;
              }
            `,
          }}
        />
      </Head>

      <Toaster position="top-center" />

      <CartProvider> {/* ✅ Wrap entire app */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CartProvider>
    </>
  );
}

export default MyApp;
