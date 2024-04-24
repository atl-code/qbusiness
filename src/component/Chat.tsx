import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { post } from 'aws-amplify/api';
import Sidebar from './Sidebar';
import Welcome from './Welcome';
import ChatInput from './ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';
interface JsonResponse {
  conv: string;
  message: string;
  timestamp: string;
  type: string;
}

export interface ListResponse {
  DocumentType: JsonResponse[];
}

let ConversationId: string;

function Chat() {
  const [conversations, setConversations] = useState<Array<JsonResponse>>([]);
  const [loading, setLoading] = useState(false);
  const { conv } = useParams<{ conv: string }>();
  const [messageHistory, setMessageHistory] = useState<
    Array<{ type: string; text: string; timestamp: string; loading?: boolean }>
  >([]);

  const [inputValue, setInputValue] = useState('');
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    const updateMsgHistory = async () => {
      // const res = await getMsgHistory(); cast this to JsonResponse[]
      const res = await getMsgHistory();

      
      setMessageHistory(
        //@ts-ignore
        res.sort((a: JsonResponse, b: JsonResponse) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map((msg: JsonResponse) => ({ type: msg.type.toLowerCase(), text: msg.message.toString(), timestamp: msg.timestamp })),
      );
    };

    if (conv) {
      setMessageHistory([]);
      ConversationId = conv;
      updateMsgHistory();
    }
  }, [conv]);


  async function listApi() {
    const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    const user = await getCurrentUser();
    const response = post({
      apiName: 'api7c358ab5', path: '/hello', options: {
        headers: {
          Authorization: authToken ?? '',
          "Access-Control-Allow-Origin": "*",
        },
        body: { user: user.username }
      }
    });

    const { body } = await response.response;
    const res = await body.json();
    return res;
  }
  async function getMsgHistory() {
    const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    const user = await getCurrentUser();
    const response = post({
      apiName: 'api7c358ab5', path: '/hello', options: {
        headers: {
          Authorization: authToken ?? '',
          "Access-Control-Allow-Origin": "*",
        },
        body: { user: user.username, conv: ConversationId, action: 'open' }
      }
    });

    const { body } = await response.response;
    //@ts-ignore
    const res: ListResponse = await body.json();
    return res;
  }
  async function deleteConversation(conv: string) {
    console.log("DELETE CONVERSATION", conv)
    const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    const user = await getCurrentUser();
    const response = post({
      apiName: 'api7c358ab5', path: '/hello', options: {
        headers: {
          Authorization: authToken ?? '',
          "Access-Control-Allow-Origin": "*",
        },
        body: { user: user.username, conv: conv, action: 'delete' }
      }
    });

    const { body } = await response.response;
    const res = await body.json();

    return res;
  }

  const navigate = useNavigate();
  async function msgApi() {
    const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    setLoading(true);


    const user = await getCurrentUser();

    const requestBody: { message: string; user: string; conv?: string } = { message: inputValue, user: user.username }
    if (ConversationId) {
      requestBody.conv = ConversationId;
    }
    const response = post({
      apiName: 'api7c358ab5', path: '/hello', options: {
        headers: {
          Authorization: authToken ?? '',
          "Access-Control-Allow-Origin": "*",
        },
        body: requestBody
      }
    });

    const { body } = await response.response;

    const res = await body.json();
    console.log("THIS IS THE msgAPI", res);
    if (!ConversationId) {
      // Refresh the list
      const refreshConversations = async () => {
        const res = await listApi();
   //@ts-ignore
        setConversations(res);


      }
      await refreshConversations();
    }
    //@ts-ignore
    ConversationId = res.conv;
    navigate(`/chat/${ConversationId}`);
    setLoading(false);
    return res;
  }


  /* async function handleSignOut() {

    try {
  
      await signOut();
  
    } catch (error) {
  
      console.log('error signing out: ', error);
  
    }
  
  } */



  useEffect(() => {
    async function fetchConversations() {
      const resp = await listApi();
      console.log(resp);
    }
    fetchConversations();
  }, []);

  const lastMessageRef = React.useRef<HTMLDivElement>(null);


  useEffect(() => {
    // Scroll to the last message whenever the message history changes
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messageHistory]);



  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValue.trim() !== "") {
      const userMessage = {
        type: "user",
        text: inputValue,
        timestamp: new Date().toISOString(),
      };

      setMessageHistory((messageHistory) => [
        ...messageHistory,
        userMessage,
        { type: "SYSTEM", text: "Sending...", loading: true, timestamp: new Date().toISOString()},
      ]);

      setInputValue("");

      try {
        const res = await msgApi();
        console.log("THIS IS THE RESPONSE OF MSG API THAT WE ARE TESTING ", res)
        setMessageHistory((messageHistory) =>
          messageHistory.map((msg, index) =>
          
            index === messageHistory.length - 1
            //@ts-ignore
              ? { ...msg, text: res.message.toString(), loading: false, timestamp: res.timestamp}
              : msg
          )
        );
      } catch (error) {
        console.error("Error fetching API response:", error);
      }
    }
  };


  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="h-[93.4vh] w-full  flex overflow-hidden">
      <Sidebar
        isSidebarVisible={isSidebarVisible}
        //@ts-ignore
        deleteConversation={deleteConversation}
        toggleSidebar={toggleSidebar}
        //@ts-ignore
        listApi={listApi}
        //@ts-ignore
        conversations={conversations}
        //@ts-ignore
        setConversations={setConversations}
      />
      <div className="flex-1 flex flex-col ">
        {messageHistory.length === 0 ? (
          <Welcome />
        ) : (
          <div className="flex flex-col gap-2">
            <div className=" flex-col gap-2 flex justify-center max-h-[100vh] min-h-[65vh] w-full">
              <ScrollArea className="h-[80vh] w-full rounded-md" >
                {messageHistory.map((msg, index) => (
                  <div
                    key={index}
                    ref={index === messageHistory.length - 1 ? lastMessageRef : null}
                    className={`${msg.type === 'user'
                        ? 'text-right bg-gray-500 text-white shadow-2xl rounded-lg mb-2 p-2'
                        : 'text-left bg-gray-200 text-gray-700 shadow-2xl rounded-lg mb-2 p-2'
                      } w-[80%] lg:w-[80%] mx-auto`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">
                        {msg.type === 'user' ? 'You' : 'Amazon Q'}
                      </span>
                      <span className="text-xs text-gray-700">
                        
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ''}
                      </span>
                    </div>
                    {msg.loading ? (
                      <div className="flex justify-start items-center space-x-2">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                      </div>
                    ) : (
                      <p className="p-2">{msg.text}</p>
                    )}

                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        )}
      
       <ChatInput
          handleSendMessage={handleSendMessage}
          setInputValue={setInputValue}
          inputValue={inputValue}
          loading={loading}
        />
  
      </div>
    </div>
  );
}

export default Chat;
