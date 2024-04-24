import { useEffect } from 'react';
import { CgMenu, CgTrash } from 'react-icons/cg';
import {PiChatCircleLight } from 'react-icons/pi';
import { RxCross2 } from 'react-icons/rx';
import { VscAdd } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
  

interface Props {
    isSidebarVisible: boolean;
    toggleSidebar: () => void;
    listApi: () => Promise<ListResponse>;
    conversations: Array<{ conv: string, title: string }>;
    setConversations: (conversations: ListResponse) => void;
    deleteConversation :(conv: string) => Promise<ListResponse>
}

const Sidebar = ({ isSidebarVisible, toggleSidebar, listApi, conversations, setConversations, deleteConversation }: Props) => {
    const navigate = useNavigate();

    const refreshConversations = async () => {
        const res = await listApi();
        setConversations(res);
    }

    useEffect(() => {
        const fetchConversations = async () => {
            const res = await listApi();
            setConversations(res);
        };

        fetchConversations();
    }, []);

    return (
        isSidebarVisible ? (
            <div className={`transition-transform transform duration-300 ${isSidebarVisible ? "translate-x-0" : "-translate-x-full"} h-full w-[20%] lg:flex flex-col bg-slate-100 p-4`}>
                <div className="flex items-center justify-between mb-4">
                    <button className="p-3 rounded-lg flex items-center gap-2 h-14 bg-blue-500 text-white" onClick={() => 
                      // if window.location.pathname is not equal to / then navigate to / else do nothing
                      window.location.pathname !== '/' ? window.location.pathname = '/' : toast.error('You are already starting a new conversation.')
                    }>
                        <VscAdd className="text-white" />
                        New Conversation
                    </button>
                    <button onClick={toggleSidebar} className="text-blue-500 text-2xl">
                        <RxCross2 />
                    </button>
                </div>
                <ScrollArea className="flex flex-col gap-2 w-full overflow-y-auto">
                    {conversations && conversations.length > 0 ? (
                        conversations.map((conv, index) => (
                            <div key={index} className="flex items-center py-2 px-3 rounded-xl w-full cursor-pointer justify-between gap-2" 
                                onClick={() => navigate(`/chat/${conv.conv}`)}>
                                <PiChatCircleLight className="text-blue-500 text-2xl flex-shrink-0"/>
                                <div className="flex items-center gap-x-4 flex-grow">
                                    <p className="text-gray-500 flex-grow line-clamp-1">{conv.title}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <CgTrash className="text-red-500 text-2xl" onClick={async (e) => {
                                        e.stopPropagation();
                                        await deleteConversation(conv.conv);
                                    
                                            await refreshConversations();
                                            navigate('/');
                                            toast.success('Conversation Deleted Successfully');
                                    }} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No conversations yet</p>
                    )}
                </ScrollArea>
              
            </div>
        ) : (
            <div>
                <button onClick={toggleSidebar} className="text-blue-500 text-2xl">
                    <CgMenu />
                </button>
            </div>
        )
    );
}

export default Sidebar;
