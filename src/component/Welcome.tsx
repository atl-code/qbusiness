import { BsChat } from "react-icons/bs";


export default function Welcome(){
    return (
        
            <div className="h-[80vh] flex flex-col justify-center items-center p-4">
              <h1 className="text-4xl font-bold text-blue-500 mb-2">Amazon Q</h1>
              <p className="font-bold text-gray-600 text-center mb-4">
                Your Generative AI assistant is here.
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-[3rem] h-[3rem] bg-purple-700 flex items-center justify-center rounded-full">
                  <BsChat className="text-3xl text-white" />
                </div>
                <div className="max-w-xl w-full flex items-center justify-center p-4 rounded-lg shadow-md border-2 border-gray-500">
                  <p className="text-gray-500 text-sm py-3 font-semibold">
                    I am your AI assistant. Enter a prompt to start a conversation.
                    I'll respond using data from within your organization.
                  </p>
                </div>
              </div>
            </div>
      
    )
}