export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 max-w-5xl w-full">
        <h1 className="text-4xl font-bold mb-8 text-center">
          AI Customer Service Assistant
        </h1>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <div className="text-center">
            <p className="text-lg mb-4">Welcome to our AI Customer Service Assistant!</p>
            <p className="mb-6">This is a simple demo of our customer service chatbot.</p>
            
            <div className="bg-blue-100 p-4 rounded-lg inline-block">
              <p className="font-semibold">Features:</p>
              <ul className="text-left list-disc pl-5 mt-2">
                <li>24/7 Customer Support</li>
                <li>Product Information</li>
                <li>Order Status Tracking</li>
                <li>Returns and Refunds</li>
                <li>Technical Support</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">Powered by Next.js</p>
        </div>
      </div>
    </main>
  );
}
