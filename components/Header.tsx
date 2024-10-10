"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {
  Menu,
  Coins,
  Leaf,
  Search,
  Bell,
  User,
  ChevronDown,
  LogIn,
  LogOut,
  Ghost,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import {
  createUser,
  getUserByemail,
  getUnreadNotification,
  getUserBalance,
  markNotificationAsRead,
} from "@/utils/db/actions";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Badge } from "./ui/badge";
const clientId =
  "BJKdDFkNtkWX87XqkuWrDu4rbkSvWyQZ5lswS0ucINxxcN0inRVW8zzKAywPPzgiOHP7_3PcfFwfpvcQvSdaLRs";
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  displayName: "Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});
const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
  privateKeyProvider,
});

interface HeaderProps {
  onMenuClick: () => void;
  totalEarnings: number;
}

interface NotificationData {
  id: number;
  createdAt: Date;
  userId: number;
  message: string;
  type: string;
  isRead: boolean;
}

export default function Header({ onMenuClick, totalEarnings }: HeaderProps) {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedin, setLoggedin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const pathName = usePathname();
  const [notification, setNotification] = useState<NotificationData[]>([]);
  const [balance, setBalance] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();

        if (web3auth.provider) {
          setProvider(web3auth.provider);
          setLoggedin(true);

          const user = await web3auth.getUserInfo();
          setUserInfo(user);

          if (user.email) {
            localStorage.setItem("userEmail", user.email);
            try {
              await createUser(user.email, user.name || "Anonymous user");
            } catch (error) {
              console.log("Error creating user", error);
            }
          }
        }
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (userInfo && userInfo.email) {
        const user = await getUserByemail(userInfo.email);
        if (user) {
          const unreadNotifications = await getUnreadNotification(user.id);
          setNotification(unreadNotifications);
        }
      }
    };
    fetchNotifications();

    // check notification after 3 seconds
    const notificationInterval = setInterval(fetchNotifications, 3000);
    // Return a cleanup function that clears the interval
    return () => {
      if (notificationInterval) {
        clearInterval(notificationInterval);
      }
    };
  }, [userInfo]);

  useEffect(() => {
    const fetchUserBalance = async () => {
      if (userInfo && userInfo.email) {
        const user = await getUserByemail(userInfo.email);
        if (user) {
          const userBalance = await getUserBalance(user.id);
          setBalance(userBalance);
        }
      }
    };
    fetchUserBalance();

    const handleBalanceUpdate = (event: CustomEvent) => {
      setBalance(event.detail);
    };

    window.addEventListener(
      "balanceUpdate",
      handleBalanceUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "balanceUpdate",
        handleBalanceUpdate as EventListener
      );
    };
  }, [userInfo]);

  const login = async () => {
    if (!web3auth) {
      console.error("web3auth is not initialized");
      return;
    }
    try {
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      setLoggedin(true);
      const user = await web3auth.getUserInfo();
      setUserInfo(user);

      if (user.email) {
        localStorage.setItem("userEmail", user.email);
        try {
          await createUser(user.email, user.name || "Anonymous user");
        } catch (error) {
          console.log("error creating user", error);
        }
      }
    } catch (error) {
      console.error("Error during login");
    }
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth is not initialized");
      return;
    }

    try {
      await web3auth.logout();
      setProvider(null);
      setLoggedin(false);
      setUserInfo(null);
      localStorage.removeItem("userEmail");
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  const getUserInfo = async () => {
    if (web3auth.connected) {
      const user = await web3auth.getUserInfo();
      setUserInfo(user);

      if (user.email) {
        localStorage.removeItem("userEmail");
        try {
          await createUser(user.email, user.name || "Anonymous user");
        } catch (error) {
          console.error("Error during createUser", error);
        }
      }
    }
  };

  const handleNotificationClick = async (notificationId: number) => {
    await markNotificationAsRead(notificationId);
    setNotification((prevNotifications) =>
      prevNotifications.filter(
        (notification) => notification.id !== notificationId
      )
    );
  };

  if (loading) {
    return <div>Loading please wait....</div>;
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center px-4 py-2 flex-wrap md:flex-nowrap">
        <div className="flex items-center flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="bg-yellow-500 hover:bg-yellow-400 text-white mr-2 md:mr-4"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/" className="flex items-center">
            <Leaf className="h-6 w-6 md:h-8 md:w-8 text-green-500 mr-1 md:mr-2" />
            <div className="flex flex-col">
              <span className="font-bold text-base md:text-lg text-gray-800">
                CleanUp Pro
              </span>
              <span className="text-[8px] md:text-[10px] text-gray-500 -mt-1">
                24 hours service
              </span>
            </div>
          </Link>
        </div>

        {!isMobile && (
          <div className="flex-grow max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-600"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        )}

        <div className="ml-auto flex items-center space-x-2 md:space-x-4">
          {isMobile && (
            <Button variant="ghost" size="icon" className="mr-2">
              <Search className="h-5 w-5" />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="mr-2 relative">
                <Bell className="h-5 w-5" />
                {notification.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.2rem] h-5">
                    {notification.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {notification.length > 0 ? (
                notification.map((notif: any) => (
                  <DropdownMenuItem
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif.id)}
                  >
                    <span className="font-medium">{notif.type}</span>
                    <span>{notif.message}</span>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem>No Notifications</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="mr-2 md:mr-4 flex items-center bg-gray-100 rounded-full px-2 md:px-3 py-1">
            <Coins className="h-4 w-4 md:h-5 md:w-5 mr-1 text-green-500" />
            <span className="font-semibold text-sm md:text-base text-gray-800">
              {balance.toFixed(2)}
            </span>
          </div>

          {!loggedin ? (
            <Button
              onClick={login}
              className="bg-green-600 hover:bg-green-700 text-white text-sm md:text-base"
            >
              Login
              <LogIn className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex items-center"
                >
                  <User className="h-5 w-5 mr-1" />
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={getUserInfo}>
                  {userInfo ? userInfo.name : "Fetch User Info"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
