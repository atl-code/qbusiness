import React from 'react'
import { LuSendHorizonal } from 'react-icons/lu';
interface Props{
    handleSendMessage: (e: React.FormEvent <HTMLFormElement>) => void,
    inputValue: string,
    setInputValue: (value: string) => void,
    loading: boolean
      // const [conversations, setConversations] = useState<Array<{ conv: string, title: string }>>([]);



}

const ChatInput = ({
    handleSendMessage,
    inputValue,
    setInputValue,
    loading

} : Props) => {



   
  return (
    <div className="p-4 w-full ">
        
          <div className="flex items-center justify-center gap-1 mb-2 w-full">
            
            <div className=" w-full flex items-center">
              <form onSubmit={handleSendMessage} className="  w-[66vw] flex items-center mx-auto">
              <input
                type="text"
                disabled={loading}
                placeholder="Enter a prompt"
                value = {inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full h-14 pl-4 pr-20 rounded-lg border border-gray-500 focus:outline-none rounded-r-none
                 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className=" flex items-center pr-4">
                <button disabled={loading} className=" w-full bg-blue-500 text-white h-14 pl-4 duration-500 transition-all flex items-center justify-center h-10 p-4 border border-gray-500 rounded rounded-l-none border-l-0 cursor-pointer hover:bg-blue-700 group" type="submit">
                  <LuSendHorizonal className="text-white text-2xl hover:text-white  group-hover:text-white duration-1000 transition-all" />
                </button>
              </div>
                </form>
            </div>
          </div>
         
        </div>
  )
}


export default ChatInput