import StateProvider from "./states";
import AuthProvider from "./auth";
import UserProvider from "./users";
import RequestProvider from "./request";
import FriendProvider from "./friend";
import SocketProvider from "./socket";
import ChatProvider from "./chat";
import MessageProvider from "./message";
import GroupProvider from "./group";

const ContextProvider = ({ children }: any) => {
  return (
    <StateProvider>
      <AuthProvider>
        <UserProvider>
          <RequestProvider>
            <SocketProvider>
              <FriendProvider>
                <GroupProvider>
                  <ChatProvider>
                    <MessageProvider>{children}</MessageProvider>
                  </ChatProvider>
                </GroupProvider>
              </FriendProvider>
            </SocketProvider>
          </RequestProvider>
        </UserProvider>
      </AuthProvider>
    </StateProvider>
  );
};

export default ContextProvider;
